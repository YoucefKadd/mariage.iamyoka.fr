import Link from 'next/link';

export default function Header() {
  return (
    <header className="absolute w-full top-0 z-50 py-8 px-6 md:px-12 flex justify-between items-center text-brand-ink">
        <div className="w-1/4">
            <Link href="#" className="text-xl md:text-2xl font-sans font-bold tracking-widest uppercase">Iamyoka</Link>
        </div>
        <nav className="hidden md:flex w-2/4 justify-center space-x-8 lg:space-x-12 text-[10px] tracking-[0.2em] uppercase font-light">
            <Link href="#concept" className="hover:text-brand-taupe transition-colors duration-300">L'Approche</Link>
            <Link href="#processus" className="hover:text-brand-taupe transition-colors duration-300">Le Processus</Link>
            <Link href="#portfolio" className="hover:text-brand-taupe transition-colors duration-300">Portfolio</Link>
            <Link href="#tarifs" className="hover:text-brand-taupe transition-colors duration-300">Prestations</Link>
            <Link href="#faq" className="hover:text-brand-taupe transition-colors duration-300">FAQ</Link>
            <Link href="#contact" className="hover:text-brand-taupe transition-colors duration-300">Contact</Link>
        </nav>
        <div className="w-1/4 flex justify-end">
            <Link href="#contact" className="hidden md:inline-block bg-brand-peach text-white px-8 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] hover:bg-brand-taupe transition-colors duration-300 shadow-sm">
                Réserver
            </Link>
        </div>
    </header>
  );
}
