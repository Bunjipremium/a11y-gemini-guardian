
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Websites from "./pages/Websites";
import ScanResults from "./pages/ScanResults";
import NotFound from "./pages/NotFound";

// Produkt-Seiten
import Produkt from "./pages/Produkt";
import ProduktFeatures from "./pages/ProduktFeatures";
import ProduktPreise from "./pages/ProduktPreise";
import ProduktDemo from "./pages/ProduktDemo";

// Rechtliches-Seiten
import Rechtliches from "./pages/Rechtliches";
import RechtlichesDatenschutz from "./pages/RichtlichesDatenschutz";
import RechtlichesImpressum from "./pages/RechtlichesImpressum";
import RechtlichesAGB from "./pages/RechtlichesAGB";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <Index />
              </PublicRoute>
            } 
          />
          <Route 
            path="/auth" 
            element={
              <PublicRoute>
                <Auth />
              </PublicRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/websites" 
            element={
              <ProtectedRoute>
                <Websites />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/scan/:scanId" 
            element={
              <ProtectedRoute>
                <ScanResults />
              </ProtectedRoute>
            } 
          />
          
          {/* Produkt-Routen */}
          <Route path="/produkt" element={<Produkt />} />
          <Route path="/produkt/features" element={<ProduktFeatures />} />
          <Route path="/produkt/preise" element={<ProduktPreise />} />
          <Route path="/produkt/demo" element={<ProduktDemo />} />
          
          {/* Rechtliches-Routen */}
          <Route path="/rechtliches" element={<Rechtliches />} />
          <Route path="/rechtliches/datenschutz" element={<RechtlichesDatenschutz />} />
          <Route path="/rechtliches/impressum" element={<RechtlichesImpressum />} />
          <Route path="/rechtliches/agb" element={<RechtlichesAGB />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
