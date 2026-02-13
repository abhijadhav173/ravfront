"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStoredUser, getDashboard, getPosts, type User, type Post } from "@/lib/api";
import { FolderOpen, FileText, ChevronRight, Calendar } from "lucide-react";

export default function InvestorPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dashboard, setDashboard] = useState<{ role: string; counts: Record<string, number> } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const u = getStoredUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    if (u.status !== "approved") {
      router.replace("/pending");
      return;
    }
    if (u.role === "admin") {
      router.replace("/admin");
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
        const [dash, postsRes] = await Promise.all([
          getDashboard(),
          getPosts(1),
        ]);
        setDashboard(dash);
        setPosts(postsRes.data);
        setLastPage(postsRes.last_page);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  async function loadPosts(p: number) {
    try {
      const res = await getPosts(p);
      setPosts(res.data);
      setPage(p);
      setLastPage(res.last_page);
    } catch {
      setError("Failed to load posts");
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-heading font-bold text-ravok-gold uppercase tracking-wide mb-2">
        Investor dashboard
      </h1>
      <p className="text-sm text-ravok-slate font-sans mb-6">Welcome, {user.name}</p>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-sans">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-ravok-slate font-sans">Loading…</p>
          ) : (
            <>
              {dashboard && (
                <div className="grid grid-cols-2 gap-4 mb-10">
                  {dashboard.counts.categories != null && (
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-sans uppercase tracking-widest text-ravok-slate flex items-center gap-2">
                          <FolderOpen className="w-4 h-4" /> Categories
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-heading font-bold text-white">{dashboard.counts.categories}</p>
                      </CardContent>
                    </Card>
                  )}
                  {dashboard.counts.posts != null && (
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-sans uppercase tracking-widest text-ravok-slate flex items-center gap-2">
                          <FileText className="w-4 h-4" /> Published posts
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-heading font-bold text-ravok-gold">{dashboard.counts.posts}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl font-heading text-ravok-gold">Published posts</CardTitle>
                  <CardDescription className="text-ravok-slate font-sans text-sm">
                    View content shared with investors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {posts.length === 0 ? (
                    <p className="text-ravok-slate font-sans text-sm">No published posts yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {posts.map((post) => (
                        <Link
                          key={post.id}
                          href={`/investor/post?id=${post.id}`}
                          className="block p-4 rounded-lg bg-black/30 border border-white/5 hover:border-ravok-gold/30 transition-colors group"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-heading font-semibold text-white group-hover:text-ravok-gold transition-colors">
                                {post.title}
                              </h3>
                              {post.category && (
                                <p className="text-sm text-ravok-slate mt-1">{post.category.name}</p>
                              )}
                              {post.published_at && (
                                <p className="text-xs text-ravok-slate mt-1 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(post.published_at).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <ChevronRight className="w-5 h-5 text-ravok-gold shrink-0" />
                          </div>
                        </Link>
                      ))}
                      {lastPage > 1 && (
                        <div className="flex gap-2 pt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white"
                            disabled={page <= 1}
                            onClick={() => loadPosts(page - 1)}
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white"
                            disabled={page >= lastPage}
                            onClick={() => loadPosts(page + 1)}
                          >
                            Next
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

            </>
          )}
    </div>
  );
}
