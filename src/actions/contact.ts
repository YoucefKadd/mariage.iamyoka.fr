"use server";

import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function submitContactForm(data: FormData) {
  const names = data.get('name') as string;
  const email = data.get('email') as string;
  const phone = data.get('phone') as string;
  const date = data.get('date') as string;
  const location = data.get('location') as string;
  const message = data.get('message') as string;
  const services = data.getAll('services') as string[];

  const servicesText = services.length > 0 ? services.join(', ') : 'Aucun service spécifique coché';

  if (!names || !email || !message) {
    return { error: "Vos noms, votre email et votre message sont requis." };
  }

  try {
    // 1. Sauvegarder dans la BDD (Lead)
    await prisma.lead.create({
      data: {
        names,
        email,
        phone: phone || null,
        date: date || "Non précisée",
        location: location || "Non précisé",
        message,
        styleResult: services.length > 0 ? `Contact (${services.join(' / ')})` : "Formulaire Contact",
      }
    });

    // 2. Envoyer l'email
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Iamyoka Website" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Envoyé à la même adresse
      subject: `Nouveau contact : ${names} - Iamyoka`,
      text: `Nouveau message de contact via le site web :\n\nNoms : ${names}\nEmail : ${email}\nTéléphone : ${phone}\nDate : ${date}\nLieu : ${location}\nServices souhaités : ${servicesText}\n\nMessage :\n${message}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-top: 4px solid #8a7a67; border-radius: 4px;">
          <h2 style="font-weight: 300; letter-spacing: 1px; color: #333; margin-top: 0;">Nouveau prospect (Formulaire)</h2>
          <p style="color: #666; font-size: 14px; margin-bottom: 30px;">Un nouveau message de contact a été soumis sur votre site web.</p>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; width: 140px; color: #888;">Noms & Prénoms</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">${names}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}" style="color: #8a7a67; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888;">Téléphone</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${phone ? `<a href="tel:${phone}" style="color: #8a7a67; text-decoration: none;">${phone}</a>` : '<span style="color: #aaa; font-style: italic;">Non précisé</span>'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888;">Date du mariage</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${date || '<span style="color: #aaa; font-style: italic;">Non précisée</span>'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888;">Lieu de réception</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${location || '<span style="color: #aaa; font-style: italic;">Non précisé</span>'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888;">Services souhaités</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">
                <span style="background-color: #f5f5f5; padding: 4px 8px; border-radius: 4px; font-size: 12px; border: 1px solid #e0e0e0;">
                  ${servicesText}
                </span>
              </td>
            </tr>
          </table>
          
          <div style="margin-top: 30px;">
            <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #8a7a67; border-bottom: 1px solid #8a7a67; padding-bottom: 5px; display: inline-block;">Leur Message</h3>
            <div style="background-color: #fcfbfa; padding: 20px; border-radius: 4px; border-left: 3px solid #8a7a67; margin-top: 15px; color: #444; line-height: 1.6; font-size: 14px;">
              ${message.replace(/\n/g, '<br/>')}
            </div>
          </div>
          
          <div style="margin-top: 40px; text-align: center;">
            <a href="mailto:${email}" style="background-color: #8a7a67; color: #ffffff; padding: 12px 24px; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; font-size: 12px; border-radius: 2px; display: inline-block;">Répondre à ${names.split(' ')[0]}</a>
          </div>
        </div>
      `
    };

    const autoReplyOptions = {
      from: `"Iamyoka" <${process.env.SMTP_USER}>`,
      to: email, // L'adresse du client
      subject: `Votre demande de contact - Iamyoka`,
      text: `Bonjour ${names},\n\nNous avons bien reçu votre message et nous vous en remercions infiniment.\n\nNous allons étudier votre demande avec soin et reviendrons vers vous très prochainement pour en discuter de vive voix.\n\n--- Récapitulatif de votre demande ---\nNoms : ${names}\nTéléphone : ${phone || 'Non précisé'}\nDate : ${date || 'Non précisée'}\nLieu : ${location || 'Non précisé'}\nServices souhaités : ${servicesText}\nMessage :\n${message}\n\nÀ très vite,\nL'équipe Iamyoka.\n\n--\nSite Web: https://iamyoka.fr`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="font-weight: 300; letter-spacing: 1px; color: #333;">Bonjour ${names},</h2>
          <p style="line-height: 1.6; color: #444;">Nous avons bien reçu votre message concernant votre mariage et nous vous en remercions infiniment.</p>
          <p style="line-height: 1.6; color: #444;">Nous allons étudier votre demande avec soin et reviendrons vers vous très prochainement pour en discuter de vive voix.</p>
          
          <div style="background-color: #f9f9f9; padding: 25px; border-radius: 4px; margin: 30px 0; border: 1px solid #eee;">
            <h3 style="margin-top: 0; margin-bottom: 20px; color: #8a7a67; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Récapitulatif de votre demande</h3>
            <p style="margin: 8px 0; color: #555; font-size: 14px;"><strong>Noms :</strong> ${names}</p>
            <p style="margin: 8px 0; color: #555; font-size: 14px;"><strong>Téléphone :</strong> ${phone || 'Non précisé'}</p>
            <p style="margin: 8px 0; color: #555; font-size: 14px;"><strong>Date prévue :</strong> ${date || 'Non précisée'}</p>
            <p style="margin: 8px 0; color: #555; font-size: 14px;"><strong>Lieu :</strong> ${location || 'Non précisé'}</p>
            <p style="margin: 8px 0; color: #555; font-size: 14px;"><strong>Services souhaités :</strong> ${servicesText}</p>
            <div style="margin-top: 20px; color: #555; font-size: 14px;">
                <strong>Votre message :</strong><br/>
                <p style="font-style: italic; border-left: 3px solid #8a7a67; padding-left: 15px; margin-top: 10px; color: #666;">
                    ${message.replace(/\n/g, '<br/>')}
                </p>
            </div>
          </div>
          
          <br/>
          <p style="line-height: 1.6; color: #444;">À très vite,<br/><strong>Iamyoka</strong></p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 40px 0 20px 0;" />
          <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 0.1em; text-align: center;">Ceci est un message automatique, vous serez recontacté prochainement.</p>
        </div>
      `
    };

    // Envoyer les deux emails en parallèle (un pour l'admin, un pour le client)
    await Promise.all([
      transporter.sendMail(mailOptions),
      transporter.sendMail(autoReplyOptions)
    ]);

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    return { error: "Une erreur interne est survenue. Veuillez réessayer ou nous contacter directement." };
  }
}
