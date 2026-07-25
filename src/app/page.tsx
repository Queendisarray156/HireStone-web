"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (location) params.set("location", location);
    router.push(`/jobs${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <div>
      <section className="border-b border-line bg-gradient-to-b from-brand-50/60 to-white">
        <div className="container py-20 sm:py-28 text-center animate-rise-in">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-ink text-balance">
            Find work that fits.<br className="hidden sm:block" /> Hire people who fit it.
          </h1>
          <p className="mt-4 text-ink-soft text-lg max-w-xl mx-auto">
            Search open roles, apply with one saved resume, and track every
            application from first click to offer.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 mx-auto max-w-2xl flex flex-col sm:flex-row gap-2 rounded-lg border border-line bg-white p-2 shadow-card"
          >
            <div className="flex items-center gap-2 flex-1 px-2">
              <Search className="h-4 w-4 text-ink-faint shrink-0" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Job title or keyword"
                className="border-0 shadow-none focus-visible:ring-0 px-0 h-9"
              />
            </div>
            <div className="hidden sm:block w-px bg-line" />
            <div className="flex items-center gap-2 flex-1 px-2">
              <MapPin className="h-4 w-4 text-ink-faint shrink-0" />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="border-0 shadow-none focus-visible:ring-0 px-0 h-9"
              />
            </div>
            <Button type="submit" size="lg" className="sm:w-auto w-full">
              Search jobs
            </Button>
          </form>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { label: "For candidates", body: "Build a profile, upload resumes once, apply everywhere." },
            { label: "For employers", body: "Post a role, review applicants, move them through your pipeline." },
            { label: "For teams", body: "See application stats and manage users in one place." },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-line bg-white p-6">
              <p className="text-sm font-semibold text-brand-600">{item.label}</p>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
