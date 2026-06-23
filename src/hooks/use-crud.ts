import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { ApiResponse, PaginatedResponse } from "@/types";
import {
  apiList,
  apiGetOne,
  apiCreateOne,
  apiUpdateOne,
  apiRemoveOne,
} from "@/actions/api.action";

export function createCrudHooks<T, TCreate, TUpdate>(
  endpoint: string,
  queryKey: string,
) {
  const allKey = [queryKey, "list"] as const;
  const detailKey = [queryKey, "detail"] as const;

  function useList(params?: Record<string, unknown>) {
    return useQuery({
      queryKey: [...allKey, params],
      queryFn: () => apiList<T>(endpoint, params),
    });
  }

  function useGet(id: string | undefined) {
    return useQuery({
      queryKey: [...detailKey, id],
      queryFn: () => apiGetOne<T>(`${endpoint}/${id}`),
      enabled: !!id,
    });
  }

  function useCreate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: TCreate) => apiCreateOne<T>(endpoint, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: allKey });
      },
    });
  }

  function useUpdate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: TUpdate }) =>
        apiUpdateOne<T>(`${endpoint}/${id}`, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: allKey });
      },
    });
  }

  function useRemove() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => apiRemoveOne(`${endpoint}/${id}`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: allKey });
      },
    });
  }

  return { useList, useGet, useCreate, useUpdate, useRemove };
}
