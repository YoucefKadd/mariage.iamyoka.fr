export default function Tarifs() {
  return (
    <section id="tarifs" className="py-24 bg-brand-paper px-6 border-t border-brand-sand">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 fade-in-up">
                <h3 className="text-brand-taupe text-xs uppercase tracking-[0.2em] mb-4">Investissement</h3>
                <h2 className="text-4xl md:text-5xl font-serif">Collections Mariage</h2>
                <p className="text-brand-ink/50 font-light text-sm max-w-2xl mx-auto mt-6">Des formules pensées pour s'adapter à votre grand jour, avec un accompagnement sur-mesure du début à la fin.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch fade-in-up">
                
                {/* Formule 1 */}
                <div className="bg-white border border-brand-sand/50 p-8 flex flex-col h-full shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-lg transition-shadow duration-500 group">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-brand-taupe mb-2">Photographie Seule</p>
                    <h4 className="text-3xl font-serif text-brand-ink mb-2">Le Documentaire</h4>
                    <div className="text-2xl font-serif text-brand-ink mb-6">À partir de 2 200 €</div>
                    <hr className="border-brand-sand mb-8" />
                    
                    <ul className="text-sm font-light text-brand-ink/70 space-y-4 flex-grow mb-10">
                        <li className="flex items-start">
                            <svg className="w-4 h-4 text-brand-taupe mt-1 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
                            <span>Rendez-vous de préparation & logistique</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-4 h-4 text-brand-taupe mt-1 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
                            <span>Couverture complète des préparatifs à la soirée</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-4 h-4 text-brand-taupe mt-1 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
                            <span>Retouche colorimétrique fine de chaque image</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-4 h-4 text-brand-taupe mt-1 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
                            <span>Livraison sur galerie privée en ligne Haute Définition</span>
                        </li>
                    </ul>

                    <div className="bg-brand-sand/20 p-5 border-l-2 border-brand-taupe mt-auto group-hover:bg-brand-sand/40 transition-colors duration-300">
                        <p className="text-[10px] uppercase tracking-[0.1em] font-medium text-brand-ink mb-2">Idéal pour vous si...</p>
                        <p className="text-xs font-light text-brand-ink/80 leading-relaxed italic">
                            ... vous accordez une importance capitale aux souvenirs sur papier glacé et souhaitez revivre chaque instant à travers des images figées, authentiques et intemporelles.
                        </p>
                    </div>
                </div>

                {/* Formule 2 */}
                <div className="bg-brand-ink border border-brand-ink p-8 flex flex-col h-full shadow-2xl relative transform lg:-translate-y-4 group">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-taupe text-white px-5 py-1 text-[9px] uppercase tracking-[0.2em] shadow-sm whitespace-nowrap">
                        L'Expérience Complète
                    </div>
                    
                    <p className="text-[10px] uppercase tracking-[0.2em] text-brand-taupe mb-2 mt-2">Photo & Vidéo</p>
                    <h4 className="text-3xl font-serif text-brand-paper mb-2">Le 7ème Art</h4>
                    <div className="text-2xl font-serif text-brand-taupe mb-6">À partir de 3 800 €</div>
                    <hr className="border-brand-taupe/30 mb-8" />
                    
                    <ul className="text-sm font-light text-brand-paper/80 space-y-4 flex-grow mb-10">
                        <li className="flex items-start">
                            <svg className="w-4 h-4 text-brand-taupe mt-1 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
                            <span>Rendez-vous de préparation & direction artistique</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-4 h-4 text-brand-taupe mt-1 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
                            <span>Couverture à deux (1 Photographe + 1 Vidéaste)</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-4 h-4 text-brand-taupe mt-1 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
                            <span>Film cinématographique (Teaser + Film Long)</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-4 h-4 text-brand-taupe mt-1 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
                            <span>Reportage photo documentaire complet</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-4 h-4 text-brand-taupe mt-1 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
                            <span>Prises de vue par drone incluses</span>
                        </li>
                    </ul>

                    <div className="bg-white/5 p-5 border-l-2 border-brand-taupe mt-auto">
                        <p className="text-[10px] uppercase tracking-[0.1em] font-medium text-brand-taupe mb-2">Idéal pour vous si...</p>
                        <p className="text-xs font-light text-brand-paper/70 leading-relaxed italic">
                            ... vous ne voulez faire aucun compromis. Vous souhaitez l'intensité narrative d'un film pour revivre les discours et les frissons, couplée à l'élégance de la photographie.
                        </p>
                    </div>
                </div>

                {/* Formule 3 */}
                <div className="bg-white border border-brand-sand/50 p-8 flex flex-col h-full shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-lg transition-shadow duration-500 group">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-brand-taupe mb-2">Vidéo Seule</p>
                    <h4 className="text-3xl font-serif text-brand-ink mb-2">Le Cinéma</h4>
                    <div className="text-2xl font-serif text-brand-ink mb-6">À partir de 3 000 €</div>
                    <hr className="border-brand-sand mb-8" />
                    
                    <ul className="text-sm font-light text-brand-ink/70 space-y-4 flex-grow mb-10">
                        <li className="flex items-start">
                            <svg className="w-4 h-4 text-brand-taupe mt-1 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
                            <span>Rendez-vous de préparation & repérage</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-4 h-4 text-brand-taupe mt-1 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
                            <span>Couverture complète des préparatifs à la soirée</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-4 h-4 text-brand-taupe mt-1 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
                            <span>Montage cinématographique & étalonnage (Color Grading)</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-4 h-4 text-brand-taupe mt-1 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
                            <span>Livraison formats Web et TV en 4K</span>
                        </li>
                    </ul>

                    <div className="bg-brand-sand/20 p-5 border-l-2 border-brand-taupe mt-auto group-hover:bg-brand-sand/40 transition-colors duration-300">
                        <p className="text-[10px] uppercase tracking-[0.1em] font-medium text-brand-ink mb-2">Idéal pour vous si...</p>
                        <p className="text-xs font-light text-brand-ink/80 leading-relaxed italic">
                            ... vous avez déjà votre photographe mais rêvez d'une véritable œuvre en mouvement pour immortaliser les voix, les musiques et l'ambiance de votre journée.
                        </p>
                    </div>
                </div>

            </div>
            
            {/* NOUVELLE OFFRE ULTRA-PREMIUM */}
            <div className="mt-12 bg-brand-ink text-brand-paper border border-brand-ink p-8 md:p-12 shadow-2xl relative fade-in-up">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-taupe text-white px-6 py-1 text-[9px] uppercase tracking-[0.2em] shadow-sm whitespace-nowrap">
                    L'Expérience Studio & Grands Événements
                </div>
                
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
                    <div className="lg:w-1/3 text-center lg:text-left">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-brand-taupe mb-2 mt-4">La Production Intégrale</p>
                        <h4 className="text-3xl font-serif mb-2">Le Blockbuster</h4>
                        <div className="text-2xl font-serif text-brand-taupe mb-6">Sur-mesure</div>
                        <hr className="border-brand-taupe/30 mb-8 lg:hidden" />
                    </div>
                    
                    <div className="lg:w-1/3">
                        <ul className="text-sm font-light text-brand-paper/80 space-y-6">
                            <li className="flex items-start">
                                <svg className="w-4 h-4 text-brand-taupe mt-1 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
                                <div>
                                    <span className="font-medium text-white block">1 Photographe Principal</span>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-4 h-4 text-brand-taupe mt-1 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
                                <div>
                                    <span className="font-medium text-white block">2 à 3 Vidéastes</span>
                                    <span className="block text-brand-paper/60 text-xs mt-1">(Couverture multi-angles, drone et steadicam)</span>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-4 h-4 text-brand-taupe mt-1 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
                                <div>
                                    <span className="font-medium text-white block">1 Content Creator</span>
                                    <span className="block text-brand-paper/60 text-xs mt-1">(Vidéos verticales immersives pour vos réseaux, livrées en 24h)</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    
                    <div className="lg:w-1/3 w-full">
                        <div className="bg-white/5 p-5 border-l-2 border-brand-taupe h-full flex flex-col justify-center">
                            <p className="text-[10px] uppercase tracking-[0.1em] font-medium text-brand-taupe mb-2">Nous vous conseillons cette offre si...</p>
                            <p className="text-xs font-light text-brand-paper/70 leading-relaxed italic">
                                ... vous organisez un mariage d'exception, sur plusieurs jours ou avec de très nombreux invités. Notre équipe complète garantit qu'absolument aucun détail, aucun angle et aucune émotion ne sera oublié, tout en vous fournissant du contenu immédiat pour vos proches.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-16 text-center fade-in-up bg-white p-8 border border-brand-sand/50 shadow-sm">
                <p className="text-sm font-serif text-brand-ink mb-6">Personnalisez votre expérience avec nos options à la carte :</p>
                <div className="flex flex-wrap justify-center gap-3">
                    <span className="inline-block border border-brand-taupe/40 px-5 py-2 text-[10px] uppercase tracking-widest text-brand-ink hover:bg-brand-taupe hover:text-white transition-colors duration-300 cursor-default">+ Photobooth</span>
                    <span className="inline-block border border-brand-taupe/40 px-5 py-2 text-[10px] uppercase tracking-widest text-brand-ink hover:bg-brand-taupe hover:text-white transition-colors duration-300 cursor-default">+ Album Photo Premium</span>
                    <span className="inline-block border border-brand-taupe/40 px-5 py-2 text-[10px] uppercase tracking-widest text-brand-ink hover:bg-brand-taupe hover:text-white transition-colors duration-300 cursor-default">+ Prise de vue Drone (Seul)</span>
                    <span className="inline-block border border-brand-taupe/40 px-5 py-2 text-[10px] uppercase tracking-widest text-brand-ink hover:bg-brand-taupe hover:text-white transition-colors duration-300 cursor-default">+ Séance Engagement (Couple)</span>
                </div>
            </div>
        </div>
    </section>
  );
}
