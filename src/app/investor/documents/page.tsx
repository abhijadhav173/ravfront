"use client";

import { useEffect, useState } from "react";
import {
  listInvestorDocuments,
  type InvestorDocument,
  type DocumentCategory,
  getDocumentCategories,
  storageUrl,
} from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getStoredUser, getToken, me, setAuth } from "@/lib/api";

function groupBy<T, K extends string | number>(items: T[], key: (t: T) => K): Record<K, T[]> {
  return items.reduce((acc, item) => {
    const k = key(item);
    (acc[k] ||= [] as T[]).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

function groupDocs(items: InvestorDocument[]): Record<string, InvestorDocument[]> {
  return items.reduce<Record<string, InvestorDocument[]>>((acc, d) => {
    const k = d.group_key || `${d.name}::${d.description}`;
    (acc[k] ||= []).push(d);
    return acc;
  }, {});
}

export default function InvestorDocumentsPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [catDocs, setCatDocs] = useState<Record<number, InvestorDocument[]>>({});
  const [catPage, setCatPage] = useState<Record<number, number>>({});
  const [catHasMore, setCatHasMore] = useState<Record<number, boolean>>({});
  const [catLoading, setCatLoading] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Guard: ensure logged-in, approved investor before fetching.
    // Prefer server truth via /api/me when possible.
    async function ensureAuth() {
      const token = getToken();
      if (!token) {
        setError("Your session is missing. Please sign in again.");
        setAuthChecked(true);
        return false;
      }
      // Always confirm with server to avoid stale local cache
      let u = getStoredUser();
      try {
        const serverUser = await me();
        setAuth(token, serverUser);
        u = serverUser;
      } catch {
        setError("Could not verify your session. Please sign in again.");
        setAuthChecked(true);
        return false;
      }
      if (u.role === "admin") {
        router.replace("/admin");
        return false;
      }
      if (u.status !== "approved") {
        router.replace("/pending");
        return false;
      }
      setAuthChecked(true);
      return true;
    }

    async function load() {
      setLoading(true);
      setError("");
      try {
        const ok = await ensureAuth();
        if (!ok) return;
        const cats = await getDocumentCategories();
        setCategories(cats);
        // prime first page for each category (4 per page)
        await Promise.all(
          cats.map(async (c) => {
            setCatLoading((s) => ({ ...s, [c.id]: true }));
            try {
              const res = await listInvestorDocuments(1, { document_category_id: c.id, per_page: 4 });
              setCatDocs((s) => ({ ...s, [c.id]: res.data }));
              setCatPage((s) => ({ ...s, [c.id]: res.current_page }));
              setCatHasMore((s) => ({ ...s, [c.id]: res.current_page < res.last_page }));
            } finally {
              setCatLoading((s) => ({ ...s, [c.id]: false }));
            }
          })
        );
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        // Do not hard-redirect to login; show inline error to avoid bounce.
        setError(msg || "Failed to load documents");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [router]);

  async function loadMore(catId: number) {
    const next = (catPage[catId] ?? 1) + 1;
    setCatLoading((s) => ({ ...s, [catId]: true }));
    try {
      const res = await listInvestorDocuments(next, { document_category_id: catId, per_page: 4 });
      setCatDocs((s) => ({ ...s, [catId]: [...(s[catId] ?? []), ...res.data] }));
      setCatPage((s) => ({ ...s, [catId]: res.current_page }));
      setCatHasMore((s) => ({ ...s, [catId]: res.current_page < res.last_page }));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      // Do not hard-redirect to login; show inline error to avoid bounce.
      setError(msg || "Failed to load documents");
    } finally {
      setCatLoading((s) => ({ ...s, [catId]: false }));
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 font-sans text-sm text-red-400">
          {error}
        </div>
      )}

      {(!authChecked || loading) ? (
        <div className="px-2 py-8">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 animate-pulse rounded-full bg-ravok-gold" />
            <p className="font-sans text-ravok-slate">Loading documents…</p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <motion.h1
              className="font-heading text-2xl font-bold tracking-tight text-white"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Investor Documents
            </motion.h1>
            <motion.p
              className="mt-2 font-sans text-sm text-ravok-slate/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Documents and resources available to approved investors.
            </motion.p>
            <motion.div
              className="mt-3 h-0.5 w-12 bg-ravok-gold"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ transformOrigin: "left" }}
            />
          </div>

          {categories.map((cat) => {
            const inCat = catDocs[cat.id] ?? [];
            return (
              <section key={cat.id} className="border-t border-white/10 py-8 first:border-t-0">
                <div className="mb-4">
                  <h2 className="font-heading text-lg font-bold tracking-tight text-white uppercase">
                    {cat.name}
                  </h2>
                  {inCat.length > 0 && (
                    <p className="mt-1 font-sans text-xs text-ravok-slate">
                      {inCat.length} file{inCat.length !== 1 ? "s" : ""} loaded
                    </p>
                  )}
                </div>

                {inCat.length === 0 ? (
                  <p className="font-sans text-ravok-slate/80">No documents in this category yet.</p>
                ) : (
                  <>
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                      {inCat.map((d) => {
                        const isImage = (d.mime_type ?? "").startsWith("image/");
                        return (
                          <div key={d.id} className="rounded-lg border border-white/10 bg-black/30 p-3">
                            <div className="text-sm text-white font-medium truncate">
                              {d.original_name || d.name}
                            </div>
                            {isImage && (
                              <a href={storageUrl(d.file_path)} target="_blank" className="block mt-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={storageUrl(d.file_path)}
                                  alt={d.original_name || d.name}
                                  className="max-h-36 w-full object-contain rounded border border-white/10"
                                />
                              </a>
                            )}
                            <div className="mt-2 flex items-center justify-between text-xs text-ravok-slate">
                              <span>{(d.size_bytes / 1024).toFixed(1)} KB</span>
                              <Link
                                href={storageUrl(d.file_path)}
                                target="_blank"
                                className="text-ravok-gold hover:text-ravok-beige"
                              >
                                {isImage ? "View / Download" : "Download"}
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {catHasMore[cat.id] && (
                      <div className="pt-3">
                        <button
                          onClick={() => loadMore(cat.id)}
                          disabled={catLoading[cat.id]}
                          className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-sans text-white hover:bg-white/10 disabled:opacity-60"
                        >
                          {catLoading[cat.id] ? "Loading…" : "View more"}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}
