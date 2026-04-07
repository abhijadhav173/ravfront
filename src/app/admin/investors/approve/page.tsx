"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStoredUser, getUsers, type User } from "@/lib/api";
import { ChevronLeft, ChevronRight, User as UserIcon } from "lucide-react";

export default function AdminInvestorsApprovePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
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
    if (!user) return;
    setLoading(true);
    setError("");
    getUsers({ role: "investor", status: "approved", page: 1 })
      .then((res) => {
        setUsers(res.data);
        setPage(1);
        setLastPage(res.last_page);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [user]);

  async function loadPage(p: number) {
    try {
      const res = await getUsers({ role: "investor", status: "approved", page: p });
      setUsers(res.data);
      setPage(p);
      setLastPage(res.last_page);
    } catch {
      setError("Failed to load");
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-ravok-gold">
          Approve Request
        </h1>
        <p className="mt-1 font-sans text-sm text-ravok-slate">
          Investors with approved requests
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 font-sans text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-white/10 bg-black/40 shadow-lg">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="font-sans text-ravok-slate">Loading…</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center font-sans text-ravok-slate">No approved investors yet.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse font-sans text-sm">
                <thead>
                  <tr className="border-b border-ravok-gold/30 bg-ravok-gold/10">
                    <th className="px-4 py-3 text-left font-heading text-xs font-semibold uppercase tracking-wider text-ravok-gold">#</th>
                    <th className="px-4 py-3 text-left font-heading text-xs font-semibold uppercase tracking-wider text-ravok-gold">Name</th>
                    <th className="px-4 py-3 text-left font-heading text-xs font-semibold uppercase tracking-wider text-ravok-gold">Email</th>
                    <th className="px-4 py-3 text-left font-heading text-xs font-semibold uppercase tracking-wider text-ravok-gold">Status</th>
                    <th className="px-4 py-3 text-right font-heading text-xs font-semibold uppercase tracking-wider text-ravok-gold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u, i) => (
                    <tr key={u.id} className="transition-colors hover:bg-white/5">
                      <td className="px-4 py-3 text-ravok-slate">{(page - 1) * 15 + i + 1}</td>
                      <td className="px-4 py-3 font-medium text-white">{u.name}</td>
                      <td className="px-4 py-3 text-ravok-slate">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded bg-green-500/20 px-2 py-0.5 text-xs font-medium uppercase tracking-wider text-green-400">approved</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/admin/investors/details?id=${u.id}`}>
                          <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-ravok-gold">
                            <UserIcon className="h-4 w-4 sm:mr-1" />
                            Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {lastPage > 1 && (
              <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
                <p className="font-sans text-xs text-ravok-slate">Page {page} of {lastPage}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 hover:text-ravok-gold" disabled={page <= 1} onClick={() => loadPage(page - 1)}>
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Button>
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 hover:text-ravok-gold" disabled={page >= lastPage} onClick={() => loadPage(page + 1)}>
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
