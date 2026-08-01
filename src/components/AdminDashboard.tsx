"use client";

import { useState, useRef, useEffect } from 'react';
import { addPhoto, deletePhoto, addFilm, deleteFilm, updateHeroVideo, movePhoto, moveFilm, updatePhotosOrder, updatePhoto, updateFilmsOrder, updateFilm } from '@/actions/media';
import { updateQuestion, deleteLeads } from '@/actions/quiz';
import { addFaq, updateFaq, deleteFaq, moveFaq } from '@/actions/faq';
import { updateEmailSettings } from '@/actions/contact';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AdminDashboard({ initialMedia, initialQuiz, initialLeads, initialFaqs, initialEmailSettings }: { initialMedia: any, initialQuiz: any, initialLeads: any[], initialFaqs: any[], initialEmailSettings?: any }) {
  const [activeTab, setActiveTab] = useState<'hero' | 'photos' | 'films' | 'quiz' | 'leads' | 'faq' | 'email'>('leads');
  const [emailState, setEmailState] = useState({
    subject: initialEmailSettings?.subject || "Votre demande de contact - Iamyoka",
    introText: initialEmailSettings?.introText || "Nous avons bien reçu votre message concernant votre mariage et nous vous en remercions infiniment.\n\nNous allons étudier votre demande avec soin et reviendrons vers vous très prochainement pour en discuter de vive voix.",
    closingText: initialEmailSettings?.closingText || "À très vite,\nIamyoka"
  });
  const [loading, setLoading] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State pour la sélection et la suppression avec mot de passe des leads
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [leadsToDelete, setLeadsToDelete] = useState<string[]>([]);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // State pour la vue et le glisser-déposer de la Galerie Photo
  const [photoViewMode, setPhotoViewMode] = useState<'grid' | 'table'>('grid');
  const [photosList, setPhotosList] = useState<any[]>(initialMedia.photos || []);
  const [draggedPhotoIndex, setDraggedPhotoIndex] = useState<number | null>(null);
  const [dragOverPhotoIndex, setDragOverPhotoIndex] = useState<number | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<any>(null);

  // State pour la vue et le glisser-déposer des Films
  const [filmViewMode, setFilmViewMode] = useState<'grid' | 'table'>('grid');
  const [filmsList, setFilmsList] = useState<any[]>(initialMedia.films || []);
  const [draggedFilmIndex, setDraggedFilmIndex] = useState<number | null>(null);
  const [dragOverFilmIndex, setDragOverFilmIndex] = useState<number | null>(null);
  const [editingFilm, setEditingFilm] = useState<any>(null);

  useEffect(() => {
    setPhotosList(initialMedia.photos || []);
  }, [initialMedia.photos]);

  useEffect(() => {
    setFilmsList(initialMedia.films || []);
  }, [initialMedia.films]);

  const handleFilmDragStart = (e: React.DragEvent, index: number) => {
    setDraggedFilmIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleFilmDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedFilmIndex === null) return;
    if (dragOverFilmIndex !== index) {
      setDragOverFilmIndex(index);
    }
  };

  const handleFilmDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedFilmIndex === null || draggedFilmIndex === dropIndex) {
      setDraggedFilmIndex(null);
      setDragOverFilmIndex(null);
      return;
    }

    const newList = [...filmsList];
    const [movedItem] = newList.splice(draggedFilmIndex, 1);
    newList.splice(dropIndex, 0, movedItem);

    setFilmsList(newList);
    setDraggedFilmIndex(null);
    setDragOverFilmIndex(null);

    await updateFilmsOrder(newList.map(f => f.id));
  };

  const handlePhotoDragStart = (e: React.DragEvent, index: number) => {
    setDraggedPhotoIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handlePhotoDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedPhotoIndex === null) return;
    if (dragOverPhotoIndex !== index) {
      setDragOverPhotoIndex(index);
    }
  };

  const handlePhotoDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedPhotoIndex === null || draggedPhotoIndex === dropIndex) {
      setDraggedPhotoIndex(null);
      setDragOverPhotoIndex(null);
      return;
    }

    const newList = [...photosList];
    const [movedItem] = newList.splice(draggedPhotoIndex, 1);
    newList.splice(dropIndex, 0, movedItem);

    setPhotosList(newList);
    setDraggedPhotoIndex(null);
    setDragOverPhotoIndex(null);

    await updatePhotosOrder(newList.map(p => p.id));
  };

  const photoFormRef = useRef<HTMLFormElement>(null);
  const filmFormRef = useRef<HTMLFormElement>(null);
  const heroFormRef = useRef<HTMLFormElement>(null);

  const handleAddPhoto = async (formData: FormData) => {
    setLoading(true);
    await addPhoto(formData);
    photoFormRef.current?.reset();
    setLoading(false);
  };

  const handleAddFilm = async (formData: FormData) => {
    setLoading(true);
    await addFilm(formData);
    filmFormRef.current?.reset();
    setLoading(false);
  };

  const handleUpdateHero = async (formData: FormData) => {
    setLoading(true);
    await updateHeroVideo(formData);
    setLoading(false);
  };

  const handleUpdateQuestion = async (formData: FormData) => {
    setLoading(true);
    await updateQuestion(formData);
    setLoading(false);
  };

  const handleAddFaq = async (formData: FormData) => {
    setLoading(true);
    await addFaq(formData);
    (document.getElementById('faq-add-form') as HTMLFormElement)?.reset();
    setLoading(false);
  };

  const handleUpdateFaq = async (formData: FormData) => {
    setLoading(true);
    await updateFaq(formData);
    setEditingFaq(null);
    setLoading(false);
  };

  const exportCSV = () => {
    if (!initialLeads || initialLeads.length === 0) return;
    const headers = ['Date', 'Noms', 'Email', 'Téléphone', 'Date Mariage', 'Lieu', 'Source/Style', 'Message'];
    const rows = initialLeads.map(lead => [
      new Date(lead.createdAt).toLocaleDateString('fr-FR'),
      `"${lead.names}"`,
      `"${lead.email}"`,
      `"${lead.phone || ''}"`,
      `"${lead.date}"`,
      `"${lead.location || ''}"`,
      `"${lead.styleResult}"`,
      `"${(lead.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "contacts_quiz.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    if (!initialLeads || initialLeads.length === 0) return;
    // Orientation Paysage pour un rendu parfait identique au web
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    
    // En-tête Premium
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(44, 42, 41); // brand-ink (#2C2A29)
    doc.text("IAMYOKA - BOÎTE DE RÉCEPTION", 14, 15);
    
    // Sous-titre
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(173, 154, 137); // brand-taupe
    doc.text(`Exporté le ${new Date().toLocaleDateString('fr-FR')} - Total : ${initialLeads.length} contacts`, 14, 20);

    const tableColumn = ["DATE", "CONTACT", "PROJET (DATE/LIEU)", "SOURCE", "STYLE / SERVICES", "MESSAGE"];
    const tableRows = initialLeads.map(lead => {
      const isContactForm = lead.styleResult?.startsWith('Contact') || lead.styleResult === 'Formulaire Contact';
      let servicesOrStyle = lead.styleResult || '-';
      
      if (isContactForm) {
        servicesOrStyle = lead.styleResult.replace('Contact (', '').replace(')', '');
        if (servicesOrStyle === 'Formulaire Contact') {
          servicesOrStyle = '-';
        } else {
          // Format avec retours à la ligne pour réserver la hauteur des chips
          servicesOrStyle = servicesOrStyle.split(' / ').map((s: string) => s.trim().toUpperCase()).join('\n');
        }
      } else {
        servicesOrStyle = servicesOrStyle.toUpperCase();
      }

      const formattedDate = new Date(lead.date).toLocaleDateString('fr-FR') !== 'Invalid Date' 
        ? new Date(lead.date).toLocaleDateString('fr-FR') 
        : (lead.date || 'NON PRÉCISÉE');

      return [
        new Date(lead.createdAt).toLocaleDateString('fr-FR'),
        `${lead.names}\n${lead.email}${lead.phone ? '\n' + lead.phone : ''}`,
        `${formattedDate}\n${(lead.location || 'NON PRÉCISÉ').toUpperCase()}`,
        isContactForm ? 'FORMULAIRE' : 'QUIZ',
        servicesOrStyle,
        lead.message || '-'
      ];
    });
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      theme: 'plain',
      styles: { 
        fontSize: 8,
        font: "helvetica",
        cellPadding: 5,
        valign: 'middle',
        lineColor: [234, 230, 223], // brand-sand
        textColor: [44, 42, 41]
      },
      headStyles: { 
        fillColor: [255, 255, 255],
        textColor: [181, 168, 152], // brand-taupe
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      columnStyles: {
        0: { cellWidth: 25 }, // DATE
        1: { cellWidth: 60 }, // CONTACT
        2: { cellWidth: 45 }, // PROJET
        3: { cellWidth: 30, halign: 'center' }, // SOURCE
        4: { cellWidth: 50 }, // STYLE / SERVICES
        5: { cellWidth: 59 }, // MESSAGE
      },
      willDrawCell: (data) => {
        if (data.section === 'body') {
          const rowRaw = data.row.raw as string[];
          
          // Ajuster dynamiquement la hauteur de la ligne en fonction du nombre de chips pour éviter tout chevauchement
          if (rowRaw && rowRaw[3] === 'FORMULAIRE' && rowRaw[4] && rowRaw[4] !== '-') {
            const serviceCount = rowRaw[4].split('\n').filter(Boolean).length;
            const minNeededHeight = (serviceCount * 7) + 6;
            if (data.row.height < minNeededHeight) {
              data.row.height = minNeededHeight;
            }
          }

          // Vider totalement le texte par défaut pour les colonnes 3 (Source) et 4 (Services)
          // afin d'empêcher autoTable de superposer du texte noir sous les chips
          if (data.column.index === 3 || data.column.index === 4) {
            data.cell.text = [];
          }
        }
      },
      didDrawCell: (data) => {
        if (data.section === 'body') {
          const doc = data.doc;
          const rowRaw = data.row.raw as string[];
          
          // 1. Colonne SOURCE (Tag gris clair rempli)
          if (data.column.index === 3) {
            const text = rowRaw[3];
            if (text && text !== '-') {
              const rectWidth = doc.getTextWidth(text) + 8;
              const rectHeight = 5.5;
              const x = data.cell.x + (data.cell.width - rectWidth) / 2;
              const y = data.cell.y + (data.cell.height - rectHeight) / 2;
              
              // Fond gris clair (like web tag)
              doc.setFillColor(245, 244, 242);
              doc.roundedRect(x, y, rectWidth, rectHeight, 1.2, 1.2, 'F');
              
              // Texte du tag
              doc.setFont("helvetica", "normal");
              doc.setFontSize(6.5);
              doc.setTextColor(140, 138, 137);
              doc.text(text, x + (rectWidth / 2), y + 3.8, { align: 'center' });
            }
          }
          
          // 2. Colonne STYLE / SERVICES (Chips arrondies avec bordure)
          if (data.column.index === 4) {
            const text = rowRaw[4];
            const isContactForm = rowRaw[3] === 'FORMULAIRE';
            
            if (text && text !== '-') {
              if (isContactForm) {
                // Formulaire : Dessiner une vrai chip par service
                const services = text.split('\n');
                const chipHeight = 5;
                const gap = 2;
                const totalHeight = (services.length * chipHeight) + ((services.length - 1) * gap);
                let currentY = data.cell.y + (data.cell.height - totalHeight) / 2;
                
                services.forEach(service => {
                  const cleanService = service.trim();
                  if (!cleanService) return;
                  
                  doc.setFont("helvetica", "normal");
                  doc.setFontSize(6.5);
                  const rectWidth = doc.getTextWidth(cleanService) + 8;
                  const x = data.cell.x + 3;
                  const y = currentY;
                  
                  // Contour arrondi (Chip)
                  doc.setDrawColor(181, 168, 152); // brand-taupe
                  doc.setLineWidth(0.25);
                  doc.roundedRect(x, y, rectWidth, chipHeight, 2.5, 2.5, 'D');
                  
                  // Texte du chip
                  doc.setTextColor(181, 168, 152);
                  doc.text(cleanService, x + (rectWidth / 2), y + 3.6, { align: 'center' });
                  
                  currentY += chipHeight + gap;
                });
              } else {
                // Quiz : Style affiché normalement
                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                doc.setTextColor(44, 42, 41);
                doc.text(text, data.cell.x + 3, data.cell.y + (data.cell.height / 2) + 1);
              }
            }
          }
        }

        // Ligne de séparation fine horizontale sous chaque ligne (like web table)
        if (data.section === 'body') {
          doc.setDrawColor(234, 230, 223); // brand-sand
          doc.setLineWidth(0.2);
          doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
        }
      }
    });
    
    doc.save("iamyoka_contacts.pdf");
  };

  const tabLabels: Record<string, string> = {
    leads: 'Boîte de Réception',
    hero: "Vidéo d'Accueil",
    photos: 'Galerie Photos',
    films: 'Films de Mariage',
    faq: 'Questions Fréquentes',
    quiz: 'Paramétrage du Quiz',
    email: "Template d'Email",
  };

  const renderNavCategories = () => (
    <>
      {/* Catégorie 1: Relation Client */}
      <div>
        <h3 className="text-[9px] uppercase tracking-[0.2em] text-brand-ink/40 mb-3 font-medium">Relation Client</h3>
        <div className="space-y-1">
          <button 
            onClick={() => { setActiveTab('leads'); setShowAddForm(false); setMobileMenuOpen(false); }} 
            className={`w-full flex items-center justify-between text-left px-3 py-2 text-sm transition-colors ${activeTab === 'leads' ? 'bg-brand-taupe/10 text-brand-taupe font-medium' : 'text-brand-ink hover:bg-brand-sand/30'}`}
          >
            <span>Boîte de Réception</span>
            {initialLeads?.length > 0 && (
                <span className={`text-[9px] w-5 h-5 flex items-center justify-center rounded-full ${activeTab === 'leads' ? 'bg-brand-taupe text-white' : 'bg-brand-ink/10 text-brand-ink'}`}>
                    {initialLeads.length}
                </span>
            )}
          </button>
        </div>
      </div>

      {/* Catégorie 2: Visuels */}
      <div>
        <h3 className="text-[9px] uppercase tracking-[0.2em] text-brand-ink/40 mb-3 font-medium">Visuels & Médias</h3>
        <div className="space-y-1">
          <button 
            onClick={() => { setActiveTab('hero'); setShowAddForm(false); setMobileMenuOpen(false); }} 
            className={`w-full text-left px-3 py-2 text-sm transition-colors ${activeTab === 'hero' ? 'bg-brand-taupe/10 text-brand-taupe font-medium' : 'text-brand-ink hover:bg-brand-sand/30'}`}
          >
            Vidéo d'Accueil
          </button>
          <button 
            onClick={() => { setActiveTab('photos'); setShowAddForm(false); setMobileMenuOpen(false); }} 
            className={`w-full text-left px-3 py-2 text-sm transition-colors ${activeTab === 'photos' ? 'bg-brand-taupe/10 text-brand-taupe font-medium' : 'text-brand-ink hover:bg-brand-sand/30'}`}
          >
            Galerie Photos
          </button>
          <button 
            onClick={() => { setActiveTab('films'); setShowAddForm(false); setMobileMenuOpen(false); }} 
            className={`w-full text-left px-3 py-2 text-sm transition-colors ${activeTab === 'films' ? 'bg-brand-taupe/10 text-brand-taupe font-medium' : 'text-brand-ink hover:bg-brand-sand/30'}`}
          >
            Films de Mariage
          </button>
        </div>
      </div>

      {/* Catégorie 3: Contenus */}
      <div>
        <h3 className="text-[9px] uppercase tracking-[0.2em] text-brand-ink/40 mb-3 font-medium">Textes & Configuration</h3>
        <div className="space-y-1">
          <button 
            onClick={() => { setActiveTab('faq'); setShowAddForm(false); setMobileMenuOpen(false); }} 
            className={`w-full text-left px-3 py-2 text-sm transition-colors ${activeTab === 'faq' ? 'bg-brand-taupe/10 text-brand-taupe font-medium' : 'text-brand-ink hover:bg-brand-sand/30'}`}
          >
            Questions Fréquentes
          </button>
          <button 
            onClick={() => { setActiveTab('quiz'); setShowAddForm(false); setMobileMenuOpen(false); }} 
            className={`w-full text-left px-3 py-2 text-sm transition-colors ${activeTab === 'quiz' ? 'bg-brand-taupe/10 text-brand-taupe font-medium' : 'text-brand-ink hover:bg-brand-sand/30'}`}
          >
            Paramétrage du Quiz
          </button>
          <button 
            onClick={() => { setActiveTab('email'); setShowAddForm(false); setMobileMenuOpen(false); }} 
            className={`w-full text-left px-3 py-2 text-sm transition-colors ${activeTab === 'email' ? 'bg-brand-taupe/10 text-brand-taupe font-medium' : 'text-brand-ink hover:bg-brand-sand/30'}`}
          >
            Template d'Email
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start relative">
      
      {/* Mobile Sticky Navigation Header with Hamburger Button */}
      <div className="w-full md:hidden sticky top-2 z-30 space-y-2">
        <div className="bg-white border border-brand-sand shadow-md px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase tracking-widest text-brand-ink/50 font-medium">Navigation :</span>
            <span className="text-xs font-serif font-bold text-brand-ink">{tabLabels[activeTab]}</span>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center space-x-2 bg-brand-paper hover:bg-brand-sand/50 px-3 py-1.5 border border-brand-sand transition-colors rounded-sm"
          >
            <span className="text-[10px] uppercase tracking-widest text-brand-ink font-medium">
              {mobileMenuOpen ? 'Fermer' : 'Menu'}
            </span>
            <svg className="w-4 h-4 text-brand-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Dropdown Menu on Mobile */}
        {mobileMenuOpen && (
          <div className="bg-white p-5 border border-brand-sand shadow-xl space-y-6 animate-[fadeIn_0.2s_ease-out]">
            {renderNavCategories()}
          </div>
        )}
      </div>

      {/* Desktop Sidebar Navigation */}
      <div className="hidden md:block w-64 shrink-0 space-y-8 bg-white p-6 border border-brand-sand shadow-sm sticky top-6">
        {renderNavCategories()}
      </div>

      {/* Contenu Principal */}
      <div className="flex-1 w-full min-w-0">

      {activeTab === 'hero' && (
        <div className="space-y-12">
          <div className="bg-white p-8 border border-brand-sand shadow-sm">
            <h2 className="text-xl font-serif mb-6">Vidéo d'arrière-plan (Accueil)</h2>
            <form ref={heroFormRef} action={handleUpdateHero} className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">URL de la vidéo MP4 ou lien YouTube</label>
                <input 
                  type="url" 
                  name="url" 
                  defaultValue={initialMedia.heroVideo}
                  className="w-full border-b border-brand-taupe/40 py-2 focus:outline-none focus:border-brand-taupe bg-transparent" 
                  placeholder="https://youtube.com/watch?v=... ou https://.../video.mp4" 
                  required 
                />
              </div>
              <div>
                <button type="submit" disabled={loading} className="bg-brand-taupe text-white px-8 py-3 text-[10px] uppercase tracking-widest hover:bg-brand-ink transition-colors disabled:opacity-50">
                  {loading ? 'Mise à jour...' : 'Sauvegarder'}
                </button>
              </div>
            </form>
          </div>
          
          <div>
            <h2 className="text-xl font-serif mb-6">Aperçu de la vidéo actuelle</h2>
            {initialMedia.heroVideo ? (
              <video src={initialMedia.heroVideo} autoPlay loop muted className="w-full max-w-2xl aspect-video object-cover border border-brand-sand shadow-sm" />
            ) : (
              <p className="text-sm text-brand-ink/50">Aucune vidéo configurée.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'photos' && (
        <div className="space-y-8">
          
          {/* Header & Bouton Ajouter */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-brand-sand shadow-sm">
             <div>
                <h2 className="text-xl font-serif">Galerie Photos ({photosList.length})</h2>
                <p className="text-xs text-brand-ink/60 uppercase tracking-widest mt-1">Gérez l'ordre et le portfolio photo par glisser-déposer</p>
             </div>
             
             <div className="flex flex-wrap items-center gap-3">
               {/* Sélecteur de vue (Grille / Tableau) */}
               <div className="flex bg-brand-paper border border-brand-sand p-1 rounded-sm">
                 <button
                   type="button"
                   onClick={() => setPhotoViewMode('grid')}
                   className={`px-3 py-1.5 text-[10px] uppercase tracking-widest flex items-center space-x-1.5 transition-colors ${photoViewMode === 'grid' ? 'bg-brand-taupe text-white font-bold' : 'text-brand-ink hover:text-brand-taupe'}`}
                 >
                   <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                   </svg>
                   <span>Vue Grille</span>
                 </button>
                 <button
                   type="button"
                   onClick={() => setPhotoViewMode('table')}
                   className={`px-3 py-1.5 text-[10px] uppercase tracking-widest flex items-center space-x-1.5 transition-colors ${photoViewMode === 'table' ? 'bg-brand-taupe text-white font-bold' : 'text-brand-ink hover:text-brand-taupe'}`}
                 >
                   <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                   </svg>
                   <span>Vue Tableau</span>
                 </button>
               </div>

               <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-brand-taupe text-white px-6 py-2 text-[10px] uppercase tracking-widest hover:bg-brand-ink transition-colors"
               >
                  {showAddForm ? 'Fermer' : '+ Ajouter une photo'}
               </button>
             </div>
          </div>

          {/* Formulaire Ajout Photo (Caché par défaut) */}
          {showAddForm && (
            <div className="bg-white p-8 border border-brand-sand shadow-sm animate-[fadeIn_0.3s_ease-out]">
              <h2 className="text-xl font-serif mb-6">Ajouter une nouvelle photo</h2>
              <form ref={photoFormRef} onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                const fd = new FormData(e.currentTarget);
                await addPhoto(fd);
                photoFormRef.current?.reset();
                setShowAddForm(false);
                setLoading(false);
              }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">Fichier Image (PC / Téléphone)</label>
                  <input 
                    type="file" 
                    name="file" 
                    accept="image/*" 
                    className="w-full text-xs text-brand-ink border border-brand-sand p-2 bg-brand-paper rounded-xs cursor-pointer file:mr-3 file:py-1 file:px-3 file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:bg-brand-taupe file:text-white file:rounded-xs hover:file:bg-brand-ink mb-2" 
                  />
                  <p className="text-[9px] text-brand-ink/40 uppercase tracking-widest mb-1">— OU URL Externe —</p>
                  <input type="url" name="url" className="w-full border-b border-brand-taupe/40 py-2 focus:outline-none focus:border-brand-taupe bg-transparent text-xs" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">Titre / Description courte</label>
                  <input type="text" name="title" className="w-full border-b border-brand-taupe/40 py-2 focus:outline-none focus:border-brand-taupe bg-transparent" placeholder="Ex: Les Préparatifs" required />
                </div>
                <div className="md:col-span-2">
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="inline-flex items-center justify-center space-x-2 bg-brand-taupe text-white px-8 py-3 text-[10px] uppercase tracking-widest hover:bg-brand-ink transition-colors disabled:opacity-50 min-w-[200px]"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Upload & Compression...</span>
                      </>
                    ) : (
                      <span>Ajouter la photo</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Affichage des photos (Grille ou Tableau) */}
          <div className="bg-white p-6 border border-brand-sand shadow-sm">
            
            {photoViewMode === 'grid' ? (
              /* Vue Grille interactive avec Drag & Drop */
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {photosList.map((photo: any, index: number) => {
                  const isDragging = draggedPhotoIndex === index;
                  const isDragOver = dragOverPhotoIndex === index;

                  return (
                    <div 
                      key={photo.id} 
                      draggable
                      onDragStart={(e) => handlePhotoDragStart(e, index)}
                      onDragOver={(e) => handlePhotoDragOver(e, index)}
                      onDrop={(e) => handlePhotoDrop(e, index)}
                      onDragEnd={() => { setDraggedPhotoIndex(null); setDragOverPhotoIndex(null); }}
                      className={`relative group bg-white p-2 border transition-all cursor-grab active:cursor-grabbing ${
                        isDragging ? 'opacity-30 scale-95 border-dashed border-brand-taupe' : 
                        isDragOver ? 'border-brand-taupe ring-2 ring-brand-taupe/50 scale-105 z-10' : 'border-brand-sand hover:border-brand-taupe/50'
                      }`}
                    >
                      {/* Poignée Drag & Drop indicator */}
                      <div className="absolute top-3 left-3 z-10 bg-brand-ink/80 text-white text-[9px] px-2 py-1 rounded-xs backdrop-blur-xs flex items-center space-x-1 shadow-md">
                        <span>⋮⋮</span>
                        <span>#{index + 1}</span>
                      </div>

                      <img src={photo.url} alt={photo.title} className="w-full h-40 object-cover select-none pointer-events-none" />
                      <p className="mt-2 text-xs font-medium truncate">{photo.title}</p>
                      
                      {/* Actions rapides */}
                      <div className="absolute bottom-3 right-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {index > 0 && (
                          <button 
                            type="button"
                            onClick={async () => await movePhoto(photo.id, 'up')}
                            className="bg-brand-ink text-white w-7 h-7 flex items-center justify-center rounded-sm hover:bg-brand-taupe shadow-md text-xs"
                            title="Monter"
                          >
                            ↑
                          </button>
                        )}
                        {index < photosList.length - 1 && (
                          <button 
                            type="button"
                            onClick={async () => await movePhoto(photo.id, 'down')}
                            className="bg-brand-ink text-white w-7 h-7 flex items-center justify-center rounded-sm hover:bg-brand-taupe shadow-md text-xs"
                            title="Descendre"
                          >
                            ↓
                          </button>
                        )}
                        <button 
                          type="button"
                          onClick={() => setEditingPhoto(photo)}
                          className="bg-brand-taupe text-white w-7 h-7 flex items-center justify-center rounded-sm hover:bg-brand-ink shadow-md text-xs"
                          title="Modifier le titre / lien"
                        >
                          ✎
                        </button>
                        <button 
                          type="button"
                          onClick={async () => await deletePhoto(photo.id)}
                          className="bg-red-500 text-white w-7 h-7 flex items-center justify-center rounded-sm hover:bg-red-600 shadow-md text-xs"
                          title="Supprimer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Vue Tableau interactive avec Drag & Drop */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-brand-sand">
                      <th className="py-3 px-4 text-[10px] uppercase tracking-widest text-brand-ink/50 font-medium w-16 text-center">Ordre</th>
                      <th className="py-3 px-4 text-[10px] uppercase tracking-widest text-brand-ink/50 font-medium w-24">Aperçu</th>
                      <th className="py-3 px-4 text-[10px] uppercase tracking-widest text-brand-ink/50 font-medium min-w-[200px]">Titre / Description</th>
                      <th className="py-3 px-4 text-[10px] uppercase tracking-widest text-brand-ink/50 font-medium min-w-[250px]">Lien Image</th>
                      <th className="py-3 px-4 text-[10px] uppercase tracking-widest text-brand-ink/50 font-medium text-right w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {photosList.map((photo: any, index: number) => {
                      const isDragging = draggedPhotoIndex === index;
                      const isDragOver = dragOverPhotoIndex === index;

                      return (
                        <tr 
                          key={photo.id}
                          draggable
                          onDragStart={(e) => handlePhotoDragStart(e, index)}
                          onDragOver={(e) => handlePhotoDragOver(e, index)}
                          onDrop={(e) => handlePhotoDrop(e, index)}
                          onDragEnd={() => { setDraggedPhotoIndex(null); setDragOverPhotoIndex(null); }}
                          className={`border-b border-brand-sand/50 transition-all cursor-grab active:cursor-grabbing ${
                            isDragging ? 'opacity-30 bg-brand-sand/40' :
                            isDragOver ? 'bg-brand-taupe/20 border-t-2 border-b-2 border-brand-taupe' : 'hover:bg-brand-sand/20'
                          }`}
                        >
                          {/* Poignée & Ordre */}
                          <td className="py-3 px-4 text-center align-middle">
                            <div className="flex items-center justify-center space-x-1 text-brand-ink/60 font-mono text-xs">
                              <span className="text-base leading-none select-none text-brand-taupe">⋮⋮</span>
                              <span>#{index + 1}</span>
                            </div>
                          </td>

                          {/* Aperçu */}
                          <td className="py-3 px-4 align-middle">
                            <img src={photo.url} alt={photo.title} className="w-16 h-12 object-cover rounded-xs border border-brand-sand pointer-events-none select-none" />
                          </td>

                          {/* Titre */}
                          <td className="py-3 px-4 align-middle text-sm font-medium text-brand-ink">
                            {photo.title}
                          </td>

                          {/* URL */}
                          <td className="py-3 px-4 align-middle text-xs text-brand-taupe max-w-xs truncate">
                            {photo.url?.startsWith('data:') ? (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-[10px] uppercase tracking-widest font-bold bg-brand-taupe/10 text-brand-taupe border border-brand-taupe/30 shadow-2xs">
                                <span>📷</span>
                                <span>Image Téléversée</span>
                              </span>
                            ) : (
                              <a href={photo.url} target="_blank" rel="noopener noreferrer" className="hover:underline truncate block max-w-[200px]">
                                {photo.url}
                              </a>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 align-middle text-right">
                            <div className="flex items-center justify-end space-x-1">
                              {index > 0 && (
                                <button 
                                  type="button"
                                  onClick={async () => await movePhoto(photo.id, 'up')}
                                  className="border border-brand-sand text-brand-ink w-7 h-7 flex items-center justify-center rounded-sm hover:bg-brand-taupe hover:text-white transition-colors text-xs"
                                  title="Monter"
                                >
                                  ↑
                                </button>
                              )}
                              {index < photosList.length - 1 && (
                                <button 
                                  type="button"
                                  onClick={async () => await movePhoto(photo.id, 'down')}
                                  className="border border-brand-sand text-brand-ink w-7 h-7 flex items-center justify-center rounded-sm hover:bg-brand-taupe hover:text-white transition-colors text-xs"
                                  title="Descendre"
                                >
                                  ↓
                                </button>
                              )}
                              <button 
                                type="button"
                                onClick={() => setEditingPhoto(photo)}
                                className="border border-brand-taupe text-brand-taupe w-7 h-7 flex items-center justify-center rounded-sm hover:bg-brand-taupe hover:text-white transition-colors text-xs"
                                title="Modifier le titre / lien"
                              >
                                ✎
                              </button>
                              <button 
                                type="button"
                                onClick={async () => await deletePhoto(photo.id)}
                                className="border border-red-200 text-red-500 w-7 h-7 flex items-center justify-center rounded-sm hover:bg-red-500 hover:text-white transition-colors text-xs ml-1"
                                title="Supprimer"
                              >
                                ✕
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      )}

      {activeTab === 'films' && (
        <div className="space-y-8">
          {/* Header & Bouton Ajouter */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-brand-sand shadow-sm">
             <div>
                <h2 className="text-xl font-serif">Films de Mariage ({filmsList.length})</h2>
                <p className="text-xs text-brand-ink/60 uppercase tracking-widest mt-1">Gérez l'ordre et le portfolio vidéo par glisser-déposer</p>
             </div>
             
             <div className="flex flex-wrap items-center gap-3">
               {/* Sélecteur de vue (Grille / Tableau) */}
               <div className="flex bg-brand-paper border border-brand-sand p-1 rounded-sm">
                 <button
                   type="button"
                   onClick={() => setFilmViewMode('grid')}
                   className={`px-3 py-1.5 text-[10px] uppercase tracking-widest flex items-center space-x-1.5 transition-colors ${filmViewMode === 'grid' ? 'bg-brand-taupe text-white font-bold' : 'text-brand-ink hover:text-brand-taupe'}`}
                 >
                   <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                   </svg>
                   <span>Vue Grille</span>
                 </button>
                 <button
                   type="button"
                   onClick={() => setFilmViewMode('table')}
                   className={`px-3 py-1.5 text-[10px] uppercase tracking-widest flex items-center space-x-1.5 transition-colors ${filmViewMode === 'table' ? 'bg-brand-taupe text-white font-bold' : 'text-brand-ink hover:text-brand-taupe'}`}
                 >
                   <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                   </svg>
                   <span>Vue Tableau</span>
                 </button>
               </div>

               <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-brand-taupe text-white px-6 py-2 text-[10px] uppercase tracking-widest hover:bg-brand-ink transition-colors"
               >
                  {showAddForm ? 'Fermer' : '+ Ajouter un film'}
               </button>
             </div>
          </div>

          {/* Formulaire Ajout Film */}
          {showAddForm && (
            <div className="bg-white p-8 border border-brand-sand shadow-sm animate-[fadeIn_0.3s_ease-out]">
              <h2 className="text-xl font-serif mb-6">Ajouter un nouveau film</h2>
              <form ref={filmFormRef} onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                const fd = new FormData(e.currentTarget);
                await addFilm(fd);
                filmFormRef.current?.reset();
                setShowAddForm(false);
                setLoading(false);
              }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">Lien YouTube de la vidéo</label>
                  <input type="url" name="youtubeUrl" className="w-full border-b border-brand-taupe/40 py-2 focus:outline-none focus:border-brand-taupe bg-transparent" placeholder="https://youtube.com/watch?v=..." required />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">Image de couverture (Fichier ou URL)</label>
                  <input 
                    type="file" 
                    name="file" 
                    accept="image/*" 
                    className="w-full text-xs text-brand-ink border border-brand-sand p-1.5 bg-brand-paper rounded-xs cursor-pointer file:mr-2 file:py-1 file:px-2 file:border-0 file:text-[9px] file:uppercase file:tracking-widest file:bg-brand-taupe file:text-white file:rounded-xs mb-1" 
                  />
                  <input type="url" name="url" className="w-full border-b border-brand-taupe/40 py-1.5 focus:outline-none focus:border-brand-taupe bg-transparent text-xs" placeholder="Laissée vide = générée par YouTube" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">Titre Principal</label>
                  <input type="text" name="title" className="w-full border-b border-brand-taupe/40 py-2 focus:outline-none focus:border-brand-taupe bg-transparent" placeholder="Ex: Élise & Maxime" required />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">Sous-titre (Lieu ou Type)</label>
                  <input type="text" name="subtitle" className="w-full border-b border-brand-taupe/40 py-2 focus:outline-none focus:border-brand-taupe bg-transparent" placeholder="Ex: Château de la Ligne" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">Badge (Optionnel)</label>
                  <input type="text" name="badge" className="w-full border-b border-brand-taupe/40 py-2 focus:outline-none focus:border-brand-taupe bg-transparent" placeholder="Ex: Sélection Officielle" />
                </div>
                <div className="md:col-span-2 flex items-center space-x-3">
                  <input type="checkbox" name="isMain" id="isMain" className="w-4 h-4 text-brand-taupe accent-brand-taupe" />
                  <label htmlFor="isMain" className="text-sm font-medium">Film mis en avant (Sera affiché en grand format)</label>
                </div>
                <div className="md:col-span-2">
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="inline-flex items-center justify-center space-x-2 bg-brand-taupe text-white px-8 py-3 text-[10px] uppercase tracking-widest hover:bg-brand-ink transition-colors disabled:opacity-50 min-w-[200px]"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Upload & Traitement...</span>
                      </>
                    ) : (
                      <span>Ajouter le film</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Affichage des films (Grille ou Tableau) */}
          <div className="bg-white p-6 border border-brand-sand shadow-sm">
            {filmViewMode === 'grid' ? (
              /* Vue Grille interactive avec Drag & Drop */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filmsList.map((film: any, index: number) => {
                  const isDragging = draggedFilmIndex === index;
                  const isDragOver = dragOverFilmIndex === index;

                  return (
                    <div 
                      key={film.id}
                      draggable
                      onDragStart={(e) => handleFilmDragStart(e, index)}
                      onDragOver={(e) => handleFilmDragOver(e, index)}
                      onDrop={(e) => handleFilmDrop(e, index)}
                      onDragEnd={() => { setDraggedFilmIndex(null); setDragOverFilmIndex(null); }}
                      className={`relative group bg-white p-2 border transition-all cursor-grab active:cursor-grabbing ${
                        isDragging ? 'opacity-30 scale-95 border-dashed border-brand-taupe' : 
                        isDragOver ? 'border-brand-taupe ring-2 ring-brand-taupe/50 scale-105 z-10' : 'border-brand-sand hover:border-brand-taupe/50'
                      }`}
                    >
                      {/* Poignée Drag & Drop indicator */}
                      <div className="absolute top-3 left-3 z-10 bg-brand-ink/80 text-white text-[9px] px-2 py-1 rounded-xs backdrop-blur-xs flex items-center space-x-1 shadow-md">
                        <span>⋮⋮</span>
                        <span>#{index + 1}</span>
                      </div>

                      <div className="relative">
                        <img src={film.url} alt={film.title} className="w-full h-40 object-cover select-none pointer-events-none" />
                        {film.isMain && <span className="absolute top-2 right-2 bg-brand-taupe text-white text-[8px] uppercase px-2 py-1 shadow-xs">À la une</span>}
                        {film.badge && <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[8px] uppercase px-2 py-0.5 backdrop-blur-xs">{film.badge}</span>}
                      </div>

                      <div className="p-3">
                        <p className="font-serif text-lg text-brand-ink">{film.title}</p>
                        <p className="text-xs text-brand-ink/60">{film.subtitle}</p>
                      </div>
                      
                      {/* Actions rapides */}
                      <div className="absolute top-3 right-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {index > 0 && (
                          <button 
                            type="button"
                            onClick={async () => await moveFilm(film.id, 'up')}
                            className="bg-brand-ink text-white w-7 h-7 flex items-center justify-center rounded-sm hover:bg-brand-taupe shadow-md text-xs"
                            title="Monter"
                          >
                            ↑
                          </button>
                        )}
                        {index < filmsList.length - 1 && (
                          <button 
                            type="button"
                            onClick={async () => await moveFilm(film.id, 'down')}
                            className="bg-brand-ink text-white w-7 h-7 flex items-center justify-center rounded-sm hover:bg-brand-taupe shadow-md text-xs"
                            title="Descendre"
                          >
                            ↓
                          </button>
                        )}
                        <button 
                          type="button"
                          onClick={() => setEditingFilm(film)}
                          className="bg-brand-taupe text-white w-7 h-7 flex items-center justify-center rounded-sm hover:bg-brand-ink shadow-md text-xs"
                          title="Modifier le film"
                        >
                          ✎
                        </button>
                        <button 
                          type="button"
                          onClick={async () => await deleteFilm(film.id)}
                          className="bg-red-500 text-white w-7 h-7 flex items-center justify-center rounded-sm hover:bg-red-600 shadow-md text-xs"
                          title="Supprimer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Vue Tableau interactive avec Drag & Drop */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[750px]">
                  <thead>
                    <tr className="border-b border-brand-sand">
                      <th className="py-3 px-4 text-[10px] uppercase tracking-widest text-brand-ink/50 font-medium w-16 text-center">Ordre</th>
                      <th className="py-3 px-4 text-[10px] uppercase tracking-widest text-brand-ink/50 font-medium w-24">Vignette</th>
                      <th className="py-3 px-4 text-[10px] uppercase tracking-widest text-brand-ink/50 font-medium min-w-[180px]">Film & Lieu</th>
                      <th className="py-3 px-4 text-[10px] uppercase tracking-widest text-brand-ink/50 font-medium min-w-[220px]">Lien YouTube</th>
                      <th className="py-3 px-4 text-[10px] uppercase tracking-widest text-brand-ink/50 font-medium w-28 text-center">Statut</th>
                      <th className="py-3 px-4 text-[10px] uppercase tracking-widest text-brand-ink/50 font-medium text-right w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filmsList.map((film: any, index: number) => {
                      const isDragging = draggedFilmIndex === index;
                      const isDragOver = dragOverFilmIndex === index;

                      return (
                        <tr 
                          key={film.id}
                          draggable
                          onDragStart={(e) => handleFilmDragStart(e, index)}
                          onDragOver={(e) => handleFilmDragOver(e, index)}
                          onDrop={(e) => handleFilmDrop(e, index)}
                          onDragEnd={() => { setDraggedFilmIndex(null); setDragOverFilmIndex(null); }}
                          className={`border-b border-brand-sand/50 transition-all cursor-grab active:cursor-grabbing ${
                            isDragging ? 'opacity-30 bg-brand-sand/40' :
                            isDragOver ? 'bg-brand-taupe/20 border-t-2 border-b-2 border-brand-taupe' : 'hover:bg-brand-sand/20'
                          }`}
                        >
                          {/* Poignée & Ordre */}
                          <td className="py-3 px-4 text-center align-middle">
                            <div className="flex items-center justify-center space-x-1 text-brand-ink/60 font-mono text-xs">
                              <span className="text-base leading-none select-none text-brand-taupe">⋮⋮</span>
                              <span>#{index + 1}</span>
                            </div>
                          </td>

                          {/* Aperçu */}
                          <td className="py-3 px-4 align-middle">
                            <img src={film.url} alt={film.title} className="w-16 h-10 object-cover rounded-xs border border-brand-sand pointer-events-none select-none" />
                          </td>

                          {/* Titre & Sous-titre */}
                          <td className="py-3 px-4 align-middle">
                            <p className="text-sm font-serif font-bold text-brand-ink">{film.title}</p>
                            {film.subtitle && <p className="text-xs text-brand-ink/60">{film.subtitle}</p>}
                          </td>

                          {/* Lien YouTube */}
                          <td className="py-3 px-4 align-middle text-xs text-brand-taupe max-w-xs truncate">
                            <a href={film.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {film.youtubeUrl}
                            </a>
                          </td>

                          {/* Statut & Badge */}
                          <td className="py-3 px-4 align-middle text-center">
                            <div className="flex flex-col items-center space-y-1">
                              {film.isMain && (
                                <span className="bg-brand-taupe text-white text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full font-medium">
                                  À la une
                                </span>
                              )}
                              {film.badge && (
                                <span className="bg-brand-sand text-brand-ink text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full font-medium">
                                  {film.badge}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 align-middle text-right">
                            <div className="flex items-center justify-end space-x-1">
                              {index > 0 && (
                                <button 
                                  type="button"
                                  onClick={async () => await moveFilm(film.id, 'up')}
                                  className="border border-brand-sand text-brand-ink w-7 h-7 flex items-center justify-center rounded-sm hover:bg-brand-taupe hover:text-white transition-colors text-xs"
                                  title="Monter"
                                >
                                  ↑
                                </button>
                              )}
                              {index < filmsList.length - 1 && (
                                <button 
                                  type="button"
                                  onClick={async () => await moveFilm(film.id, 'down')}
                                  className="border border-brand-sand text-brand-ink w-7 h-7 flex items-center justify-center rounded-sm hover:bg-brand-taupe hover:text-white transition-colors text-xs"
                                  title="Descendre"
                                >
                                  ↓
                                </button>
                              )}
                              <button 
                                type="button"
                                onClick={() => setEditingFilm(film)}
                                className="border border-brand-taupe text-brand-taupe w-7 h-7 flex items-center justify-center rounded-sm hover:bg-brand-taupe hover:text-white transition-colors text-xs"
                                title="Modifier le film"
                              >
                                ✎
                              </button>
                              <button 
                                type="button"
                                onClick={async () => await deleteFilm(film.id)}
                                className="border border-red-200 text-red-500 w-7 h-7 flex items-center justify-center rounded-sm hover:bg-red-500 hover:text-white transition-colors text-xs ml-1"
                                title="Supprimer"
                              >
                                ✕
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="space-y-12">
            <div className="bg-white p-8 border border-brand-sand shadow-sm">
                <h2 className="text-xl font-serif mb-2">Configuration du Quiz de Style</h2>
                <p className="text-xs text-brand-ink/60 mb-8 uppercase tracking-widest">Modifiez les questions et les images associées à chaque style</p>
                
                <div className="space-y-16">
                    {initialQuiz?.questions?.map((q: any, index: number) => (
                        <div key={q.id} className="border border-brand-sand p-6 bg-brand-paper/30">
                            <h3 className="font-serif text-lg mb-4">Question {index + 1}</h3>
                            <form action={handleUpdateQuestion} className="space-y-6">
                                <input type="hidden" name="questionId" value={q.id} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">Titre de la question</label>
                                        <input type="text" name="title" defaultValue={q.title} className="w-full border-b border-brand-taupe/40 py-2 focus:outline-none focus:border-brand-taupe bg-transparent" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">Sous-titre (Optionnel)</label>
                                        <input type="text" name="subtitle" defaultValue={q.subtitle} className="w-full border-b border-brand-taupe/40 py-2 focus:outline-none focus:border-brand-taupe bg-transparent" />
                                    </div>
                                </div>
                                
                                <div className="pt-4">
                                    <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Images par Style</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {q.options.map((opt: any) => (
                                            <div key={opt.id} className="flex flex-col space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-brand-ink/70">
                                                    Style : <span className="font-bold text-brand-taupe">{opt.styleId}</span>
                                                </label>
                                                <input 
                                                    type="url" 
                                                    name={`${opt.styleId}Img`} 
                                                    defaultValue={opt.imageUrl} 
                                                    className="w-full border-b border-brand-taupe/40 py-2 focus:outline-none focus:border-brand-taupe bg-transparent text-xs" 
                                                    placeholder="URL de l'image" 
                                                />
                                                {opt.imageUrl && (
                                                    <img src={opt.imageUrl} alt={opt.styleId} className="w-full h-24 object-cover mt-2 opacity-50 hover:opacity-100 transition-opacity" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="pt-4 border-t border-brand-sand">
                                    <button type="submit" disabled={loading} className="bg-brand-taupe text-white px-8 py-3 text-[10px] uppercase tracking-widest hover:bg-brand-ink transition-colors disabled:opacity-50 cursor-pointer">
                                        {loading ? 'Mise à jour...' : 'Sauvegarder la Question ' + (index + 1)}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {activeTab === 'leads' && (
        <div className="space-y-8">
            <div className="bg-white p-4 md:p-8 border border-brand-sand shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-xl font-serif mb-2">Boîte de Réception ({initialLeads?.length || 0})</h2>
                        <p className="text-xs text-brand-ink/60 uppercase tracking-widest">Contacts issus du formulaire et du quiz</p>
                    </div>
                    {initialLeads && initialLeads.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                            {selectedLeadIds.length > 0 && (
                              <button 
                                onClick={() => { setLeadsToDelete(selectedLeadIds); setDeletePassword(''); setDeleteError(null); setDeleteModalOpen(true); }} 
                                className="bg-red-500 text-white px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-red-600 transition-colors shadow-sm"
                              >
                                Supprimer la sélection ({selectedLeadIds.length})
                              </button>
                            )}
                            <button onClick={exportCSV} className="border border-brand-taupe text-brand-taupe px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-brand-taupe hover:text-white transition-colors">
                                Exporter CSV
                            </button>
                            <button onClick={exportPDF} className="bg-brand-taupe text-white px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-brand-ink transition-colors">
                                Exporter PDF
                            </button>
                        </div>
                    )}
                </div>
                
                {(!initialLeads || initialLeads.length === 0) ? (
                    <div className="text-center py-12 border border-dashed border-brand-sand text-brand-ink/40">
                        Aucun contact récolté pour le moment.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[950px]">
                            <thead>
                                <tr className="border-b border-brand-sand">
                                    <th className="py-4 px-3 w-10 text-center">
                                      <input 
                                        type="checkbox" 
                                        className="w-4 h-4 accent-brand-taupe cursor-pointer"
                                        checked={selectedLeadIds.length === initialLeads.length && initialLeads.length > 0}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedLeadIds(initialLeads.map(l => l.id));
                                          } else {
                                            setSelectedLeadIds([]);
                                          }
                                        }}
                                      />
                                    </th>
                                    <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-brand-ink/50 font-medium w-24">Date</th>
                                    <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-brand-ink/50 font-medium min-w-[150px]">Contact</th>
                                    <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-brand-ink/50 font-medium min-w-[150px]">Projet (Date/Lieu)</th>
                                    <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-brand-ink/50 font-medium w-24">Source</th>
                                    <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-brand-ink/50 font-medium min-w-[200px]">Style / Services</th>
                                    <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-brand-taupe font-bold min-w-[200px]">Message</th>
                                    <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-brand-ink/50 font-medium text-right w-20">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {initialLeads.map((lead: any) => {
                                    const isContactForm = lead.styleResult?.startsWith('Contact') || lead.styleResult === 'Formulaire Contact';
                                    const sourceLabel = isContactForm ? 'Formulaire' : 'Quiz';
                                    let detailsLabel = lead.styleResult;
                                    if (isContactForm) {
                                        detailsLabel = lead.styleResult.replace('Contact (', '').replace(')', '');
                                        if (detailsLabel === 'Formulaire Contact') detailsLabel = '-';
                                    }
                                    const isSelected = selectedLeadIds.includes(lead.id);

                                    return (
                                    <tr key={lead.id} className={`border-b border-brand-sand/50 transition-colors ${isSelected ? 'bg-brand-sand/30' : 'hover:bg-brand-sand/20'}`}>
                                        <td className="py-4 px-3 align-top text-center">
                                          <input 
                                            type="checkbox" 
                                            className="w-4 h-4 accent-brand-taupe cursor-pointer"
                                            checked={isSelected}
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                setSelectedLeadIds(prev => [...prev, lead.id]);
                                              } else {
                                                setSelectedLeadIds(prev => prev.filter(id => id !== lead.id));
                                              }
                                            }}
                                          />
                                        </td>
                                        <td className="py-4 px-4 text-xs font-light align-top">{new Date(lead.createdAt).toLocaleDateString('fr-FR')}</td>
                                        <td className="py-4 px-4 align-top">
                                            <div className="text-sm font-medium">{lead.names}</div>
                                            <div className="text-xs text-brand-taupe"><a href={`mailto:${lead.email}`}>{lead.email}</a></div>
                                            {lead.phone && <div className="text-xs text-brand-ink/60"><a href={`tel:${lead.phone}`}>{lead.phone}</a></div>}
                                        </td>
                                        <td className="py-4 px-4 text-sm font-light align-top">
                                            <div>{new Date(lead.date).toLocaleDateString('fr-FR') !== 'Invalid Date' ? new Date(lead.date).toLocaleDateString('fr-FR') : lead.date}</div>
                                            {lead.location && <div className="text-xs text-brand-ink/60 uppercase">{lead.location}</div>}
                                        </td>
                                        <td className="py-4 px-4 align-top">
                                            <span className={`px-2 py-1 text-[9px] uppercase tracking-widest rounded-sm whitespace-nowrap ${isContactForm ? 'bg-brand-taupe/10 text-brand-taupe' : 'bg-brand-ink/5 text-brand-ink'}`}>
                                                {sourceLabel}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 align-top">
                                            {isContactForm ? (
                                                <div className="flex flex-wrap gap-1.5">
                                                  {detailsLabel !== '-' ? detailsLabel?.split(' / ').map((service: string, i: number) => (
                                                    <span key={i} className="border border-brand-taupe/40 text-brand-ink/80 text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full whitespace-nowrap bg-transparent">
                                                      {service}
                                                    </span>
                                                  )) : '-'}
                                                </div>
                                            ) : (
                                                <span className="font-serif text-sm text-brand-ink">{detailsLabel}</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-xs font-light max-w-xs align-top">
                                            <p className="line-clamp-3" title={lead.message}>
                                                {lead.message || <span className="italic text-brand-ink/40">Aucun message</span>}
                                            </p>
                                        </td>
                                        <td className="py-4 px-4 align-top text-right">
                                            <button 
                                              onClick={() => { setLeadsToDelete([lead.id]); setDeletePassword(''); setDeleteError(null); setDeleteModalOpen(true); }}
                                              className="text-red-500 hover:text-red-700 text-xs font-medium underline"
                                              title="Supprimer ce prospect"
                                            >
                                              Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
      )}

      {activeTab === 'faq' && (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-brand-sand shadow-sm">
                <div>
                    <h2 className="text-xl font-serif">Questions Fréquentes ({initialFaqs?.length || 0})</h2>
                    <p className="text-xs text-brand-ink/60 uppercase tracking-widest mt-1">Gérez la foire aux questions</p>
                </div>
                <button 
                    onClick={() => { setShowAddForm(!showAddForm); setEditingFaq(null); }}
                    className="bg-brand-taupe text-white px-6 py-2 text-[10px] uppercase tracking-widest hover:bg-brand-ink transition-colors"
                >
                    {showAddForm || editingFaq ? 'Fermer' : '+ Ajouter une question'}
                </button>
            </div>

            {(showAddForm || editingFaq) && (
                <div className="bg-white p-8 border border-brand-sand shadow-sm animate-[fadeIn_0.3s_ease-out]">
                    <h2 className="text-xl font-serif mb-6">{editingFaq ? 'Modifier la question' : 'Ajouter une question FAQ'}</h2>
                    <form key={editingFaq ? editingFaq.id : 'new'} id={editingFaq ? undefined : "faq-add-form"} action={async (fd) => { if(editingFaq) { await handleUpdateFaq(fd); } else { await handleAddFaq(fd); setShowAddForm(false); } }} className="grid grid-cols-1 gap-6">
                        {editingFaq && <input type="hidden" name="id" value={editingFaq.id} />}
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">Question</label>
                            <input type="text" name="question" defaultValue={editingFaq?.question || ''} className="w-full border-b border-brand-taupe/40 py-2 focus:outline-none focus:border-brand-taupe bg-transparent font-serif" required />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">Réponse</label>
                            <textarea name="answer" rows={4} defaultValue={editingFaq?.answer || ''} className="w-full border border-brand-taupe/40 py-2 px-3 focus:outline-none focus:border-brand-taupe bg-transparent text-sm resize-none" required></textarea>
                        </div>
                        <div className="flex space-x-4">
                            <button type="submit" disabled={loading} className="bg-brand-taupe text-white px-8 py-3 text-[10px] uppercase tracking-widest hover:bg-brand-ink transition-colors disabled:opacity-50">
                                {loading ? 'Sauvegarde...' : 'Enregistrer'}
                            </button>
                            {editingFaq && (
                                <button type="button" onClick={() => setEditingFaq(null)} className="border border-brand-taupe text-brand-taupe px-8 py-3 text-[10px] uppercase tracking-widest hover:bg-brand-taupe hover:text-white transition-colors">
                                    Annuler
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            <div>
                <div className="space-y-4">
                    {initialFaqs?.map((faq: any, index: number) => (
                        <div key={faq.id} className="bg-white p-6 border border-brand-sand relative group flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex-1">
                                <h3 className="font-serif text-lg text-brand-ink mb-2">{faq.question}</h3>
                                <p className="text-sm font-light text-brand-ink/70">{faq.answer}</p>
                            </div>
                            <div className="flex items-center space-x-2 shrink-0">
                                <div className="flex flex-col space-y-1 mr-4">
                                    {index > 0 && (
                                        <button onClick={async () => await moveFaq(faq.id, 'up')} className="bg-brand-sand text-brand-ink w-6 h-6 flex items-center justify-center hover:bg-brand-taupe hover:text-white transition-colors" title="Monter">↑</button>
                                    )}
                                    {index < initialFaqs.length - 1 && (
                                        <button onClick={async () => await moveFaq(faq.id, 'down')} className="bg-brand-sand text-brand-ink w-6 h-6 flex items-center justify-center hover:bg-brand-taupe hover:text-white transition-colors" title="Descendre">↓</button>
                                    )}
                                </div>
                                <button onClick={() => { setEditingFaq(faq); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="border border-brand-taupe text-brand-taupe px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-brand-taupe hover:text-white transition-colors">
                                    Modifier
                                </button>
                                <button onClick={async () => await deleteFaq(faq.id)} className="bg-red-50 text-red-500 border border-red-200 px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors">
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}
      
      </div> {/* Fin Contenu Principal */}

      {/* Modal de confirmation de suppression avec mot de passe */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-brand-ink/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white p-8 max-w-md w-full border border-brand-sand shadow-2xl space-y-6">
            <div>
              <h3 className="text-xl font-serif text-brand-ink mb-2">Confirmation de suppression</h3>
              <p className="text-xs text-brand-ink/70">
                Vous vous préparez à supprimer définitivement <strong className="text-red-500">{leadsToDelete.length} prospect(s)</strong>. 
                Cette action est irréversible.
              </p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              setDeleteLoading(true);
              setDeleteError(null);
              const res = await deleteLeads(leadsToDelete, deletePassword);
              if (res?.error) {
                setDeleteError(res.error);
                setDeleteLoading(false);
              } else {
                setDeleteModalOpen(false);
                setSelectedLeadIds(prev => prev.filter(id => !leadsToDelete.includes(id)));
                setLeadsToDelete([]);
                setDeleteLoading(false);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">Mot de passe Administrateur</label>
                <input 
                  type="password" 
                  value={deletePassword} 
                  onChange={(e) => setDeletePassword(e.target.value)} 
                  className="w-full border-b border-brand-taupe/40 py-2 focus:outline-none focus:border-brand-taupe bg-transparent text-sm" 
                  placeholder="Entrez votre mot de passe"
                  autoFocus 
                  required 
                />
              </div>

              {deleteError && (
                <div className="bg-red-50 text-red-600 text-xs p-3 border border-red-200">
                  {deleteError}
                </div>
              )}

              <div className="flex space-x-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setDeleteModalOpen(false)} 
                  className="flex-1 border border-brand-sand py-2.5 text-[10px] uppercase tracking-widest text-brand-ink hover:bg-brand-sand/30 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={deleteLoading} 
                  className="flex-1 bg-red-500 text-white py-2.5 text-[10px] uppercase tracking-widest hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deleteLoading ? 'Vérification...' : 'Confirmer la suppression'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'édition d'une photo */}
      {editingPhoto && (
        <div className="fixed inset-0 bg-brand-ink/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white p-8 max-w-lg w-full border border-brand-sand shadow-2xl space-y-6">
            <div>
              <h3 className="text-xl font-serif text-brand-ink mb-1">Modifier la photo</h3>
              <p className="text-xs text-brand-ink/60 uppercase tracking-widest">Modifiez le titre et le lien de l'image</p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              const fd = new FormData(e.currentTarget);
              await updatePhoto(fd);
              setEditingPhoto(null);
              setLoading(false);
            }} className="space-y-6">
              <input type="hidden" name="id" value={editingPhoto.id} />
              
              <div>
                <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">Titre / Description courte</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingPhoto.title} 
                  className="w-full border-b border-brand-taupe/40 py-2 focus:outline-none focus:border-brand-taupe bg-transparent text-sm font-medium" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">Image (Fichier depuis l'appareil ou URL)</label>
                <input 
                  type="file" 
                  name="file" 
                  accept="image/*" 
                  className="w-full text-xs text-brand-ink border border-brand-sand p-2 bg-brand-paper rounded-xs cursor-pointer file:mr-3 file:py-1 file:px-3 file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:bg-brand-taupe file:text-white file:rounded-xs hover:file:bg-brand-ink mb-2" 
                />
                <input 
                  type="url" 
                  name="url" 
                  defaultValue={editingPhoto.url?.startsWith('data:') ? '' : editingPhoto.url} 
                  className="w-full border-b border-brand-taupe/40 py-2 focus:outline-none focus:border-brand-taupe bg-transparent text-xs text-brand-taupe" 
                  placeholder={editingPhoto.url?.startsWith('data:') ? "Fichier stocké dans la BDD (Laissez vide pour conserver)" : "https://..."} 
                />
                {editingPhoto.url && (
                  <div className="mt-4">
                    <p className="text-[10px] uppercase tracking-widest text-brand-ink/40 mb-1">Aperçu actuel :</p>
                    <img src={editingPhoto.url} alt="Aperçu" className="w-full h-40 object-cover border border-brand-sand rounded-xs shadow-xs" />
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setEditingPhoto(null)} 
                  className="flex-1 border border-brand-sand py-2.5 text-[10px] uppercase tracking-widest text-brand-ink hover:bg-brand-sand/30 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 inline-flex items-center justify-center space-x-2 bg-brand-taupe text-white py-2.5 text-[10px] uppercase tracking-widest hover:bg-brand-ink transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <span>Enregistrer</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'édition d'un film */}
      {editingFilm && (
        <div className="fixed inset-0 bg-brand-ink/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white p-8 max-w-xl w-full border border-brand-sand shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-xl font-serif text-brand-ink mb-1">Modifier le film</h3>
              <p className="text-xs text-brand-ink/60 uppercase tracking-widest">Modifiez les informations et liens de la vidéo</p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              const fd = new FormData(e.currentTarget);
              await updateFilm(fd);
              setEditingFilm(null);
              setLoading(false);
            }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="hidden" name="id" value={editingFilm.id} />
              
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">Lien YouTube de la vidéo *</label>
                <input 
                  type="url" 
                  name="youtubeUrl" 
                  defaultValue={editingFilm.youtubeUrl} 
                  className="w-full border-b border-brand-taupe/40 py-2 focus:outline-none focus:border-brand-taupe bg-transparent text-xs text-brand-taupe font-mono" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">Titre Principal *</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingFilm.title} 
                  className="w-full border-b border-brand-taupe/40 py-2 focus:outline-none focus:border-brand-taupe bg-transparent text-sm font-medium" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">Sous-titre (Lieu / Type)</label>
                <input 
                  type="text" 
                  name="subtitle" 
                  defaultValue={editingFilm.subtitle || ''} 
                  className="w-full border-b border-brand-taupe/40 py-2 focus:outline-none focus:border-brand-taupe bg-transparent text-sm" 
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">Badge (Optionnel)</label>
                <input 
                  type="text" 
                  name="badge" 
                  defaultValue={editingFilm.badge || ''} 
                  className="w-full border-b border-brand-taupe/40 py-2 focus:outline-none focus:border-brand-taupe bg-transparent text-xs" 
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">Changer l'image de couverture</label>
                <input 
                  type="file" 
                  name="file" 
                  accept="image/*" 
                  className="w-full text-xs text-brand-ink border border-brand-sand p-1.5 bg-brand-paper rounded-xs cursor-pointer file:mr-2 file:py-1 file:px-2 file:border-0 file:text-[9px] file:uppercase file:tracking-widest file:bg-brand-taupe file:text-white file:rounded-xs mb-1" 
                />
                <input 
                  type="url" 
                  name="url" 
                  defaultValue={editingFilm.url || ''} 
                  className="w-full border-b border-brand-taupe/40 py-2 focus:outline-none focus:border-brand-taupe bg-transparent text-xs text-brand-taupe" 
                  placeholder="Laissez vide pour générer automatiquement"
                />
              </div>

              <div className="md:col-span-2 flex items-center space-x-3 bg-brand-paper p-3 border border-brand-sand rounded-xs">
                <input 
                  type="checkbox" 
                  name="isMain" 
                  id="editIsMain" 
                  defaultChecked={editingFilm.isMain} 
                  className="w-4 h-4 text-brand-taupe accent-brand-taupe" 
                />
                <label htmlFor="editIsMain" className="text-xs font-medium text-brand-ink">
                  Film mis en avant (Sera affiché en grand format sur la page d'accueil)
                </label>
              </div>

              <div className="md:col-span-2 flex space-x-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setEditingFilm(null)} 
                  className="flex-1 border border-brand-sand py-2.5 text-[10px] uppercase tracking-widest text-brand-ink hover:bg-brand-sand/30 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 inline-flex items-center justify-center space-x-2 bg-brand-taupe text-white py-2.5 text-[10px] uppercase tracking-widest hover:bg-brand-ink transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <span>Enregistrer les modifications</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'email' && (
        <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-white p-6 border border-brand-sand shadow-sm">
            <h2 className="text-xl font-serif text-brand-ink mb-1">Emails Automatiques & Confirmation</h2>
            <p className="text-xs text-brand-ink/60 uppercase tracking-widest">
              Personnalisez les textes de l'email de confirmation automatique envoyé aux futurs mariés sans perdre la mise en forme HTML du site.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulaire de personnalisation */}
            <div className="bg-white p-8 border border-brand-sand shadow-sm space-y-6">
              <h3 className="text-lg font-serif text-brand-ink mb-4 border-b border-brand-sand pb-3">
                Champs du Template
              </h3>

              <form onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                const fd = new FormData(e.currentTarget);
                await updateEmailSettings(fd);
                setEmailState({
                  subject: fd.get('subject') as string,
                  introText: fd.get('introText') as string,
                  closingText: fd.get('closingText') as string,
                });
                setLoading(false);
              }} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2 font-medium">
                    Sujet de l'email de confirmation
                  </label>
                  <input 
                    type="text" 
                    name="subject" 
                    value={emailState.subject} 
                    onChange={(e) => setEmailState(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full border-b border-brand-taupe/40 py-2 focus:outline-none focus:border-brand-taupe bg-transparent text-sm font-medium" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2 font-medium">
                    Texte d'introduction / Confirmation
                  </label>
                  <textarea 
                    name="introText" 
                    rows={5}
                    value={emailState.introText} 
                    onChange={(e) => setEmailState(prev => ({ ...prev, introText: e.target.value }))}
                    className="w-full border border-brand-sand p-3 focus:outline-none focus:border-brand-taupe bg-brand-paper/40 text-xs text-brand-ink leading-relaxed rounded-xs" 
                    required 
                  />
                  <p className="text-[10px] text-brand-ink/50 mt-1">
                    Astuce : Utilisez <code className="bg-brand-sand/50 px-1 py-0.5 rounded text-brand-taupe font-mono">{"{{nom}}"}</code> pour inclure le prénom/nom des mariés.
                  </p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2 font-medium">
                    Texte de clôture / Formule de politesse
                  </label>
                  <textarea 
                    name="closingText" 
                    rows={3}
                    value={emailState.closingText} 
                    onChange={(e) => setEmailState(prev => ({ ...prev, closingText: e.target.value }))}
                    className="w-full border border-brand-sand p-3 focus:outline-none focus:border-brand-taupe bg-brand-paper/40 text-xs text-brand-ink leading-relaxed rounded-xs" 
                    required 
                  />
                </div>

                {/* Guide des Balises Dynamiques */}
                <div className="bg-brand-paper p-4 border border-brand-sand rounded-xs space-y-2">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-brand-taupe">
                    Variables Dynamiques Disponibles :
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-brand-ink/70">
                    <div><code className="bg-white px-1.5 py-0.5 border text-brand-ink font-mono text-[11px]">{"{{nom}}"}</code> : Noms des mariés</div>
                    <div><code className="bg-white px-1.5 py-0.5 border text-brand-ink font-mono text-[11px]">{"{{email}}"}</code> : Email du prospect</div>
                    <div><code className="bg-white px-1.5 py-0.5 border text-brand-ink font-mono text-[11px]">{"{{date}}"}</code> : Date du mariage</div>
                    <div><code className="bg-white px-1.5 py-0.5 border text-brand-ink font-mono text-[11px]">{"{{lieu}}"}</code> : Lieu de réception</div>
                    <div><code className="bg-white px-1.5 py-0.5 border text-brand-ink font-mono text-[11px]">{"{{services}}"}</code> : Services choisis</div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full inline-flex items-center justify-center space-x-2 bg-brand-taupe text-white py-3 text-[10px] uppercase tracking-widest hover:bg-brand-ink transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Enregistrement du Template...</span>
                    </>
                  ) : (
                    <span>Enregistrer le Template d'Email</span>
                  )}
                </button>
              </form>
            </div>

            {/* Aperçu en direct du mail HTML */}
            <div className="bg-white p-8 border border-brand-sand shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-brand-sand pb-3">
                <h3 className="text-lg font-serif text-brand-ink">
                  Aperçu du mail (Rendu Réel Client)
                </h3>
                <span className="bg-emerald-50 text-emerald-700 text-[9px] uppercase tracking-widest px-2.5 py-1 border border-emerald-200 rounded-full font-bold">
                  Mise en forme préservée
                </span>
              </div>

              <div className="border border-brand-sand bg-white p-6 shadow-inner rounded-sm font-sans space-y-5 text-sm text-gray-800">
                <div className="border-b border-gray-100 pb-3">
                  <p className="text-xs text-gray-500 font-mono"><strong>Sujet :</strong> {emailState.subject.replace(/{{nom}}/g, 'Camille & Thomas')}</p>
                  <p className="text-xs text-gray-400 font-mono"><strong>De :</strong> Iamyoka &lt;contact@iamyoka.fr&gt;</p>
                </div>

                <h2 className="text-xl font-light text-gray-800 tracking-wide">Bonjour Camille & Thomas,</h2>

                <div className="text-sm text-gray-600 leading-relaxed space-y-2 whitespace-pre-line">
                  {emailState.introText.replace(/{{nom}}/g, 'Camille & Thomas')}
                </div>

                {/* Boîte de récapitulatif stylisée */}
                <div className="bg-neutral-50 p-5 rounded border border-neutral-200 my-4">
                  <h3 className="text-xs uppercase tracking-widest text-brand-taupe font-bold mb-3">Récapitulatif de votre demande</h3>
                  <div className="space-y-1.5 text-xs text-gray-700">
                    <p><strong>Noms :</strong> Camille & Thomas</p>
                    <p><strong>Téléphone :</strong> 06 12 34 56 78</p>
                    <p><strong>Date prévue :</strong> 14/06/2027</p>
                    <p><strong>Lieu :</strong> Domaine de Verchant</p>
                    <p><strong>Services souhaités :</strong> Photo & Film de Mariage</p>
                    <div className="pt-2 border-t border-neutral-200 mt-2">
                      <strong>Votre message :</strong>
                      <p className="italic text-gray-500 border-l-2 border-brand-taupe pl-3 mt-1">
                        "Bonjour Iamyoka, nous adorons votre style cinématique..."
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line pt-2">
                  {emailState.closingText.replace(/{{nom}}/g, 'Camille & Thomas')}
                </div>

                <div className="border-t border-gray-200 pt-4 text-center">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Ceci est un message automatique, vous serez recontacté prochainement.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
