export default function Temoignages() {
  return (
    <section id="temoignages" className="py-24 bg-white px-6 md:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 fade-in-up">
                <div className="flex items-center justify-center mb-6">
                    <div className="h-px bg-brand-taupe/40 w-12 md:w-24"></div>
                    <span className="px-4 text-[10px] uppercase tracking-[0.2em] text-brand-taupe font-medium">Preuve Sociale</span>
                    <div className="h-px bg-brand-taupe/40 w-12 md:w-24"></div>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif text-brand-ink italic mb-4">Vos petits messages</h2>
            </div>

            <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar space-x-6 md:grid md:grid-cols-3 md:space-x-0 md:gap-8 fade-in-up">
                
                {/* Témoignage 1 */}
                <div className="snap-center shrink-0 w-[85vw] md:w-auto bg-brand-paper p-8 md:p-12 border border-brand-sand/50">
                    <div className="flex text-brand-taupe mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                    </div>
                    <h3 className="text-xl font-serif mb-4">"Un souvenir inestimable"</h3>
                    <p className="text-sm font-light text-brand-ink/70 leading-relaxed mb-6">
                        "L'équipe a su capturer l'essence de notre journée avec une telle discrétion. Le film est tout simplement digne d'un cinéma, nos familles ont été bouleversées par l'émotion."
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-medium">— Camille & Thomas</p>
                </div>
                
                {/* Témoignage 2 (ajouté pour remplir la grille) */}
                <div className="snap-center shrink-0 w-[85vw] md:w-auto bg-brand-paper p-8 md:p-12 border border-brand-sand/50">
                    <div className="flex text-brand-taupe mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                    </div>
                    <h3 className="text-xl font-serif mb-4">"Une présence magique"</h3>
                    <p className="text-sm font-light text-brand-ink/70 leading-relaxed mb-6">
                        "Les photos sont sublimes. Ils ont su nous mettre à l'aise dès les préparatifs, on ne les remarquait même pas et pourtant, chaque moment important est immortalisé à la perfection."
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-medium">— Sarah & Thomas</p>
                </div>

                {/* Témoignage 3 */}
                <div className="snap-center shrink-0 w-[85vw] md:w-auto bg-brand-paper p-8 md:p-12 border border-brand-sand/50">
                    <div className="flex text-brand-taupe mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                    </div>
                    <h3 className="text-xl font-serif mb-4">"Au-delà de nos espérances"</h3>
                    <p className="text-sm font-light text-brand-ink/70 leading-relaxed mb-6">
                        "Nous avions beaucoup d'attentes pour notre vidéo de mariage, mais le résultat a été bien au-delà. Une réalisation parfaite, une équipe aux petits soins. Merci du fond du cœur de nous permettre de revivre cette journée."
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-medium">— Manon & Julien</p>
                </div>
            </div>
        </div>
    </section>
  );
}
