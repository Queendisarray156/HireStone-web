"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api, apiErrorMessage } from "@/lib/api";
import { setSession, decodeJwtSub } from "@/lib/auth";
import { useAuth } from "@/hooks/use-auth";

export default function RegisterEmployerPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ company_name: "", email: "", password: "", company_website: "" });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register/employer", {
        email: form.email,
        password: form.password,
        company_name: form.company_name,
        company_website: form.company_website || undefined,
      });

      const id = decodeJwtSub(data.access_token) ?? 0;
      const user = { id, email: form.email, role: data.role as "employer" };
      setSession(data.access_token, user);
      setUser(user);

      toast.success("Account created");
      router.push("/dashboard/employer");
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
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-50 text-accent-700">
            <Building2 className="h-5 w-5" />
          </span>
          <h1 className="mt-4 text-xl font-semibold text-ink">Create your employer account</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="company_name">Company name</Label>
            <Input
              id="company_name"
              required
              value={form.company_name}
              onChange={(e) => update("company_name", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Work email</Label>
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
            <Label htmlFor="company_website">Company website (optional)</Label>
            <Input
              id="company_website"
              placeholder="https://acme.com"
              value={form.company_website}
              onChange={(e) => update("company_website", e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" variant="accent" loading={loading}>
            Create account
          </Button>
        </form>
      </div>
    </div>
  );
}
