import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Download, Edit2, Save, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Alocacao {
  id: string;
  disciplina: string;
  turma: string;
  professor: string;
  cargaHoraria: number;
  conflitos: boolean;
}

const mockAlocacoes: Alocacao[] = [
  { id: "1", disciplina: "INF101", turma: "A", professor: "Dr. João Silva", cargaHoraria: 4, conflitos: false },
  { id: "2", disciplina: "INF201", turma: "A", professor: "Dra. Maria Santos", cargaHoraria: 4, conflitos: false },
  { id: "3", disciplina: "MAT101", turma: "B", professor: "Prof. Carlos Souza", cargaHoraria: 6, conflitos: true },
  { id: "4", disciplina: "INF301", turma: "A", professor: "Dra. Ana Costa", cargaHoraria: 4, conflitos: false },
];

export default function Resultados() {
  const [alocacoes, setAlocacoes] = useState<Alocacao[]>(mockAlocacoes);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const handleSalvar = () => {
    toast.success("Alocações salvas com sucesso!");
    setEditandoId(null);
  };

  const handleExportar = () => {
    toast.success("Alocações exportadas com sucesso!");
  };

  const professoresDisponiveis = [
    "Dr. João Silva",
    "Dra. Maria Santos",
    "Prof. Carlos Souza",
    "Dra. Ana Costa",
  ];

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Resultados</h1>
          <p className="text-muted-foreground mt-1">
            Revise e ajuste as alocações geradas
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExportar}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button
            onClick={handleSalvar}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar Alocações
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">98%</div>
                <div className="text-sm text-muted-foreground">Taxa de Alocação</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">42</div>
                <div className="text-sm text-muted-foreground">Disciplinas Alocadas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">3</div>
                <div className="text-sm text-muted-foreground">Conflitos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">23</div>
                <div className="text-sm text-muted-foreground">Professores Utilizados</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Alocações */}
      <Card>
        <CardHeader>
          <CardTitle>Alocações do Semestre 2024.1</CardTitle>
          <CardDescription>
            Clique em "Editar" para ajustar manualmente uma alocação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alocacoes.map((alocacao) => (
              <div
                key={alocacao.id}
                className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                  alocacao.conflitos
                    ? "border-warning bg-warning/5"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Disciplina</div>
                    <div className="font-semibold text-foreground">
                      {alocacao.disciplina} - Turma {alocacao.turma}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm text-muted-foreground">Professor</div>
                    {editandoId === alocacao.id ? (
                      <Select
                        defaultValue={alocacao.professor}
                        onValueChange={(value) => {
                          setAlocacoes(
                            alocacoes.map((a) =>
                              a.id === alocacao.id
                                ? { ...a, professor: value, conflitos: false }
                                : a
                            )
                          );
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {professoresDisponiveis.map((prof) => (
                            <SelectItem key={prof} value={prof}>
                              {prof}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="font-medium text-foreground">
                        {alocacao.professor}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Carga Horária</div>
                    <div className="font-medium text-foreground">
                      {alocacao.cargaHoraria}h/semana
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {alocacao.conflitos && (
                    <Badge variant="outline" className="text-warning border-warning">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Conflito
                    </Badge>
                  )}
                  {editandoId === alocacao.id ? (
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditandoId(null);
                        toast.success("Alteração salva!");
                      }}
                      className="bg-accent text-accent-foreground"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Salvar
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditandoId(alocacao.id)}
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
