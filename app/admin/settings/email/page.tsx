"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStoredUser, getMailSettings, updateMailSettings, type MailSettings } from "@/lib/api";
import { toast } from "@/lib/toast";

const ENCRYPTION_OPTIONS = [
  { value: "tls", label: "TLS" },
  { value: "ssl", label: "SSL" },
  { value: "", label: "None" },
];

export default function AdminSettingsEmailPage() {
  const router = useRouter();
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<MailSettings>({
    mail_driver: "smtp",
    mail_host: "",
    mail_port: "587",
    mail_username: "",
    mail_password: "",
    mail_encryption: "tls",
    mail_from_address: "",
    mail_from_name: "",
  });

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
    getMailSettings()
      .then((data) => setForm(data))
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load settings"))
      .finally(() => setLoading(false));
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Partial<MailSettings> = {
        mail_driver: form.mail_driver,
        mail_host: form.mail_host || undefined,
        mail_port: form.mail_port || undefined,
        mail_username: form.mail_username || undefined,
        mail_encryption: form.mail_encryption || undefined,
        mail_from_address: form.mail_from_address || undefined,
        mail_from_name: form.mail_from_name || undefined,
      };
      if (form.mail_password.trim()) {
        payload.mail_password = form.mail_password;
      }
      const updated = await updateMailSettings(payload);
      setForm(updated);
      toast.success("Email settings saved.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-ravok-gold">
          Email forwarding
        </h1>
        <p className="mt-1 font-sans text-sm text-ravok-slate">
          Configure SMTP for outgoing mail (e.g. Google, Mailtrap, SendGrid)
        </p>
      </div>

      {loading ? (
        <p className="font-sans text-ravok-slate">Loading…</p>
      ) : (
        <Card className="overflow-hidden border border-white/10 bg-black/40 shadow-lg">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="font-heading text-lg text-ravok-gold">SMTP settings</CardTitle>
            <CardDescription className="font-sans text-sm text-ravok-slate">
              Host, port, and credentials. Common: Gmail (smtp.gmail.com, 587, TLS), Mailtrap (smtp.mailtrap.io, 2525), SendGrid (smtp.sendgrid.net).
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="mail_host" className="text-white/90 font-sans">Host</Label>
                <Input
                  id="mail_host"
                  value={form.mail_host}
                  onChange={(e) => setForm((f) => ({ ...f, mail_host: e.target.value }))}
                  className="mt-1 border-white/20 bg-black/30 text-white"
                  placeholder="e.g. smtp.gmail.com, smtp.mailtrap.io"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mail_port" className="text-white/90 font-sans">Port</Label>
                  <Input
                    id="mail_port"
                    value={form.mail_port}
                    onChange={(e) => setForm((f) => ({ ...f, mail_port: e.target.value }))}
                    className="mt-1 border-white/20 bg-black/30 text-white"
                    placeholder="587"
                  />
                </div>
                <div>
                  <Label htmlFor="mail_encryption" className="text-white/90 font-sans">Encryption</Label>
                  <select
                    id="mail_encryption"
                    value={form.mail_encryption}
                    onChange={(e) => setForm((f) => ({ ...f, mail_encryption: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-white/20 bg-black/30 px-3 py-2 font-sans text-sm text-white"
                  >
                    {ENCRYPTION_OPTIONS.map((opt) => (
                      <option key={opt.value || "none"} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="mail_username" className="text-white/90 font-sans">Username</Label>
                <Input
                  id="mail_username"
                  value={form.mail_username}
                  onChange={(e) => setForm((f) => ({ ...f, mail_username: e.target.value }))}
                  className="mt-1 border-white/20 bg-black/30 text-white"
                  placeholder="SMTP username"
                />
              </div>
              <div>
                <Label htmlFor="mail_password" className="text-white/90 font-sans">Password</Label>
                <Input
                  id="mail_password"
                  type="password"
                  value={form.mail_password}
                  onChange={(e) => setForm((f) => ({ ...f, mail_password: e.target.value }))}
                  className="mt-1 border-white/20 bg-black/30 text-white"
                  placeholder="Leave blank to keep current"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <Label htmlFor="mail_from_address" className="text-white/90 font-sans">From address</Label>
                <Input
                  id="mail_from_address"
                  type="email"
                  value={form.mail_from_address}
                  onChange={(e) => setForm((f) => ({ ...f, mail_from_address: e.target.value }))}
                  className="mt-1 border-white/20 bg-black/30 text-white"
                  placeholder="noreply@example.com"
                />
              </div>
              <div>
                <Label htmlFor="mail_from_name" className="text-white/90 font-sans">From name</Label>
                <Input
                  id="mail_from_name"
                  value={form.mail_from_name}
                  onChange={(e) => setForm((f) => ({ ...f, mail_from_name: e.target.value }))}
                  className="mt-1 border-white/20 bg-black/30 text-white"
                  placeholder="RAVOK"
                />
              </div>
              <div className="pt-2">
                <Button
                  type="submit"
                  className="bg-ravok-gold text-black hover:bg-ravok-gold/90"
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save email settings"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
