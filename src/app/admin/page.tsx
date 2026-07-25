"use client";

import { toast } from "sonner";
import { Loader2, Briefcase, Users, Building2, User } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdminStats, useAdminUsers, useToggleUserActive } from "@/hooks/use-admin";
import { apiErrorMessage } from "@/lib/api";

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Users }) {
  return (
    <Card>
      <CardBody className="flex items-center gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-600">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-2xl font-semibold font-mono text-ink">{value}</p>
          <p className="text-xs text-ink-soft">{label}</p>
        </div>
      </CardBody>
    </Card>
  );
}

export default function AdminPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: users, isLoading: usersLoading } = useAdminUsers();
  const toggle = useToggleUserActive();

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-semibold text-ink">Admin</h1>

      {statsLoading ? (
        <div className="flex justify-center py-12 text-ink-faint">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : stats ? (
        <>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Open jobs" value={stats.open_jobs} icon={Briefcase} />
            <StatCard label="Total jobs" value={stats.total_jobs} icon={Briefcase} />
            <StatCard label="Employers" value={stats.total_employers} icon={Building2} />
            <StatCard label="Candidates" value={stats.total_candidates} icon={User} />
          </div>

          <Card className="mt-6">
            <CardBody>
              <p className="text-sm font-semibold text-ink mb-3">
                Applications by status ({stats.total_applications} total)
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.by_status).map(([status, count]) => (
                  <Badge key={status} variant="neutral">
                    {status}: {count}
                  </Badge>
                ))}
              </div>
            </CardBody>
          </Card>
        </>
      ) : null}

      <h2 className="mt-10 text-lg font-semibold text-ink">Users</h2>
      <div className="mt-4 overflow-x-auto rounded-lg border border-line bg-white">
        {usersLoading ? (
          <div className="flex justify-center py-12 text-ink-faint">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink-faint">
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Role</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u) => (
                <tr key={u.id} className="border-b border-line last:border-0">
                  <td className="p-3 text-ink">{u.email}</td>
                  <td className="p-3 text-ink-soft capitalize">{u.role}</td>
                  <td className="p-3">
                    <Badge variant={u.is_active ? "accent" : "danger"}>{u.is_active ? "Active" : "Disabled"}</Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        toggle.mutate(
                          { id: u.id, activate: !u.is_active },
                          { onSuccess: () => toast.success("Updated"), onError: (err) => toast.error(apiErrorMessage(err)) }
                        )
                      }
                    >
                      {u.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
