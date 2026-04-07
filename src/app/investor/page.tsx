"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStoredUser, type User } from "@/lib/api";

export default function InvestorPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-heading font-bold text-ravok-gold uppercase tracking-wide mb-4">
        Investor dashboard
      </h1>
      <p className="text-sm text-ravok-slate font-sans">
        Welcome, {user.name}
      </p>
      {loading && <p className="mt-6 text-ravok-slate font-sans">Loading…</p>}
    </div>
  );
}
