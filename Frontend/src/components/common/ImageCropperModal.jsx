import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, ZoomIn, ZoomOut, RotateCw, RotateCcw, Check, Loader2 } from "lucide-react";
import getCroppedImg from "../../utils/cropImage";
import toast from "react-hot-toast";

const ImageCropperModal = ({
  isOpen,
  imageSrc,
  cropType = "avatar", // "avatar" | "cover"
  onClose,
  onCropComplete,
  fileName,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const isAvatar = cropType === "avatar";
  const isThumbnail = cropType === "thumbnail";

  let aspectRatio = 1 / 1;
  let cropShape = "round";
  let modalTitle = "Adjust Profile Picture";
  let cropLabel = "1:1 Circle Crop";

  if (cropType === "cover") {
    aspectRatio = 16 / 6;
    cropShape = "rect";
    modalTitle = "Adjust Channel Banner";
    cropLabel = "Banner Crop (16:6)";
  } else if (cropType === "thumbnail") {
    aspectRatio = 16 / 9;
    cropShape = "rect";
    modalTitle = "Adjust Video Thumbnail";
    cropLabel = "16:9 Video Ratio";
  }

  const onCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  const onZoomChange = (newZoom) => {
    setZoom(newZoom);
  };

  const onCropAreaChange = useCallback((croppedArea, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  const handleApply = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setIsProcessing(true);
      const defaultFileName = isAvatar ? "avatar_cropped.jpg" : "cover_cropped.jpg";
      const result = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
        { horizontal: false, vertical: false },
        fileName || defaultFileName
      );

      if (result) {
        onCropComplete(result.file, result.previewUrl);
        onClose();
      }
    } catch (err) {
      console.error("Cropping failed:", err);
      toast.error("Failed to crop image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full ${
          isAvatar ? "max-w-md" : "max-w-xl"
        } rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-2xl space-y-4`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
              {modalTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Drag to reposition, zoom or rotate your photo
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition cursor-pointer"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Cropper Container */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-2xl bg-zinc-950 border border-slate-200 dark:border-zinc-800 shadow-inner">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            cropShape={cropShape}
            showGrid={true}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onRotationChange={setRotation}
            onCropComplete={onCropAreaChange}
          />
        </div>

        {/* Controls: Zoom & Rotate */}
        <div className="space-y-3 pt-1">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-zinc-400">
            <ZoomOut size={16} className="shrink-0 text-[#71717A]" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1.5 bg-[#18181B] rounded-lg appearance-none cursor-pointer accent-[#FF5A36]"
              aria-label="Zoom level"
            />
            <ZoomIn size={16} className="shrink-0 text-[#71717A]" />
            <span className="w-10 text-right font-mono text-[11px] font-semibold text-[#FAFAF8]">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Action Tools */}
          <div className="flex items-center justify-between text-xs pt-1 font-mono">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRotate}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#18181B] px-3 py-1.5 text-xs text-[#FAFAF8] hover:bg-[#222226] transition cursor-pointer"
              >
                <RotateCw size={13} />
                <span>Rotate 90°</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-[#18181B] px-3 py-1.5 text-xs text-[#71717A] hover:bg-[#222226] hover:text-[#FAFAF8] transition cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            </div>

            <span className="text-[11px] text-[#71717A]">
              {cropLabel}
            </span>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/8">
          <button
            type="button"
            disabled={isProcessing}
            onClick={onClose}
            className="rounded-md border border-white/10 bg-[#18181B] px-4 py-2 font-mono text-xs text-[#FAFAF8] hover:bg-[#222226] transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleApply}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#FF5A36] hover:bg-[#FF704E] px-5 py-2 font-mono text-xs font-bold text-[#0A0A0A] shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Applying...</span>
              </>
            ) : (
              <>
                <Check size={14} />
                <span>Apply & Save</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
