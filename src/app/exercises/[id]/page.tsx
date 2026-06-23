"use client";

import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useExercise, useDeleteExercise } from "@/hooks/use-exercises";
import { useMuscleGroupList } from "@/hooks/use-muscle-groups";
import { useMovementGroupList } from "@/hooks/use-movement-groups";
import { useEquipmentList } from "@/hooks/use-equipment";
import {
  useInstructionList,
  useCreateInstruction,
  useUpdateInstruction,
  useDeleteInstruction,
} from "@/hooks/use-instructions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Dumbbell,
  Bone,
  Move3d,
  Weight,
  ListOrdered,
  Plus,
  GripVertical,
  Pencil,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { instructionSchema, type InstructionFormData } from "@/lib/schemas";

const difficultyColor: Record<string, string> = {
  Beginner: "bg-green-500/10 text-green-500",
  Intermediate: "bg-yellow-500/10 text-yellow-500",
  Advanced: "bg-red-500/10 text-red-500",
  Expert: "bg-purple-500/10 text-purple-500",
};

export default function ExerciseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data, isLoading } = useExercise(id);
  const deleteExercise = useDeleteExercise();
  const { data: muscleGroups } = useMuscleGroupList({ per_page: 100 });
  const { data: movementGroups } = useMovementGroupList({ per_page: 100 });
  const { data: equipmentData } = useEquipmentList({ per_page: 100 });
  const { data: instructions, isLoading: instructionsLoading } = useInstructionList(id);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [instructionOpen, setInstructionOpen] = useState(false);
  const [editingInstruction, setEditingInstruction] = useState<string | null>(null);
  const exercise = data?.data;

  const muscleGroupName = muscleGroups?.data.find(
    (mg) => mg.id === exercise?.muscle_group_id,
  )?.name;
  const movementGroupName = movementGroups?.data.find(
    (mg) => mg.id === exercise?.movement_group_id,
  )?.name;

  const equipmentNames = exercise?.equipment_ids
    ?.map((eid) => equipmentData?.data.find((eq) => eq.id === eid)?.name)
    .filter(Boolean) ?? [];

  async function handleDelete() {
    try {
      await deleteExercise.mutateAsync(id);
      toast.success("Exercício excluído com sucesso");
      router.push("/exercises");
    } catch {
      toast.error("Erro ao excluir exercício");
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
            <Button variant="link" className="mt-2">
              Voltar para lista
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/exercises">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {exercise.name}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/exercises/${id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </Link>
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DialogTrigger render={<Button variant="destructive" size="sm" />}>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Excluir Exercício</DialogTitle>
                  <DialogDescription>
                    Tem certeza que deseja excluir &quot;{exercise.name}&quot;?
                    Esta ação não pode ser desfeita.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleteExercise.isPending}
                  >
                    {deleteExercise.isPending ? "Excluindo..." : "Excluir"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              Informações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Dificuldade</span>
                <div className="mt-1">
                  {exercise.difficulty ? (
                    <Badge
                      variant="secondary"
                      className={difficultyColor[exercise.difficulty]}
                    >
                      {exercise.difficulty}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </div>
            </div>

            {equipmentNames.length > 0 && (
              <div>
                <span className="text-sm text-muted-foreground">Equipamentos</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {equipmentNames.map((name) => (
                    <Badge key={name} variant="secondary">
                      <Weight className="h-3 w-3 mr-1" />
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {exercise.description && (
              <div>
                <span className="text-sm text-muted-foreground">Descrição</span>
                <p className="text-foreground mt-1 whitespace-pre-wrap">
                  {exercise.description}
                </p>
              </div>
            )}

            {exercise.execution_tips && (
              <div>
                <span className="text-sm text-muted-foreground">Dicas de Execução</span>
                <p className="text-foreground mt-1 whitespace-pre-wrap">
                  {exercise.execution_tips}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bone className="h-5 w-5 text-primary" />
              Classificação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Grupo Muscular</span>
                <div className="flex items-center gap-2 mt-1">
                  <Bone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {muscleGroupName ?? exercise.muscle_group_id}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Grupo de Movimento</span>
                <div className="flex items-center gap-2 mt-1">
                  <Move3d className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {movementGroupName ?? exercise.movement_group_id}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ListOrdered className="h-5 w-5 text-primary" />
                Instruções (Passo a Passo)
              </CardTitle>
              <Dialog open={instructionOpen} onOpenChange={setInstructionOpen}>
                <DialogTrigger render={<Button size="sm" />}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Passo
                </DialogTrigger>
                <InstructionFormDialog
                  exerciseId={id}
                  open={instructionOpen}
                  onOpenChange={setInstructionOpen}
                />
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {instructionsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : !instructions || instructions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhuma instrução cadastrada
              </p>
            ) : (
              <div className="space-y-2">
                {instructions
                  .slice()
                  .sort((a, b) => a.step_order - b.step_order)
                  .map((inst, index) => (
                    <div
                      key={inst.id}
                      className="flex items-start gap-3 rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary shrink-0">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground whitespace-pre-wrap">
                          {inst.description}
                        </p>
                        {inst.image_url && (
                          <img
                            src={inst.image_url}
                            alt=""
                            className="mt-2 rounded-lg border border-border w-32 aspect-video object-cover"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setEditingInstruction(inst.id)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <DeleteInstructionButton
                          exerciseId={id}
                          instructionId={inst.id}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {editingInstruction && (
          <Dialog
            open={!!editingInstruction}
            onOpenChange={(open) => { if (!open) setEditingInstruction(null); }}
          >
            <InstructionFormDialog
              exerciseId={id}
              instructionId={editingInstruction}
              open={!!editingInstruction}
              onOpenChange={(open) => { if (!open) setEditingInstruction(null); }}
            />
          </Dialog>
        )}

        {(exercise.thumbnail_url || exercise.image_url || exercise.gif_url || exercise.video_url) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Mídias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {exercise.thumbnail_url && (
                  <div>
                    <span className="text-sm text-muted-foreground">Thumbnail</span>
                    <img
                      src={exercise.thumbnail_url}
                      alt=""
                      className="mt-1 rounded-lg border border-border w-full aspect-video object-cover"
                    />
                  </div>
                )}
                {exercise.image_url && (
                  <div>
                    <span className="text-sm text-muted-foreground">Imagem</span>
                    <img
                      src={exercise.image_url}
                      alt=""
                      className="mt-1 rounded-lg border border-border w-full aspect-video object-cover"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

function InstructionFormDialog({
  exerciseId,
  instructionId,
  open,
  onOpenChange,
}: {
  exerciseId: string;
  instructionId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: instructions } = useInstructionList(exerciseId);
  const createInstruction = useCreateInstruction();
  const updateInstruction = useUpdateInstruction();
  const isEditing = !!instructionId;

  const existingInstruction = instructionId
    ? instructions?.find((i) => i.id === instructionId)
    : undefined;

  const form = useForm<InstructionFormData>({
    resolver: zodResolver(instructionSchema),
    defaultValues: {
      description: "",
      image_url: "",
      step_order: undefined,
    },
  });

  function resetForm() {
    if (existingInstruction) {
      form.reset({
        description: existingInstruction.description,
        image_url: existingInstruction.image_url ?? "",
        step_order: existingInstruction.step_order,
      });
    } else {
      form.reset({
        description: "",
        image_url: "",
        step_order: instructions?.length ?? 0,
      });
    }
  }

  useState(() => { if (open) resetForm(); });

  async function onSubmit(data: InstructionFormData) {
    try {
      if (isEditing && instructionId) {
        await updateInstruction.mutateAsync({
          exerciseId,
          instructionId,
          data: {
            description: data.description,
            image_url: data.image_url || undefined,
            step_order: data.step_order,
          },
        });
        toast.success("Instrução atualizada");
      } else {
        await createInstruction.mutateAsync({
          exerciseId,
          data: {
            description: data.description,
            image_url: data.image_url || undefined,
            step_order: data.step_order ?? instructions?.length ?? 0,
          },
        });
        toast.success("Instrução adicionada");
      }
      onOpenChange(false);
    } catch {
      toast.error("Erro ao salvar instrução");
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Editar Passo" : "Adicionar Passo"}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea className="min-h-20" {...field} />
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
                <FormLabel>URL da Imagem (opcional)</FormLabel>
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
          <DialogFooter>
            <Button type="submit">
              {isEditing ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}

function DeleteInstructionButton({
  exerciseId,
  instructionId,
}: {
  exerciseId: string;
  instructionId: string;
}) {
  const deleteInstruction = useDeleteInstruction();

  async function handleDelete() {
    try {
      await deleteInstruction.mutateAsync({ exerciseId, instructionId });
      toast.success("Instrução removida");
    } catch {
      toast.error("Erro ao remover instrução");
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="text-muted-foreground hover:text-destructive"
      onClick={handleDelete}
    >
      <X className="h-3.5 w-3.5" />
    </Button>
  );
}
