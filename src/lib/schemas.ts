import { z } from "zod";

const difficultyOptions = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;

export const exerciseSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255, "Máximo de 255 caracteres"),
  slug: z.string().optional(),
  description: z.string().optional(),
  execution_tips: z.string().optional(),
  difficulty: z.enum(difficultyOptions).optional().nullable(),
  target_muscle_primary: z.string().optional().nullable(),
  thumbnail_url: z.string().url("URL inválida").optional().or(z.literal("")),
  image_url: z.string().url("URL inválida").optional().or(z.literal("")),
  gif_url: z.string().url("URL inválida").optional().or(z.literal("")),
  video_url: z.string().url("URL inválida").optional().or(z.literal("")),
  movement_group_id: z.string().uuid("Grupo de movimento inválido"),
  muscle_group_id: z.string().uuid("Grupo muscular inválido"),
  equipment_ids: z.array(z.string().uuid()).optional().default([]),
  instructions: z
    .array(
      z.object({
        step_order: z.number().int().min(1),
        description: z.string().min(1, "Descrição do passo é obrigatória"),
        image_url: z.string().optional().nullable(),
      }),
    )
    .optional()
    .default([]),
});

export type ExerciseFormData = z.infer<typeof exerciseSchema>;

export const equipmentSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255, "Máximo de 255 caracteres"),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  order_index: z.number().int().min(0).optional().default(0),
});

export type EquipmentFormData = z.infer<typeof equipmentSchema>;

export const muscleGroupSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255, "Máximo de 255 caracteres"),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  order_index: z.number().int().min(0).optional().default(0),
});

export type MuscleGroupFormData = z.infer<typeof muscleGroupSchema>;

export const movementGroupSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255, "Máximo de 255 caracteres"),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  order_index: z.number().int().min(0).optional().default(0),
});

export type MovementGroupFormData = z.infer<typeof movementGroupSchema>;

export const substitutionSchema = z.object({
  exercise_id: z.string().uuid("Exercício principal inválido"),
  alternative_exercise_id: z.string().uuid("Exercício substituto inválido"),
  reason: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
});

export type SubstitutionFormData = z.infer<typeof substitutionSchema>;
