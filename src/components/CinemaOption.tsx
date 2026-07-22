import Link from 'next/link';

export default function CinemaOption() {
  return (
    <section className="py-24 bg-brand-ink text-brand-paper px-6 md:px-12 relative overflow-hidden border-t border-brand-sand/10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl aspect-square bg-brand-taupe/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
            
            <div className="flex-1 w-full fade-in-up order-2 md:order-1">
                <div className="relative aspect-[4/5] md:aspect-square w-full bg-brand-ink">
                    <img 
                        src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop" 
                        alt="Salle de cinéma privée VIP" 
                        className="object-cover w-full h-full opacity-70 grayscale-[30%]"
                    />
                    <div className="absolute inset-0 border border-brand-taupe/30 m-4 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/80 via-transparent to-transparent"></div>
                </div>
            </div>

            <div className="flex-1 space-y-8 fade-in-up order-1 md:order-2">
                <div>
                    <h3 className="text-brand-taupe text-[10px] uppercase tracking-[0.3em] mb-4">L'Expérience Ultime</h3>
                    <h2 className="text-4xl md:text-5xl font-serif leading-tight">Projection Privée <br/><span className="italic text-brand-taupe">Cinéma</span></h2>
                </div>
                
                <div className="space-y-4 font-light text-brand-paper/80 leading-relaxed text-sm md:text-base">
                    <p>
                        Revivez les émotions de votre grand jour dans les conditions les plus parfaites. Nous vous proposons en option une projection privée exclusive de votre film de mariage.
                    </p>
                    <p>
                        Un moment suspendu dans le temps, en tête-à-tête pour 2 personnes. Installez-vous confortablement dans une véritable salle de cinéma et découvrez votre chef-d'œuvre sur grand écran, enveloppés par un son immersif de haute qualité.
                    </p>
                </div>
                
                <div className="pt-6">
                    <Link href="#contact" className="inline-flex items-center space-x-4 border-b border-brand-taupe pb-2 text-brand-taupe text-xs uppercase tracking-[0.2em] hover:text-white hover:border-white transition-colors duration-300">
                        <span>Réserver cette option</span>
                        <span>→</span>
                    </Link>
                </div>
            </div>
            
        </div>
    </section>
  );
}
