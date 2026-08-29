import { ImageIcon, Trash2, UploadCloud } from 'lucide-react';
import { useRef, useState } from 'react';

interface DropZoneProps {
  imageFile: File | null;
  imageUrl: string | null;
  onImageChange: (file: File | null) => void;
  disabled?: boolean;
}

export function DropZone({ imageFile, imageUrl, onImageChange, disabled }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      onImageChange(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const previewUrl = imageUrl ?? (imageFile ? URL.createObjectURL(imageFile) : null);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !disabled && !previewUrl && inputRef.current?.click()}
      className={`group relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
        isDragging
          ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-900/30'
          : previewUrl
            ? 'border-brand-300/50 bg-slate-50 dark:border-brand-700/50 dark:bg-brand-950/40'
            : 'cursor-pointer border-slate-300 bg-slate-50/50 hover:border-brand-400 hover:bg-brand-50/30 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-brand-500 dark:hover:bg-brand-950/30'
      } ${disabled ? 'pointer-events-none opacity-60' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      {previewUrl ? (
        <div className="relative h-full w-full">
          <img
            src={previewUrl}
            alt="Product preview"
            className="h-full w-full object-contain"
          />
          {!disabled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onImageChange(null);
              }}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-red-500/90 text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-red-600"
              aria-label="Remove image"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 transition-all duration-300 group-hover:scale-110 dark:bg-brand-900/50 dark:text-brand-400">
            <UploadCloud className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Перетащите изображение товара сюда
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              или нажмите, чтобы выбрать файл (PNG, JPG, WEBP)
            </p>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Максимальное качество для лучшего результата</span>
          </div>
        </div>
      )}
    </div>
  );
}
