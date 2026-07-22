"use client";

import { useState, useRef } from 'react';
import { addPhoto, deletePhoto, addFilm, deleteFilm, updateHeroVideo, movePhoto, moveFilm } from '@/actions/media';
import { updateQuestion } from '@/actions/quiz';
import { addFaq, updateFaq, deleteFaq, moveFaq } from '@/actions/faq';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AdminDashboard({ initialMedia, initialQuiz, initialLeads, initialFaqs }: { initialMedia: any, initialQuiz: any, initialLeads: any[], initialFaqs: any[] }) {
  const [activeTab, setActiveTab] = useState<'hero' | 'photos' | 'films' | 'quiz' | 'leads' | 'faq'>('leads');
  const [loading, setLoading] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
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
    const doc = new jsPDF();
    doc.text("Contacts - IAMYOKA", 14, 20);
    const tableColumn = ["Date", "Noms", "Contact", "Projet (Date/Lieu)", "Source"];
    const tableRows = initialLeads.map(lead => [
      new Date(lead.createdAt).toLocaleDateString('fr-FR'),
      lead.names,
      `${lead.email}\n${lead.phone || ''}`,
      `${lead.date}\n${lead.location || ''}`,
      lead.styleResult
    ]);
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [173, 154, 137] }, // brand-taupe
    });
    doc.save("contacts.pdf");
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 space-y-8 bg-white p-6 border border-brand-sand shadow-sm sticky top-6">
        
        {/* Catégorie 1: Relation Client */}
        <div>
          <h3 className="text-[9px] uppercase tracking-[0.2em] text-brand-ink/40 mb-3 font-medium">Relation Client</h3>
          <div className="space-y-1">
            <button 
              onClick={() => { setActiveTab('leads'); setShowAddForm(false); }} 
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
              onClick={() => { setActiveTab('hero'); setShowAddForm(false); }} 
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${activeTab === 'hero' ? 'bg-brand-taupe/10 text-brand-taupe font-medium' : 'text-brand-ink hover:bg-brand-sand/30'}`}
            >
              Vidéo d'Accueil
            </button>
            <button 
              onClick={() => { setActiveTab('photos'); setShowAddForm(false); }} 
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${activeTab === 'photos' ? 'bg-brand-taupe/10 text-brand-taupe font-medium' : 'text-brand-ink hover:bg-brand-sand/30'}`}
            >
              Galerie Photos
            </button>
            <button 
              onClick={() => { setActiveTab('films'); setShowAddForm(false); }} 
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
              onClick={() => { setActiveTab('faq'); setShowAddForm(false); }} 
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${activeTab === 'faq' ? 'bg-brand-taupe/10 text-brand-taupe font-medium' : 'text-brand-ink hover:bg-brand-sand/30'}`}
            >
              Questions Fréquentes
            </button>
            <button 
              onClick={() => { setActiveTab('quiz'); setShowAddForm(false); }} 
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${activeTab === 'quiz' ? 'bg-brand-taupe/10 text-brand-taupe font-medium' : 'text-brand-ink hover:bg-brand-sand/30'}`}
            >
              Paramétrage du Quiz
            </button>
          </div>
        </div>

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
            <div className="bg-white p-8 border border-brand-sand shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-xl font-serif mb-2">Boîte de Réception ({initialLeads?.length || 0})</h2>
                        <p className="text-xs text-brand-ink/60 uppercase tracking-widest">Contacts issus du formulaire et du quiz</p>
                    </div>
                    {initialLeads && initialLeads.length > 0 && (
                        <div className="flex space-x-4">
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
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="border-b border-brand-sand">
                                    <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-brand-ink/50 font-medium w-24">Date</th>
                                    <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-brand-ink/50 font-medium min-w-[150px]">Contact</th>
                                    <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-brand-ink/50 font-medium min-w-[150px]">Projet (Date/Lieu)</th>
                                    <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-brand-ink/50 font-medium w-24">Source</th>
                                    <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-brand-ink/50 font-medium min-w-[200px]">Style / Services</th>
                                    <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-brand-taupe font-bold min-w-[250px]">Message</th>
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

                                    return (
                                    <tr key={lead.id} className="border-b border-brand-sand/50 hover:bg-brand-sand/20 transition-colors">
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
    </div>
  );
}
