'use client';

import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Upload, X, Check, AlertCircle, ImageIcon } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ImageCropperProps {
  /** Current cropped file value */
  value?: File | null;
  /** Called with the new cropped File, or null when removed */
  onChange: (file: File | null) => void;
  /** Lock aspect ratio — e.g. 1 for square, 16/9, 4/3. Omit for free crop */
  aspectRatio?: number;
  /** Render the crop box as a circle (good for avatars) */
  circularCrop?: boolean;
  /** Max input file size in MB. Default 5 */
  maxSizeMB?: number;
  /** JPEG quality of the output blob (0–1). Default 0.92 */
  quality?: number;
  /** Longest side of the output image in px. Default 800 */
  outputSize?: number;
  /** Accepted MIME types, comma-separated. Default image/jpeg,image/png,image/webp */
  accept?: string;
  /** Upload zone primary label */
  label?: string;
  /** Upload zone hint line */
  hint?: string;
  /** Shape of the thumbnail preview: circle | square | rounded */
  previewShape?: 'circle' | 'square' | 'rounded';
  /** External error message (e.g. from form validation) */
  error?: string;
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initCrop(
  imgWidth: number,
  imgHeight: number,
  aspect?: number,
): Crop {
  if (!aspect) {
    // Default: 80% of the shorter side, free crop
    const size = Math.min(imgWidth, imgHeight) * 0.8;
    return centerCrop(
      { unit: 'px', width: size, height: size },
      imgWidth,
      imgHeight,
    );
  }
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 80 }, aspect, imgWidth, imgHeight),
    imgWidth,
    imgHeight,
  );
}

async function cropToFile(
  imgEl: HTMLImageElement,
  pixelCrop: PixelCrop,
  quality: number,
  outputSize: number,
  circular: boolean,
): Promise<File> {
  const scaleX = imgEl.naturalWidth / imgEl.width;
  const scaleY = imgEl.naturalHeight / imgEl.height;

  const srcX = pixelCrop.x * scaleX;
  const srcY = pixelCrop.y * scaleY;
  const srcW = pixelCrop.width * scaleX;
  const srcH = pixelCrop.height * scaleY;

  // Scale output so the longest side = outputSize
  const aspect = srcW / srcH;
  const outW = aspect >= 1 ? outputSize : Math.round(outputSize * aspect);
  const outH = aspect >= 1 ? Math.round(outputSize / aspect) : outputSize;

  const canvas = document.createElement('canvas');
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext('2d')!;

  if (circular) {
    ctx.beginPath();
    ctx.arc(outW / 2, outH / 2, Math.min(outW, outH) / 2, 0, Math.PI * 2);
    ctx.clip();
  }

  ctx.drawImage(imgEl, srcX, srcY, srcW, srcH, 0, 0, outW, outH);

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) { reject(new Error('Canvas export failed')); return; }
        resolve(new File([blob], 'image.jpg', { type: 'image/jpeg' }));
      },
      'image/jpeg',
      quality,
    );
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ImageCropper({
  value,
  onChange,
  aspectRatio,
  circularCrop = false,
  maxSizeMB = 5,
  quality = 0.92,
  outputSize = 800,
  accept = 'image/jpeg,image/png,image/webp',
  label = 'Upload Image',
  hint,
  previewShape = 'rounded',
  error: externalError,
  className = '',
}: ImageCropperProps) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [rawSrc, setRawSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isOpen, setIsOpen] = useState(false);
  const [fileError, setFileError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview URL derived from value
  const previewUrl = value ? URL.createObjectURL(value) : null;

  // ── File loading ───────────────────────────────────────────────────────────
  const loadFile = useCallback(
    (file: File | null | undefined) => {
      if (!file) return;
      setFileError('');

      const allowed = accept.split(',').map((t) => t.trim());
      if (!allowed.includes(file.type)) {
        setFileError(
          `Unsupported format. Allowed: ${allowed
            .map((t) => t.replace('image/', '').toUpperCase())
            .join(', ')}`,
        );
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setFileError(`File is too large. Max allowed size is ${maxSizeMB} MB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setRawSrc(e.target?.result as string);
        setCrop(undefined);
        setCompletedCrop(undefined);
        setIsOpen(true);
      };
      reader.readAsDataURL(file);
    },
    [accept, maxSizeMB],
  );

  // ── Image loaded in crop modal ─────────────────────────────────────────────
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(initCrop(width, height, aspectRatio));
  };

  // ── Apply crop ─────────────────────────────────────────────────────────────
  const applyCrop = useCallback(async () => {
    if (!imgRef.current || !completedCrop) return;
    setIsApplying(true);
    try {
      const file = await cropToFile(
        imgRef.current,
        completedCrop,
        quality,
        outputSize,
        circularCrop,
      );
      onChange(file);
      setIsOpen(false);
    } catch {
      setFileError('Failed to process the image. Please try again.');
    } finally {
      setIsApplying(false);
    }
  }, [completedCrop, quality, outputSize, circularCrop, onChange]);

  // ── Close / cancel ─────────────────────────────────────────────────────────
  const closeModal = () => {
    setIsOpen(false);
    setRawSrc(null);
  };

  // ── Preview shape ──────────────────────────────────────────────────────────
  const thumbShape = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-xl',
  }[previewShape];

  const displayError = fileError || externalError;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={`space-y-2 ${className}`}>

      {/* Upload zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          loadFile(e.dataTransfer.files?.[0]);
        }}
        className={`relative border-2 border-dashed rounded-xl transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : displayError
            ? 'border-red-300 bg-red-50/30'
            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/20'
        }`}
      >
        {value && previewUrl ? (
          /* ── Preview state ── */
          <div className="flex items-center gap-4 p-4">
            <div
              className={`w-16 h-16 overflow-hidden shrink-0 border border-gray-100 bg-gray-50 ${thumbShape}`}
            >
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onLoad={() => URL.revokeObjectURL(previewUrl)}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#0F172A] truncate">{value.name}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {(value.size / 1024).toFixed(0)} KB · Cropped & ready
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="px-3 py-1.5 text-[12px] font-medium text-[#0F172A] bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Change
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(null); }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                isDragOver ? 'bg-blue-100 text-blue-500' : 'bg-gray-50 text-gray-400'
              }`}
            >
              {isDragOver ? (
                <ImageIcon className="w-5 h-5" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#0F172A]">{label}</p>
              <p className="text-[12px] text-gray-400 mt-0.5">
                {hint ?? `Drag & drop or click to browse · Max ${maxSizeMB} MB`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          loadFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      {/* Error message */}
      {displayError && (
        <p className="flex items-center gap-1.5 text-[12px] text-red-500">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {displayError}
        </p>
      )}

      {/* ── Crop Modal ───────────────────────────────────────────────────── */}
      {isOpen && rawSrc && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Panel */}
          <div className="relative bg-white rounded-2xl shadow-2xl flex flex-col w-full max-w-[560px] max-h-[90vh] overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="text-[15px] font-bold text-[#0F172A]">Crop Image</h3>
                <p className="text-[12px] text-gray-400 mt-0.5">
                  Drag the handles to adjust the crop area
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Crop area */}
            <div className="flex-1 overflow-auto bg-[#111827] flex items-center justify-center p-4 min-h-[280px]">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspectRatio}
                circularCrop={circularCrop}
                minWidth={50}
                minHeight={50}
                keepSelection
                className="max-w-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={rawSrc}
                  alt="Crop source"
                  onLoad={onImageLoad}
                  className="max-w-full max-h-[50vh] object-contain block"
                  style={{ display: 'block' }}
                />
              </ReactCrop>
            </div>

            {/* Tip */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 shrink-0">
              <p className="text-[11px] text-gray-400 text-center">
                Drag inside the selection to move · Drag the corner handles to resize
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2.5 text-[13px] font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyCrop}
                disabled={!completedCrop?.width || isApplying}
                className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-white bg-[#0F172A] rounded-lg hover:bg-[#1e293b] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                {isApplying ? 'Applying...' : 'Apply Crop'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
