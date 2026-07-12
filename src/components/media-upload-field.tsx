"use client";

import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadMediaAction } from "@/actions/media.action";
import { Upload, Loader2, File, X } from "lucide-react";

interface MediaUploadFieldProps {
  label: string;
  accept: string;
  value: string | undefined | null;
  onChange: (url: string | null) => void;
  previewType?: "image" | "video";
}

export function MediaUploadField({
  label,
  accept,
  value,
  onChange,
  previewType = "image",
}: MediaUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [manualUrl, setManualUrl] = useState("");

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return uploadMediaAction(formData);
    },
    onSuccess: (data) => {
      onChange(data.url);
    },
  });

  function handleFileSelect(file: File) {
    uploadMutation.mutate(file);
  }

  function handleManualUrl() {
    if (manualUrl) {
      onChange(manualUrl);
      setManualUrl("");
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {value && (
        <div className="relative rounded-lg border border-border overflow-hidden">
          {previewType === "video" ? (
            <video
              src={value}
              controls
              className="w-full max-h-48 object-contain bg-muted"
            >
              <p className="text-sm text-muted-foreground">Seu navegador não suporta vídeo.</p>
            </video>
          ) : (
            <img
              src={value}
              alt=""
              className="w-full max-h-48 object-contain bg-muted"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-1 right-1 rounded-full bg-background/80 p-1 text-muted-foreground hover:text-foreground transition-colors"
            title="Remover"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
        >
          {uploadMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              {value ? "Alterar" : "Enviar"}
            </>
          )}
        </Button>
        <div className="flex-1 flex items-center gap-2">
          <Input
            placeholder="Ou cole uma URL..."
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!manualUrl}
            onClick={handleManualUrl}
          >
            <File className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {uploadMutation.data && (
        <p className="text-xs text-muted-foreground">
          Upload concluído: {uploadMutation.data.filename}
        </p>
      )}
    </div>
  );
}
