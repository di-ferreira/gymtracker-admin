"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { useCreateExercise } from "@/hooks/use-exercises";
import { useEquipmentList } from "@/hooks/use-equipment";
import { useMuscleGroupList } from "@/hooks/use-muscle-groups";
import { useMovementGroupList } from "@/hooks/use-movement-groups";
import { exerciseSchema, type ExerciseFormData } from "@/lib/schemas";
import type { ExerciseCreate } from "@/types";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { Label } from "@/components/ui/label";
import { ArrowUp, ArrowDown, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CreateExercisePage() {
  const router = useRouter();
  const createExercise = useCreateExercise();
  const { data: equipmentData } = useEquipmentList({ per_page: 100 });
  const { data: muscleGroupData } = useMuscleGroupList({ per_page: 100 });
  const { data: movementGroupData } = useMovementGroupList({ per_page: 100 });

  const [manualSlug, setManualSlug] = useState(false);

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

  const watchName = form.watch("name");

  function handleNameChange(value: string) {
    form.setValue("name", value);
    if (!manualSlug && value) {
      form.setValue("slug", slugify(value));
    }
  }

  async function onSubmit(data: ExerciseFormData) {
    try {
      const payload: ExerciseCreate = {
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
      await createExercise.mutateAsync(payload);
      toast.success("Exercício criado com sucesso");
      router.push("/exercises");
    } catch {
      toast.error("Erro ao criar exercício");
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-4">
          <Link href="/exercises">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Novo Exercício
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Adicione um novo exercício ao catálogo
            </p>
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
                        <Input
                          placeholder="Ex: Supino Reto"
                          {...field}
                          onChange={(e) => handleNameChange(e.target.value)}
                        />
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
                        <Input
                          placeholder="supino-reto"
                          {...field}
                          onFocus={() => setManualSlug(true)}
                        />
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
                        <Textarea
                          placeholder="Descrição do exercício"
                          className="min-h-24"
                          {...field}
                        />
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
                        <Textarea
                          placeholder="Dicas para execução correta"
                          className="min-h-24"
                          {...field}
                        />
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
                            <SelectValue placeholder="Selecione a dificuldade" />
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
                            {equipmentValue.map((id) => {
                              const eq = equipmentData?.data.find((e) => e.id === id);
                              return (
                                <div
                                  key={id}
                                  className="inline-flex items-center gap-1 rounded-full border border-border bg-accent px-3 py-1 text-sm"
                                >
                                  {eq?.name ?? id}
                                  <button
                                    type="button"
                                    className="text-muted-foreground hover:text-foreground ml-1"
                                    onClick={() =>
                                      field.onChange(equipmentValue.filter((v) => v !== id))
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
                      <Label>Passo {index + 1}</Label>
                      <Textarea
                        placeholder="Descrição do passo"
                        {...form.register(`instructions.${index}.description`)}
                      />
                      {form.formState.errors.instructions?.[index]?.description && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.instructions[index]?.description?.message}
                        </p>
                      )}
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
              <Button type="submit" disabled={createExercise.isPending}>
                {createExercise.isPending ? "Salvando..." : "Salvar Exercício"}
              </Button>
              <Link href="/exercises">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}
