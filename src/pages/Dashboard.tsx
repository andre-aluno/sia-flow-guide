import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Stepper from "@/components/Stepper";
import {
  Calendar,
  BookOpen,
  Users,
  Zap,
  CheckCircle2,
  ArrowRight,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  fetchSemestres,
  fetchDisciplinas,
  fetchProfessores,
  fetchAlocacoes,
  type Semestre,
} from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const steps = [
  { id: 1, name: "Semestre", description: "Criar ou selecionar" },
  { id: 2, name: "Áreas", description: "Cadastrar áreas" },
  { id: 3, name: "Disciplinas", description: "Cadastrar ou importar" },
  { id: 4, name: "Professores", description: "Cadastrar ou importar" },
  { id: 5, name: "Ofertas", description: "Gerar ofertas" },
  { id: 6, name: "Alocação", description: "Executar algoritmo" },
];

const quickActions = [
  {
    title: "Novo Semestre",
    description: "Criar um novo semestre letivo",
    icon: Calendar,
    href: "/semestres",
    color: "primary",
  },
  {
    title: "Importar Disciplinas",
    description: "Importar lista de disciplinas",
    icon: BookOpen,
    href: "/disciplinas",
    color: "accent",
  },
  {
    title: "Executar Alocação",
    description: "Rodar algoritmo de alocação",
    icon: Zap,
    href: "/alocacao",
    color: "warning",
  },
];

const recentActivities = [
  {
    title: "Alocação executada com sucesso",
    description: "Semestre 2024.1 - 45 disciplinas alocadas",
    time: "Há 2 horas",
    icon: CheckCircle2,
    color: "text-accent",
  },
  {
    title: "Novas disciplinas cadastradas",
    description: "12 disciplinas adicionadas ao sistema",
    time: "Há 5 horas",
    icon: BookOpen,
    color: "text-primary",
  },
  {
    title: "Professores importados",
    description: "8 novos professores cadastrados",
    time: "Ontem",
    icon: Users,
    color: "text-muted-foreground",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    semestres: 0,
    semestresAtivos: 0,
    disciplinas: 0,
    professores: 0,
    alocacoes: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Carregar dados em paralelo
      const [semestresRes, disciplinasRes, professoresRes, alocacoesRes] = await Promise.all([
        fetchSemestres({ per_page: 100 }),
        fetchDisciplinas({ per_page: 1 }), // Só precisamos do total
        fetchProfessores({ per_page: 1 }), // Só precisamos do total
        fetchAlocacoes({ per_page: 1 }), // Só precisamos do total
      ]);

      // Contar semestres ativos (dentro do período atual)
      const hoje = new Date();
      const semestresAtivos = semestresRes.data.filter((s: Semestre) => {
        const inicio = new Date(s.data_inicio);
        const fim = new Date(s.data_fim);
        return hoje >= inicio && hoje <= fim;
      }).length;

      setStats({
        semestres: semestresRes.total || semestresRes.data.length,
        semestresAtivos,
        disciplinas: disciplinasRes.total || 0,
        professores: professoresRes.total || 0,
        alocacoes: alocacoesRes.total || 0,
      });
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">
          Bem-vindo ao SIA
        </h1>
        <p className="text-muted-foreground mt-2">
          Sistema Integrado de Alocação - Gerencie todo o processo de alocação de professores
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Semestres Ativos */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Semestres Ativos
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold text-foreground">{stats.semestresAtivos}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.semestres} total cadastrados
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Disciplinas */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Disciplinas
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold text-foreground">{stats.disciplinas}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total cadastradas
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Professores */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Professores
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold text-foreground">{stats.professores}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Disponíveis
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Alocações */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alocações
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold text-foreground">{stats.alocacoes}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total realizadas
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Process Stepper */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Processo de Alocação</CardTitle>
          <CardDescription>
            Siga as etapas abaixo para completar uma alocação de semestre
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Stepper steps={steps} currentStep={1} />
          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate("/semestres")}
            >
              Iniciar Novo Processo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente as funcionalidades principais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action) => (
              <button
                key={action.title}
                onClick={() => navigate(action.href)}
                className="w-full flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-secondary transition-all group"
              >
                <div className="flex-shrink-0">
                  <action.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-foreground">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Atividades Recentes</CardTitle>
            <CardDescription>
              Acompanhe as últimas ações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <activity.icon className={`h-5 w-5 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Help Banner */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <AlertCircle className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">
                Precisa de ajuda?
              </h3>
              <p className="text-sm text-muted-foreground">
                Consulte nossa documentação ou entre em contato com o suporte
              </p>
            </div>
          </div>
          <Button variant="outline">
            Acessar Documentação
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
