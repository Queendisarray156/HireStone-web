"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api, apiErrorMessage } from "@/lib/api";
import { setSession, decodeJwtSub } from "@/lib/auth";
import { useAuth } from "@/hooks/use-auth";

export default function RegisterCandidatePage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", password: "", phone: "", headline: "" });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register/candidate", {
        email: form.email,
        password: form.password,
        full_name: form.full_name,
        phone: form.phone || undefined,
        headline: form.headline || undefined,
      });

      const id = decodeJwtSub(data.access_token) ?? 0;
      const user = { id, email: form.email, role: data.role as "candidate" };
      setSession(data.access_token, user);
      setUser(user);

      toast.success("Account created");
      router.push("/dashboard/candidate");
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container flex justify-center py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-600">
            <User className="h-5 w-5" />
          </span>
          <h1 className="mt-4 text-xl font-semibold text-ink">Create your candidate account</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" required value={form.full_name} onChange={(e) => update("full_name", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="headline">Headline (optional)</Label>
            <Input
              id="headline"
              placeholder="Senior Frontend Engineer"
              value={form.headline}
              onChange={(e) => update("headline", e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" loading={loading}>
            Create account
          </Button>
        </form>
      </div>
    </div>
  );
}
