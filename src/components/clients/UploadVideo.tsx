import React, { useState, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface UploadVideoProps {
  label: string;
  onFileUpload: (file: File | null) => void;
  currentFileUrl?: string | null;
  accept?: string;
  maxSize?: number; // in bytes
}

export function UploadVideo({
  label,
  onFileUpload,
  currentFileUrl,
  accept = "video/mp4, video/quicktime",
  maxSize = 30 * 1024 * 1024, // 30MB
}: UploadVideoProps) {
  const [preview, setPreview] = useState<string | null>(currentFileUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Effect to revoke object URL on cleanup
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);
  
  useEffect(() => {
      setPreview(currentFileUrl || null);
  }, [currentFileUrl]);


  const handleFile = useCallback((file: File | null) => {
    setError(null);
    if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
    }

    if (!file) {
      onFileUpload(null);
      setPreview(null);
      return;
    }

    const acceptedTypes = accept.split(",").map(t => t.trim());
    if (!acceptedTypes.includes(file.type)) {
      setError("Tipo de vídeo não suportado.");
      onFileUpload(null);
      setPreview(null);
      return;
    }
    
    if (file.size > maxSize) {
      setError(`Vídeo muito grande. Máximo de ${maxSize / (1024 * 1024)}MB.`);
      onFileUpload(null);
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onFileUpload(file);
  }, [onFileUpload, maxSize, accept, preview]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    } else {
        handleFile(null);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleFile(null);
    if (inputRef.current) {
        inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragEnter}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors aspect-video",
          "border-border/50 bg-background/50 hover:bg-muted/30",
          isDragActive && "border-primary bg-primary/10",
          error && "border-destructive text-destructive"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        {preview ? (
          <>
            <video src={preview} controls className="w-full h-full rounded-md bg-black" />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 h-7 w-7 text-white/80 hover:text-destructive hover:bg-destructive/20 rounded-full z-10"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="text-center p-4">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Arraste ou <span className="font-semibold text-primary">clique para enviar o vídeo</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              MP4 ou MOV (Máx. {maxSize / (1024 * 1024)}MB)
            </p>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
    </div>
  );
}