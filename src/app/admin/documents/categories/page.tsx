"use client";

import { useEffect, useState } from "react";
import {
  getDocumentCategories,
  createDocumentCategory,
  updateDocumentCategory,
  deleteDocumentCategory,
  type DocumentCategory,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/toast";

export default function AdminDocumentCategoriesPage() {
  const [items, setItems] = useState<DocumentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState<DocumentCategory | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await getDocumentCategories();
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editing) {
        await updateDocumentCategory(editing.id, { name, description });
      } else {
        await createDocumentCategory({ name, description });
      }
      toast.success(editing ? "Category updated" : "Category added");
      setName("");
      setDescription("");
      setEditing(null);
      await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to save";
      setError(msg);
      toast.error(msg);
    }
  }

  async function performDelete(id: number) {
    try {
      await deleteDocumentCategory(id);
      toast.success("Category deleted");
      await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to delete";
      setError(msg);
      toast.error(msg);
    }
  }

  function startEdit(item: DocumentCategory) {
    setEditing(item);
    setName(item.name);
    setDescription(item.description ?? "");
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-heading font-bold text-ravok-gold uppercase tracking-wide mb-4">
        Investor Documents — Categories
      </h1>
      {error && (
        <div className="mb-4 p-3 rounded border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3 mb-8">
        <Input
          placeholder="Category name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex gap-2">
          <Button type="submit" className="shrink-0">
            {editing ? "Update" : "Add"} Category
          </Button>
          {editing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditing(null);
                setName("");
                setDescription("");
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="space-y-2">
        {loading ? (
          <p className="text-ravok-slate">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-ravok-slate">No categories yet.</p>
        ) : (
          items.map((it) => (
            <div
              key={it.id}
              className="flex items-start justify-between gap-3 rounded border border-white/10 p-3 bg-white/5"
            >
              <div>
                <div className="text-white font-medium">{it.name}</div>
                {it.description && (
                  <div className="text-sm text-ravok-slate mt-1">{it.description}</div>
                )}
              </div>
                <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => startEdit(it)}>
                  Edit
                </Button>
                  <Button size="sm" variant="destructive" onClick={() => setConfirmId(it.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
        {/* Confirm Delete Modal */}
        {confirmId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
            <div className="w-full max-w-sm rounded-lg border border-white/10 bg-black p-5">
              <h3 className="text-lg font-heading text-white mb-2">Are you sure?</h3>
              <p className="text-sm text-ravok-slate mb-4">This will permanently delete the category.</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setConfirmId(null)}>Cancel</Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    const id = confirmId;
                    setConfirmId(null);
                    await performDelete(id as number);
                  }}
                >
                  Yes, delete
                </Button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
