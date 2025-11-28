import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Semestres from "./pages/Semestres";
import Disciplinas from "./pages/Disciplinas";
import Professores from "./pages/Professores";
import Ofertas from "./pages/Ofertas";
import Alocacao from "./pages/Alocacao";
import Areas from "./pages/Areas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/semestres" element={<Semestres />} />
            <Route path="/areas" element={<Areas />} />
            <Route path="/disciplinas" element={<Disciplinas />} />
            <Route path="/professores" element={<Professores />} />
            <Route path="/ofertas" element={<Ofertas />} />
            <Route path="/alocacao" element={<Alocacao />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
