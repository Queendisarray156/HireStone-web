# Niyog -- a Job Posting and Hiring Plateform

Next.js 16 (App Router) + TypeScript + Tailwind frontend for the job-board FastAPI backend.

## Stack

- Next.js 16 App Router, TypeScript
- Tailwind CSS, custom design tokens (brand navy + accent emerald, see `tailwind.config.ts`)
- Hand-rolled shadcn-style UI primitives on Radix (`src/components/ui`) — Button, Input,
  Select, Tabs, Dialog, Dropdown, Badge, Card, Label, Textarea
- TanStack Query for all API data/mutations
- Axios client with Bearer-token interceptor (`src/lib/api.ts`)
- `sonner` for toasts, `lucide-react` for icons

## Pages built (basic tier)

- `/` — hero + quick search
- `/jobs` — search with keyword/location/job-type/remote filters, pagination
- `/jobs/[id]` — job detail + apply dialog (resume picker + cover letter)
- `/login`, `/register`, `/register/candidate`, `/register/employer`
- `/dashboard/candidate` — applications (with the pipeline stepper) + profile tab
- `/dashboard/candidate/resumes` — upload, set primary, delete
- `/dashboard/employer` — post job dialog, job list, open/close toggle
- `/dashboard/employer/jobs/[id]/applications` — applicant list + status dropdown
- `/admin` — stats cards, application-status breakdown, user activate/deactivate table

Route guarding: `src/middleware.ts` redirects unauthenticated or wrong-role users away
from `/dashboard/*` and `/admin/*`.

## Setup

```bash
npm install
cp .env.example .env.local   # point NEXT_PUBLIC_API_URL at your FastAPI backend
npm run dev
```

## Auth model (read before hardening)

Token + user info are stored in a plain (non-httpOnly) cookie so client components
can read it and attach `Authorization: Bearer <token>` on every API call directly
to FastAPI — no Next.js API proxy layer. This is simple and fine for an internal
tool or MVP; it trades away httpOnly's XSS protection. Hardening path: add Next.js
Route Handlers that hold the token server-side and proxy authenticated requests.

There's no public admin-registration endpoint (matches the backend) — create an
admin with the backend's `app/scripts/create_admin.py`, then log in normally here.

## Deploy — Netlify

`netlify.toml` is set up with the official `@netlify/plugin-nextjs` runtime.
Set `NEXT_PUBLIC_API_URL` as an environment variable in the Netlify site settings
to your deployed FastAPI URL (must allow CORS from your Netlify domain — already
wide open in the backend's `CORSMiddleware`, tighten `allow_origins` for prod).

## Known gaps (next pass)

- No `react-hook-form` + `zod` yet — forms are controlled state with native HTML
  validation. Fine for basic tier, worth adding for richer error messaging.
- Employer/candidate name/email of applicants isn't joined from the backend
  response (`Application` only returns `candidate_id`) — either add a join
  endpoint backend-side or fetch each candidate profile individually.
- No file preview/download for resumes on the employer side.
- No dark mode (design brief was corporate/light).
