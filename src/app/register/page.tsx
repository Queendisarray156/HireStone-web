import Link from "next/link";
import { User, Building2 } from "lucide-react";

export default function RegisterChoicePage() {
  return (
    <div className="container flex justify-center py-16">
      <div className="w-full max-w-md">
        <h1 className="text-xl font-semibold text-ink text-center">Create your account</h1>
        <p className="mt-1 text-sm text-ink-soft text-center">Choose how you'll use HireStone.</p>

        <div className="mt-8 grid gap-4">
          <Link
            href="/register/candidate"
            className="flex items-center gap-4 rounded-lg border border-line bg-white p-5 hover:border-brand-300 hover:shadow-pop transition-all"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-50 text-brand-600">
              <User className="h-5 w-5" />
            </span>
            <div>
              <p className="font-medium text-ink">I'm looking for a job</p>
              <p className="text-sm text-ink-soft">Search roles, upload a resume, apply</p>
            </div>
          </Link>

          <Link
            href="/register/employer"
            className="flex items-center gap-4 rounded-lg border border-line bg-white p-5 hover:border-brand-300 hover:shadow-pop transition-all"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-accent-50 text-accent-700">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <p className="font-medium text-ink">I'm hiring</p>
              <p className="text-sm text-ink-soft">Post roles and review applicants</p>
            </div>
          </Link>
        </div>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand-500 underline underline-offset-2">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
