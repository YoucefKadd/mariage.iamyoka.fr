import Link from 'next/link';

export default function Header() {
  return (
    <header className="absolute w-full top-0 z-50 py-8 px-6 md:px-12 flex justify-between items-center text-brand-ink">
        <div className="flex-none z-10">
            <Link href="#" className="text-xl md:text-2xl font-sans font-bold tracking-widest uppercase">Iamyoka</Link>
        </div>
        <nav className="hidden md:flex flex-1 justify-center space-x-4 lg:space-x-8 xl:space-x-12 text-[10px] tracking-[0.2em] uppercase font-light whitespace-nowrap px-4">
            <Link href="#concept" className="hover:text-brand-taupe transition-colors duration-300">L'Approche</Link>
            <Link href="#processus" className="hover:text-brand-taupe transition-colors duration-300">Le Processus</Link>
            <Link href="#portfolio" className="hover:text-brand-taupe transition-colors duration-300">Portfolio</Link>
            <Link href="#tarifs" className="hover:text-brand-taupe transition-colors duration-300">Prestations</Link>
            <Link href="#faq" className="hover:text-brand-taupe transition-colors duration-300">FAQ</Link>
            <Link href="#contact" className="hover:text-brand-taupe transition-colors duration-300">Contact</Link>
        </nav>
        <div className="flex-none flex justify-end z-10">
            <Link href="#contact" className="hidden md:inline-block border border-brand-ink text-brand-ink px-8 py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-brand-ink hover:text-white transition-colors duration-300">
                Réserver
            </Link>
        </div>
    </header>
  );
}
