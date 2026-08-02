import { isAuthenticated, login, logout } from '@/actions/auth';
import { getMedia } from '@/actions/media';
import { getQuiz, getLeads } from '@/actions/quiz';
import { getFaqs } from '@/actions/faq';
import { getEmailSettings } from '@/actions/contact';
import { getSections } from '@/actions/content';
import AdminDashboard from '@/components/AdminDashboard';
import PasswordInput from '@/components/PasswordInput';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const isAuth = await isAuthenticated();

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-paper px-4">
        <div className="bg-white p-8 md:p-12 shadow-xl max-w-md w-full border border-brand-sand">
          <h1 className="text-3xl font-serif text-brand-ink text-center mb-8">Administration</h1>
          <form action={async (formData) => {
            "use server";
            const res = await login(formData);
            if (res?.success) redirect('/admin');
          }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-brand-ink/70 mb-2">Mot de passe</label>
              <PasswordInput />
            </div>
            <button type="submit" className="w-full bg-brand-ink text-brand-paper py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-brand-taupe transition-colors">Se connecter</button>
          </form>
        </div>
      </div>
    );
  }

  const media = await getMedia();
  const quiz = await getQuiz();
  const leads = await getLeads();
  const faqs = await getFaqs();
  const emailSettings = await getEmailSettings();
  const sections = await getSections();

  return (
    <div className="min-h-screen bg-brand-paper">
      <header className="bg-white border-b border-brand-sand py-6 px-6 md:px-12 flex justify-between items-center">
        <h1 className="text-2xl font-serif text-brand-ink">Iamyoka Admin</h1>
        <form action={async () => {
          "use server";
          await logout();
          redirect('/admin');
        }}>
          <button type="submit" className="text-xs uppercase tracking-widest text-brand-taupe hover:text-brand-ink transition-colors">Déconnexion</button>
        </form>
      </header>
      
      <main className="w-full mx-auto py-12 px-4 md:px-8">
        <AdminDashboard 
          initialMedia={media} 
          initialQuiz={quiz} 
          initialLeads={leads} 
          initialFaqs={faqs} 
          initialEmailSettings={emailSettings}
          initialSections={sections} 
        />
      </main>
    </div>
  );
}
