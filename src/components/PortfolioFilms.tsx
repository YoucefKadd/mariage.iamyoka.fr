import { getMedia } from '@/actions/media';
import FilmCard from '@/components/FilmCard';

export default async function PortfolioFilms() {
  const { films } = await getMedia();
  
  const mainFilms = films.filter((f: any) => f.isMain);
  const secondaryFilms = films.filter((f: any) => !f.isMain);

  return (
    <section id="portfolio-films" className="py-24 bg-brand-ink text-brand-paper px-6 md:px-12 transition-colors duration-700">
        <div className="max-w-7xl mx-auto">
            
            <div className="text-center mb-16 md:mb-24 fade-in-up">
                <div className="flex items-center justify-center mb-6">
                    <div className="h-px bg-brand-taupe/40 w-12 md:w-24"></div>
                    <span className="px-4 text-[10px] uppercase tracking-[0.2em] text-brand-taupe font-medium">Le Cinéma</span>
                    <div className="h-px bg-brand-taupe/40 w-12 md:w-24"></div>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-brand-paper mb-6" id="portfolio">Vos souvenirs en mouvement</h2>
                <p className="text-brand-paper/60 font-light text-sm max-w-2xl mx-auto leading-relaxed">
                    L'intensité d'un regard, le souffle du vent, l'éclat d'un rire. Votre journée racontée comme une véritable œuvre cinématographique, avec un étalonnage digne du 7ème art.
                </p>
            </div>

            {/* Grille Vidéos */}
            <div className="space-y-12 md:space-y-20 fade-in-up">
                
                {/* Vidéos Principales (En vedette) */}
                {mainFilms.map((film: any) => (
                    <FilmCard key={film.id} film={film} />
                ))}

                {/* Vidéos Secondaires (2 colonnes) */}
                {secondaryFilms.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {secondaryFilms.map((film: any) => (
                            <FilmCard key={film.id} film={film} />
                        ))}
                    </div>
                )}
                
                {films.length === 0 && (
                    <div className="text-center text-brand-paper/40 py-12 border border-dashed border-brand-taupe/20">
                        Aucun film dans la galerie.
                    </div>
                )}
            </div>
            
            <div className="mt-20 text-center fade-in-up">
                <a href="#contact" className="inline-block border-b border-brand-taupe text-brand-taupe pb-1 text-[10px] uppercase tracking-[0.2em] hover:text-white hover:border-white transition-colors duration-300">
                    Discuter de votre projet vidéo
                </a>
            </div>

        </div>
    </section>
  );
}
