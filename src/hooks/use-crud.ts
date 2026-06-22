import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { ApiResponse, PaginatedResponse } from "@/types";

type ServiceMethod<T, TCreate, TUpdate> = {
  list: (params?: Record<string, unknown>) => Promise<PaginatedResponse<T>>;
  get: (id: string) => Promise<ApiResponse<T>>;
  create: (data: TCreate) => Promise<ApiResponse<T>>;
  update: (id: string, data: TUpdate) => Promise<ApiResponse<T>>;
  remove: (id: string) => Promise<void>;
};

export function createCrudHooks<T, TCreate, TUpdate>(
  service: ServiceMethod<T, TCreate, TUpdate>,
  queryKey: string,
) {
  const allKey = [queryKey, "list"] as const;
  const detailKey = [queryKey, "detail"] as const;

  function useList(
    params?: Record<string, unknown>,
    options?: Partial<UseQueryOptions<PaginatedResponse<T>>>,
  ) {
    return useQuery({
      queryKey: [...allKey, params],
      queryFn: () => service.list(params),
      ...options,
    });
  }

  function useGet(id: string | undefined) {
    return useQuery({
      queryKey: [...detailKey, id],
      queryFn: () => service.get(id!),
      enabled: !!id,
    });
  }

  function useCreate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: TCreate) => service.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: allKey });
      },
    });
  }

  function useUpdate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: TUpdate }) =>
        service.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: allKey });
      },
    });
  }

  function useRemove() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => service.remove(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: allKey });
      },
    });
  }

  return { useList, useGet, useCreate, useUpdate, useRemove };
}
