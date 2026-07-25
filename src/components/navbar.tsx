"use client";

import Link from "next/link";
import { Briefcase, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";

function dashboardHref(role: string) {
  if (role === "employer") return "/dashboard/employer";
  if (role === "candidate") return "/dashboard/candidate";
  return "/admin";
}

export function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-500 text-white">
            <Briefcase className="h-4 w-4" />
          </span>
          <span className="text-[17px] tracking-tight">HireStone</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/jobs" className="px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink">
            Find jobs
          </Link>
          {(!user || user.role === "employer") && (
            <Link href="/register/employer" className="px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink">
              Post a job
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {loading ? null : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-md border border-line px-3 h-9 text-sm font-medium text-ink hover:bg-surface-sunk">
                  {user.email}
                  <ChevronDown className="h-3.5 w-3.5 text-ink-faint" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={dashboardHref(user.role)}>
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={logout} className="text-danger">
                  <LogOut className="h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
