"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStoredUser, getCategories, deleteCategory, type Category } from "@/lib/api";
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [user, setUser] = useState(getStoredUser());
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

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
    getCategories(1)
      .then((res) => {
        setCategories(res.data);
        setPage(res.current_page);
        setLastPage(res.last_page);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [user]);

  async function loadPage(p: number) {
    try {
      const res = await getCategories(p);
      setCategories(res.data);
      setPage(res.current_page);
      setLastPage(res.last_page);
    } catch {
      setError("Failed to load");
    }
  }

  async function handleDelete(c: Category) {
    if (c.posts_count && c.posts_count > 0) {
      setError("Cannot delete category that has posts.");
      return;
    }
    if (!confirm(`Delete category "${c.name}"?`)) return;
    setDeletingId(c.id);
    setError("");
    try {
      await deleteCategory(c.id);
      setCategories((prev) => prev.filter((x) => x.id !== c.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-ravok-gold">
            Categories
          </h1>
          <p className="mt-1 font-sans text-sm text-ravok-slate">View all categories</p>
        </div>
        <Link href="/admin/categories/add">
          <Button
            size="sm"
            className="bg-ravok-gold text-black hover:bg-ravok-gold/90"
          >
            <Plus className="h-4 w-4 sm:mr-1" />
            Add category
          </Button>
        </Link>
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
        ) : categories.length === 0 ? (
          <div className="py-16 text-center font-sans text-ravok-slate">
            <p className="mb-4">No categories yet.</p>
            <Link href="/admin/categories/add">
              <Button size="sm" className="bg-ravok-gold text-black hover:bg-ravok-gold/90">
                <Plus className="h-4 w-4 mr-1" />
                Add category
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse font-sans text-sm">
                <thead>
                  <tr className="border-b border-ravok-gold/30 bg-ravok-gold/10">
                    <th className="px-4 py-3 text-left font-heading text-xs font-semibold uppercase tracking-wider text-ravok-gold">
                      #
                    </th>
                    <th className="px-4 py-3 text-left font-heading text-xs font-semibold uppercase tracking-wider text-ravok-gold">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left font-heading text-xs font-semibold uppercase tracking-wider text-ravok-gold">
                      Slug
                    </th>
                    <th className="px-4 py-3 text-left font-heading text-xs font-semibold uppercase tracking-wider text-ravok-gold">
                      Posts
                    </th>
                    <th className="px-4 py-3 text-right font-heading text-xs font-semibold uppercase tracking-wider text-ravok-gold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {categories.map((c, i) => (
                    <tr key={c.id} className="transition-colors hover:bg-white/5">
                      <td className="px-4 py-3 text-ravok-slate">
                        {(page - 1) * 15 + i + 1}
                      </td>
                      <td className="px-4 py-3 font-medium text-white">{c.name}</td>
                      <td className="px-4 py-3 text-ravok-slate">{c.slug}</td>
                      <td className="px-4 py-3 text-ravok-slate">
                        {c.posts_count != null ? c.posts_count : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/categories/edit?id=${c.id}`}>
                            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-ravok-gold">
                              <Pencil className="h-4 w-4 sm:mr-1" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(c)}
                            disabled={deletingId === c.id || (c.posts_count != null && c.posts_count > 0)}
                            title={c.posts_count && c.posts_count > 0 ? "Cannot delete: has posts" : "Delete"}
                          >
                            <Trash2 className="h-4 w-4 sm:mr-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {lastPage > 1 && (
              <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
                <p className="font-sans text-xs text-ravok-slate">
                  Page {page} of {lastPage}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10 hover:text-ravok-gold"
                    disabled={page <= 1}
                    onClick={() => loadPage(page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10 hover:text-ravok-gold"
                    disabled={page >= lastPage}
                    onClick={() => loadPage(page + 1)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
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
