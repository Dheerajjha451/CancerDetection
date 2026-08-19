import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { SessionProvider } from 'next-auth/react';
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Bricolage_Grotesque({ subsets: ["latin"] });
const productionUrl = "https://healthcare.dheerajjha.com";

export const metadata: Metadata = {
  metadataBase: new URL(productionUrl),
  title: {
    default: "OncoSight",
    template: "%s | OncoSight",
  },
  description:
    "OncoSight is a healthcare platform for cancer patients with screening, guidance, and support tools.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "OncoSight",
    description:
      "OncoSight is a healthcare platform for cancer patients with screening, guidance, and support tools.",
    url: productionUrl,
    siteName: "OncoSight",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OncoSight",
    description:
      "OncoSight is a healthcare platform for cancer patients with screening, guidance, and support tools.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
      <body className={inter.className}>
         <Toaster />
         {children}
       </body>
      </html>
    </SessionProvider>
  )
}