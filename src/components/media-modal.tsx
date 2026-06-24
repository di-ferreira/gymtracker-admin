"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { XIcon } from "lucide-react";

interface MediaModalProps {
  open: boolean;
  onClose: () => void;
  src: string;
  type: "image" | "video";
}

export function MediaModal({ open, onClose, src, type }: MediaModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[90vw] max-h-[90vh] w-auto h-auto p-0 overflow-hidden bg-black/90 sm:max-w-[90vw]"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 transition-colors"
        >
          <XIcon className="h-5 w-5" />
        </button>
        {type === "video" ? (
          <video
            src={src}
            controls
            autoPlay
            className="max-w-full max-h-[85vh] object-contain mx-auto"
          >
            <p className="text-sm text-muted-foreground">Seu navegador não suporta vídeo.</p>
          </video>
        ) : (
          <img
            src={src}
            alt=""
            className="max-w-full max-h-[85vh] object-contain mx-auto"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
