import { createCrudHooks } from "@/hooks/use-crud";
import type { Equipment, EquipmentCreate, EquipmentUpdate } from "@/types";

export const {
  useList: useEquipmentList,
  useGet: useEquipment,
  useCreate: useCreateEquipment,
  useUpdate: useUpdateEquipment,
  useRemove: useDeleteEquipment,
} = createCrudHooks<Equipment, EquipmentCreate, EquipmentUpdate>(
  "/admin/catalog/equipment",
  "equipment",
);
