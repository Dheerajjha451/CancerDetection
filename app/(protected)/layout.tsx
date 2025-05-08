import { Navbar } from "./_components/navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return ( 
    <div className="flex min-h-screen">
    <Navbar />
    <main className="flex-1 p-6 ">
      {children}
    </main>
  </div>
   );
}
 
export default ProtectedLayout;