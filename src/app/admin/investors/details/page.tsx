"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getStoredUser,
  getUser,
  approveUser,
  rejectUser,
  getDashboard,
  type User,
  type DashboardCounts,
} from "@/lib/api";
import { ChevronLeft, CheckCircle, XCircle } from "lucide-react";

export default function AdminInvestorDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [user, setUser] = useState<User | null>(null);
  const [investor, setInvestor] = useState<User | null>(null);
  const [dashboard, setDashboard] = useState<DashboardCounts | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [actionId, setActionId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const u = getStoredUser();
    if (!u || u.role !== "admin") {
      router.replace(u ? "/pending" : "/login");
      return;
    }
    setUser(u);
  }, [router]);

  useEffect(() => {
    if (!user || !id) return;
    const numId = parseInt(id, 10);
    if (Number.isNaN(numId)) {
      setError("Invalid investor");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    getUser(numId)
      .then((u) => {
        if (u.role !== "investor") {
          setError("User is not an investor");
          setInvestor(null);
        } else {
          setInvestor(u);
        }
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load investor");
        setInvestor(null);
      })
      .finally(() => setLoading(false));
  }, [user, id]);

  useEffect(() => {
    if (!user) return;
    getDashboard().then(setDashboard).catch(() => {});
  }, [user]);

  async function handleApprove() {
    if (!investor || investor.role !== "investor") return;
    setActionId(investor.id);
    setError("");
    try {
      const updated = await approveUser(investor.id);
      setInvestor(updated);
      if (dashboard?.counts.users_pending != null) {
        setDashboard({
          ...dashboard,
          counts: { ...dashboard.counts, users_pending: Math.max(0, dashboard.counts.users_pending - 1) },
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to approve");
    } finally {
      setActionId(null);
    }
  }

  async function handleReject() {
    if (!investor || investor.role !== "investor") return;
    setActionId(investor.id);
    setError("");
    try {
      const updated = await rejectUser(investor.id);
      setInvestor(updated);
      if (dashboard?.counts.users_pending != null) {
        setDashboard({
          ...dashboard,
          counts: { ...dashboard.counts, users_pending: Math.max(0, dashboard.counts.users_pending - 1) },
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to reject");
    } finally {
      setActionId(null);
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/admin/investors"
        className="mb-6 inline-flex items-center gap-2 font-sans text-sm uppercase tracking-widest text-ravok-slate transition-colors hover:text-ravok-gold"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to investors
      </Link>

      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-ravok-gold">
          Investor details
        </h1>
        <p className="mt-1 font-sans text-sm text-ravok-slate">View and manage investor</p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 font-sans text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <p className="font-sans text-ravok-slate">Loading…</p>
      ) : investor ? (
        <div className="space-y-6">
          <Card className="overflow-hidden border border-white/10 bg-black/40 shadow-lg">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="font-heading text-lg text-ravok-gold">Account</CardTitle>
              <CardDescription className="font-sans text-sm text-ravok-slate">
                Basic information
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <dl className="space-y-3 font-sans text-sm">
                <div>
                  <dt className="text-ravok-slate">Name</dt>
                  <dd className="mt-0.5 font-medium text-white">{investor.name}</dd>
                </div>
                <div>
                  <dt className="text-ravok-slate">Email</dt>
                  <dd className="mt-0.5 text-white">{investor.email}</dd>
                </div>
                <div>
                  <dt className="text-ravok-slate">Status</dt>
                  <dd className="mt-0.5">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs font-medium uppercase tracking-wider ${
                        investor.status === "approved"
                          ? "bg-green-500/20 text-green-400"
                          : investor.status === "rejected"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-ravok-gold/20 text-ravok-gold"
                      }`}
                    >
                      {investor.status}
                    </span>
                  </dd>
                </div>
              </dl>
              {investor.status === "pending" && (
                <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                  <Button
                    size="sm"
                    className="bg-green-600 text-white hover:bg-green-700"
                    onClick={handleApprove}
                    disabled={actionId === investor.id}
                  >
                    <CheckCircle className="h-4 w-4 sm:mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleReject}
                    disabled={actionId === investor.id}
                  >
                    <XCircle className="h-4 w-4 sm:mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden border border-white/10 bg-black/40 shadow-lg">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="font-heading text-lg text-ravok-gold">Profile</CardTitle>
              <CardDescription className="font-sans text-sm text-ravok-slate">
                Optional profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {investor.profile ? (
                <dl className="space-y-3 font-sans text-sm">
                  <div>
                    <dt className="text-ravok-slate">Phone</dt>
                    <dd className="mt-0.5 text-white">{investor.profile.phone || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-ravok-slate">Bio</dt>
                    <dd className="mt-0.5 text-white whitespace-pre-wrap">{investor.profile.bio || "—"}</dd>
                  </div>
                </dl>
              ) : (
                <p className="font-sans text-ravok-slate">No profile data yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : id && !loading ? (
        <p className="font-sans text-ravok-slate">Investor not found.</p>
      ) : null}
    </div>
  );
}
