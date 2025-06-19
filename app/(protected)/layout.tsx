"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "./_components/navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const pathname = usePathname();
  
  const hideNavbar =  pathname?.includes("/room");

  return ( 
    <div className="flex min-h-screen">
      {!hideNavbar && <Navbar />}
      <main className={`flex-1 ${!hideNavbar ? "p-6" : ""}`}>
        {children}
      </main>
    </div>
  );
}
 
export default ProtectedLayout;