import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import type { AdminUpdateUserRequest } from "@/types";

const queryKey = ["users", "list"] as const;

export function useUserList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...queryKey, params],
    queryFn: () => userService.list(params),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminUpdateUserRequest }) =>
      userService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
