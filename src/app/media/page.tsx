"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { mediaService, type MediaItem } from "@/services/media.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, Trash2, Film, Image, FileType } from "lucide-react";

const typeIcons: Record<string, React.ReactNode> = {
  VIDEO: <Film className="h-4 w-4" />,
  GIF: <FileType className="h-4 w-4" />,
  IMAGE: <Image className="h-4 w-4" />,
  THUMBNAIL: <Image className="h-4 w-4" />,
};

export default function MediaPage() {
  const queryClient = useQueryClient();
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["media", typeFilter],
    queryFn: () => mediaService.list({ type: typeFilter || undefined, per_page: 50 }),
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, type }: { file: File; type: string }) =>
      mediaService.upload(file, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Mídia enviada com sucesso");
    },
    onError: () => toast.error("Erro ao enviar mídia"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => mediaService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Mídia excluída");
    },
  });

  const mediaList: MediaItem[] = data?.data ?? data ?? [];

  function handleUpload(file: File) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    let type = "IMAGE";
    if (ext === "mp4" || ext === "mov") type = "VIDEO";
    else if (ext === "gif") type = "GIF";
    else if (ext === "webp") type = "IMAGE";
    else if (ext === "jpg" || ext === "jpeg" || ext === "png") type = "IMAGE";
    uploadMutation.mutate({ file, type });
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Biblioteca de Mídia</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Gerencie GIFs, vídeos e imagens do catálogo
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,.gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                e.target.value = "";
              }}
            />
            <Button onClick={() => fileInputRef.current?.click()} disabled={uploadMutation.isPending}>
              <Upload className="h-4 w-4 mr-2" />
              {uploadMutation.isPending ? "Enviando..." : "Upload"}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={(v) => v !== null && setTypeFilter(v)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="IMAGE">Imagens</SelectItem>
              <SelectItem value="GIF">GIFs</SelectItem>
              <SelectItem value="VIDEO">Vídeos</SelectItem>
              <SelectItem value="THUMBNAIL">Thumbnails</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-video rounded-lg" />
            ))}
          </div>
        ) : mediaList.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4">
              <Image className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Nenhuma mídia encontrada</p>
            <p className="text-sm text-muted-foreground mt-1">
              Faça upload de GIFs, vídeos ou imagens
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaList.map((media) => (
              <div
                key={media.id}
                className="group relative aspect-video rounded-lg border border-border bg-card overflow-hidden cursor-pointer"
                onClick={() => setPreviewUrl(media.url)}
              >
                {media.type === "VIDEO" ? (
                  <video
                    src={media.url}
                    className="w-full h-full object-cover"
                    muted
                  />
                ) : (
                  <img
                    src={media.url}
                    alt={media.filename}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="icon-sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMutation.mutate(media.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <div className="inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 text-[10px] text-white">
                    {typeIcons[media.type] ?? null}
                    {media.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={!!previewUrl} onOpenChange={(o) => !o && setPreviewUrl(null)}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="sr-only">Preview</DialogTitle>
            </DialogHeader>
            {previewUrl && (
              <div className="flex items-center justify-center">
                {previewUrl.match(/\.(mp4|mov|webm)$/i) ? (
                  <video
                    src={previewUrl}
                    controls
                    className="max-w-full max-h-[70vh] rounded-lg"
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-[70vh] rounded-lg object-contain"
                  />
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
