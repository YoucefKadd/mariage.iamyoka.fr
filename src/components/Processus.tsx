export default function Processus() {
  return (
    <section id="processus" className="py-24 bg-brand-paper px-4 md:px-12 border-t border-brand-sand">
        <div className="max-w-5xl mx-auto">
            
            {/* En-tête de la section */}
            <div className="text-center mb-16 md:mb-24 fade-in-up">
                <div className="flex items-center justify-center mb-6">
                    <div className="h-px bg-brand-taupe/40 w-12 md:w-24"></div>
                    <span className="px-4 text-[10px] uppercase tracking-[0.2em] text-brand-taupe font-medium">L'Architecture du Souvenir</span>
                    <div className="h-px bg-brand-taupe/40 w-12 md:w-24"></div>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-brand-ink">Le déroulé de votre film</h2>
            </div>

            <div className="relative">
                
                {/* LE FIL D'ARIANE (Ligne verticale globale) */}
                <div className="absolute top-8 bottom-8 left-1/4 w-px bg-brand-taupe/50 transform -translate-x-1/2 z-0"></div>

                {/* ÉTAPE 1 */}
                <div className="relative flex flex-row w-full mb-12 md:mb-20 fade-in-up z-10 group">
                    <div className="w-1/4 flex flex-col items-end pr-4 md:pr-12 pt-4 md:pt-8">
                        <div className="text-4xl md:text-7xl font-serif italic text-brand-taupe mb-1 md:mb-2 leading-none">I</div>
                        <div className="text-[8px] md:text-[10px] uppercase tracking-widest text-brand-ink/50 mt-2 md:mt-4 text-right">Premier Contact</div>
                    </div>
                    <div className="absolute left-1/4 top-7 md:top-14 w-3 h-3 md:w-4 md:h-4 rounded-full border border-brand-taupe bg-brand-paper flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-300">
                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-brand-taupe"></div>
                    </div>
                    <div className="w-3/4 pl-6 md:pl-12">
                        <div className="bg-white p-6 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-brand-sand/40">
                            <div className="inline-block bg-brand-paper text-brand-ink px-3 py-1 md:px-4 md:py-1.5 text-[8px] md:text-[9px] uppercase tracking-[0.2em] mb-4 md:mb-6 font-medium">L'Échange</div>
                            <h4 className="text-2xl md:text-3xl font-serif text-brand-ink mb-3 md:mb-4">Autour d'un café</h4>
                            <p className="text-xs md:text-sm font-light text-brand-ink/70 leading-relaxed">
                                Vous nous racontez votre histoire et comment vous voyez votre mariage. Le but est d'apprendre à vous connaître et de ressentir votre sensibilité pour créer le film le plus proche de vous, du thème et de la volonté de votre mariage.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ÉTAPE 2 - NOUVELLE ÉTAPE OFFRE / DEVIS */}
                <div className="relative flex flex-row w-full mb-12 md:mb-20 fade-in-up z-10 group">
                    <div className="w-1/4 flex flex-col items-end pr-4 md:pr-12 pt-4 md:pt-8">
                        <div className="text-4xl md:text-7xl font-serif italic text-brand-taupe mb-1 md:mb-2 leading-none">II</div>
                        <div className="text-[8px] md:text-[10px] uppercase tracking-widest text-brand-ink/50 mt-2 md:mt-4 text-right">L'Engagement</div>
                    </div>
                    <div className="absolute left-1/4 top-7 md:top-14 w-3 h-3 md:w-4 md:h-4 rounded-full border border-brand-taupe bg-brand-paper flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-300">
                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-brand-taupe"></div>
                    </div>
                    <div className="w-3/4 pl-6 md:pl-12">
                        <div className="bg-white p-6 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-brand-sand/40">
                            <div className="inline-block bg-brand-paper text-brand-ink px-3 py-1 md:px-4 md:py-1.5 text-[8px] md:text-[9px] uppercase tracking-[0.2em] mb-4 md:mb-6 font-medium">La Proposition</div>
                            <h4 className="text-2xl md:text-3xl font-serif text-brand-ink mb-3 md:mb-4">Offre & Devis sur-mesure</h4>
                            <p className="text-xs md:text-sm font-light text-brand-ink/70 leading-relaxed">
                                Suite à notre échange, nous concevons une proposition personnalisée et détaillée. Celle-ci inclut l'approche artistique recommandée, la configuration de l'équipe (photographes et vidéastes), ainsi qu'un devis transparent pour donner vie à vos souvenirs.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ÉTAPE 3 (Anciennement 2) */}
                <div className="relative flex flex-row w-full mb-12 md:mb-20 fade-in-up z-10 group">
                    <div className="w-1/4 flex flex-col items-end pr-4 md:pr-12 pt-4 md:pt-8">
                        <div className="text-4xl md:text-7xl font-serif italic text-brand-taupe mb-1 md:mb-2 leading-none">III</div>
                        <div className="text-[8px] md:text-[10px] uppercase tracking-widest text-brand-ink/50 mt-2 md:mt-4 text-right">Avant le mariage</div>
                    </div>
                    <div className="absolute left-1/4 top-7 md:top-14 w-3 h-3 md:w-4 md:h-4 rounded-full border border-brand-taupe bg-brand-paper flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-300">
                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-brand-taupe"></div>
                    </div>
                    <div className="w-3/4 pl-6 md:pl-12">
                        <div className="bg-white p-6 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-brand-sand/40">
                            <div className="inline-block bg-brand-paper text-brand-ink px-3 py-1 md:px-4 md:py-1.5 text-[8px] md:text-[9px] uppercase tracking-[0.2em] mb-4 md:mb-6 font-medium">La Direction</div>
                            <h4 className="text-2xl md:text-3xl font-serif text-brand-ink mb-3 md:mb-4">Vision & Logistique</h4>
                            <p className="text-xs md:text-sm font-light text-brand-ink/70 leading-relaxed">
                                Nous vous présentons la direction artistique la plus adéquate que l'on a choisie pour votre mariage. Nous faisons ensuite un point sur la logistique et l'organisation pour que nous puissions coordonner nos équipes le grand jour.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ÉTAPE 4 (Anciennement 3) */}
                <div className="relative flex flex-row w-full mb-12 md:mb-20 fade-in-up z-10 group">
                    <div className="w-1/4 flex flex-col items-end pr-4 md:pr-12 pt-4 md:pt-8">
                        <div className="text-4xl md:text-7xl font-serif italic text-brand-taupe mb-1 md:mb-2 leading-none">IV</div>
                        <div className="text-[8px] md:text-[10px] uppercase tracking-widest text-brand-ink/50 mt-2 md:mt-4 text-right">Le Grand Jour</div>
                    </div>
                    <div className="absolute left-1/4 top-7 md:top-14 w-3 h-3 md:w-4 md:h-4 rounded-full border border-brand-taupe bg-brand-paper flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-300">
                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-brand-taupe"></div>
                    </div>
                    <div className="w-3/4 pl-6 md:pl-12">
                        <div className="bg-white p-6 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-brand-sand/40">
                            <div className="inline-block bg-brand-paper text-brand-ink px-3 py-1 md:px-4 md:py-1.5 text-[8px] md:text-[9px] uppercase tracking-[0.2em] mb-4 md:mb-6 font-medium">Le Tournage</div>
                            <h4 className="text-2xl md:text-3xl font-serif text-brand-ink mb-3 md:mb-4">Prise de vue</h4>
                            <p className="text-xs md:text-sm font-light text-brand-ink/70 leading-relaxed">
                                Le jour de votre mariage, place au tournage et à la prise de vue. Nous intervenons avec la plus grande discrétion pour capturer l'authenticité de chaque instant, des préparatifs jusqu'à la soirée.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ÉTAPE 5 (Anciennement 4) */}
                <div className="relative flex flex-row w-full fade-in-up z-10 group">
                    <div className="w-1/4 flex flex-col items-end pr-4 md:pr-12 pt-4 md:pt-8">
                        <div className="text-4xl md:text-7xl font-serif italic text-brand-taupe mb-1 md:mb-2 leading-none">V</div>
                        <div className="text-[8px] md:text-[10px] uppercase tracking-widest text-brand-ink/50 mt-2 md:mt-4 text-right">Après le mariage</div>
                    </div>
                    <div className="absolute left-1/4 top-7 md:top-14 w-3 h-3 md:w-4 md:h-4 rounded-full border border-brand-taupe bg-brand-paper flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-300">
                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-brand-taupe"></div>
                    </div>
                    <div className="w-3/4 pl-6 md:pl-12">
                        <div className="bg-white p-6 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-brand-sand/40">
                            <div className="inline-block bg-brand-paper text-brand-ink px-3 py-1 md:px-4 md:py-1.5 text-[8px] md:text-[9px] uppercase tracking-[0.2em] mb-4 md:mb-6 font-medium">La Livraison</div>
                            <h4 className="text-2xl md:text-3xl font-serif text-brand-ink mb-3 md:mb-4">Découverte de l'œuvre</h4>
                            <p className="text-xs md:text-sm font-light text-brand-ink/70 leading-relaxed">
                                Livraison de vos photos et de votre film via une galerie privée en ligne de haute qualité, avec la possibilité d'ajouter des supports physiques d'exception (coffret, album).
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
  );
}
