"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAnalyticsOverview, type AnalyticsOverview } from "@/lib/api/v1/analytics";

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function AnalyticsOverviewPage() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsOverview()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-ravok-gold">
            Analytics Overview
          </h1>
          <p className="mt-1 font-sans text-sm text-ravok-slate">
            Engagement across all documents and rooms
          </p>
        </div>
        <Link
          href="/admin/analytics/documents"
          className="font-sans text-xs uppercase tracking-[0.2em] text-ravok-slate hover:text-ravok-gold"
        >
          By Document →
        </Link>
      </div>

      {loading ? (
        <p className="py-16 text-center font-sans text-ravok-slate">Loading…</p>
      ) : !data ? (
        <p className="py-16 text-center font-sans text-red-400">Failed to load.</p>
      ) : (
        <>
          {/* Headline numbers */}
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Total Views", value: data.totals.views },
              { label: "Last 7 Days", value: data.totals.views_last_7_days },
              { label: "Unique Viewers", value: data.totals.unique_viewers },
              { label: "Total Time", value: formatDuration(data.totals.total_duration_seconds) },
            ].map((c) => (
              <div key={c.label} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <p className="font-sans text-xl font-light tabular-nums text-ravok-gold">{c.value}</p>
                <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.2em] text-white/40">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Top documents + Top rooms in two columns */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h2 className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.2em] text-white/60">
                Top Documents
              </h2>
              {data.top_documents.length === 0 ? (
                <p className="font-sans text-sm text-ravok-slate">No data.</p>
              ) : (
                <div className="space-y-1">
                  {data.top_documents.map((d) => (
                    <Link
                      key={d.id}
                      href={`/admin/analytics/${d.id}`}
                      className="flex items-center justify-between rounded border border-white/10 bg-white/[0.03] px-3 py-2 text-sm hover:border-ravok-gold/30"
                    >
                      <span className="truncate font-sans text-white">{d.name}</span>
                      <span className="ml-2 shrink-0 font-sans text-xs tabular-nums text-ravok-gold">{d.views} views</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.2em] text-white/60">
                Top Rooms
              </h2>
              {data.top_rooms.length === 0 ? (
                <p className="font-sans text-sm text-ravok-slate">No data.</p>
              ) : (
                <div className="space-y-1">
                  {data.top_rooms.map((r) => (
                    <Link
                      key={r.id}
                      href={`/admin/rooms/${r.id}/analytics`}
                      className="flex items-center justify-between rounded border border-white/10 bg-white/[0.03] px-3 py-2 text-sm hover:border-ravok-gold/30"
                    >
                      <span className="truncate font-sans text-white">{r.name}</span>
                      <span className="ml-2 shrink-0 font-sans text-xs tabular-nums text-ravok-gold">{r.visitors} visitors</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Top viewers */}
          {data.top_viewers.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.2em] text-white/60">
                Top Viewers
              </h2>
              <div className="space-y-1">
                {data.top_viewers.map((v) => (
                  <div key={v.id} className="flex items-center justify-between rounded border border-white/10 bg-white/[0.03] px-3 py-2 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-sans text-white">{v.name}</p>
                      <p className="truncate font-sans text-xs text-ravok-slate">{v.email}</p>
                    </div>
                    <span className="ml-2 shrink-0 font-sans text-xs tabular-nums text-ravok-gold">{formatDuration(v.total_duration_seconds)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent activity */}
          {data.recent_activity.length > 0 && (
            <div>
              <h2 className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.2em] text-white/60">
                Recent Activity
              </h2>
              <div className="space-y-1">
                {data.recent_activity.map((a) => (
                  <div key={a.id} className="rounded border border-white/10 bg-white/[0.03] px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-sm text-white">
                        {a.viewer_name}
                        {a.location && <span className="ml-2 text-white/30 text-xs">· {a.location}</span>}
                      </span>
                      <span className="font-sans text-[10px] text-white/40">{timeAgo(a.started_at)}</span>
                    </div>
                    <p className="mt-0.5 font-sans text-xs text-ravok-slate">
                      {a.document?.name || "—"}
                      {a.room && <span className="ml-1 text-white/30">in {a.room.name}</span>}
                      <span className="ml-2 text-ravok-gold">{formatDuration(a.total_duration_seconds)}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
