"use client";

import { useState, useRef } from 'react';
import { submitContactForm } from '@/actions/contact';

export default function Contact() {
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setStatus('idle');
    
    const formData = new FormData(e.currentTarget);
    const result = await submitContactForm(formData);
    
    if (result?.error) {
      setStatus('error');
      setErrorMsg(result.error);
    } else {
      setStatus('success');
      formRef.current?.reset();
    }
    
    setIsPending(false);
  }

  return (
    <section id="contact" className="py-24 bg-brand-ink text-brand-paper px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 fade-in-up">
                <h3 className="text-brand-taupe text-xs uppercase tracking-[0.2em] mb-4">Parlons de vous</h3>
                <h2 className="text-4xl md:text-5xl font-serif mb-6 italic">Racontez-nous votre histoire</h2>
                <p className="font-light text-brand-paper/80 max-w-2xl mx-auto leading-relaxed mb-4">
                    Les réservations pour l'année prochaine sont ouvertes. N'hésitez pas à nous donner le plus de détails possibles sur votre vision, la date et le lieu de votre mariage.
                </p>
                <a href="mailto:contact@mariage.iamyoka.fr" className="text-sm text-brand-taupe hover:text-white transition-colors border-b border-brand-taupe/30 hover:border-white pb-1">
                    contact@mariage.iamyoka.fr
                </a>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 fade-in-up max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative">
                        <input type="text" id="name" name="name" required className="w-full bg-transparent border-b border-brand-taupe/40 py-3 text-sm focus:outline-none focus:border-brand-taupe transition-colors peer placeholder-transparent" placeholder="Votre nom" />
                        <label htmlFor="name" className="absolute left-0 top-3 text-brand-paper/50 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-taupe peer-placeholder-shown:text-sm peer-placeholder-shown:top-3">Vos noms & prénoms</label>
                    </div>
                    <div className="relative">
                        <input type="email" id="email" name="email" required className="w-full bg-transparent border-b border-brand-taupe/40 py-3 text-sm focus:outline-none focus:border-brand-taupe transition-colors peer placeholder-transparent" placeholder="Email" />
                        <label htmlFor="email" className="absolute left-0 top-3 text-brand-paper/50 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-taupe peer-placeholder-shown:text-sm peer-placeholder-shown:top-3">Votre email</label>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative">
                        <input type="tel" id="phone" name="phone" className="w-full bg-transparent border-b border-brand-taupe/40 py-3 text-sm focus:outline-none focus:border-brand-taupe transition-colors peer placeholder-transparent" placeholder="Téléphone" />
                        <label htmlFor="phone" className="absolute left-0 top-3 text-brand-paper/50 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-taupe peer-placeholder-shown:text-sm peer-placeholder-shown:top-3">Votre téléphone</label>
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-brand-paper/50 text-xs uppercase tracking-widest mb-1">Date du mariage (si connue)</label>
                        <input type="date" id="date" name="date" className="w-full bg-transparent border-b border-brand-taupe/40 py-2 text-sm focus:outline-none focus:border-brand-taupe transition-colors text-brand-paper [color-scheme:dark]" />
                    </div>
                </div>
                
                <div className="relative">
                    <input type="text" id="location" name="location" className="w-full bg-transparent border-b border-brand-taupe/40 py-3 text-sm focus:outline-none focus:border-brand-taupe transition-colors peer placeholder-transparent" placeholder="Lieu" />
                    <label htmlFor="location" className="absolute left-0 top-3 text-brand-paper/50 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-taupe peer-placeholder-shown:text-sm peer-placeholder-shown:top-3">Lieu de réception</label>
                </div>

                <div className="pt-2">
                    <p className="text-brand-paper/50 text-[10px] uppercase tracking-widest mb-4">Services souhaités :</p>
                    <div className="flex flex-wrap gap-4 md:gap-6">
                        {['Photo', 'Film', 'Photo + Vidéos', 'Drone', 'Projection Privée', "J'en veux plus pour mon mariage !"].map((service) => (
                            <label key={service} className="cursor-pointer group">
                                <input type="checkbox" name="services" value={service} className="peer sr-only" />
                                <span className="inline-block px-4 py-2 text-xs md:text-sm font-light border border-brand-taupe/40 rounded-full text-brand-paper/80 hover:border-brand-taupe peer-checked:bg-brand-taupe peer-checked:border-brand-taupe peer-checked:text-white transition-all duration-300">
                                    {service}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
                
                <div className="relative">
                    <textarea id="message" name="message" required rows={5} className="w-full bg-transparent border-b border-brand-taupe/40 py-3 text-sm focus:outline-none focus:border-brand-taupe transition-colors peer placeholder-transparent resize-none" placeholder="Message"></textarea>
                    <label htmlFor="message" className="absolute left-0 top-3 text-brand-paper/50 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-taupe peer-placeholder-shown:text-sm peer-placeholder-shown:top-3">Racontez-nous votre mariage et l'ambiance souhaitée...</label>
                </div>
                
                <div className="text-center pt-4">
                    {status === 'success' && (
                        <p className="text-green-400 text-sm mb-4">Votre message a bien été envoyé ! Nous vous répondrons très vite.</p>
                    )}
                    {status === 'error' && (
                        <p className="text-red-400 text-sm mb-4">{errorMsg}</p>
                    )}
                    
                    <button 
                        type="submit" 
                        disabled={isPending}
                        className="inline-flex items-center justify-center space-x-3 bg-brand-taupe text-brand-ink px-12 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-brand-paper transition-colors duration-300 disabled:opacity-75 disabled:cursor-not-allowed min-w-[240px]"
                    >
                        {isPending ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-brand-ink" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Envoi en cours...</span>
                            </>
                        ) : (
                            <span>Envoyer le message</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    </section>
  );
}
