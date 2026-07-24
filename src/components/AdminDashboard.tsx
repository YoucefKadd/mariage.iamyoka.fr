"use client";

import { useState, useRef } from 'react';
import { addPhoto, deletePhoto, addFilm, deleteFilm, updateHeroVideo, movePhoto, moveFilm } from '@/actions/media';
import { updateQuestion, deleteLeads } from '@/actions/quiz';
import { addFaq, updateFaq, deleteFaq, moveFaq } from '@/actions/faq';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AdminDashboard({ initialMedia, initialQuiz, initialLeads, initialFaqs }: { initialMedia: any, initialQuiz: any, initialLeads: any[], initialFaqs: any[] }) {
  const [activeTab, setActiveTab] = useState<'hero' | 'photos' | 'films' | 'quiz' | 'leads' | 'faq'>('leads');
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
                <h2 className="text-xl font-serif">Galerie Photos ({initialMedia.photos.length})</h2>
                <p className="text-xs text-brand-ink/60 uppercase tracking-widest mt-1">Gérez le portfolio photo</p>
             </div>
             <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-brand-taupe text-white px-6 py-2 text-[10px] uppercase tracking-widest hover:bg-brand-ink transition-colors"
             >
                {showAddForm ? 'Fermer' : '+ Ajouter une photo'}
             </button>
          </div>

          {/* Formulaire Ajout Photo (Caché par défaut) */}
          {showAddForm && (
            <div className="bg-white p-8 border border-brand-sand shadow-sm animate-[fadeIn_0.3s_ease-out]">
              <h2 className="text-xl font-serif mb-6">Ajouter une nouvelle photo</h2>
              <form ref={photoFormRef} action={async (fd) => { await handleAddPhoto(fd); setShowAddForm(false); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">URL de l'image (Unsplash, Cloudinary, etc.)</label>
                  <input type="url" name="url" className="w-full border-b border-brand-taupe/40 py-2 focus:outline-none focus:border-brand-taupe bg-transparent" required />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">Titre / Description courte</label>
                  <input type="text" name="title" className="w-full border-b border-brand-taupe/40 py-2 focus:outline-none focus:border-brand-taupe bg-transparent" placeholder="Ex: Les Préparatifs" required />
                </div>
                <div className="md:col-span-2">
                  <button type="submit" disabled={loading} className="bg-brand-taupe text-white px-8 py-3 text-[10px] uppercase tracking-widest hover:bg-brand-ink transition-colors disabled:opacity-50">
                    {loading ? 'Ajout en cours...' : 'Ajouter la photo'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Grille des photos actuelles */}
          <div className="bg-white p-6 border border-brand-sand shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {initialMedia.photos.map((photo: any, index: number) => (
                <div key={photo.id} className="relative group bg-white p-2 border border-brand-sand">
                  <img src={photo.url} alt={photo.title} className="w-full h-40 object-cover" />
                  <p className="mt-2 text-xs font-medium truncate">{photo.title}</p>
                  
                  <div className="absolute top-2 left-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {index > 0 && (
                      <button 
                        onClick={async () => await movePhoto(photo.id, 'up')}
                        className="bg-brand-ink text-white w-8 h-8 flex items-center justify-center rounded-sm hover:bg-brand-taupe shadow-md"
                        title="Monter"
                      >
                        ↑
                      </button>
                    )}
                    {index < initialMedia.photos.length - 1 && (
                      <button 
                        onClick={async () => await movePhoto(photo.id, 'down')}
                        className="bg-brand-ink text-white w-8 h-8 flex items-center justify-center rounded-sm hover:bg-brand-taupe shadow-md"
                        title="Descendre"
                      >
                        ↓
                      </button>
                    )}
                  </div>

                  <button 
                    onClick={async () => await deletePhoto(photo.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    title="Supprimer"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'films' && (
        <div className="space-y-8">
          {/* Header & Bouton Ajouter */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-brand-sand shadow-sm">
             <div>
                <h2 className="text-xl font-serif">Films de Mariage ({initialMedia.films.length})</h2>
                <p className="text-xs text-brand-ink/60 uppercase tracking-widest mt-1">Gérez le portfolio vidéo</p>
             </div>
             <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-brand-taupe text-white px-6 py-2 text-[10px] uppercase tracking-widest hover:bg-brand-ink transition-colors"
             >
                {showAddForm ? 'Fermer' : '+ Ajouter un film'}
             </button>
          </div>

          {/* Formulaire Ajout Film */}
          {showAddForm && (
            <div className="bg-white p-8 border border-brand-sand shadow-sm animate-[fadeIn_0.3s_ease-out]">
              <h2 className="text-xl font-serif mb-6">Ajouter un nouveau film</h2>
              <form ref={filmFormRef} action={async (fd) => { await handleAddFilm(fd); setShowAddForm(false); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">Lien YouTube de la vidéo</label>
                  <input type="url" name="youtubeUrl" className="w-full border-b border-brand-taupe/40 py-2 focus:outline-none focus:border-brand-taupe bg-transparent" placeholder="https://youtube.com/watch?v=..." required />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-brand-ink/50 mb-2">Image de couverture (Optionnel)</label>
                  <input type="url" name="url" className="w-full border-b border-brand-taupe/40 py-2 focus:outline-none focus:border-brand-taupe bg-transparent" placeholder="Laissée vide, elle sera générée" />
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
                  <button type="submit" disabled={loading} className="bg-brand-taupe text-white px-8 py-3 text-[10px] uppercase tracking-widest hover:bg-brand-ink transition-colors disabled:opacity-50">
                    {loading ? 'Ajout en cours...' : 'Ajouter le film'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Liste des films actuels */}
          <div className="bg-white p-6 border border-brand-sand shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {initialMedia.films.map((film: any, index: number) => (
                <div key={film.id} className="relative group bg-white p-2 border border-brand-sand">
                  <div className="relative">
                    <img src={film.url} alt={film.title} className="w-full h-40 object-cover" />
                    {film.isMain && <span className="absolute top-2 right-2 bg-brand-taupe text-white text-[8px] uppercase px-2 py-1">À la une</span>}
                  </div>
                  <div className="p-3">
                    <p className="font-serif text-lg">{film.title}</p>
                    <p className="text-xs text-brand-ink/60">{film.subtitle}</p>
                  </div>
                  
                  <div className="absolute top-2 left-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {index > 0 && (
                      <button 
                        onClick={async () => await moveFilm(film.id, 'up')}
                        className="bg-brand-ink text-white w-8 h-8 flex items-center justify-center rounded-sm hover:bg-brand-taupe shadow-md"
                        title="Monter"
                      >
                        ↑
                      </button>
                    )}
                    {index < initialMedia.films.length - 1 && (
                      <button 
                        onClick={async () => await moveFilm(film.id, 'down')}
                        className="bg-brand-ink text-white w-8 h-8 flex items-center justify-center rounded-sm hover:bg-brand-taupe shadow-md"
                        title="Descendre"
                      >
                        ↓
                      </button>
                    )}
                  </div>

                  <button 
                    onClick={async () => await deleteFilm(film.id)}
                    className="absolute bottom-4 right-4 bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    title="Supprimer"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
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

    </div>
  );
}
