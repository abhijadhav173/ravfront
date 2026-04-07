'use client';

import { Confession } from '@/lib/types/confessions';
import { formatRelativeTime } from '@/lib/utils/date';
import { useState } from 'react';
import { Heart } from 'lucide-react';

interface ConfessionCardProps {
  confession: Confession;
  onReact?: (confessionId: number) => Promise<void>;
}

export function ConfessionCard({ confession, onReact }: ConfessionCardProps) {
  const [reacting, setReacting] = useState(false);
  const [reactionCount, setReactionCount] = useState(confession.reactions);

  const handleReact = async () => {
    if (!onReact || reacting) return;
    setReacting(true);
    try {
      await onReact(confession.id);
      setReactionCount((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to react to confession', error);
    } finally {
      setReacting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-white/[0.06] to-transparent rounded-2xl p-5 border border-white/10 hover:border-ravok-gold/30 shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* Category tag */}
      {confession.category && (
        <div className="mb-3">
          <span className="rounded-full bg-ravok-gold/15 px-3 py-1 font-sans text-xs font-medium uppercase tracking-wider text-ravok-gold">
            {confession.category}
          </span>
        </div>
      )}

      {/* Confession text */}
      <p className="font-heading text-base leading-relaxed text-white/90 flex-grow mb-4 italic">
        &ldquo;{confession.body}&rdquo;
      </p>

      {/* Metadata & interactions */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <span className="font-sans text-xs text-ravok-slate">
          {formatRelativeTime(new Date(confession.created_at))}
        </span>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReact}
            disabled={reacting}
            className="flex items-center gap-1.5 font-sans text-xs text-ravok-slate hover:text-ravok-gold transition-colors disabled:opacity-50"
          >
            <Heart className="h-3.5 w-3.5" />
            <span>{reactionCount}</span>
          </button>

          {confession.status === 'featured' && (
            <span className="font-sans text-xs text-ravok-gold font-medium">Featured</span>
          )}
        </div>
      </div>

      {/* Amanda's response */}
      {confession.amanda_response && (
        <div className="mt-3 pt-3 border-t border-ravok-gold/20 bg-ravok-gold/5 rounded-lg p-3">
          <p className="font-sans text-xs text-ravok-gold font-medium mb-1">Amanda&apos;s Take:</p>
          <p className="font-sans text-xs text-ravok-beige/80 leading-relaxed">
            {confession.amanda_response.substring(0, 100)}
            {confession.amanda_response.length > 100 ? '...' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
