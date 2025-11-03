import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Play, Settings, TrendingUp, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Alocacao() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [populacao, setPopulacao] = useState([100]);
  const [geracoes, setGeracoes] = useState([50]);
  const [mutacao, setMutacao] = useState([0.1]);

  const handleExecutar = () => {
    setIsRunning(true);
    setProgress(0);
    
    // Simulação do progresso
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          toast.success("Alocação concluída com sucesso!", {
            description: "98% de taxa de alocação atingida",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alocação</h1>
          <p className="text-muted-foreground mt-1">
            Execute o algoritmo genético de alocação
          </p>
        </div>
        <Button
          onClick={handleExecutar}
          disabled={isRunning}
          className="bg-warning text-warning-foreground hover:bg-warning/90"
        >
          {isRunning ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Executando...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Executar Alocação
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Configurações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Parâmetros do Algoritmo
            </CardTitle>
            <CardDescription>
              Configure os parâmetros do algoritmo genético
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Tamanho da População</Label>
                <span className="text-sm font-semibold text-primary">
                  {populacao[0]}
                </span>
              </div>
              <Slider
                value={populacao}
                onValueChange={setPopulacao}
                min={50}
                max={200}
                step={10}
                disabled={isRunning}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Número de Gerações</Label>
                <span className="text-sm font-semibold text-primary">
                  {geracoes[0]}
                </span>
              </div>
              <Slider
                value={geracoes}
                onValueChange={setGeracoes}
                min={10}
                max={100}
                step={5}
                disabled={isRunning}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Taxa de Mutação</Label>
                <span className="text-sm font-semibold text-primary">
                  {mutacao[0].toFixed(2)}
                </span>
              </div>
              <Slider
                value={mutacao}
                onValueChange={setMutacao}
                min={0.01}
                max={0.5}
                step={0.01}
                disabled={isRunning}
              />
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-warning" />
              Status da Execução
            </CardTitle>
            <CardDescription>
              Acompanhe o progresso do algoritmo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-semibold text-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">Geração Atual</span>
                <span className="font-semibold text-foreground">
                  {isRunning ? Math.floor((progress / 100) * geracoes[0]) : "0"} / {geracoes[0]}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">Melhor Fitness</span>
                <span className="font-semibold text-accent">
                  {isRunning ? (0.85 + (progress / 100) * 0.13).toFixed(3) : "0.000"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">Taxa de Alocação</span>
                <span className="font-semibold text-accent">
                  {isRunning ? Math.floor(85 + (progress / 100) * 13) : "0"}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resultados Anteriores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Histórico de Execuções
          </CardTitle>
          <CardDescription>
            Últimas execuções do algoritmo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { data: "2024-03-15 14:30", fitness: 0.982, alocacao: 98, tempo: "2m 15s" },
              { data: "2024-03-10 09:15", fitness: 0.975, alocacao: 97, tempo: "2m 08s" },
              { data: "2024-03-05 16:45", fitness: 0.968, alocacao: 96, tempo: "2m 22s" },
            ].map((exec, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-foreground">{exec.data}</div>
                    <div className="text-sm text-muted-foreground">
                      Tempo: {exec.tempo}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Fitness</div>
                    <div className="font-semibold text-accent">{exec.fitness}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Alocação</div>
                    <div className="font-semibold text-accent">{exec.alocacao}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
