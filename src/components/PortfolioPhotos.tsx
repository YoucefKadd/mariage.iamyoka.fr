import Link from 'next/link';
import { getMedia } from '@/actions/media';
import PhotoGrid from '@/components/PhotoGrid';

export default async function PortfolioPhotos() {
  const { photos } = await getMedia();

  return (
    <section id="portfolio-photos" className="py-24 md:py-32 bg-brand-paper px-6 md:px-12 border-t border-brand-sand/50">
        <div className="max-w-7xl mx-auto">
            
            <div className="text-center mb-16 md:mb-24 fade-in-up">
                <div className="flex items-center justify-center mb-6">
                    <div className="h-px bg-brand-taupe/40 w-12 md:w-24"></div>
                    <span className="px-4 text-[10px] uppercase tracking-[0.2em] text-brand-taupe font-medium">Le Documentaire</span>
                    <div className="h-px bg-brand-taupe/40 w-12 md:w-24"></div>
                </div>
                <h2 className="text-4xl md:text-6xl font-serif text-brand-ink mb-6">L'art de figer l'instant</h2>
                <p className="text-brand-ink/60 font-light text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                    Aucune pose figée, seulement la vérité de votre journée. Un mélange de lumière pure, d'ombres intimes et d'instants volés.
                </p>
            </div>

            {/* Grille et Lightbox */}
            <PhotoGrid photos={photos} />
            
            <div className="mt-20 text-center fade-in-up">
                <Link href="#contact" className="inline-flex items-center space-x-3 group">
                    <span className="border-b border-brand-taupe text-brand-taupe pb-1 text-[10px] uppercase tracking-[0.2em] group-hover:text-brand-ink group-hover:border-brand-ink transition-colors duration-300">
                        Découvrir plus d'histoires complètes
                    </span>
                    <svg className="w-4 h-4 text-brand-taupe group-hover:text-brand-ink transform group-hover:translate-x-2 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </Link>
            </div>

        </div>
    </section>
  );
}
