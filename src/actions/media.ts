"use server";

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

export async function getMedia() {
  const photos = await prisma.photo.findMany({ orderBy: { order: 'asc' } });
  const films = await prisma.film.findMany({ orderBy: { order: 'asc' } });
  const heroSetting = await prisma.setting.findUnique({ where: { key: 'heroVideo' } });

  // Migration from local json if DB is completely empty
  if (photos.length === 0 && films.length === 0 && !heroSetting) {
    try {
      const dbPath = path.join(process.cwd(), 'src/data/media.json');
      if (fs.existsSync(dbPath)) {
        const data = fs.readFileSync(dbPath, 'utf8');
        const media = JSON.parse(data);

        if (media.heroVideo) {
          await prisma.setting.create({ data: { key: 'heroVideo', value: media.heroVideo } });
        }

        for (let i = 0; i < media.photos.length; i++) {
          await prisma.photo.create({
            data: { id: media.photos[i].id, url: media.photos[i].url, title: media.photos[i].title || '', order: i }
          });
        }

        for (let i = 0; i < media.films.length; i++) {
          const f = media.films[i];
          await prisma.film.create({
            data: {
              id: f.id,
              url: f.url || null,
              youtubeUrl: f.youtubeUrl || '',
              title: f.title,
              subtitle: f.subtitle || null,
              badge: f.badge || null,
              isMain: f.isMain || false,
              order: i
            }
          });
        }
        
        return {
          heroVideo: media.heroVideo || null,
          photos: await prisma.photo.findMany({ orderBy: { order: 'asc' } }),
          films: await prisma.film.findMany({ orderBy: { order: 'asc' } })
        };
      }
    } catch (e) { console.error("Error migrating media:", e); }
  }

  return {
    heroVideo: heroSetting?.value || null,
    heroYtId: heroSetting?.value ? extractYouTubeId(heroSetting.value) : null,
    photos,
    films
  };
}

export async function addPhoto(data: FormData) {
  const url = data.get('url') as string;
  const title = data.get('title') as string;
  if (!url) return { error: "URL is required" };

  const count = await prisma.photo.count();
  await prisma.photo.create({
    data: { url, title, order: count }
  });

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function deletePhoto(id: string) {
  await prisma.photo.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

function extractYouTubeId(url: string) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function addFilm(data: FormData) {
  const url = data.get('url') as string;
  const youtubeUrl = data.get('youtubeUrl') as string;
  const title = data.get('title') as string;
  const subtitle = data.get('subtitle') as string;
  const badge = data.get('badge') as string;
  const isMain = data.get('isMain') === 'on';

  if (!youtubeUrl || !title) return { error: "YouTube URL and Title are required" };

  let finalUrl = url;
  if (!finalUrl) {
      const ytId = extractYouTubeId(youtubeUrl);
      if (ytId) {
          finalUrl = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
      }
  }

  const count = await prisma.film.count();
  await prisma.film.create({
    data: {
      url: finalUrl,
      youtubeUrl,
      title,
      subtitle,
      badge,
      isMain,
      order: count
    }
  });

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function deleteFilm(id: string) {
  await prisma.film.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function updateHeroVideo(data: FormData) {
  const url = data.get('url') as string;
  if (!url) return { error: "URL is required" };

  let finalUrl = url;
  const ytId = extractYouTubeId(url);
  if (ytId) {
    finalUrl = `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&modestbranding=1&showinfo=0&rel=0`;
  }

  await prisma.setting.upsert({
    where: { key: 'heroVideo' },
    update: { value: finalUrl },
    create: { key: 'heroVideo', value: finalUrl }
  });

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function movePhoto(id: string, direction: 'up' | 'down') {
  const photos = await prisma.photo.findMany({ orderBy: { order: 'asc' } });
  const index = photos.findIndex(p => p.id === id);
  if (index === -1) return { error: "Not found" };

  if (direction === 'up' && index > 0) {
    await prisma.$transaction([
      prisma.photo.update({ where: { id: photos[index].id }, data: { order: index - 1 } }),
      prisma.photo.update({ where: { id: photos[index - 1].id }, data: { order: index } })
    ]);
  } else if (direction === 'down' && index < photos.length - 1) {
    await prisma.$transaction([
      prisma.photo.update({ where: { id: photos[index].id }, data: { order: index + 1 } }),
      prisma.photo.update({ where: { id: photos[index + 1].id }, data: { order: index } })
    ]);
  }

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function moveFilm(id: string, direction: 'up' | 'down') {
  const films = await prisma.film.findMany({ orderBy: { order: 'asc' } });
  const index = films.findIndex(f => f.id === id);
  if (index === -1) return { error: "Not found" };

  if (direction === 'up' && index > 0) {
    await prisma.$transaction([
      prisma.film.update({ where: { id: films[index].id }, data: { order: index - 1 } }),
      prisma.film.update({ where: { id: films[index - 1].id }, data: { order: index } })
    ]);
  } else if (direction === 'down' && index < films.length - 1) {
    await prisma.$transaction([
      prisma.film.update({ where: { id: films[index].id }, data: { order: index + 1 } }),
      prisma.film.update({ where: { id: films[index + 1].id }, data: { order: index } })
    ]);
  }

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}
