'use client';

import { useCallback, useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils/cn';
import type { ImageDropzoneProps } from '@/types/ui';

const filterImages = (files: FileList | File[]): File[] =>
  Array.from(files).filter((file) => file.type.startsWith('image/'));

export const ImageDropzone = ({
  id,
  label = 'Imágenes',
  hint,
  multiple = true,
  onFilesSelected,
}: ImageDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | File[] | null) => {
      if (!files) return;
      const images = filterImages(files);
      if (images.length > 0) onFilesSelected(images);
    },
    [onFilesSelected],
  );

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center border border-dashed px-4 py-8 text-center transition-colors',
          isDragging
            ? 'border-teal-700 bg-cream-100'
            : 'border-line bg-surface hover:border-teal-700 hover:bg-cream-100',
        )}
      >
        <ImagePlus
          className={cn('mb-2 h-8 w-8', isDragging ? 'text-teal-700' : 'text-warm-muted')}
          aria-hidden
        />
        <p className="text-sm font-medium text-foreground">
          {isDragging ? 'Soltá las imágenes acá' : 'Arrastrá imágenes o tocá para elegir'}
        </p>
        <p className="mt-1 text-xs text-warm-muted">JPG, PNG, WEBP</p>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="sr-only"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>
      {hint && <p className="text-xs text-neutral-500">{hint}</p>}
    </div>
  );
};
