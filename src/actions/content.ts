"use server";

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type SectionLayout = 'concept' | 'about' | 'text_only' | 'image_left';

export interface SectionData {
  id: string;
  layout: SectionLayout;
  subtitle: string;
  titleHtml: string;
  contentHtml: string;
  imageUrl: string;
  placement?: 'top' | 'bottom';
}

export async function getSections(): Promise<SectionData[]> {
  const setting = await prisma.setting.findUnique({
    where: { key: 'home_sections' }
  });

  if (setting) {
    try {
      return JSON.parse(setting.value);
    } catch (e) {
      return [];
    }
  }

  // Migration from old keys
  const oldSettings = await prisma.setting.findMany({
    where: {
      key: {
        in: [
          'concept_subtitle', 'concept_title_line1', 'concept_title_line2', 
          'concept_p1', 'concept_p2', 'concept_p3', 'concept_image',
          'about_subtitle', 'about_title', 'about_p1', 'about_p2', 'about_p3', 'about_image'
        ]
      }
    }
  });

  if (oldSettings.length === 0) return []; // No old data

  const old: Record<string, string> = {};
  oldSettings.forEach(s => { old[s.key] = s.value; });

  const migratedSections: SectionData[] = [];
  
  // Concept
  if (old.concept_title_line1 || old.concept_subtitle) {
    migratedSections.push({
      id: 'concept_migrated',
      layout: 'concept',
      subtitle: old.concept_subtitle || "Notre Approche",
      titleHtml: `${old.concept_title_line1 || "Documentaire"}<br/><span class="italic text-brand-taupe">${old.concept_title_line2 || "Cinématographique"}</span>`,
      contentHtml: `<p>${old.concept_p1 || ""}</p><p>${old.concept_p2 || ""}</p><p class="font-medium text-brand-ink mt-8">${old.concept_p3 || ""}</p>`,
      imageUrl: old.concept_image || "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1974&auto=format&fit=crop"
    });
  }

  // About
  if (old.about_title || old.about_subtitle) {
    migratedSections.push({
      id: 'about_migrated',
      layout: 'about',
      subtitle: old.about_subtitle || "La Vision derrière la caméra",
      titleHtml: old.about_title || "Apprenez-en plus sur Iamyoka",
      contentHtml: `<p>${old.about_p1 || ""}</p><p>${old.about_p2 || ""}</p><p>${old.about_p3 || ""}</p>`,
      imageUrl: old.about_image || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200"
    });
  }

  await prisma.setting.create({
    data: {
      key: 'home_sections',
      value: JSON.stringify(migratedSections)
    }
  });

  return migratedSections;
}

export async function saveSections(sections: SectionData[]) {
  await prisma.setting.upsert({
    where: { key: 'home_sections' },
    update: { value: JSON.stringify(sections) },
    create: { key: 'home_sections', value: JSON.stringify(sections) }
  });
  
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}
