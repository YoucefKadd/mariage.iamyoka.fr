import type { Metadata } from "next";
import { Jost, Playfair_Display } from "next/font/google";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "IAMYOKA | Mariages",
  description: "Votre mariage comme au cinéma",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23F9F8F6%22/><text x=%2250%22 y=%2272%22 font-family=%22serif%22 font-size=%2270%22 font-style=%22italic%22 font-weight=%22bold%22 fill=%22%23B5A898%22 text-anchor=%22middle%22>I</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`scroll-smooth ${jost.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased selection:bg-brand-taupe selection:text-white">
        {children}
      </body>
    </html>
  );
}
