"use client";

import { useState, useEffect, useCallback } from "react";

interface PhotoLightboxProps {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

export function PhotoLightbox({ images, initialIndex = 0, onClose }: PhotoLightboxProps) {
  const [current, setCurrent] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const goNext = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);
  const goPrev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, goNext, goPrev]);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 50) { diff > 0 ? goPrev() : goNext(); }
    setTouchStart(null);
  };

  // Close only when clicking the dark area, not buttons/image.
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-4 z-10">
        <div className="text-white/70 text-[14px] font-medium">
          {current + 1} / {images.length}
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Nav + Image area */}
      <div className="flex items-center gap-4 max-w-[95vw] w-full justify-center">
        {/* Prev */}
        {images.length > 1 && (
          <button
            onClick={goPrev}
            className="hidden lg:flex w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 items-center justify-center transition-colors flex-shrink-0"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}

        {/* Image */}
        <div
          className="flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            key={current}
            src={images[current]}
            alt={`Photo ${current + 1}`}
            className="max-w-[92vw] max-h-[82vh] object-contain rounded-lg select-none lg:max-w-[85vw] lg:max-h-[85vh]"
            draggable={false}
          />
        </div>

        {/* Next */}
        {images.length > 1 && (
          <button
            onClick={goNext}
            className="hidden lg:flex w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 items-center justify-center transition-colors flex-shrink-0"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        )}
      </div>

      {/* Mobile nav arrows (overlay on image) */}
      {images.length > 1 && (
        <div className="lg:hidden absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2">
          <button onClick={goPrev} className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button onClick={goNext} className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                i === current ? "border-white scale-110 shadow-lg" : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
