import {Outlet, Link, useLocation, useNavigate} from "react-router-dom";
import {
    LayoutDashboard,
    Calendar,
    BookOpen,
    Users,
    ClipboardList,
    UserCheck,
    Zap,
    Layers
} from "lucide-react";
import {cn} from "@/lib/utils";
import MiniStepper from "./MiniStepper";
import logoCimatec from "@/assets/logo-cimatec.png";

const navigation = [
    {name: "Dashboard", href: "/", icon: LayoutDashboard},
    {name: "Semestres", href: "/semestres", icon: Calendar},
    {name: "Áreas", href: "/areas", icon: Layers},
    {name: "Disciplinas", href: "/disciplinas", icon: BookOpen},
    {name: "Professores", href: "/professores", icon: Users},
    {name: "Ofertas", href: "/ofertas", icon: ClipboardList},
    {name: "Gerar Alocação", href: "/gerar-alocacao", icon: Zap},
    {name: "Alocações", href: "/alocacoes", icon: UserCheck},
];

const steps = [
    {id: 1, name: "Semestre", path: "/semestres"},
    {id: 2, name: "Áreas", path: "/areas"},
    {id: 3, name: "Disciplinas", path: "/disciplinas"},
    {id: 4, name: "Professores", path: "/professores"},
    {id: 5, name: "Ofertas", path: "/ofertas"},
    {id: 6, name: "Gerar Alocação", path: "/gerar-alocacao"},
    {id: 7, name: "Alocações", path: "/alocacoes"},
];

export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();

    // Determinar o step atual baseado na rota
    const getCurrentStep = () => {
        const step = steps.find(s => s.path === location.pathname);
        return step ? step.id : 0;
    };

    const currentStep = getCurrentStep();
    const showMiniStepper = currentStep > 0; // Mostrar apenas nas páginas do processo

    const handleNext = () => {
        const nextStep = steps.find(s => s.id === currentStep + 1);
        if (nextStep) {
            navigate(nextStep.path);
        }
    };

    const handlePrevious = () => {
        const prevStep = steps.find(s => s.id === currentStep - 1);
        if (prevStep) {
            navigate(prevStep.path);
        }
    };

    return (
        <div className="min-h-screen flex w-full bg-background">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
                {/* Header */}
                <div className="p-6 border-b border-border">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        SIA
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Sistema Integrado de Alocação
                    </p>
                </div>

                {/* Navigation - scrollable if needed */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
                                <item.icon className="h-5 w-5"/>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer with Logo and Version */}
                <div className="p-4 border-t border-border space-y-3">
                    {/* Logo CIMATEC */}
                    <div className="flex justify-center">
                        <img
                            src={logoCimatec}
                            alt="Logo CIMATEC"
                            className="h-8 w-auto object-contain opacity-80"
                        />
                    </div>

                    {/* Version */}
                    <div className="text-xs text-muted-foreground text-center">
                        v1.0.0 - Sistema de Alocação
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                {/* Mini Stepper - Aparece apenas nas páginas do processo */}
                {showMiniStepper && (
                    <MiniStepper
                        steps={steps}
                        currentStep={currentStep}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                    />
                )}

                {/* Page Content */}
                <div className="flex-1">
                    <Outlet/>
                </div>
            </main>
        </div>
    );
}
