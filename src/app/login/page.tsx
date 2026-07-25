"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api, apiErrorMessage } from "@/lib/api";
import { setSession, decodeJwtSub } from "@/lib/auth";
import { useAuth } from "@/hooks/use-auth";

function dashboardHref(role: string) {
  if (role === "employer") return "/dashboard/employer";
  if (role === "candidate") return "/dashboard/candidate";
  return "/admin";
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new URLSearchParams();
      form.set("username", email);
      form.set("password", password);
      const { data } = await api.post("/auth/login", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const id = decodeJwtSub(data.access_token) ?? 0;
      const user = { id, email, role: data.role };
      setSession(data.access_token, user);
      setUser(user);

      toast.success("Welcome back");
      router.push(searchParams.get("next") || dashboardHref(data.role));
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
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-500 text-white">
            <Briefcase className="h-5 w-5" />
          </span>
          <h1 className="mt-4 text-xl font-semibold text-ink">Log in to HireStone</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" loading={loading}>
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          New here?{" "}
          <Link href="/register" className="font-medium text-brand-500 underline underline-offset-2">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}
