"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import {
  useUserList,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/use-users";
import { userCreateSchema, userEditSchema, type UserCreateFormData, type UserEditFormData } from "@/lib/schemas";
import type { AdminCreateUserRequest, AdminUpdateUserRequest } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UsersPage() {
  const { data, isLoading } = useUserList();
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
            <h1 className="text-2xl font-bold tracking-tight">Usuários</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Gerencie os usuários do sistema
            </p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger render={<Button />}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </DialogTrigger>
            <CreateUserDialog
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
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-5 w-24" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        user.role === "admin"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground",
                      )}>
                        {user.role === "admin" ? "Admin" : "Usuário"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        user.is_active
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-destructive/10 text-destructive",
                      )}>
                        {user.is_active ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => { setEditId(user.id); setEditOpen(true); }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => { setDeleteId(user.id); setDeleteOpen(true); }}
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
              <EditUserDialog
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
              <DialogTitle>Excluir Usuário</DialogTitle>
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

function CreateUserDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const createUser = useCreateUser();
  const form = useForm<UserCreateFormData>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: { name: "", email: "", password: "", role: "user", is_active: true },
  });

  useEffect(() => { if (!open) form.reset(); }, [open, form]);

  async function onSubmit(formData: UserCreateFormData) {
    try {
      const payload: AdminCreateUserRequest = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        is_active: formData.is_active,
      };
      await createUser.mutateAsync(payload);
      toast.success("Usuário criado");
      onSuccess();
    } catch {
      toast.error("Erro ao criar usuário");
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo Usuário</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem><FormLabel>Senha</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="role" render={({ field }) => (
            <FormItem>
              <FormLabel>Função</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={(v) => v !== null && field.onChange(v)}>
                  <SelectTrigger><span>{field.value === "admin" ? "Admin" : "Usuário"}</span></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="is_active" render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <FormLabel className="cursor-pointer">Usuário ativo</FormLabel>
                <p className="text-xs text-muted-foreground">
                  {field.value ? "Pode acessar o sistema" : "Acesso bloqueado"}
                </p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )} />
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={createUser.isPending}>
              {createUser.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}

function EditUserDialog({
  id,
  onSuccess,
  onCancel,
}: {
  id: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { data } = useUserList();
  const updateUser = useUpdateUser();
  const user = data?.data.find((u) => u.id === id);
  const form = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema),
    defaultValues: { name: "", role: "user", is_active: true },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        role: user.role,
        is_active: user.is_active,
      });
    }
  }, [user, form]);

  async function onSubmit(formData: UserEditFormData) {
    try {
      const payload: AdminUpdateUserRequest = {
        name: formData.name,
        role: formData.role,
        is_active: formData.is_active,
      };
      await updateUser.mutateAsync({ id, data: payload });
      toast.success("Usuário atualizado");
      onSuccess();
    } catch {
      toast.error("Erro ao atualizar usuário");
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Editar Usuário</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="role" render={({ field }) => (
            <FormItem>
              <FormLabel>Função</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={(v) => v !== null && field.onChange(v)}>
                  <SelectTrigger><span>{field.value === "admin" ? "Admin" : "Usuário"}</span></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="is_active" render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <FormLabel className="cursor-pointer">Usuário ativo</FormLabel>
                <p className="text-xs text-muted-foreground">
                  {field.value ? "Pode acessar o sistema" : "Acesso bloqueado"}
                </p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )} />
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onCancel}>Cancelar</Button>
            <Button type="submit" disabled={updateUser.isPending}>
              {updateUser.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}

function DeleteButton({ id, onSuccess }: { id: string; onSuccess: () => void }) {
  const deleteUser = useDeleteUser();

  async function handleDelete() {
    try {
      await deleteUser.mutateAsync(id);
      toast.success("Usuário excluído");
      onSuccess();
    } catch {
      toast.error("Erro ao excluir usuário");
    }
  }

  return (
    <Button variant="destructive" onClick={handleDelete} disabled={deleteUser.isPending}>
      {deleteUser.isPending ? "Excluindo..." : "Excluir"}
    </Button>
  );
}
