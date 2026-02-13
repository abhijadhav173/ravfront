"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStoredUser, createCategory } from "@/lib/api";
import { toast } from "@/lib/toast";
import { ChevronLeft } from "lucide-react";

export default function AdminCategoriesAddPage() {
  const router = useRouter();
  const [user, setUser] = useState(getStoredUser());
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const u = getStoredUser();
    if (!u || u.role !== "admin") {
      router.replace(u ? "/pending" : "/login");
      return;
    }
    setUser(u);
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createCategory({ name: name.trim(), description: description.trim() || null });
      toast.success("Category created.");
      router.push("/admin/categories");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create category");
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

      <h1 className="text-2xl font-heading font-bold text-ravok-gold uppercase tracking-wide mb-2">
        Add category
      </h1>
      <p className="text-sm text-ravok-slate font-sans mb-6">Create a new category</p>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg font-heading text-ravok-gold">New category</CardTitle>
          <CardDescription className="text-ravok-slate font-sans text-sm">
            Name and optional description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white/90 font-sans">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 bg-black/30 border-white/20 text-white"
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
                className="mt-1 bg-black/30 border-white/20 text-white"
                placeholder="Short description"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                className="bg-ravok-gold text-black hover:bg-ravok-gold/90"
                disabled={submitting || !name.trim()}
              >
                {submitting ? "Creating…" : "Add category"}
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
    </div>
  );
}
