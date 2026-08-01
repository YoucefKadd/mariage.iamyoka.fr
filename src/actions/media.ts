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

  const formattedFilms = films.map(f => ({
    ...f,
    ytId: f.youtubeUrl ? extractYouTubeId(f.youtubeUrl) : null
  }));

  return {
    heroVideo: heroSetting?.value || null,
    heroYtId: heroSetting?.value ? extractYouTubeId(heroSetting.value) : null,
    photos,
    films: formattedFilms
  };
}

async function processImageUpload(data: FormData): Promise<string | null> {
  const file = data.get('file') as File | null;
  const urlInput = data.get('url') as string | null;

  if (file && file.size > 0 && file.name) {
    try {
      const rawBytes = await file.arrayBuffer();
      let buffer = Buffer.from(rawBytes);

      // Compression & Optimisation automatique de l'image avec Sharp (WebP @ 82% qualité, max 2000px)
      try {
        const sharp = require('sharp');
        buffer = await sharp(buffer)
          .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 82 })
          .toBuffer();
      } catch (sharpError) {
        console.warn("Sharp fallback:", sharpError);
      }

      if (process.env.NODE_ENV !== 'production' && !process.env.HOSTINGER_UPLOAD_URL) {
        // Local development without Hostinger configuration
        const filename = `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}.webp`;
        const publicPath = `/uploads/${filename}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, buffer);
        return publicPath;
      } else if (process.env.HOSTINGER_UPLOAD_URL) {
        // Upload to Hostinger API
        const hostingerFormData = new FormData();
        // Construct a Blob for fetch FormData
        const blob = new Blob([buffer], { type: 'image/webp' });
        hostingerFormData.append('file', blob, file.name.replace(/\.[^/.]+$/, "") + '.webp');
        if (process.env.HOSTINGER_UPLOAD_SECRET) {
          hostingerFormData.append('secret', process.env.HOSTINGER_UPLOAD_SECRET);
        }
        
        try {
          const response = await fetch(process.env.HOSTINGER_UPLOAD_URL, {
            method: 'POST',
            body: hostingerFormData,
          });
          
          if (!response.ok) {
             const errText = await response.text();
             console.error(`Hostinger upload failed: ${response.status} ${errText}`);
             return null;
          }
          
          const result = await response.json();
          if (result.success && result.url) {
             return result.url;
          } else {
             console.error(`Invalid response from Hostinger:`, result);
             return null;
          }
        } catch (error) {
          console.error("Error uploading to Hostinger:", error);
          return null;
        }
      } else {
        // Netlify Production without Hostinger URL - Fallback to Base64 in MySQL
        return `data:image/webp;base64,${buffer.toString('base64')}`;
      }
    } catch (err) {
      console.error("Local upload write error, using base64 fallback:", err);
      const rawBytes = await file.arrayBuffer();
      let buffer = Buffer.from(rawBytes);
      try {
        const sharp = require('sharp');
        buffer = await sharp(buffer)
          .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();
      } catch (e) {}
      return `data:image/webp;base64,${buffer.toString('base64')}`;
    }
  }

  return urlInput || null;
}

export async function addPhoto(data: FormData) {
  const finalUrl = await processImageUpload(data);
  const title = data.get('title') as string;
  if (!finalUrl) return { error: "Une image (fichier ou lien URL) est obligatoire" };

  const count = await prisma.photo.count();
  await prisma.photo.create({
    data: { url: finalUrl, title: title || '', order: count }
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

export async function updatePhoto(data: FormData) {
  const id = data.get('id') as string;
  const newUrl = await processImageUpload(data);
  const title = data.get('title') as string;

  if (!id) return { error: "L'identifiant est obligatoire" };

  const existing = await prisma.photo.findUnique({ where: { id } });
  const finalUrl = newUrl || existing?.url;

  if (!finalUrl) return { error: "Une image est obligatoire" };

  await prisma.photo.update({
    where: { id },
    data: { url: finalUrl, title: title || '' }
  });

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
  const uploadedUrl = await processImageUpload(data);
  const youtubeUrl = data.get('youtubeUrl') as string;
  const title = data.get('title') as string;
  const subtitle = data.get('subtitle') as string;
  const badge = data.get('badge') as string;
  const isMain = data.get('isMain') === 'on';

  if (!youtubeUrl || !title) return { error: "YouTube URL and Title are required" };

  let finalUrl = uploadedUrl;
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

export async function updatePhotosOrder(orderedIds: string[]) {
  if (!orderedIds || orderedIds.length === 0) return { error: "No IDs provided" };

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.photo.update({
        where: { id },
        data: { order: index }
      })
    )
  );

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function updateFilmsOrder(orderedIds: string[]) {
  if (!orderedIds || orderedIds.length === 0) return { error: "No IDs provided" };

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.film.update({
        where: { id },
        data: { order: index }
      })
    )
  );

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function updateFilm(data: FormData) {
  const id = data.get('id') as string;
  const youtubeUrl = data.get('youtubeUrl') as string;
  const uploadedUrl = await processImageUpload(data);
  const title = data.get('title') as string;
  const subtitle = data.get('subtitle') as string;
  const badge = data.get('badge') as string;
  const isMain = data.get('isMain') === 'on';

  if (!id || !youtubeUrl || !title) return { error: "ID, YouTube URL and Title are required" };

  let finalUrl = uploadedUrl;
  if (!finalUrl) {
    const ytId = extractYouTubeId(youtubeUrl);
    if (ytId) {
      finalUrl = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
    }
  }

  await prisma.film.update({
    where: { id },
    data: {
      youtubeUrl,
      url: finalUrl || null,
      title,
      subtitle: subtitle || null,
      badge: badge || null,
      isMain
    }
  });

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}
