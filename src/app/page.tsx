import Header from "@/components/Header";
import Hero from "@/components/Hero";
import DynamicSections from "@/components/DynamicSections";
import Processus from "@/components/Processus";
import Salon from "@/components/Salon";
import PortfolioFilms from "@/components/PortfolioFilms";
import PortfolioPhotos from "@/components/PortfolioPhotos";
import Conseils from "@/components/Conseils";
import Tarifs from "@/components/Tarifs";
import Temoignages from "@/components/Temoignages";
import Faq from "@/components/Faq";
import CinemaOption from "@/components/CinemaOption";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Animations from "@/components/Animations";
import { getFaqs } from "@/actions/faq";
import { getSections } from "@/actions/content";

export default async function Home() {
  const faqs = await getFaqs();
  const sections = await getSections();

  return (
    <main>
      <Animations />
      <Header />
      <Hero />
      <DynamicSections sections={sections.filter(s => s.placement === 'top' || (!s.placement && s.layout === 'concept'))} />
      <Processus />
      <Salon />
      <PortfolioFilms />
      <PortfolioPhotos />
      <DynamicSections sections={sections.filter(s => s.placement === 'bottom' || (!s.placement && (s.layout === 'about' || s.layout !== 'concept')))} />
      <Conseils />
      <Tarifs />
      <CinemaOption />
      <Temoignages />
      <Faq faqs={faqs} />
      <Contact />
      <Footer />
    </main>
  );
}

