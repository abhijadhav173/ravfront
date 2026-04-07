'use client';

import { useEffect, useState } from 'react';
import { Confession } from '@/lib/types/confessions';
import { confessionsApi } from '@/lib/api/v1/confessions';
import { ConfessionCard } from './ConfessionCard';
import { useApi } from '@/lib/hooks/useApi';

interface ConfessionWallProps {
  initialLimit?: number;
  onLoadMore?: () => void;
}

export function ConfessionWall({ initialLimit = 12, onLoadMore }: ConfessionWallProps) {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { data: paginatedData, loading, error, execute } = useApi<{
    data: Confession[];
    meta: { last_page: number };
  }>();

  useEffect(() => {
    execute(async () => {
      const result = await confessionsApi.getFeed(1, initialLimit);
      setConfessions(result.data);
      setPage(1);
      setHasMore(result.meta.current_page < result.meta.last_page);
      return { data: result.data, meta: result.meta };
    });
  }, [execute, initialLimit]);

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    execute(async () => {
      const result = await confessionsApi.getFeed(nextPage, initialLimit);
      setConfessions((prev) => [...prev, ...result.data]);
      setPage(nextPage);
      setHasMore(result.meta.current_page < result.meta.last_page);
      onLoadMore?.();
      return { data: result.data, meta: result.meta };
    });
  };

  const handleReact = async (confessionId: number) => {
    await confessionsApi.react(confessionId);
  };

  return (
    <div>
      {/* Masonry grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {confessions.map((confession) => (
          <ConfessionCard key={confession.id} confession={confession} onReact={handleReact} />
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-3">
            <div className="h-2 w-2 animate-pulse rounded-full bg-ravok-gold" />
            <p className="font-sans text-ravok-slate">Loading confessions…</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-8">
          <p className="font-sans text-red-400">Failed to load confessions</p>
        </div>
      )}

      {/* Load more */}
      {!loading && hasMore && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            className="border border-ravok-gold/30 text-white px-8 py-3 font-sans text-xs uppercase tracking-widest hover:bg-ravok-gold hover:text-black transition-all rounded-full"
          >
            Load More Confessions
          </button>
        </div>
      )}

      {/* End */}
      {!hasMore && confessions.length > 0 && (
        <div className="text-center py-8">
          <p className="font-sans text-ravok-slate/60 text-sm">All confessions loaded</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && confessions.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="font-sans text-ravok-slate">No confessions yet. Be the first to share!</p>
        </div>
      )}
    </div>
  );
}
