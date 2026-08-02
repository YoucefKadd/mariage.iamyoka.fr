"use client";

import { SectionData } from "@/actions/content";

function SectionConcept({ section }: { section: SectionData }) {
  return (
    <section id={section.id} className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
        <div className="md:col-span-5 fade-in-up">
          <h3 className="text-brand-taupe text-xs uppercase tracking-[0.2em] mb-6">
            {section.subtitle}
          </h3>
          {/* Allow <h2> styling from RichTextEditor or raw HTML */}
          <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight" dangerouslySetInnerHTML={{ __html: section.titleHtml }}></h2>
          
          <div 
            className="space-y-6 text-brand-ink/70 font-light text-sm md:text-base leading-relaxed whitespace-pre-wrap [&>p]:mb-4"
            dangerouslySetInnerHTML={{ __html: section.contentHtml }}
          ></div>
        </div>

        <div className="md:col-span-7 relative fade-in-up">
          <div className="relative p-4 bg-white shadow-sm w-full h-[500px] md:h-[700px]">
            <img 
              src={section.imageUrl} 
              alt={section.subtitle} 
              className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" 
            />
          </div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-brand-sand -z-10 hidden md:block"></div>
        </div>
      </div>
    </section>
  );
}

function SectionAbout({ section }: { section: SectionData }) {
  return (
    <section id={section.id} className="py-24 bg-white px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
        <div className="md:w-1/2 fade-in-up">
          <h3 className="text-brand-taupe text-xs uppercase tracking-[0.2em] mb-4">
            {section.subtitle}
          </h3>
          <h2 className="text-4xl md:text-5xl font-serif text-brand-ink mb-6" dangerouslySetInnerHTML={{ __html: section.titleHtml }}></h2>
          
          <div 
            className="space-y-6 text-brand-ink/70 font-light text-sm leading-relaxed whitespace-pre-wrap [&>p]:mb-4"
            dangerouslySetInnerHTML={{ __html: section.contentHtml }}
          ></div>
        </div>
        
        <div className="md:w-1/2 w-full fade-in-up">
          <div className="relative h-[500px] w-full">
            <img 
              src={section.imageUrl} 
              alt={section.subtitle} 
              className="w-full h-full object-cover rounded-sm border border-brand-sand shadow-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionTextOnly({ section }: { section: SectionData }) {
  return (
    <section id={section.id} className="py-24 md:py-32 px-6 md:px-12 max-w-4xl mx-auto text-center">
      <div className="fade-in-up">
        <h3 className="text-brand-taupe text-xs uppercase tracking-[0.2em] mb-6">
          {section.subtitle}
        </h3>
        <h2 className="text-4xl md:text-5xl font-serif mb-12 leading-tight" dangerouslySetInnerHTML={{ __html: section.titleHtml }}></h2>
        
        <div 
          className="space-y-6 text-brand-ink/70 font-light text-sm md:text-base leading-relaxed whitespace-pre-wrap [&>p]:mb-4"
          dangerouslySetInnerHTML={{ __html: section.contentHtml }}
        ></div>
      </div>
    </section>
  );
}

function SectionImageLeft({ section }: { section: SectionData }) {
  return (
    <section id={section.id} className="py-24 bg-brand-paper px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20">
        <div className="md:w-1/2 fade-in-up">
          <h3 className="text-brand-taupe text-xs uppercase tracking-[0.2em] mb-4">
            {section.subtitle}
          </h3>
          <h2 className="text-4xl md:text-5xl font-serif text-brand-ink mb-6" dangerouslySetInnerHTML={{ __html: section.titleHtml }}></h2>
          
          <div 
            className="space-y-6 text-brand-ink/70 font-light text-sm leading-relaxed whitespace-pre-wrap [&>p]:mb-4"
            dangerouslySetInnerHTML={{ __html: section.contentHtml }}
          ></div>
        </div>
        
        <div className="md:w-1/2 w-full fade-in-up">
          <div className="relative h-[500px] w-full p-4 bg-white shadow-sm">
            <img 
              src={section.imageUrl} 
              alt={section.subtitle} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DynamicSections({ sections }: { sections: SectionData[] }) {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map(section => {
        if (section.layout === 'concept') return <SectionConcept key={section.id} section={section} />;
        if (section.layout === 'about') return <SectionAbout key={section.id} section={section} />;
        if (section.layout === 'text_only') return <SectionTextOnly key={section.id} section={section} />;
        if (section.layout === 'image_left') return <SectionImageLeft key={section.id} section={section} />;
        return null;
      })}
    </>
  );
}
