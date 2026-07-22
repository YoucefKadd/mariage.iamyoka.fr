"use client";

import { useState } from "react";

export default function FilmCard({ film }: { film: any }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={`group relative ${film.isMain ? '' : 'flex flex-col'}`}>
      <div 
        className={`relative ${film.isMain ? 'aspect-video shadow-2xl' : 'aspect-[16/9]'} bg-black overflow-hidden border border-brand-taupe/${film.isMain ? '20' : '10'}`}
      >
        {!isPlaying ? (
          <div className="w-full h-full cursor-pointer relative" onClick={() => setIsPlaying(true)}>
            {/* Film Grain */}
            <div className={`absolute inset-0 z-10 ${film.isMain ? 'opacity-10' : 'opacity-0'} pointer-events-none mix-blend-overlay`} style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')" }}></div>
            
            <img src={film.url} className={`w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-[1.5s] ${film.isMain ? 'grayscale-[30%]' : 'grayscale-[20%]'} group-hover:grayscale-0 opacity-80 group-hover:opacity-100`} alt={film.title} />
            
            <div className={`absolute inset-0 ${film.isMain ? 'bg-gradient-to-t from-brand-ink/90 via-brand-ink/10 to-transparent opacity-80' : 'bg-brand-ink/40 group-hover:bg-brand-ink/10'} transition-all duration-500 z-10`}></div>
            
            {/* Bouton Play */}
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center">
                <div className={`${film.isMain ? 'w-16 h-16 md:w-24 md:h-24 bg-brand-taupe/80 backdrop-blur-md shadow-[0_0_30px_rgba(181,168,152,0.4)]' : 'w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-brand-taupe group-hover:border-transparent'} rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-500 relative`}>
                    {film.isMain && <div className="absolute inset-0 bg-brand-taupe rounded-full animate-ping opacity-30 group-hover:opacity-60 transition-opacity"></div>}
                    <svg className={`${film.isMain ? 'w-6 h-6 md:w-10 md:h-10 text-white' : 'w-4 h-4 md:w-5 md:h-5 text-white'} ml-1 md:ml-2 relative z-10`} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
            </div>

            {/* Informations superposées */}
            {film.isMain && (
                <div className="absolute bottom-6 md:bottom-12 left-0 right-0 text-center z-30 px-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {film.badge && (
                        <span className="inline-block border border-brand-taupe/60 text-brand-taupe px-3 py-1 text-[8px] md:text-[9px] uppercase tracking-[0.3em] mb-4 backdrop-blur-md bg-brand-ink/40">
                            {film.badge}
                        </span>
                    )}
                    <h3 className="text-2xl md:text-5xl font-serif text-white tracking-widest uppercase shadow-sm">{film.title}</h3>
                    {film.subtitle && (
                        <p className="mt-3 text-[10px] md:text-xs uppercase tracking-[0.2em] text-brand-paper/70 font-light">{film.subtitle}</p>
                    )}
                </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full">
            {film.ytId ? (
                <iframe 
                    className="w-full h-full" 
                    src={`https://www.youtube-nocookie.com/embed/${film.ytId}?autoplay=1&rel=0&modestbranding=1`} 
                    title={film.title} 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                </iframe>
            ) : (
                <div className="flex items-center justify-center h-full bg-brand-ink text-white/50 text-sm font-light">
                    Lien YouTube manquant
                </div>
            )}
          </div>
        )}
      </div>
      
      {!film.isMain && !isPlaying && (
          <div className="mt-6 text-center transform group-hover:-translate-y-2 transition-transform duration-300">
              <h4 className="text-xl md:text-2xl font-serif text-brand-paper mb-2">{film.title}</h4>
              {film.subtitle && (
                  <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-brand-taupe font-medium">{film.subtitle}</p>
              )}
          </div>
      )}
    </div>
  );
}
