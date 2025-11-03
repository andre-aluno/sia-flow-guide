import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  Users, 
  ClipboardList, 
  Zap,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Semestres", href: "/semestres", icon: Calendar },
  { name: "Disciplinas", href: "/disciplinas", icon: BookOpen },
  { name: "Professores", href: "/professores", icon: Users },
  { name: "Ofertas", href: "/ofertas", icon: ClipboardList },
  { name: "Alocação", href: "/alocacao", icon: Zap },
  { name: "Resultados", href: "/resultados", icon: CheckCircle2 },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            SIA
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sistema Integrado de Alocação
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            v1.0.0 - Sistema de Alocação
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
