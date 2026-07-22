"use server";

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

export async function getQuiz() {
  const questions = await prisma.quizQuestion.findMany({
    include: {
      options: true
    },
    orderBy: {
      order: 'asc'
    }
  });

  if (questions.length === 0) {
    try {
      const dbPath = path.join(process.cwd(), 'src/data/quiz.json');
      if (fs.existsSync(dbPath)) {
        const data = fs.readFileSync(dbPath, 'utf8');
        const initialQuiz = JSON.parse(data);
        for (let i = 0; i < initialQuiz.questions.length; i++) {
          const q = initialQuiz.questions[i];
          await prisma.quizQuestion.create({
            data: {
              id: q.id,
              title: q.title,
              subtitle: q.subtitle,
              order: i,
              options: {
                create: q.options.map((opt: any) => ({
                  id: opt.id,
                  styleId: opt.styleId,
                  imageUrl: opt.imageUrl
                }))
              }
            }
          });
        }
        return { questions: await prisma.quizQuestion.findMany({ include: { options: true }, orderBy: { order: 'asc' } }) };
      }
    } catch(e) { console.error("Error migrating quiz:", e); }
    return { questions: [] };
  }

  return { questions };
}

export async function updateQuestion(data: FormData) {
  const questionId = data.get('questionId') as string;
  const title = data.get('title') as string;
  const subtitle = data.get('subtitle') as string;

  if (!questionId) return { error: "Question ID missing" };

  await prisma.quizQuestion.update({
    where: { id: questionId },
    data: { title, subtitle }
  });

  const styles = ['documentaire', 'editorial', 'cinematique', 'fineart'];
  for (const style of styles) {
    const imageUrl = data.get(`${style}Img`) as string;
    if (imageUrl) {
      const option = await prisma.quizOption.findFirst({
        where: { questionId, styleId: style }
      });
      if (option) {
        await prisma.quizOption.update({
          where: { id: option.id },
          data: { imageUrl }
        });
      } else {
        await prisma.quizOption.create({
          data: {
            questionId,
            styleId: style,
            imageUrl
          }
        });
      }
    }
  }

  revalidatePath('/admin');
  revalidatePath('/quiz');
  return { success: true };
}

export async function getLeads() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // Seed leads if empty (optional migration)
  if (leads.length === 0) {
    try {
      const dbPath = path.join(process.cwd(), 'src/data/leads.json');
      if (fs.existsSync(dbPath)) {
        const data = fs.readFileSync(dbPath, 'utf8');
        const initialLeads = JSON.parse(data);
        for (const lead of initialLeads) {
          await prisma.lead.create({
            data: {
              id: lead.id,
              names: lead.names,
              email: lead.email,
              phone: lead.phone || null,
              date: lead.date || null,
              styleResult: lead.styleResult,
              createdAt: new Date(lead.createdAt)
            }
          });
        }
        return await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
      }
    } catch(e) { console.error("Error migrating leads:", e); }
  }

  return leads;
}

export async function addLead(data: FormData) {
  const names = data.get('names') as string;
  const email = data.get('email') as string;
  const phone = data.get('phone') as string;
  const date = data.get('date') as string;
  const styleResult = data.get('styleResult') as string;

  if (!names || !email || !phone) return { error: "Names, email and phone are required" };

  await prisma.lead.create({
    data: {
      names,
      email,
      phone,
      date: date || "Non précisée",
      styleResult
    }
  });

  revalidatePath('/admin');
  return { success: true };
}
