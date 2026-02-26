import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Artigos from "./pages/Artigos";
import Consulta from "./pages/Consulta";
import Entrada from "./pages/Entrada";
import Saida from "./pages/Saida";
import Romaneio from "./pages/Romaneio";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/artigos">
        <ProtectedRoute requiredRole="admin">
          <Artigos />
        </ProtectedRoute>
      </Route>
      <Route path="/consulta">
        <ProtectedRoute>
          <Consulta />
        </ProtectedRoute>
      </Route>
      <Route path="/entrada">
        <ProtectedRoute requiredRole="admin">
          <Entrada />
        </ProtectedRoute>
      </Route>
      <Route path="/saida">
        <ProtectedRoute requiredRole="admin">
          <Saida />
        </ProtectedRoute>
      </Route>
      <Route path="/romaneio">
        <ProtectedRoute requiredRole="funcionario">
          <Romaneio />
        </ProtectedRoute>
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
