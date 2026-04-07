"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStoredUser, getProfile, updateProfile, updateProfileWithAvatar, getAvatarUrl, changePassword } from "@/lib/api";
import { toast } from "@/lib/toast";

export default function AdminProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(getStoredUser());
  const [profileUser, setProfileUser] = useState<Awaited<ReturnType<typeof getProfile>> | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

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
    getProfile()
      .then((u) => {
        setProfileUser(u);
        setName(u.name);
        setPhone(u.profile?.phone ?? "");
        setBio(u.profile?.bio ?? "");
      })
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load profile"))
      .finally(() => setLoading(false));
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = avatarFile
        ? await updateProfileWithAvatar({
            name: name.trim(),
            phone: phone.trim() || null,
            bio: bio.trim() || null,
            avatar: avatarFile,
          })
        : await updateProfile({
            name: name.trim(),
            phone: phone.trim() || null,
            bio: bio.trim() || null,
          });
      setProfileUser(updated);
      setName(updated.name);
      setPhone(updated.profile?.phone ?? "");
      setBio(updated.profile?.bio ?? "");
      setAvatarFile(null);
      if (typeof window !== "undefined" && localStorage.getItem("ravok_user")) {
        const stored = JSON.parse(localStorage.getItem("ravok_user")!);
        localStorage.setItem("ravok_user", JSON.stringify({ ...stored, ...updated, profile: updated.profile }));
      }
      toast.success("Profile updated.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-ravok-gold">Profile</h1>
        <p className="mt-1 font-sans text-sm text-ravok-slate">Manage your account and profile</p>
      </div>
      {loading ? (
        <p className="font-sans text-ravok-slate">Loading…</p>
      ) : (
        <Card className="overflow-hidden border border-white/10 bg-black/40 shadow-lg">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="font-heading text-lg text-ravok-gold">Profile management</CardTitle>
            <CardDescription className="font-sans text-sm text-ravok-slate">Update your name and optional profile details</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-ravok-gold/50 bg-black/50 text-2xl font-heading font-semibold text-ravok-gold">
                  {getAvatarUrl(profileUser?.profile?.avatar) ? (
                    <img
                      src={getAvatarUrl(profileUser?.profile?.avatar)!}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : avatarFile ? (
                    <img
                      src={URL.createObjectURL(avatarFile)}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    (name || user?.name || "?").slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-white/90 font-sans">Profile photo</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    className="border-white/20 bg-black/30 text-white file:mr-2 file:rounded file:border-0 file:bg-ravok-gold file:px-3 file:py-1 file:text-black file:text-sm"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="name" className="text-white/90 font-sans">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 border-white/20 bg-black/30 text-white" required />
              </div>
              <div>
                <Label className="text-white/90 font-sans">Email</Label>
                <p className="mt-1 font-sans text-ravok-slate">{user.email}</p>
                <p className="mt-0.5 text-xs text-ravok-slate">Email cannot be changed here.</p>
              </div>
              <div>
                <Label htmlFor="phone" className="text-white/90 font-sans">Phone (optional)</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 border-white/20 bg-black/30 text-white" placeholder="+1 234 567 8900" />
              </div>
              <div>
                <Label htmlFor="bio" className="text-white/90 font-sans">Bio (optional)</Label>
                <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="mt-1 w-full rounded-md border border-white/20 bg-black/30 px-3 py-2 font-sans text-sm text-white" placeholder="A short bio..." />
              </div>
              <div className="pt-2">
                <Button type="submit" className="bg-ravok-gold text-black hover:bg-ravok-gold/90" disabled={saving || !name.trim()}>{saving ? "Saving…" : "Save profile"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!loading && (
        <Card className="mt-6 overflow-hidden border border-white/10 bg-black/40 shadow-lg">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="font-heading text-lg text-ravok-gold">Change password</CardTitle>
            <CardDescription className="font-sans text-sm text-ravok-slate">Update your account password</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="current_password" className="text-white/90 font-sans">Current password</Label>
                <Input
                  id="current_password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 border-white/20 bg-black/30 text-white"
                  required
                  autoComplete="current-password"
                />
              </div>
              <div>
                <Label htmlFor="new_password" className="text-white/90 font-sans">New password</Label>
                <Input
                  id="new_password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 border-white/20 bg-black/30 text-white"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <p className="mt-0.5 text-xs text-ravok-slate">At least 8 characters</p>
              </div>
              <div>
                <Label htmlFor="confirm_password" className="text-white/90 font-sans">Confirm new password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 border-white/20 bg-black/30 text-white"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              <div className="pt-2">
                <Button type="submit" className="bg-ravok-gold text-black hover:bg-ravok-gold/90" disabled={changingPassword}>
                  {changingPassword ? "Updating…" : "Change password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
