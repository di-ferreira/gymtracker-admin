"use client";

import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useExercise, useUpdateExercise } from "@/hooks/use-exercises";
import { useMuscleGroupList } from "@/hooks/use-muscle-groups";
import { useMovementGroupList } from "@/hooks/use-movement-groups";
import { useEquipmentList } from "@/hooks/use-equipment";
import { exerciseSchema, type ExerciseFormData } from "@/lib/schemas";
import type { ExerciseUpdate } from "@/types";
import { useForm } from "react-hook-form";
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
import { ArrowLeft, Weight } from "lucide-react";
import Link from "next/link";
import { MediaUploadField } from "@/components/media-upload-field";

export default function EditExercisePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data, isLoading } = useExercise(id);
  const updateExercise = useUpdateExercise();
  const { data: muscleGroupData } = useMuscleGroupList({ per_page: 100 });
  const { data: movementGroupData } = useMovementGroupList({ per_page: 100 });
  const { data: equipmentData } = useEquipmentList({ per_page: 100 });

  const exercise = data?.data;

  const form = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      name: "",
      description: "",
      execution_tips: "",
      difficulty: undefined,
      movement_group_id: "",
      muscle_group_id: "",
      equipment_ids: [],
    },
  });

  useEffect(() => {
    if (exercise) {
      form.reset({
        name: exercise.name,
        description: exercise.description ?? "",
        execution_tips: exercise.execution_tips ?? "",
        difficulty: exercise.difficulty ?? undefined,
        movement_group_id: exercise.movement_group_id,
        muscle_group_id: exercise.muscle_group_id,
        equipment_ids: exercise.equipment?.map((e) => e.id) ?? [],
      });
    }
  }, [exercise, form]);

  async function onSubmit(data: ExerciseFormData) {
    try {
      const payload: ExerciseUpdate = {
        name: data.name,
        description: data.description || undefined,
        execution_tips: data.execution_tips || undefined,
        difficulty: data.difficulty ?? undefined,
        movement_group_id: data.movement_group_id,
        muscle_group_id: data.muscle_group_id,
        equipment_ids: data.equipment_ids && data.equipment_ids.length > 0 ? data.equipment_ids : undefined,
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

  const selectedIds = form.watch("equipment_ids") ?? [];

  function toggleEquipment(eid: string) {
    const current = form.getValues("equipment_ids") ?? [];
    if (current.includes(eid)) {
      form.setValue("equipment_ids", current.filter((id) => id !== eid), { shouldValidate: true });
    } else {
      form.setValue("equipment_ids", [...current, eid], { shouldValidate: true });
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Weight className="h-5 w-5 text-primary" />
                  Equipamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!equipmentData || equipmentData.data.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum equipamento disponível
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {equipmentData.data.map((eq) => (
                      <label
                        key={eq.id}
                        className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer transition-colors ${
                          selectedIds.includes(eq.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-accent"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(eq.id)}
                          onChange={() => toggleEquipment(eq.id)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm font-medium">{eq.name}</span>
                      </label>
                    ))}
                  </div>
                )}
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
                    <MediaUploadField
                      label="Thumbnail"
                      accept="image/*"
                      value={field.value}
                      onChange={(url) => field.onChange(url)}
                      previewType="image"
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <MediaUploadField
                      label="Imagem"
                      accept="image/*"
                      value={field.value}
                      onChange={(url) => field.onChange(url)}
                      previewType="image"
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="gif_url"
                  render={({ field }) => (
                    <MediaUploadField
                      label="GIF"
                      accept="image/*,.gif"
                      value={field.value}
                      onChange={(url) => field.onChange(url)}
                      previewType="image"
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="video_url"
                  render={({ field }) => (
                    <MediaUploadField
                      label="Vídeo"
                      accept="video/*"
                      value={field.value}
                      onChange={(url) => field.onChange(url)}
                      previewType="video"
                    />
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
