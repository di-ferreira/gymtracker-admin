import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { apiList, apiUpdateOne, apiCreateOne, apiRemoveOne } from "@/actions/api.action";
import type { AdminCreateUserRequest, AdminUpdateUserRequest, User } from "@/types";

const queryKey = ["users", "list"] as const;

export function useUserList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...queryKey, params],
    queryFn: () => apiList<User>("/admin/users", params),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminCreateUserRequest) =>
      apiCreateOne<User>("/admin/users", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
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

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiRemoveOne(`/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
