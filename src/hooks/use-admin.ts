import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AdminUser, ApplicationStats } from "@/types";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const { data } = await api.get<ApplicationStats>("/admin/stats");
      return data;
    },
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const { data } = await api.get<AdminUser[]>("/admin/users");
      return data;
    },
  });
}

export function useToggleUserActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, activate }: { id: number; activate: boolean }) => {
      const { data } = await api.patch<AdminUser>(`/admin/users/${id}/${activate ? "activate" : "deactivate"}`);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}
