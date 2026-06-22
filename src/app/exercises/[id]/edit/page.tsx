"use client";

import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useExercise, useUpdateExercise } from "@/hooks/use-exercises";
import { useEquipmentList } from "@/hooks/use-equipment";
import { useMuscleGroupList } from "@/hooks/use-muscle-groups";
import { useMovementGroupList } from "@/hooks/use-movement-groups";
import { exerciseSchema, type ExerciseFormData } from "@/lib/schemas";
import type { ExerciseUpdate } from "@/types";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditExercisePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data, isLoading } = useExercise(id);
  const updateExercise = useUpdateExercise();
  const { data: equipmentData } = useEquipmentList({ per_page: 100 });
  const { data: muscleGroupData } = useMuscleGroupList({ per_page: 100 });
  const { data: movementGroupData } = useMovementGroupList({ per_page: 100 });

  const exercise = data?.data;

  const form = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      execution_tips: "",
      difficulty: undefined,
      movement_group_id: "",
      muscle_group_id: "",
      equipment_ids: [],
      instructions: [],
    },
  });

  const { fields, append, remove, swap } = useFieldArray({
    control: form.control,
    name: "instructions",
  });

  useEffect(() => {
    if (exercise) {
      form.reset({
        name: exercise.name,
        slug: exercise.slug,
        description: exercise.description ?? "",
        execution_tips: exercise.execution_tips ?? "",
        difficulty: exercise.difficulty ?? undefined,
        movement_group_id: exercise.movement_group_id,
        muscle_group_id: exercise.muscle_group_id,
        equipment_ids: exercise.equipment_relations?.map((r) => r.equipment_id) ?? [],
        instructions: exercise.instructions?.map((i) => ({
          step_order: i.step_order,
          description: i.description,
          image_url: i.image_url,
        })) ?? [],
      });
    }
  }, [exercise, form]);

  async function onSubmit(data: ExerciseFormData) {
    try {
      const payload: ExerciseUpdate = {
        name: data.name,
        slug: data.slug || undefined,
        description: data.description || undefined,
        execution_tips: data.execution_tips || undefined,
        difficulty: data.difficulty ?? undefined,
        movement_group_id: data.movement_group_id,
        muscle_group_id: data.muscle_group_id,
        thumbnail_url: data.thumbnail_url || undefined,
        image_url: data.image_url || undefined,
        gif_url: data.gif_url || undefined,
        video_url: data.video_url || undefined,
      };
      await updateExercise.mutateAsync({ id, data: payload });
      toast.success("Exercício atualizado com sucesso");
      router.push(`/exercises/${id}`);
    } catch {
      toast.error("Erro ao atualizar exercício");
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-2xl">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!exercise) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Exercício não encontrado</p>
          <Link href="/exercises">
            <Button variant="link">Voltar para lista</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-4">
          <Link href={`/exercises/${id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Editar Exercício
            </h1>
            <p className="text-muted-foreground text-sm mt-1">{exercise.name}</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-24" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="execution_tips"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dicas de Execução</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-24" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dificuldade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Beginner">Iniciante</SelectItem>
                          <SelectItem value="Intermediate">Intermediário</SelectItem>
                          <SelectItem value="Advanced">Avançado</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Classificação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="muscle_group_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grupo Muscular</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {muscleGroupData?.data.map((mg) => (
                            <SelectItem key={mg.id} value={mg.id}>
                              {mg.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="movement_group_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grupo de Movimento</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {movementGroupData?.data.map((mg) => (
                            <SelectItem key={mg.id} value={mg.id}>
                              {mg.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="equipment_ids"
                  render={({ field }) => {
                    const equipmentValue = field.value ?? [];
                    return (
                      <FormItem>
                        <FormLabel>Equipamentos</FormLabel>
                        <Select
                          onValueChange={(newValue) => {
                            if (newValue && !equipmentValue.includes(newValue)) {
                              field.onChange([...equipmentValue, newValue]);
                            }
                          }}
                          value=""
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Adicionar equipamento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {equipmentData?.data
                              .filter((eq) => !equipmentValue.includes(eq.id))
                              .map((eq) => (
                                <SelectItem key={eq.id} value={eq.id}>
                                  {eq.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {equipmentValue.map((eqId) => {
                            const eq = equipmentData?.data.find((e) => e.id === eqId);
                            return (
                              <div
                                key={eqId}
                                className="inline-flex items-center gap-1 rounded-full border border-border bg-accent px-3 py-1 text-sm"
                              >
                                {eq?.name ?? eqId}
                                <button
                                  type="button"
                                  className="text-muted-foreground hover:text-foreground ml-1"
                                  onClick={() =>
                                    field.onChange(equipmentValue.filter((v) => v !== eqId))
                                  }
                                >
                                  ×
                                </button>
                              </div>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instruções</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-start gap-3 rounded-lg border border-border p-4"
                  >
                    <div className="flex flex-col gap-1 mt-1">
                      <button
                        type="button"
                        onClick={() => swap(index, index - 1)}
                        disabled={index === 0}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => swap(index, index + 1)}
                        disabled={index === fields.length - 1}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-medium">Passo {index + 1}</p>
                      <Textarea
                        placeholder="Descrição do passo"
                        {...form.register(`instructions.${index}.description`)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-6 text-muted-foreground hover:text-destructive"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({ step_order: fields.length + 1, description: "" })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Passo
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mídias</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="thumbnail_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail (URL)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://..."
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagem (URL)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://..."
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gif_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GIF (URL)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://..."
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="video_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vídeo (URL)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://..."
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={updateExercise.isPending}>
                {updateExercise.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
              <Link href={`/exercises/${id}`}>
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}
