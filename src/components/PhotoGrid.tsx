"use client";

import { useState, useEffect, useCallback } from "react";

export default function PhotoGrid({ photos }: { photos: any[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
    document.body.style.overflow = 'auto';
  }, []);

  const nextPhoto = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % photos.length);
    }
  }, [selectedIndex, photos.length]);

  const prevPhoto = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length);
    }
  }, [selectedIndex, photos.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, closeLightbox, nextPhoto, prevPhoto]);

  // Clean up on unmount
  useEffect(() => {
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  return (
    <>
      {/* Grille Pinterest / Masonry Dynamique - Grandes Images */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 md:gap-12 space-y-8 md:space-y-12 fade-in-up">
          {photos.map((photo: any, index: number) => (
              <div 
                  key={photo.id} 
                  onClick={() => openLightbox(index)}
                  className="break-inside-avoid group relative overflow-hidden bg-brand-sand cursor-zoom-in"
              >
                  <img 
                      src={photo.url} 
                      className="w-full h-auto object-cover transform group-hover:scale-[1.03] transition-transform duration-[2s] ease-out grayscale-[15%] group-hover:grayscale-0" 
                      alt={photo.title} 
                      loading="lazy"
                  />
                  <div className="absolute inset-0 bg-brand-ink/0 group-hover:bg-brand-ink/20 transition-colors duration-700"></div>
                  <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0 z-10 pointer-events-none">
                      <span className="text-[10px] text-white uppercase tracking-[0.2em] font-medium drop-shadow-md border border-white/30 px-3 py-1 backdrop-blur-sm bg-brand-ink/20">
                          {photo.title}
                      </span>
                  </div>
              </div>
          ))}
      </div>

      {photos.length === 0 && (
          <div className="text-center text-brand-ink/40 py-12 border border-dashed border-brand-sand">
              Aucune photo dans la galerie.
          </div>
      )}

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
          <div 
              className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-ink/95 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]"
              onClick={closeLightbox}
          >
              <button 
                  onClick={closeLightbox} 
                  className="absolute top-6 right-6 md:top-12 md:right-12 text-brand-taupe hover:text-white transition-colors z-[110] focus:outline-none"
                  aria-label="Fermer"
              >
                  <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>

              {photos.length > 1 && (
                  <button 
                      onClick={(e) => { e.stopPropagation(); prevPhoto(); }} 
                      className="absolute left-4 md:left-12 text-brand-taupe hover:text-white transition-colors z-[110] focus:outline-none bg-brand-ink/50 md:bg-transparent rounded-full p-2 md:p-0"
                      aria-label="Photo précédente"
                  >
                      <svg className="w-8 h-8 md:w-14 md:h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7"></path></svg>
                  </button>
              )}

              {photos.length > 1 && (
                  <button 
                      onClick={(e) => { e.stopPropagation(); nextPhoto(); }} 
                      className="absolute right-4 md:right-12 text-brand-taupe hover:text-white transition-colors z-[110] focus:outline-none bg-brand-ink/50 md:bg-transparent rounded-full p-2 md:p-0"
                      aria-label="Photo suivante"
                  >
                      <svg className="w-8 h-8 md:w-14 md:h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path></svg>
                  </button>
              )}
              
              <div 
                  className="w-full h-full max-w-7xl max-h-screen p-4 md:p-12 flex flex-col items-center justify-center relative animate-[scaleIn_0.4s_cubic-bezier(0.16,1,0.3,1)]"
                  onClick={(e) => e.stopPropagation()} 
              >
                  <img 
                      src={photos[selectedIndex].url} 
                      alt={photos[selectedIndex].title} 
                      className="max-w-full max-h-[85vh] object-contain shadow-2xl"
                  />
                  {photos[selectedIndex].title && (
                      <p className="text-white mt-6 text-sm md:text-base uppercase tracking-[0.2em] font-light">
                          {photos[selectedIndex].title}
                      </p>
                  )}
                  <p className="text-brand-taupe/50 mt-2 text-xs">
                      {selectedIndex + 1} / {photos.length}
                  </p>
              </div>
          </div>
      )}
    </>
  );
}
