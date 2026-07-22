"use client";

import { useState } from 'react';

export default function Faq({ faqs }: { faqs: any[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white px-6 md:px-12 border-t border-brand-sand/50">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 fade-in-up">
                <div className="flex items-center justify-center mb-6">
                    <div className="h-px bg-brand-taupe/40 w-12 md:w-24"></div>
                    <span className="px-4 text-[10px] uppercase tracking-[0.2em] text-brand-taupe font-medium">Questions fréquentes</span>
                    <div className="h-px bg-brand-taupe/40 w-12 md:w-24"></div>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif text-brand-ink italic mb-4">Ce que vous nous demandez souvent</h2>
            </div>

            <div className="space-y-4 fade-in-up">
                {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-brand-sand/60">
                        <button 
                            className="w-full flex justify-between items-center py-6 text-left focus:outline-none group"
                            onClick={() => toggleFaq(index)}
                        >
                            <h3 className="text-lg md:text-xl font-serif text-brand-ink group-hover:text-brand-taupe transition-colors duration-300 pr-8">
                                {faq.question}
                            </h3>
                            <span className="shrink-0 w-8 h-8 flex items-center justify-center border border-brand-taupe/30 rounded-full text-brand-taupe transition-transform duration-300" style={{ transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0)' }}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4"></path></svg>
                            </span>
                        </button>
                        <div 
                            className="overflow-hidden transition-all duration-500 ease-in-out"
                            style={{ maxHeight: openIndex === index ? '500px' : '0', opacity: openIndex === index ? 1 : 0 }}
                        >
                            <p className="pb-8 text-sm font-light text-brand-ink/70 leading-relaxed pr-8 md:pr-12">
                                {faq.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-16 text-center fade-in-up">
                <p className="text-sm font-light text-brand-ink/70 mb-4">Une autre question en tête ?</p>
                <a href="#contact" className="inline-block border-b border-brand-taupe text-brand-taupe pb-1 text-[10px] uppercase tracking-[0.2em] hover:text-brand-ink hover:border-brand-ink transition-colors duration-300">
                    Écrivez-nous
                </a>
            </div>
        </div>
    </section>
  );
}
