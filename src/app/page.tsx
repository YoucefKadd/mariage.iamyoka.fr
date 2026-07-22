import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Concept from "@/components/Concept";
import Processus from "@/components/Processus";
import Salon from "@/components/Salon";
import PortfolioFilms from "@/components/PortfolioFilms";
import PortfolioPhotos from "@/components/PortfolioPhotos";
import APropos from "@/components/APropos";
import Conseils from "@/components/Conseils";
import Tarifs from "@/components/Tarifs";
import Temoignages from "@/components/Temoignages";
import Faq from "@/components/Faq";
import CinemaOption from "@/components/CinemaOption";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Animations from "@/components/Animations";
import { getFaqs } from "@/actions/faq";

export default async function Home() {
  const faqs = await getFaqs();

  return (
    <main>
      <Animations />
      <Header />
      <Hero />
      <Concept />
      <Processus />
      <Salon />
      <PortfolioFilms />
      <PortfolioPhotos />
      <APropos />
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

