import Image from "next/image";

export default function Concept() {
  return (
    <section id="concept" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
            
            <div className="md:col-span-5 fade-in-up">
                <h3 className="text-brand-taupe text-xs uppercase tracking-[0.2em] mb-6">Notre Approche</h3>
                <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
                    Documentaire <br/><span className="italic text-brand-taupe">Cinématographique</span>
                </h2>
                <div className="space-y-6 text-brand-ink/70 font-light text-sm md:text-base leading-relaxed">
                    <p>
                        Pour nous, votre mariage est un récit qui se doit d'être authentique. C'est pour cela que nous concevons un univers où le style photographique sur le vif s'allie à une atmosphère digne du 7ème art.
                    </p>
                    <p>
                        Des préparatifs jusqu'au jour J, nous travaillons pour respecter et traduire la vérité du jour où vous vous dites "oui". Pas de poses figées interminables, seulement vos rires francs, la lumière douce d'une fin d'après-midi, et l'intensité d'un regard.
                    </p>
                    <p className="font-medium text-brand-ink mt-8">
                        Basés à Toulouse. <br/>Disponibles partout en France et à l'international.
                    </p>
                </div>
            </div>

            <div className="md:col-span-7 relative fade-in-up">
                {/* Image décalée avec bordure fine style tableau */}
                <div className="relative p-4 bg-white shadow-sm w-full h-[500px] md:h-[700px]">
                    <img 
                      src="https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1974&auto=format&fit=crop" 
                      alt="Photographie documentaire" 
                      className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" 
                    />
                </div>
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-brand-sand -z-10 hidden md:block"></div>
            </div>

        </div>
    </section>
  );
}
