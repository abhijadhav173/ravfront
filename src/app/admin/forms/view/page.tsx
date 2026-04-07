'use client';

import { getFormSubmission } from "@/lib/api";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminFormViewPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const id = Number(sp.get("id") || 0);
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      router.replace("/admin/forms");
      return;
    }
    setLoading(true);
    getFormSubmission(id)
      .then((d) => setItem(d))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-ravok-gold">
            View Submission
          </h1>
          <p className="mt-1 font-sans text-sm text-ravok-slate">ID {id}</p>
        </div>
        <Link
          href="/admin/forms"
          className="inline-flex items-center px-3 py-1.5 rounded border border-white/20 text-white hover:bg-white/10 hover:text-ravok-gold transition-colors"
        >
          Back
        </Link>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <p className="font-sans text-ravok-slate">Loading…</p>
        </div>
      ) : !item ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 font-sans text-sm text-red-400">
          Not found
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-black/40 shadow-lg p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-sans text-ravok-slate">Type</p>
                <p className="text-white font-sans uppercase">{item.type}</p>
              </div>
              <div>
                <p className="text-xs font-sans text-ravok-slate">Created</p>
                <p className="text-white font-sans">{new Date(item.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-sans text-ravok-slate">Name</p>
                <p className="text-white font-sans">{item.name}</p>
              </div>
              <div>
                <p className="text-xs font-sans text-ravok-slate">Email</p>
                <p className="text-white font-sans">{item.email}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/40 shadow-lg p-6">
            <h2 className="font-heading text-lg text-ravok-gold mb-4">Answers</h2>
            <div className="space-y-4">
              {item.data && typeof item.data === "object" ? (
                Object.entries(item.data).map(([k, v]: any, i: number) => (
                  <div key={i} className="border-b border-white/10 pb-3">
                    <p className="text-xs font-sans text-ravok-slate">{k}</p>
                    <p className="text-white font-sans whitespace-pre-wrap">{String(v ?? "")}</p>
                  </div>
                ))
              ) : (
                <p className="text-ravok-slate font-sans">No answers.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
