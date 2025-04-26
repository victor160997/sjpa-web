
import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <main className="flex-1 overflow-y-auto pb-16">
        {children || <Outlet />}
      </main>
      
      <footer className="fixed bottom-0 w-full bg-white border-t border-gray-200">
        <Tabs 
          defaultValue={isActive('/cadastro') ? 'cadastro' : 'checagem'} 
          className="w-full"
          onValueChange={(value) => {
            navigate(`/${value}`);
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cadastro">
              Cadastro
            </TabsTrigger>
            <TabsTrigger value="checagem">
              Checagem
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </footer>
    </div>
  );
};

export default MainLayout;
