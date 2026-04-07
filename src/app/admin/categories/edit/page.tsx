"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getStoredUser, getCategory, updateCategory } from "@/lib/api";
import { toast } from "@/lib/toast";
import { ChevronLeft } from "lucide-react";

export default function AdminCategoriesEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [user, setUser] = useState(getStoredUser());
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const u = getStoredUser();
    if (!u || u.role !== "admin") {
      router.replace(u ? "/pending" : "/login");
      return;
    }
    setUser(u);
  }, [router]);

  useEffect(() => {
    if (!user || !id) return;
    const numId = parseInt(id, 10);
    if (Number.isNaN(numId)) {
      toast.error("Invalid category");
      setLoading(false);
      return;
    }
    setLoading(true);
    getCategory(numId)
      .then((c) => {
        setName(c.name);
        setDescription(c.description ?? "");
      })
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load category"))
      .finally(() => setLoading(false));
  }, [user, id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    const numId = parseInt(id, 10);
    if (Number.isNaN(numId)) return;
    setSubmitting(true);
    try {
      await updateCategory(numId, { name: name.trim(), description: description.trim() || null });
      toast.success("Category updated.");
      router.push("/admin/categories");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update category");
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto">
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-2 text-ravok-slate font-sans text-sm uppercase tracking-widest hover:text-ravok-gold transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to categories
      </Link>

      <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-ravok-gold mb-2">
        Edit category
      </h1>
      <p className="text-sm font-sans text-ravok-slate mb-6">Update category details</p>

      {loading ? (
        <p className="font-sans text-ravok-slate">Loading…</p>
      ) : (
        <Card className="overflow-hidden border border-white/10 bg-black/40 shadow-lg">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="font-heading text-lg text-ravok-gold">Edit category</CardTitle>
            <CardDescription className="font-sans text-sm text-ravok-slate">
              Name and optional description
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white/90 font-sans">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 border-white/20 bg-black/30 text-white"
                  placeholder="Category name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-white/90 font-sans">Description (optional)</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 border-white/20 bg-black/30 text-white"
                  placeholder="Short description"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="bg-ravok-gold text-black hover:bg-ravok-gold/90"
                  disabled={submitting || !name.trim()}
                >
                  {submitting ? "Saving…" : "Save"}
                </Button>
                <Link href="/admin/categories">
                  <Button type="button" variant="outline" className="border-white/20 text-white">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
