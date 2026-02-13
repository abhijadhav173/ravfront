"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getStoredUser,
  getDashboard,
  getUsers,
  approveUser,
  rejectUser,
  type User,
  type DashboardCounts,
} from "@/lib/api";
import { Users, FolderOpen, FileText, Clock, CheckCircle, XCircle, ChevronRight } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dashboard, setDashboard] = useState<DashboardCounts | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [usersPage, setUsersPage] = useState(1);
  const [usersLastPage, setUsersLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const u = getStoredUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    if (u.role !== "admin") {
      if (u.status === "approved") router.replace("/investor");
      else router.replace("/pending");
      return;
    }
    setUser(u);
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("ravok_token");
    if (!token) return;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [dash, usersRes] = await Promise.all([
          getDashboard(),
          getUsers({ page: 1, role: "investor" }),
        ]);
        setDashboard(dash);
        setUsers(usersRes.data);
        setUsersLastPage(usersRes.last_page);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  async function loadUsers(page: number) {
    try {
      const res = await getUsers({ page, role: "investor" });
      setUsers(res.data);
      setUsersPage(page);
      setUsersLastPage(res.last_page);
    } catch {
      setError("Failed to load users");
    }
  }

  async function handleApprove(u: User) {
    if (u.role !== "investor") return;
    setActionId(u.id);
    setError("");
    try {
      await approveUser(u.id);
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, status: "approved" as const } : x)));
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

  async function handleReject(u: User) {
    if (u.role !== "investor") return;
    setActionId(u.id);
    setError("");
    try {
      await rejectUser(u.id);
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, status: "rejected" as const } : x)));
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
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-ravok-gold">
          Dashboard
        </h1>
        <p className="mt-1 font-sans text-sm text-ravok-slate">Overview and quick actions</p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 font-sans text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <p className="font-sans text-ravok-slate">Loading…</p>
      ) : (
        <>
          {dashboard && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-10">
              {dashboard.counts.users != null && (
                <Card className="overflow-hidden border border-white/10 bg-black/40 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-wider text-ravok-slate">
                      <Users className="h-4 w-4 text-ravok-gold" /> Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-heading text-2xl font-bold text-white">{dashboard.counts.users}</p>
                  </CardContent>
                </Card>
              )}
              {dashboard.counts.users_pending != null && (
                <Card className="overflow-hidden border border-white/10 bg-black/40 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-wider text-ravok-slate">
                      <Clock className="h-4 w-4 text-ravok-gold" /> Pending
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-heading text-2xl font-bold text-ravok-gold">{dashboard.counts.users_pending}</p>
                  </CardContent>
                </Card>
              )}
              {dashboard.counts.categories != null && (
                <Card className="overflow-hidden border border-white/10 bg-black/40 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-wider text-ravok-slate">
                      <FolderOpen className="h-4 w-4 text-ravok-gold" /> Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-heading text-2xl font-bold text-white">{dashboard.counts.categories}</p>
                  </CardContent>
                </Card>
              )}
              {dashboard.counts.posts != null && (
                <Card className="overflow-hidden border border-white/10 bg-black/40 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-wider text-ravok-slate">
                      <FileText className="h-4 w-4 text-ravok-gold" /> Posts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-heading text-2xl font-bold text-white">{dashboard.counts.posts}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <div className="overflow-hidden rounded-lg border border-white/10 bg-black/40 shadow-lg">
            <div className="flex flex-col gap-4 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-heading text-lg font-semibold text-ravok-gold">Investors</h2>
                <CardDescription className="mt-0.5 font-sans text-sm text-ravok-slate">
                  Approve or reject pending accounts
                </CardDescription>
              </div>
              <Link href="/admin/investors">
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 hover:text-ravok-gold">
                  View all
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            {users.length === 0 ? (
              <div className="py-12 text-center font-sans text-ravok-slate">No investors yet.</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse font-sans text-sm">
                    <thead>
                      <tr className="border-b border-ravok-gold/30 bg-ravok-gold/10">
                        <th className="px-4 py-3 text-left font-heading text-xs font-semibold uppercase tracking-wider text-ravok-gold">Name</th>
                        <th className="px-4 py-3 text-left font-heading text-xs font-semibold uppercase tracking-wider text-ravok-gold">Email</th>
                        <th className="px-4 py-3 text-left font-heading text-xs font-semibold uppercase tracking-wider text-ravok-gold">Status</th>
                        <th className="px-4 py-3 text-right font-heading text-xs font-semibold uppercase tracking-wider text-ravok-gold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map((u) => (
                        <tr key={u.id} className="transition-colors hover:bg-white/5">
                          <td className="px-4 py-3 font-medium text-white">{u.name}</td>
                          <td className="px-4 py-3 text-ravok-slate">{u.email}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block rounded px-2 py-0.5 text-xs font-medium uppercase tracking-wider ${
                                u.status === "approved"
                                  ? "bg-green-500/20 text-green-400"
                                  : u.status === "rejected"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-ravok-gold/20 text-ravok-gold"
                              }`}
                            >
                              {u.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {u.role === "investor" && u.status === "pending" ? (
                              <div className="flex justify-end gap-2">
                                <Button size="sm" className="bg-green-600 text-white hover:bg-green-700" onClick={() => handleApprove(u)} disabled={actionId === u.id}>
                                  <CheckCircle className="h-4 w-4 sm:mr-1" /> Approve
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleReject(u)} disabled={actionId === u.id}>
                                  <XCircle className="h-4 w-4 sm:mr-1" /> Reject
                                </Button>
                              </div>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {usersLastPage > 1 && (
                  <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
                    <p className="font-sans text-xs text-ravok-slate">Page {usersPage} of {usersLastPage}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 hover:text-ravok-gold" disabled={usersPage <= 1} onClick={() => loadUsers(usersPage - 1)}>Previous</Button>
                      <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 hover:text-ravok-gold" disabled={usersPage >= usersLastPage} onClick={() => loadUsers(usersPage + 1)}>Next</Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
