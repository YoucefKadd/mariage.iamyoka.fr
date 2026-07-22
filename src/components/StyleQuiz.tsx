"use client";

import { useState } from "react";
import Link from "next/link";
import { stylesInfo, PhotoStyle } from "@/data/quizData";
import { addLead } from "@/actions/quiz";

export default function StyleQuiz({ questions }: { questions: any[] }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<Record<PhotoStyle, number>>({
    editorial: 0,
    documentaire: 0,
    cinematique: 0,
    lumineux: 0,
  });
  const [animating, setAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [submittingLead, setSubmittingLead] = useState(false);

  const handleSelect = (styleId: PhotoStyle) => {
    if (animating) return;
    
    setScores(prev => ({
      ...prev,
      [styleId]: prev[styleId] + 1
    }));

    setAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setAnimating(false);
    }, 400); 
  };

  const calculateWinner = () => {
    return Object.keys(scores).reduce((a, b) => scores[a as PhotoStyle] > scores[b as PhotoStyle] ? a : b) as PhotoStyle;
  };

  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittingLead(true);
    
    const formData = new FormData(e.currentTarget);
    const winnerId = calculateWinner();
    formData.append('styleResult', stylesInfo[winnerId].title);
    
    await addLead(formData);
    
    setSubmittingLead(false);
    setShowResult(true);
  };

  const isFormStep = currentStep === questions.length && !showResult;
  const isFinished = showResult;

  if (isFinished) {
    const winnerId = calculateWinner();
    const winner = stylesInfo[winnerId];

    return (
      <div className={`min-h-screen w-full flex flex-col items-center justify-center p-6 md:p-12 transition-colors duration-1000 ${winner.color} ${winner.textColor}`}>
        <div className="max-w-3xl text-center animate-[fadeIn_1s_ease-out]">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium opacity-60 mb-6 block">
            Votre profil photographique
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8 tracking-tight">
            {winner.title}
          </h1>
          <p className="text-sm md:text-base font-light tracking-wide leading-relaxed max-w-2xl mx-auto mb-16 opacity-80">
            {winner.description}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/#contact" 
              className={`border-b border-current pb-1 text-[10px] uppercase tracking-[0.2em] hover:opacity-50 transition-opacity`}
            >
              Contactez-nous pour en discuter
            </Link>
            <Link 
              href="/" 
              className={`border border-current px-8 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] hover:bg-current hover:text-${winnerId === 'cinematique' || winnerId === 'editorial' ? 'black' : 'white'} transition-colors`}
            >
              Retour au site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isFormStep) {
    return (
      <div className="min-h-screen w-full bg-brand-ink flex flex-col items-center justify-center p-6 text-brand-paper animate-[fadeIn_0.5s_ease-out]">
        <div className="max-w-xl w-full text-center">
          <span className="text-brand-taupe text-[10px] uppercase tracking-[0.3em] font-medium mb-6 block animate-pulse">
            Analyse de vos réponses...
          </span>
          <h2 className="text-3xl md:text-5xl font-serif mb-8 drop-shadow-md">
            Découvrez votre style photographique
          </h2>
          <p className="text-xs text-white/60 font-light tracking-[0.1em] mb-12">
            Laissez-nous vos coordonnées pour afficher votre résultat et recevoir nos conseils personnalisés.
          </p>

          <form onSubmit={handleLeadSubmit} className="space-y-6 text-left">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-brand-taupe mb-2">Prénoms des futurs mariés *</label>
              <input type="text" name="names" required className="w-full bg-transparent border-b border-brand-taupe/40 py-3 text-white focus:outline-none focus:border-brand-taupe transition-colors" placeholder="Ex: Élise & Thomas" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-brand-taupe mb-2">Adresse Email *</label>
              <input type="email" name="email" required className="w-full bg-transparent border-b border-brand-taupe/40 py-3 text-white focus:outline-none focus:border-brand-taupe transition-colors" placeholder="votre@email.com" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-brand-taupe mb-2">Numéro de Téléphone *</label>
              <input type="tel" name="phone" required className="w-full bg-transparent border-b border-brand-taupe/40 py-3 text-white focus:outline-none focus:border-brand-taupe transition-colors" placeholder="06 12 34 56 78" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-brand-taupe mb-2">Date du mariage (Optionnel)</label>
              <input type="date" name="date" className="w-full bg-transparent border-b border-brand-taupe/40 py-3 text-white/50 focus:outline-none focus:border-brand-taupe transition-colors" />
            </div>
            <div className="pt-8 text-center">
              <button 
                type="submit" 
                disabled={submittingLead}
                className="bg-brand-taupe text-brand-ink px-12 py-4 rounded-sm text-xs uppercase tracking-[0.2em] font-medium hover:bg-white transition-colors disabled:opacity-50 cursor-pointer"
              >
                {submittingLead ? 'Analyse en cours...' : 'Révéler mon style'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const question = questions[currentStep];

  return (
    <div className="min-h-screen w-full bg-brand-ink flex flex-col relative overflow-hidden text-brand-paper">
      
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/10 z-50">
        <div 
          className="h-full bg-brand-taupe transition-all duration-700 ease-out"
          style={{ width: `${(currentStep / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Header (Quit) */}
      <div className="absolute top-6 left-6 md:top-12 md:left-12 z-50">
        <Link href="/" className="text-[10px] uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors">
          Quitter
        </Link>
      </div>

      <div className={`flex-1 flex flex-col w-full transition-opacity duration-400 ${animating ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Question Title */}
        <div className="w-full text-center pt-24 pb-8 md:pt-32 md:pb-16 px-4 z-10">
          <span className="text-brand-taupe text-[10px] uppercase tracking-[0.3em] font-medium mb-4 block">
            Question {currentStep + 1} sur {questions.length}
          </span>
          <h2 className="text-3xl md:text-5xl font-serif mb-4 drop-shadow-md">
            {question.title}
          </h2>
          <p className="text-xs text-white/60 font-light tracking-[0.1em]">
            {question.subtitle}
          </p>
        </div>

        {/* Options Grid */}
        <div className="flex-1 w-full max-w-[100rem] mx-auto px-4 md:px-8 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-stretch">
          {question.options.map((option: any, index: number) => (
            <div 
              key={option.id}
              onClick={() => handleSelect(option.styleId)}
              className="group relative cursor-pointer overflow-hidden rounded-sm bg-black animate-[fadeIn_0.5s_ease-out]"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
            >
              <img 
                src={option.imageUrl} 
                alt={`Option ${index + 1}`}
                className="w-full h-full min-h-[300px] md:min-h-0 object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out opacity-80 group-hover:opacity-100 grayscale-[20%] group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-brand-ink/20 group-hover:bg-brand-ink/0 transition-colors duration-500"></div>
              
              {/* Select Indicator */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                <div className="w-16 h-16 rounded-full border border-white/50 backdrop-blur-md bg-white/10 flex items-center justify-center">
                  <span className="text-white text-[10px] uppercase tracking-widest">Choisir</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
