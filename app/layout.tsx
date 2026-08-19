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
         <footer className="border-t mt-8">
           <div className="mx-auto max-w-7xl px-4 py-6">
             <h2 className="text-lg font-semibold mb-3">Check out my other work</h2>
             <ul className="space-y-2">
               <li>
                 <a href="https://www.dheerajjha.com/" target="_blank" rel="noopener noreferrer">
                   dheerajjha.com
                 </a>
               </li>
               <li>
                 <a href="https://webannotates.com/" target="_blank" rel="noopener noreferrer">
                   webannotates.com
                 </a>
               </li>
               <li>
                 <a href="https://linksave.webannotates.com/" target="_blank" rel="noopener noreferrer">
                   linksave.webannotates.com
                 </a>
               </li>
               <li>
                 <a href="https://fileconversion.dheerajjha.com/" target="_blank" rel="noopener noreferrer">
                   fileconversion.dheerajjha.com
                 </a>
               </li>
               <li>
                 <a href="https://webscan.dheerajjha.com/" target="_blank" rel="noopener noreferrer">
                   webscan.dheerajjha.com
                 </a>
               </li>
               <li>
                 <a href="https://salesly.dheerajjha.com/" target="_blank" rel="noopener noreferrer">
                   salesly.dheerajjha.com
                 </a>
               </li>
             </ul>
           </div>
         </footer>
       </body>
      </html>
    </SessionProvider>
  )
}