"use server";

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getFaqs() {
  let faqs = await prisma.faqItem.findMany({
    orderBy: { order: 'asc' }
  });
  
  if (faqs.length === 0) {
    const initialFaqs = [
      {
        question: "Combien de temps à l'avance devons-nous réserver ?",
        answer: "Nous vous conseillons de nous contacter 9 à 12 mois avant la date de votre mariage. Notre calendrier se remplit rapidement, particulièrement pour la haute saison (de mai à septembre)."
      },
      {
        question: "Vous déplacez-vous en dehors de Toulouse ?",
        answer: "Absolument ! Bien que basés à Toulouse, nous adorons voyager. Nous couvrons des mariages dans toute la France et à l'international (les frais de déplacement et d'hébergement seront calculés sur mesure)."
      },
      {
        question: "Combien de photos ou quelle durée de film allons-nous recevoir ?",
        answer: "Cela dépend de la collection choisie. Pour la photographie, comptez entre 400 et 800 photos retouchées. Pour la vidéo, nos films longs varient de 10 à 20 minutes, avec un teaser de 1 à 3 minutes. Le plus important pour nous reste toujours la qualité plutôt que la quantité."
      },
      {
        question: "Travaillez-vous toujours en binôme ?",
        answer: "Si vous choisissez nos offres combinant Photo et Vidéo, nous serons toujours au minimum deux. C'est essentiel pour couvrir la journée sous différents angles et garantir l'esthétique cinématographique qui fait notre signature."
      },
      {
        question: "Quels sont vos délais de livraison ?",
        answer: "Nous apportons un soin extrêmement méticuleux à la post-production (tri, colorimétrie, montage). Les teasers vidéos ou un premier aperçu photo sont souvent livrés sous 72h. L'œuvre complète vous sera remise entre 4 et 8 semaines après votre mariage."
      }
    ];

    for (let i = 0; i < initialFaqs.length; i++) {
        await prisma.faqItem.create({
            data: { question: initialFaqs[i].question, answer: initialFaqs[i].answer, order: i }
        });
    }
    faqs = await prisma.faqItem.findMany({ orderBy: { order: 'asc' } });
  }

  return faqs;
}

export async function addFaq(formData: FormData) {
  const question = formData.get('question') as string;
  const answer = formData.get('answer') as string;

  if (!question || !answer) return { error: "Données invalides" };

  const lastFaq = await prisma.faqItem.findFirst({
    orderBy: { order: 'desc' }
  });
  
  const nextOrder = lastFaq ? lastFaq.order + 1 : 0;

  await prisma.faqItem.create({
    data: { question, answer, order: nextOrder }
  });

  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deleteFaq(id: string) {
  await prisma.faqItem.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function updateFaq(formData: FormData) {
  const id = formData.get('id') as string;
  const question = formData.get('question') as string;
  const answer = formData.get('answer') as string;

  if (!id || !question || !answer) return { error: "Données invalides" };

  await prisma.faqItem.update({
    where: { id },
    data: { question, answer }
  });

  revalidatePath('/');
  revalidatePath('/admin');
}

export async function moveFaq(id: string, direction: 'up' | 'down') {
  const current = await prisma.faqItem.findUnique({ where: { id } });
  if (!current) return;

  const faqs = await prisma.faqItem.findMany({ orderBy: { order: 'asc' } });
  const index = faqs.findIndex(f => f.id === id);

  if (direction === 'up' && index > 0) {
    const prev = faqs[index - 1];
    await prisma.$transaction([
      prisma.faqItem.update({ where: { id: current.id }, data: { order: prev.order } }),
      prisma.faqItem.update({ where: { id: prev.id }, data: { order: current.order } }),
    ]);
  } else if (direction === 'down' && index < faqs.length - 1) {
    const next = faqs[index + 1];
    await prisma.$transaction([
      prisma.faqItem.update({ where: { id: current.id }, data: { order: next.order } }),
      prisma.faqItem.update({ where: { id: next.id }, data: { order: current.order } }),
    ]);
  }

  revalidatePath('/');
  revalidatePath('/admin');
}
