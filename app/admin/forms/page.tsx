"use client";
import { listFormSubmissions, exportFormSubmissionsCsvUrl, FormType, getStoredUser, deleteFormSubmission } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/lib/ui/button";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function AdminFormsPage() {
  const sp = useSearchParams();
  const type = sp.get("type") as FormType | null;
  const page = Number(sp.get("page") || 1);
  const [items, setItems] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user = useMemo(() => getStoredUser(), []);

  useEffect(() => {
    setLoading(true);
    listFormSubmissions(page, type || undefined)
      .then((d) => setItems(d))
      .finally(() => setLoading(false));
  }, [type, page]);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-ravok-gold">
          Form Responses
        </h1>
        <p className="mt-1 font-sans text-sm text-ravok-slate">
          View submissions and export CSV
        </p>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-3 text-sm font-sans">
          <Link href="/admin/forms" className="text-white/80 hover:text-ravok-gold">All</Link>
          <Link href="/admin/forms?type=writer" className="text-white/80 hover:text-ravok-gold">Writer</Link>
          <Link href="/admin/forms?type=director" className="text-white/80 hover:text-ravok-gold">Director</Link>
          <Link href="/admin/forms?type=producer" className="text-white/80 hover:text-ravok-gold">Producer</Link>
        </div>
        <Button asChild className="bg-ravok-gold text-black hover:brightness-95">
          <a href={exportFormSubmissionsCsvUrl(type || undefined)} target="_blank">Download CSV</a>
        </Button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <p className="font-sans text-ravok-slate">Loading…</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-white/10 rounded bg-black/40 shadow-lg">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-white">
              <tr>
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Created</th>
                <th className="text-right p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items?.data?.map((row: any) => (
                <tr key={row.id} className="border-t border-white/10">
                  <td className="p-2">{row.id}</td>
                  <td className="p-2 uppercase">{row.type}</td>
                  <td className="p-2">{row.name}</td>
                  <td className="p-2">{row.email}</td>
                  <td className="p-2">{new Date(row.created_at).toLocaleString()}</td>
                  <td className="p-2 text-right">
                    <Link
                      href={`/admin/forms/view?id=${row.id}`}
                      className="inline-flex items-center px-3 py-1.5 rounded border border-white/20 text-white hover:bg-white/10 hover:text-ravok-gold transition-colors"
                    >
                      View
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="ml-2"
                      onClick={async () => {
                        if (!confirm(`Delete submission #${row.id}?`)) return;
                        try {
                          await deleteFormSubmission(row.id);
                          setItems((prev: any) => ({
                            ...prev,
                            data: prev.data.filter((x: any) => x.id !== row.id),
                          }));
                        } catch (e) {
                          // noop; could surface toast if desired
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
