import { z } from "zod";

const difficultyOptions = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;

export const exerciseSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255, "Máximo de 255 caracteres"),
  description: z.string().optional(),
  execution_tips: z.string().optional(),
  difficulty: z.enum(difficultyOptions).optional().nullable(),
  thumbnail_url: z.string().url("URL inválida").optional().or(z.literal("")),
  image_url: z.string().url("URL inválida").optional().or(z.literal("")),
  gif_url: z.string().url("URL inválida").optional().or(z.literal("")),
  video_url: z.string().url("URL inválida").optional().or(z.literal("")),
  movement_group_id: z.string().uuid("Grupo de movimento inválido"),
  muscle_group_id: z.string().uuid("Grupo muscular inválido"),
  equipment_ids: z.array(z.string().uuid()).optional(),
});

export type ExerciseFormData = z.input<typeof exerciseSchema>;

export const equipmentSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255, "Máximo de 255 caracteres"),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  order_index: z.number().int().min(0).optional().default(0),
});

export type EquipmentFormData = z.input<typeof equipmentSchema>;

export const muscleGroupSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255, "Máximo de 255 caracteres"),
  description: z.string().optional().nullable(),
  order_index: z.number().int().min(0).optional().default(0),
});

export type MuscleGroupFormData = z.input<typeof muscleGroupSchema>;

export const movementGroupSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255, "Máximo de 255 caracteres"),
  description: z.string().optional().nullable(),
  order_index: z.number().int().min(0).optional().default(0),
});

export type MovementGroupFormData = z.input<typeof movementGroupSchema>;

export const substitutionSchema = z.object({
  exercise_id: z.string().uuid("Exercício principal inválido"),
  alternative_exercise_id: z.string().uuid("Exercício substituto inválido"),
  reason: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
});

export type SubstitutionFormData = z.infer<typeof substitutionSchema>;

const userRoles = ["admin", "user"] as const;

export const userCreateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(150, "Máximo de 150 caracteres"),
  email: z.string().email("Email inválido").max(255, "Máximo de 255 caracteres"),
  password: z.string().min(8, "Mínimo de 8 caracteres").max(128, "Máximo de 128 caracteres"),
  role: z.enum(userRoles, { message: "Função inválida" }).default("user"),
  is_active: z.boolean().default(true),
});

export type UserCreateFormData = z.input<typeof userCreateSchema>;

export const userEditSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255, "Máximo de 255 caracteres"),
  role: z.enum(userRoles, { message: "Função inválida" }),
  is_active: z.boolean(),
});

export type UserEditFormData = z.input<typeof userEditSchema>;

export const instructionSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  step_order: z.number().int().min(0).optional(),
  image_url: z.string().url("URL inválida").optional().or(z.literal("")),
});

export type InstructionFormData = z.input<typeof instructionSchema>;

export const workoutSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255, "Máximo de 255 caracteres"),
  description: z.string().optional(),
  user_id: z.string().uuid("Usuário inválido"),
});

export type WorkoutFormData = z.input<typeof workoutSchema>;

export const workoutExerciseSchema = z.object({
  exercise_id: z.string().uuid("Exercício inválido"),
  sets: z.number().int().min(0).optional().nullable(),
  reps: z.number().int().min(0).optional().nullable(),
  weight: z.number().min(0).optional().nullable(),
  rest_seconds: z.number().int().min(0).optional().nullable(),
  notes: z.string().optional().nullable(),
  order: z.number().int().min(0).optional(),
});

export type WorkoutExerciseFormData = z.input<typeof workoutExerciseSchema>;
