export type PhotoStyle = 'editorial' | 'documentaire' | 'cinematique' | 'lumineux';

export interface QuizOption {
  id: string;
  imageUrl: string;
  styleId: PhotoStyle;
}

export interface QuizQuestion {
  id: string;
  title: string;
  subtitle: string;
  options: QuizOption[];
}

export const stylesInfo = {
  editorial: {
    title: "Le Style Éditorial",
    description: "Inspiré des magazines de mode. Vous aimez l'élégance affirmée, la composition parfaite et les attitudes assumées. Chaque photo ressemble à la couverture de Vogue.",
    color: "bg-brand-ink",
    textColor: "text-white"
  },
  documentaire: {
    title: "L'Approche Documentaire",
    description: "Spontanéité avant tout. Vous voulez que l'on capture les vrais moments, les éclats de rire imprévus et les larmes de joie sans aucune mise en scène.",
    color: "bg-[#F4F1ED]", // Très clair
    textColor: "text-brand-ink"
  },
  cinematique: {
    title: "L'Ambiance Cinématique",
    description: "Moody et dramatique. Vous êtes attirés par les jeux d'ombres, les lumières tamisées et les émotions intenses. Des images qui racontent un film.",
    color: "bg-[#1A1A1A]", // Très sombre
    textColor: "text-[#D9B3A0]" // Peach text
  },
  lumineux: {
    title: "Lumineux & Fine Art",
    description: "Doux, romantique et intemporel. Vous préférez les ambiances baignées de lumière naturelle, les tons pastel et une délicatesse absolue.",
    color: "bg-white",
    textColor: "text-[#B5A898]" // Taupe
  }
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    title: "Quelle ambiance vous attire le plus ?",
    subtitle: "Laissez-vous guider par votre premier instinct visuel.",
    options: [
      { id: "o1-1", imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800", styleId: "editorial" },
      { id: "o1-2", imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800", styleId: "documentaire" },
      { id: "o1-3", imageUrl: "https://images.unsplash.com/photo-1537368910025-702800a7813c?auto=format&fit=crop&q=80&w=800", styleId: "cinematique" },
      { id: "o1-4", imageUrl: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=800", styleId: "lumineux" }
    ]
  },
  {
    id: "q2",
    title: "Quel moment attendez-vous avec impatience ?",
    subtitle: "Sélectionnez la photo qui représente votre instant idéal.",
    options: [
      { id: "o2-1", imageUrl: "https://images.unsplash.com/photo-1532712938730-4e36fc273863?auto=format&fit=crop&q=80&w=800", styleId: "documentaire" }, 
      { id: "o2-2", imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800", styleId: "lumineux" }, 
      { id: "o2-3", imageUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800", styleId: "editorial" }, 
      { id: "o2-4", imageUrl: "https://images.unsplash.com/photo-1621517409446-24df974bc27f?auto=format&fit=crop&q=80&w=800", styleId: "cinematique" } 
    ]
  },
  {
    id: "q3",
    title: "Si votre couple était une photo ?",
    subtitle: "Ne réfléchissez pas, cliquez.",
    options: [
      { id: "o3-1", imageUrl: "https://images.unsplash.com/photo-1610174070258-293e5066c050?auto=format&fit=crop&q=80&w=800", styleId: "cinematique" }, 
      { id: "o3-2", imageUrl: "https://images.unsplash.com/photo-1550005809-91ad75fb315f?auto=format&fit=crop&q=80&w=800", styleId: "editorial" },
      { id: "o3-3", imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800", styleId: "lumineux" }, 
      { id: "o3-4", imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800", styleId: "documentaire" } 
    ]
  }
];
