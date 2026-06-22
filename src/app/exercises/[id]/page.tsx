"use client";

import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useExercise, useDeleteExercise } from "@/hooks/use-exercises";
import { useMuscleGroupList } from "@/hooks/use-muscle-groups";
import { useMovementGroupList } from "@/hooks/use-movement-groups";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Dumbbell,
  Bone,
  Move3d,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

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
  const [deleteOpen, setDeleteOpen] = useState(false);
  const exercise = data?.data;

  const muscleGroupName = muscleGroups?.data.find(
    (mg) => mg.id === exercise?.muscle_group_id,
  )?.name;
  const movementGroupName = movementGroups?.data.find(
    (mg) => mg.id === exercise?.movement_group_id,
  )?.name;

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
              <p className="text-muted-foreground text-sm">/{exercise.slug}</p>
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
