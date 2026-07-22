"use server";

import { cookies } from "next/headers";

const ADMIN_PASSWORD = "iamyoka-admin"; // Password provided by user (or default)

export async function login(formData: FormData) {
  const password = formData.get("password") as string;
  
  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", "true", { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });
    return { success: true };
  }
  return { error: "Mot de passe incorrect" };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_auth");
  return { success: true };
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_auth")?.value === "true";
}
