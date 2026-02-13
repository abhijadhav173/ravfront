"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getStoredUser, getPost, type Post } from "@/lib/api";
import { ChevronLeft, Calendar, FolderOpen } from "lucide-react";

export default function InvestorPostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [user, setUser] = useState(getStoredUser());
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState("");

  useEffect(() => {
    const u = getStoredUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    if (u.status !== "approved" || u.role === "admin") {
      router.replace(u.role === "admin" ? "/admin" : "/pending");
      return;
    }
    setUser(u);
  }, [router]);

  useEffect(() => {
    if (!id || !user) return;
    const numId = parseInt(id, 10);
    if (Number.isNaN(numId)) {
      setError("Invalid post");
      setLoading(false);
      return;
    }
    getPost(numId)
      .then(setPost)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load post"))
      .finally(() => setLoading(false));
  }, [id, user]);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <Link
            href="/investor"
            className="inline-flex items-center gap-2 text-ravok-slate font-sans text-sm uppercase tracking-widest hover:text-ravok-gold transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to dashboard
          </Link>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-sans">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-ravok-slate font-sans">Loading…</p>
          ) : post ? (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                {post.category && (
                  <p className="text-sm text-ravok-gold font-sans uppercase tracking-wider flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" /> {post.category.name}
                  </p>
                )}
                <CardTitle className="text-2xl md:text-3xl font-heading text-white leading-tight">
                  {post.title}
                </CardTitle>
                {post.published_at && (
                  <p className="text-sm text-ravok-slate flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.published_at).toLocaleDateString()}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-invert prose-sm max-w-none font-sans text-white/90 leading-relaxed [&_a]:text-ravok-gold [&_a]:underline [&_img]:rounded-lg [&_img]:max-w-full"
                  dangerouslySetInnerHTML={{ __html: post.body }}
                />
              </CardContent>
            </Card>
          ) : !loading && id ? (
            <p className="text-ravok-slate font-sans">Post not found.</p>
          ) : null}
    </div>
  );
}
