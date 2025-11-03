import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Stepper from "@/components/Stepper";
import {
  Calendar,
  BookOpen,
  Users,
  ClipboardList,
  Zap,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";

const steps = [
  { id: 1, name: "Semestre", description: "Criar ou selecionar" },
  { id: 2, name: "Disciplinas", description: "Cadastrar ou importar" },
  { id: 3, name: "Professores", description: "Cadastrar ou importar" },
  { id: 4, name: "Ofertas", description: "Gerar ofertas" },
  { id: 5, name: "Alocação", description: "Executar algoritmo" },
  { id: 6, name: "Resultado", description: "Ajustar e salvar" },
];

const stats = [
  {
    name: "Semestres Ativos",
    value: "2",
    icon: Calendar,
    change: "+1 este mês",
    changeType: "positive",
  },
  {
    name: "Disciplinas",
    value: "48",
    icon: BookOpen,
    change: "Total cadastradas",
    changeType: "neutral",
  },
  {
    name: "Professores",
    value: "23",
    icon: Users,
    change: "Disponíveis",
    changeType: "neutral",
  },
  {
    name: "Alocações",
    value: "156",
    icon: CheckCircle2,
    change: "+12 este semestre",
    changeType: "positive",
  },
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
        {stats.map((stat) => (
          <Card key={stat.name} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
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
