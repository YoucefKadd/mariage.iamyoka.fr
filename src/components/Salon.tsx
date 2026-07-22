import Link from 'next/link';

export default function Salon() {
  return (
    <section id="salon" className="py-20 bg-brand-ink text-brand-paper px-6">
        <div className="max-w-4xl mx-auto text-center fade-in-up">
            <span className="inline-block border border-brand-taupe text-brand-taupe px-4 py-1 text-xs uppercase tracking-[0.2em] mb-8">
                Exclusivité Salon du Mariage
            </span>
            <h2 className="text-3xl md:text-4xl font-serif mb-6 italic">Un cadeau pour votre grand jour</h2>
            <p className="font-light text-brand-paper/80 leading-relaxed mb-10 max-w-2xl mx-auto">
                Parce qu'une belle rencontre mérite d'être célébrée. Bénéficiez d'une réduction spéciale pour toute prise de contact suite à notre échange sur le salon, et d'une <strong className="text-brand-taupe font-normal">remise exceptionnelle supplémentaire</strong> pour toute réservation validée directement sur place.
            </p>
            <Link href="#contact" className="inline-block bg-brand-taupe text-brand-ink px-10 py-4 text-xs uppercase tracking-[0.2em] hover:bg-brand-paper transition-colors duration-300">
                Profiter de l'offre
            </Link>
        </div>
    </section>
  );
}
