import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const TOUR_KEY = "sia_tour_v1";
const TOOLTIP_WIDTH = 460;
const MARGIN = 16;
const ESTIMATED_HEIGHT = 190;

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TourStep {
  id: string;
  page: string;
  target: string | null;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right" | "center";
  icon?: string;
  padding?: number;
  maxSpotlightHeight?: number;
}

const STEPS: TourStep[] = [
  {
    id: "welcome",
    page: "/",
    target: null,
    title: "Bem-vindo ao SIA!",
    description:
      "O Sistema Integrado de Alocação usa um Algoritmo Genético para distribuir professores nas disciplinas de forma otimizada. Vamos te guiar pelo fluxo completo em poucos minutos.",
    position: "center",
    icon: "👋",
  },
  {
    id: "sidebar",
    page: "/",
    target: '[data-tour="sidebar"]',
    title: "Menu de Navegação",
    description:
      "Use o menu lateral para acessar cada etapa do processo. As seções seguem a ordem do fluxo de alocação, do cadastro inicial até a confirmação das alocações.",
    position: "right",
    padding: 6,
  },
  {
    id: "stepper",
    page: "/",
    target: '[data-tour="process-stepper"]',
    title: "Processo em 7 Etapas",
    description:
      "O fluxo de alocação segue 7 etapas sequenciais: Semestre → Áreas → Disciplinas → Professores → Ofertas → Gerar Alocação → Alocações. Nas 5 primeiras, você cadastra os dados. Na 6ª, configura e executa o AG. Na última, gerencia os resultados.",
    position: "top",
    padding: 12,
  },
  {
    id: "mini-stepper",
    page: "/semestres",
    target: '[data-tour="mini-stepper"]',
    title: "Navegação pelo Fluxo",
    description:
      "Esta barra aparece em todas as etapas do processo. Use os botões Anterior e Próximo para avançar ou voltar entre as etapas sem precisar usar o menu lateral.",
    position: "bottom",
    padding: 6,
  },
  {
    id: "semestres-create",
    page: "/semestres",
    target: '[data-tour="create-btn"]',
    title: "Passo 1 — Criar Semestre",
    description:
      "O semestre é o ponto de partida. Informe o nome (ex: 2024EADS1), ano, período e datas de início e fim. Todas as ofertas e alocações precisam estar vinculadas a um semestre.",
    position: "bottom",
    icon: "📅",
  },
  {
    id: "semestres-list",
    page: "/semestres",
    target: '[data-tour="data-list"]',
    title: "Semestres Cadastrados",
    description:
      "Aqui ficam todos os semestres registrados. Semestres ativos (dentro do período atual) são destacados em verde. Você pode editar ou criar novos conforme necessário.",
    position: "top",
    padding: 12,
    maxSpotlightHeight: 280,
  },
  {
    id: "areas-create",
    page: "/areas",
    target: '[data-tour="create-btn"]',
    title: "Passo 2 — Criar Área",
    description:
      "As áreas de conhecimento (ex: Computação, Matemática, Gestão) conectam professores às disciplinas. O Algoritmo Genético usa essas áreas para calcular compatibilidade antes de qualquer alocação.",
    position: "bottom",
    icon: "🏷️",
  },
  {
    id: "areas-list",
    page: "/areas",
    target: '[data-tour="data-list"]',
    title: "Áreas de Conhecimento",
    description:
      "Todas as áreas cadastradas ficam aqui. Elas são a base da compatibilidade no AG: um professor só é considerado apto para uma disciplina se compartilhar ao menos uma área com ela.",
    position: "top",
    padding: 12,
    maxSpotlightHeight: 280,
  },
  {
    id: "disciplinas-create",
    page: "/disciplinas",
    target: '[data-tour="create-btn"]',
    title: "Passo 3 — Criar Disciplina",
    description:
      "Cadastre nome, carga horária, área de competência e nível esperado do professor (1–5). Todos esses dados são usados pelo AG para encontrar a melhor correspondência professor-disciplina, respeitando as capacidades de cada um.",
    position: "bottom",
    icon: "📚",
  },
  {
    id: "disciplinas-list",
    page: "/disciplinas",
    target: '[data-tour="data-list"]',
    title: "Disciplinas Cadastradas",
    description:
      "Todas as disciplinas do curso ficam listadas aqui, com área e carga horária. A partir dessas disciplinas que são geradas as ofertas do semestre.",
    position: "top",
    padding: 12,
    maxSpotlightHeight: 280,
  },
  {
    id: "professores-create",
    page: "/professores",
    target: '[data-tour="create-btn"]',
    title: "Passo 4 — Cadastrar Professor",
    description:
      "Informe nome, titulação (Especialista, Mestre, Doutor), carga máxima de horas e áreas de atuação. O AG usa esses dados para encontrar a melhor combinação professor-disciplina respeitando capacidades.",
    position: "bottom",
    icon: "👨‍🏫",
  },
  {
    id: "professores-list",
    page: "/professores",
    target: '[data-tour="data-list"]',
    title: "Professores Disponíveis",
    description:
      "Todos os professores cadastrados participarão da alocação. O AG respeita a carga máxima de cada um para evitar sobrecarga.",
    position: "top",
    padding: 12,
    maxSpotlightHeight: 280,
  },
  {
    id: "ofertas-create",
    page: "/ofertas",
    target: '[data-tour="create-btn"]',
    title: "Passo 5 — Criar Oferta",
    description:
      "Uma oferta é a combinação de disciplina + semestre + turma (ex: Turma A). Cada oferta representa uma vaga que precisa ser preenchida por um professor.",
    position: "bottom",
    icon: "📋",
  },
  {
    id: "ofertas-list",
    page: "/ofertas",
    target: '[data-tour="data-list"]',
    title: "Ofertas do Semestre",
    description:
      "O conjunto de todas as ofertas é exatamente o que o Algoritmo Genético otimiza: encontrar a melhor distribuição de professores para cada turma, de forma simultânea.",
    position: "top",
    padding: 12,
    maxSpotlightHeight: 280,
  },
  {
    id: "ag-config",
    page: "/gerar-alocacao",
    target: '[data-tour="config-card"]',
    title: "Passo 6 — Configurar o AG",
    description:
      "Selecione o semestre e ajuste os parâmetros do algoritmo: tamanho da população, número de gerações, taxas de mutação e crossover. Os padrões já são boas configurações para a maioria dos casos.",
    position: "right",
    icon: "⚙️",
    padding: 10,
  },
  {
    id: "ag-execute",
    page: "/gerar-alocacao",
    target: '[data-tour="execute-btn"]',
    title: "Executar o Algoritmo Genético",
    description:
      "Ao clicar aqui, o AG evolui soluções por gerações, otimizando: compatibilidade de áreas, nível do professor vs. disciplina, titulação e distribuição de carga horária — tudo automaticamente.",
    position: "bottom",
    icon: "⚡",
  },
  {
    id: "ag-status",
    page: "/gerar-alocacao",
    target: '[data-tour="status-card"]',
    title: "Progresso e Resultados",
    description:
      "Acompanhe o progresso em tempo real. Após a execução, os resultados aparecem abaixo com métricas completas: fitness total, percentual de compatibilidade, distribuição de carga e alertas. Clique em 'Salvar Todas' para confirmar.",
    position: "left",
    icon: "📊",
    padding: 10,
  },
  {
    id: "alocacoes-list",
    page: "/alocacoes",
    target: '[data-tour="data-list"]',
    title: "Passo 7 — Alocações Confirmadas",
    description:
      "As alocações salvas aparecem aqui. Você também pode gerenciar manualmente: adicionar ou remover vínculos professor-disciplina fora do AG, quando necessário.",
    position: "top",
    icon: "✅",
    padding: 12,
    maxSpotlightHeight: 280,
  },
  {
    id: "done",
    page: "/alocacoes",
    target: null,
    title: "Você está pronto! 🎉",
    description:
      "Agora você conhece todo o fluxo do SIA. Comece pelo menu Semestres e siga as etapas. O processo completo leva alguns minutos — e a alocação otimizada fica pronta automaticamente.",
    position: "center",
    icon: "🚀",
  },
];

function clamp(min: number, val: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function getTooltipStyle(
  spotlight: SpotlightRect | null,
  position: TourStep["position"]
): React.CSSProperties {
  if (!spotlight || position === "center") {
    return {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: TOOLTIP_WIDTH,
    };
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  switch (position) {
    case "bottom":
      return {
        position: "fixed",
        top: spotlight.top + spotlight.height + MARGIN,
        left: clamp(
          MARGIN,
          spotlight.left + spotlight.width / 2 - TOOLTIP_WIDTH / 2,
          vw - TOOLTIP_WIDTH - MARGIN
        ),
        width: TOOLTIP_WIDTH,
      };
    case "top":
      return {
        position: "fixed",
        top: clamp(MARGIN, spotlight.top - ESTIMATED_HEIGHT - MARGIN, vh - ESTIMATED_HEIGHT - MARGIN),
        left: clamp(
          MARGIN,
          spotlight.left + spotlight.width / 2 - TOOLTIP_WIDTH / 2,
          vw - TOOLTIP_WIDTH - MARGIN
        ),
        width: TOOLTIP_WIDTH,
      };
    case "right":
      return {
        position: "fixed",
        left: spotlight.left + spotlight.width + MARGIN,
        top: clamp(MARGIN, spotlight.top, vh - 320 - MARGIN),
        width: TOOLTIP_WIDTH,
      };
    case "left":
      return {
        position: "fixed",
        right: vw - spotlight.left + MARGIN,
        top: clamp(MARGIN, spotlight.top, vh - 320 - MARGIN),
        width: TOOLTIP_WIDTH,
      };
    default:
      return {};
  }
}

export function GuidedTour() {
  const [visible, setVisible] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [ready, setReady] = useState(false);
  const retryRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const navigate = useNavigate();
  const location = useLocation();

  const step = STEPS[stepIdx];

  // Init: show tour on first visit
  useEffect(() => {
    if (!localStorage.getItem(TOUR_KEY)) {
      const t = setTimeout(() => setVisible(true), 700);
      return () => clearTimeout(t);
    }
  }, []);

  // Spotlight effect: navigate if needed, find target
  useEffect(() => {
    if (!visible) return;

    clearTimeout(retryRef.current);
    setReady(false);

    if (location.pathname !== step.page) {
      navigate(step.page);
      return;
    }

    if (!step.target) {
      setSpotlight(null);
      const t = setTimeout(() => setReady(true), 120);
      return () => clearTimeout(t);
    }

    const tryFind = () => {
      const el = document.querySelector(step.target!);
      if (!el) {
        retryRef.current = setTimeout(tryFind, 300);
        return;
      }
      retryRef.current = setTimeout(() => {
        const r = el.getBoundingClientRect();
        const pad = step.padding ?? 10;
        const rawHeight = step.maxSpotlightHeight
          ? Math.min(r.height, step.maxSpotlightHeight)
          : r.height;
        setSpotlight({
          top: r.top - pad,
          left: r.left - pad,
          width: r.width + pad * 2,
          height: rawHeight + pad * 2,
        });
        setReady(true);
      }, 200);
    };

    retryRef.current = setTimeout(tryFind, 180);
    return () => clearTimeout(retryRef.current);
  }, [visible, stepIdx, location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const goNext = () => {
    if (stepIdx < STEPS.length - 1) setStepIdx((i) => i + 1);
    else complete();
  };

  const goPrev = () => {
    if (stepIdx > 0) setStepIdx((i) => i - 1);
  };

  const complete = () => {
    localStorage.setItem(TOUR_KEY, "1");
    setVisible(false);
    navigate("/");
  };

  if (!visible) return null;

  const tooltipStyle = getTooltipStyle(spotlight, step.position);
  const isCenter = !spotlight || step.position === "center";

  return (
    <>
      {/* Full-screen click blocker (prevents page interaction during tour) */}
      <div className="fixed inset-0 z-[9997]" style={{ cursor: "default" }} />

      {/* Spotlight overlay */}
      {spotlight ? (
        <div
          className="fixed z-[9998] rounded-xl pointer-events-none"
          style={{
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.62)",
            border: "2px solid hsl(var(--primary))",
            transition: "top 0.35s ease, left 0.35s ease, width 0.35s ease, height 0.35s ease",
          }}
        />
      ) : (
        <div
          className="fixed inset-0 z-[9998] pointer-events-none"
          style={{ backgroundColor: "rgba(0,0,0,0.62)" }}
        />
      )}

      {/* Tooltip card */}
      <div
        className={cn(
          "fixed z-[10000] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden",
          "transition-all duration-300 ease-out",
          ready
            ? "opacity-100 translate-y-0"
            : isCenter
            ? "opacity-0 scale-95"
            : "opacity-0 translate-y-3"
        )}
        style={tooltipStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((stepIdx + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <div className="p-6 space-y-4">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
              {stepIdx + 1} / {STEPS.length}
            </span>
            <button
              onClick={complete}
              className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
              title="Fechar tour"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Icon + Title */}
          <div>
            {step.icon && (
              <span className="text-3xl block mb-2">{step.icon}</span>
            )}
            <h3 className="text-base font-semibold text-foreground leading-snug">
              {step.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {step.description}
          </p>

          {/* Navigation footer */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={complete}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Pular tour
            </button>
            <div className="flex gap-2">
              {stepIdx > 0 && (
                <Button variant="outline" size="sm" onClick={goPrev}>
                  <ChevronLeft className="h-3.5 w-3.5 mr-0.5" />
                  Anterior
                </Button>
              )}
              <Button size="sm" onClick={goNext}>
                {stepIdx < STEPS.length - 1 ? (
                  <>
                    Próximo
                    <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                  </>
                ) : (
                  "Concluir 🎉"
                )}
              </Button>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 pt-1">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setStepIdx(i);
                }}
                title={`Ir para etapa ${i + 1}`}
                className={cn(
                  "rounded-full transition-all duration-300 hover:opacity-80",
                  i === stepIdx
                    ? "w-5 h-1.5 bg-primary"
                    : i < stepIdx
                    ? "w-1.5 h-1.5 bg-primary/45"
                    : "w-1.5 h-1.5 bg-muted-foreground/25"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
