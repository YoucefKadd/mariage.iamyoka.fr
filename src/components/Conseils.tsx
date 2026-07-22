export default function Conseils() {
  return (
    <section id="conseils" className="py-24 bg-brand-ink text-brand-paper px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 fade-in-up">
                <h3 className="text-brand-taupe text-xs uppercase tracking-[0.2em] mb-4">Préparation</h3>
                <h2 className="text-3xl md:text-4xl font-serif italic mb-6">Nos petits conseils</h2>
                <p className="text-brand-paper/80 font-light text-sm max-w-2xl mx-auto leading-relaxed">
                    Organiser un mariage est une aventure. Voici ce que nous avons appris en accompagnant des centaines de couples :
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 fade-in-up">
                <div className="border-t border-brand-taupe/30 pt-6">
                    <span className="text-brand-taupe text-xl font-serif italic block mb-4">01.</span>
                    <h4 className="text-lg font-serif mb-3">Choisir vos prestataires</h4>
                    <p className="text-brand-paper/70 text-xs font-light leading-relaxed">
                        Prenez le temps, cherchez ceux qui partagent vos valeurs. Le feeling humain est primordial pour que vous soyez totalement à l'aise le grand jour.
                    </p>
                </div>
                <div className="border-t border-brand-taupe/30 pt-6">
                    <span className="text-brand-taupe text-xl font-serif italic block mb-4">02.</span>
                    <h4 className="text-lg font-serif mb-3">Ne pas hésiter à déléguer</h4>
                    <p className="text-brand-paper/70 text-xs font-light leading-relaxed">
                        Une wedding planner peut vous faire gagner en sérénité. Lâcher prise le jour J est le secret pour vivre le moment présent et obtenir les plus belles images.
                    </p>
                </div>
                <div className="border-t border-brand-taupe/30 pt-6">
                    <span className="text-brand-taupe text-xl font-serif italic block mb-4">03.</span>
                    <h4 className="text-lg font-serif mb-3">Rester alignés</h4>
                    <p className="text-brand-paper/70 text-xs font-light leading-relaxed">
                        Ce mariage est le vôtre, pas celui des autres. Ne faites aucun compromis sur votre vision et vivez-le selon vos propres envies et règles.
                    </p>
                </div>
                <div className="border-t border-brand-taupe/30 pt-6">
                    <span className="text-brand-taupe text-xl font-serif italic block mb-4">04.</span>
                    <h4 className="text-lg font-serif mb-3">Notre carnet d'adresses</h4>
                    <p className="text-brand-paper/70 text-xs font-light leading-relaxed">
                        Nous partageons volontiers notre carnet d’adresses de prestataires de confiance, construit avec les années. Car un mariage réussi, c’est aussi l’alchimie entre les bonnes personnes.
                    </p>
                </div>
            </div>
        </div>
    </section>
  );
}
