import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-ink text-brand-paper py-12 px-6 md:px-12 border-t border-brand-taupe/20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-serif tracking-widest uppercase">Iamyoka</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-brand-taupe mt-2">Mariages Cinématographiques</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6 text-xs md:text-sm font-light text-brand-paper/70">
          <a href="mailto:contact@mariage.iamyoka.fr" className="hover:text-brand-taupe transition-colors">contact@mariage.iamyoka.fr</a>
          <div className="flex space-x-4">
            <a href="https://www.instagram.com/iamyoka.fr/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-taupe transition-colors">@iamyoka.fr</a>
            <a href="https://www.instagram.com/yoka.mariage/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-taupe transition-colors">@yoka.mariage</a>
          </div>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-brand-paper/50 text-center md:text-right">
          © {new Date().getFullYear()} IAMYOKA. Tous droits réservés.<br/>
          Basé à Toulouse, France.
        </div>
      </div>
    </footer>
  );
}
