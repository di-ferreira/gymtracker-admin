"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import {
  useMuscleGroupList,
  useMuscleGroup,
  useCreateMuscleGroup,
  useUpdateMuscleGroup,
  useDeleteMuscleGroup,
} from "@/hooks/use-muscle-groups";
import { muscleGroupSchema, type MuscleGroupFormData } from "@/lib/schemas";
import type { MuscleGroupCreate, MuscleGroupUpdate } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function MuscleGroupsPage() {
  const { data, isLoading } = useMuscleGroupList({ per_page: 100 });
  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Grupos Musculares</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Gerencie os grupos musculares do catálogo
            </p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger render={<Button />}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Grupo
            </DialogTrigger>
            <CreateDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={() => setCreateOpen(false)} />
          </Dialog>
        </div>

        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-5 w-20" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    Nenhum grupo muscular cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((mg) => (
                  <TableRow key={mg.id}>
                    <TableCell className="font-medium">{mg.name}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {mg.description ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{mg.order_index}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => { setEditId(mg.id); setEditOpen(true); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive"
                          onClick={() => { setDeleteId(mg.id); setDeleteOpen(true); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {editId && (
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent>
              <EditDialog id={editId} onSuccess={() => { setEditOpen(false); setEditId(null); }}
                onCancel={() => { setEditOpen(false); setEditId(null); }} />
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir Grupo Muscular</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancelar</Button>
              <DeleteButton id={deleteId!} onSuccess={() => { setDeleteOpen(false); setDeleteId(null); }} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

function CreateDialog({ onSuccess }: { open: boolean; onOpenChange: (o: boolean) => void; onSuccess: () => void }) {
  const create = useCreateMuscleGroup();
  const form = useForm<MuscleGroupFormData>({
    resolver: zodResolver(muscleGroupSchema),
    defaultValues: { name: "", description: "", order_index: 0 },
  });

  async function onSubmit(data: MuscleGroupFormData) {
    try {
      const payload: MuscleGroupCreate = {
        name: data.name,
        description: data.description || undefined,
        order_index: data.order_index ?? 0,
      };
      await create.mutateAsync(payload);
      toast.success("Grupo muscular criado");
      onSuccess();
    } catch { toast.error("Erro ao criar"); }
  }

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Novo Grupo Muscular</DialogTitle></DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Descrição</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
          <DialogFooter>
            <Button type="submit" disabled={create.isPending}>Salvar</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}

function EditDialog({ id, onSuccess, onCancel }: { id: string; onSuccess: () => void; onCancel: () => void }) {
  const { data } = useMuscleGroup(id);
  const update = useUpdateMuscleGroup();
  const mg = data?.data;
  const form = useForm<MuscleGroupFormData>({
    resolver: zodResolver(muscleGroupSchema),
    defaultValues: { name: "", description: "", order_index: 0 },
  });

  useEffect(() => {
    if (mg) form.reset({
      name: mg.name,
      description: mg.description ?? "",
      order_index: mg.order_index,
    });
  }, [mg, form]);

  async function onSubmit(data: MuscleGroupFormData) {
    try {
      const payload: MuscleGroupUpdate = {
        name: data.name,
        description: data.description || undefined,
        order_index: data.order_index ?? 0,
      };
      await update.mutateAsync({ id, data: payload });
      toast.success("Grupo muscular atualizado");
      onSuccess();
    } catch { toast.error("Erro ao atualizar"); }
  }

  return (
    <>
      <DialogHeader><DialogTitle>Editar Grupo Muscular</DialogTitle></DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Descrição</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)} />
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onCancel}>Cancelar</Button>
            <Button type="submit" disabled={update.isPending}>Salvar</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}

function DeleteButton({ id, onSuccess }: { id: string; onSuccess: () => void }) {
  const del = useDeleteMuscleGroup();
  return <Button variant="destructive" onClick={async () => { try { await del.mutateAsync(id); toast.success("Excluído"); onSuccess(); } catch { toast.error("Erro ao excluir"); } }} disabled={del.isPending}>Excluir</Button>;
}
