"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { uploadMediaAction } from "@/actions/media.action";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, File, Loader2 } from "lucide-react";

interface MediaUploadResponse {
  url: string;
  filename: string;
  type: string;
}

export default function MediaPage() {
  const [lastUpload, setLastUpload] = useState<MediaUploadResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return uploadMediaAction(formData);
    },
    onSuccess: (data) => {
      setLastUpload(data);
      toast.success("Mídia enviada com sucesso");
    },
    onError: () => toast.error("Erro ao enviar mídia"),
  });

  function handleUpload(file: File) {
    uploadMutation.mutate(file);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Biblioteca de Mídia</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Faça upload de imagens, GIFs e vídeos para o catálogo
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm text-center max-w-sm">
                Selecione um arquivo de imagem, GIF ou vídeo para enviar ao servidor
              </p>
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
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMutation.isPending}
                size="lg"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Selecionar Arquivo
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {lastUpload && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                  <File className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{lastUpload.filename}</p>
                  <p className="text-xs text-muted-foreground">
                    {lastUpload.type} — {lastUpload.url}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
