import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { apiList, apiUpdateOne } from "@/actions/api.action";
import type { AdminUpdateUserRequest, User } from "@/types";

const queryKey = ["users", "list"] as const;

export function useUserList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...queryKey, params],
    queryFn: () => apiList<User>("/admin/users", params),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminUpdateUserRequest }) =>
      apiUpdateOne<User>(`/admin/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
