"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import {
  useEquipmentList,
  useEquipment,
  useCreateEquipment,
  useUpdateEquipment,
  useDeleteEquipment,
} from "@/hooks/use-equipment";
import { equipmentSchema, type EquipmentFormData } from "@/lib/schemas";
import type { EquipmentCreate, EquipmentUpdate } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useEffect } from "react";

export default function EquipmentPage() {
  const { data, isLoading } = useEquipmentList({ per_page: 100 });
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
            <h1 className="text-2xl font-bold tracking-tight">Equipamentos</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Gerencie os equipamentos do catálogo
            </p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger render={<Button />}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Equipamento
            </DialogTrigger>
            <CreateEquipmentDialog
              open={createOpen}
              onOpenChange={setCreateOpen}
              onSuccess={() => setCreateOpen(false)}
            />
          </Dialog>
        </div>

        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-5 w-24" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    Nenhum equipamento cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((eq) => (
                  <TableRow key={eq.id}>
                    <TableCell className="font-medium">{eq.name}</TableCell>
                    <TableCell className="text-muted-foreground">{eq.category}</TableCell>
                    <TableCell className="text-muted-foreground">{eq.order_index}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => { setEditId(eq.id); setEditOpen(true); }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => { setDeleteId(eq.id); setDeleteOpen(true); }}
                        >
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
              <EditEquipmentDialog
                id={editId}
                onSuccess={() => { setEditOpen(false); setEditId(null); }}
                onCancel={() => { setEditOpen(false); setEditId(null); }}
              />
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir Equipamento</DialogTitle>
              <DialogDescription>
                Tem certeza? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                Cancelar
              </Button>
              <DeleteButton id={deleteId!} onSuccess={() => { setDeleteOpen(false); setDeleteId(null); }} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

function CreateEquipmentDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const createEquipment = useCreateEquipment();
  const form = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: { name: "", description: "", category: "", order_index: 0 },
  });

  useEffect(() => { if (!open) form.reset(); }, [open, form]);

  async function onSubmit(data: EquipmentFormData) {
    try {
      const payload: EquipmentCreate = {
        name: data.name,
        description: data.description || undefined,
        category: data.category || undefined,
        order_index: data.order_index ?? 0,
      };
      await createEquipment.mutateAsync(payload);
      toast.success("Equipamento criado");
      onSuccess();
    } catch {
      toast.error("Erro ao criar equipamento");
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo Equipamento</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Descrição</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="category" render={({ field }) => (
            <FormItem><FormLabel>Categoria</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
          )} />
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={createEquipment.isPending}>
              {createEquipment.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}

function EditEquipmentDialog({
  id,
  onSuccess,
  onCancel,
}: {
  id: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { data } = useEquipment(id);
  const updateEquipment = useUpdateEquipment();
  const equipment = data?.data;
  const form = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: { name: "", description: "", category: "", order_index: 0 },
  });

  useEffect(() => {
    if (equipment) {
      form.reset({
        name: equipment.name,
        description: equipment.description ?? "",
        category: equipment.category ?? "",
        order_index: equipment.order_index,
      });
    }
  }, [equipment, form]);

  async function onSubmit(data: EquipmentFormData) {
    try {
      const payload: EquipmentUpdate = {
        name: data.name,
        description: data.description || undefined,
        category: data.category || undefined,
        order_index: data.order_index ?? 0,
      };
      await updateEquipment.mutateAsync({ id, data: payload });
      toast.success("Equipamento atualizado");
      onSuccess();
    } catch {
      toast.error("Erro ao atualizar equipamento");
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Editar Equipamento</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Descrição</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="category" render={({ field }) => (
            <FormItem><FormLabel>Categoria</FormLabel><FormControl><Input {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
          )} />
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onCancel}>Cancelar</Button>
            <Button type="submit" disabled={updateEquipment.isPending}>
              {updateEquipment.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}

function DeleteButton({ id, onSuccess }: { id: string; onSuccess: () => void }) {
  const deleteEquipment = useDeleteEquipment();

  async function handleDelete() {
    try {
      await deleteEquipment.mutateAsync(id);
      toast.success("Equipamento excluído");
      onSuccess();
    } catch {
      toast.error("Erro ao excluir equipamento");
    }
  }

  return (
    <Button variant="destructive" onClick={handleDelete} disabled={deleteEquipment.isPending}>
      {deleteEquipment.isPending ? "Excluindo..." : "Excluir"}
    </Button>
  );
}
