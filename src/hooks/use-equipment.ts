import { createCrudHooks } from "@/hooks/use-crud";
import { equipmentService } from "@/services/equipment.service";
import type { Equipment, EquipmentCreate, EquipmentUpdate } from "@/types";

export const {
  useList: useEquipmentList,
  useGet: useEquipment,
  useCreate: useCreateEquipment,
  useUpdate: useUpdateEquipment,
  useRemove: useDeleteEquipment,
} = createCrudHooks<Equipment, EquipmentCreate, EquipmentUpdate>(
  equipmentService,
  "equipment",
);
