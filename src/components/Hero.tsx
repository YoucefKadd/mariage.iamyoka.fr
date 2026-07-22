import { getMedia } from '@/actions/media';

export default async function Hero() {
  const media = await getMedia();
  const videoUrl = media.heroVideo || "https://videos.pexels.com/video-files/5091729/5091729-hd_1920_1080_30fps.mp4";
  const ytId = media.heroYtId;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-brand-paper">
        {/* Vidéo en arrière-plan */}
        {ytId ? (
            <iframe
                src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${ytId}&modestbranding=1&playsinline=1`}
                className="absolute z-0 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80 pointer-events-none grayscale-[10%]"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
            ></iframe>
        ) : (
            <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover z-0 grayscale-[10%] opacity-80"
            >
                <source src={videoUrl} type="video/mp4" />
            </video>
        )}

        {/* Voile clair pour assurer la lisibilité du Header et du texte foncé */}
        <div className="absolute inset-0 bg-white/30 z-0 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-brand-paper/20 z-0"></div>

        <div className="relative z-10 text-center px-4 w-full max-w-5xl fade-in-up visible">
            {/* Titre immense */}
            <h1 className="text-6xl md:text-8xl lg:text-[11rem] font-serif text-brand-brown mb-2 tracking-tight drop-shadow-lg" style={{ lineHeight: 0.9 }}>
                MARIAGES
            </h1>
            <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium text-brand-brown/80 mt-6 bg-white/50 inline-block px-4 py-1 backdrop-blur-sm rounded-sm">
                Votre mariage comme au cinéma
            </p>
        </div>
        
        {/* Indicateur de scroll (optionnel mais chic) */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center">
            <span className="text-[8px] uppercase tracking-widest text-brand-ink/60 mb-2">Découvrir</span>
            <div className="w-px h-12 bg-brand-ink/30 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-brand-ink animate-[scrollDown_2s_ease-in-out_infinite]"></div>
            </div>
        </div>
    </section>
  );
}
