export default function APropos() {
  return (
    <section id="a-propos" className="py-24 bg-white px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="md:w-1/2 fade-in-up">
                <h3 className="text-brand-taupe text-xs uppercase tracking-[0.2em] mb-4">La Vision derrière la caméra</h3>
                <h2 className="text-4xl md:text-5xl font-serif text-brand-ink mb-6 italic">Apprenez-en plus sur Iamyoka</h2>
                <div className="space-y-6 text-brand-ink/70 font-light text-sm leading-relaxed">
                    <p>
                        Derrière IAMYOKA se cache une véritable passion pour l'image narrative. Notre objectif n'est pas simplement de capturer des moments, mais de créer un héritage visuel qui traversera les générations.
                    </p>
                    <p>
                        Que ce soit à travers l'objectif de nos caméras ou derrière nos appareils photo, nous cherchons constamment l'équilibre parfait entre la lumière naturelle, l'émotion brute et la composition cinématographique. 
                    </p>
                    <p>
                        Grands voyageurs dans l'âme, notre inspiration puise dans les paysages grandioses et les cultures du monde entier. Cette ouverture d'esprit nous permet de nous adapter à toutes les atmosphères, du domaine classique au sud de la France jusqu'à l'élopement intimiste à l'autre bout du monde.
                    </p>
                </div>
                <div className="mt-8">
                     <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Signature_of_John_Hancock.svg/1200px-Signature_of_John_Hancock.svg.png" alt="Signature" className="h-12 opacity-40 mix-blend-multiply" />
                </div>
            </div>
            {/* Espace pour une image portrait à droite si nécessaire */}
        </div>
    </section>
  );
}
