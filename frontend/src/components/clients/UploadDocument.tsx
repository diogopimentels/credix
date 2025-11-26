import React, { useState, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { FileText, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface UploadDocumentProps {
  label: string;
  onFileUpload: (file: File | null) => void;
  currentFileUrl?: string | null;
  accept?: string; // Changed from Accept object to string
  maxSize?: number; // in bytes
}

export function UploadDocument({
  label,
  onFileUpload,
  currentFileUrl,
  accept = "image/png, image/jpeg, application/pdf",
  maxSize = 5 * 1024 * 1024, // 5MB
}: UploadDocumentProps) {
  const [preview, setPreview] = useState<string | null>(currentFileUrl || null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(currentFileUrl || null);
    if (currentFileUrl) {
      setFileName("Arquivo atual");
    }
  }, [currentFileUrl]);

  const handleFile = useCallback((file: File | null) => {
    setError(null);
    if (!file) {
      onFileUpload(null);
      setPreview(null);
      setFileName(null);
      return;
    }

    // Validate file type
    const acceptedTypes = accept.split(",").map(t => t.trim());
    if (!acceptedTypes.includes(file.type)) {
      setError("Tipo de arquivo não suportado.");
      onFileUpload(null);
      setPreview(null);
      setFileName(null);
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      setError(`Arquivo muito grande. Máximo de ${maxSize / (1024 * 1024)}MB.`);
      onFileUpload(null);
      setPreview(null);
      setFileName(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      setFileName(file.name);
      onFileUpload(file);
    };
    reader.readAsDataURL(file);

  }, [onFileUpload, maxSize, accept]);

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
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setFileName(null);
    onFileUpload(null);
    setError(null);
    if(inputRef.current) {
        inputRef.current.value = "";
    }
  };

  const isPdf = preview?.startsWith("data:application/pdf") || currentFileUrl?.toLowerCase().endsWith('.pdf');
  const isImage = preview?.startsWith("data:image/") || (!isPdf && (currentFileUrl?.toLowerCase().match(/\.(jpg|jpeg|png)$/) != null));

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragEnter} // use same handler for over
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
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
          <div className="relative w-full h-36 flex items-center justify-center rounded-md overflow-hidden bg-muted/50">
            {isImage ? (
              <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain" />
            ) : isPdf ? (
              <div className="flex flex-col items-center text-muted-foreground p-4 text-center">
                <FileText className="h-10 w-10 mb-2" />
                <span className="text-xs font-medium break-all">{fileName || "documento.pdf"}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-muted-foreground p-4 text-center">
                <FileText className="h-10 w-10 mb-2" />
                <span className="text-xs font-medium break-all">{fileName || "arquivo"}</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 h-7 w-7 text-foreground/70 hover:text-destructive hover:bg-destructive/10 rounded-full"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center p-4">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Arraste ou <span className="font-semibold text-primary">clique para enviar</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG ou PDF (Máx. {maxSize / (1024 * 1024)}MB)
            </p>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
    </div>
  );
}
