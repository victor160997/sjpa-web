import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import { RequireAuth } from "./components/auth/RequireAuth";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layouts/MainLayout";
import SetoresPage from "./pages/cadastro/SetoresPage";
import SetorFormPage from "./pages/cadastro/SetorFormPage";
import SetorDetalhesPage from "./pages/cadastro/SetorDetalhesPage";
import BaiaDetalhesPage from "./pages/cadastro/BaiaDetalhesPage";
import AnimalFormPage from "./pages/cadastro/AnimalFormPage";
import BaiaFormPage from "./pages/cadastro/BaiaFormPage";
import CheckagemPage from "./pages/checagem/CheckagemPage";
import AnimalDetalhesPage from "./pages/cadastro/AnimalDetalhesPage";

const RedirectToHome = () => <Navigate to="/cadastro" />;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route
                path="/"
                element={
                  <RequireAuth>
                    <RedirectToHome />
                  </RequireAuth>
                }
              />

              <Route path="/cadastro" element={<RequireAuth><MainLayout /></RequireAuth>}>
                <Route index element={<SetoresPage />} />
                <Route path="setores" element={<SetoresPage />} />
                {/* <Route path="setores/novo" element={<SetorFormPage />} /> */}
                <Route path="setores/:id" element={<SetorDetalhesPage />} />
                <Route path="setores/:id/editar" element={<SetorFormPage />} />
                {/* <Route path="baias/novo" element={<BaiaFormPage />} /> */}
                <Route path="baias/:id" element={<BaiaFormPage />} />
                <Route path="baias/:id/editar" element={<BaiaFormPage />} />
                <Route path="baia/:id" element={<BaiaDetalhesPage />} />
                {/* <Route path="animais/novo" element={<AnimalFormPage />} /> */}
                <Route path="animais/:id" element={<AnimalFormPage />} />
                <Route path="animais/:id/detalhes" element={<AnimalDetalhesPage />} />
              </Route>

              <Route
                path="/checagem"
                element={
                  <RequireAuth>
                    <MainLayout>
                      <CheckagemPage />
                    </MainLayout>
                  </RequireAuth>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
