import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Download, AlertTriangle, TrendingUp, Users, BookOpen, Clock, BarChart3, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { ExecutarAGResponse, AlocacaoItem, DistribuicaoCarga } from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Resultados() {
  const [resultado, setResultado] = useState<ExecutarAGResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar resultado do sessionStorage
    const storedResult = sessionStorage.getItem('ag_resultado');
    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult);
        setResultado(parsed);
      } catch (error) {
        console.error("Erro ao carregar resultado:", error);
        toast.error("Erro ao carregar resultados da alocação");
      }
    } else {
      toast.error("Nenhum resultado encontrado. Execute a alocação primeiro.");
    }
    setLoading(false);
  }, []);

  const handleExportar = () => {
    if (!resultado) return;

    // Exportar para JSON
    const dataStr = JSON.stringify(resultado, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `alocacao_${resultado.data.semestre}_${new Date().getTime()}.json`;
    link.click();

    toast.success("Resultados exportados com sucesso!");
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6 animate-fade-in flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Clock className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando resultados...</p>
        </div>
      </div>
    );
  }

  if (!resultado) {
    return (
      <div className="p-8 space-y-6 animate-fade-in">
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-warning" />
            <h2 className="text-xl font-semibold mb-2">Nenhum resultado disponível</h2>
            <p className="text-muted-foreground">Execute a alocação primeiro para visualizar os resultados.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data } = resultado;
  const alocacoesSemMatch = data.proposta_alocacao.alocacoes.filter(a => a.match !== "✅");
  const temProblemas = !data.viabilidade.viavel || alocacoesSemMatch.length > 0;

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Resultados da Alocação</h1>
          <p className="text-muted-foreground mt-1">
            Semestre: {data.semestre} | Tempo de execução: {data.tempo_execucao_segundos.toFixed(2)}s
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
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${data.resumo.percentual_compatibilidade === 100 ? 'bg-accent/10' : 'bg-warning/10'}`}>
                <CheckCircle2 className={`h-6 w-6 ${data.resumo.percentual_compatibilidade === 100 ? 'text-accent' : 'text-warning'}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {data.resumo.percentual_compatibilidade}%
                </div>
                <div className="text-sm text-muted-foreground">Compatibilidade</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {data.resumo.ofertas_com_match}/{data.resumo.ofertas_totais}
                </div>
                <div className="text-sm text-muted-foreground">Ofertas Alocadas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${temProblemas ? 'bg-warning/10' : 'bg-accent/10'}`}>
                {temProblemas ? (
                  <AlertTriangle className="h-6 w-6 text-warning" />
                ) : (
                  <CheckCircle2 className="h-6 w-6 text-accent" />
                )}
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {alocacoesSemMatch.length}
                </div>
                <div className="text-sm text-muted-foreground">Incompatibilidades</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {data.resumo.professores_utilizados}/{data.resumo.total_professores}
                </div>
                <div className="text-sm text-muted-foreground">Professores</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Visualização */}
      <Tabs defaultValue="alocacoes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alocacoes">Alocações</TabsTrigger>
          <TabsTrigger value="distribuicao">Distribuição de Carga</TabsTrigger>
          <TabsTrigger value="evolucao">Evolução</TabsTrigger>
          <TabsTrigger value="qualidade">Análise de Qualidade</TabsTrigger>
        </TabsList>

        {/* Tab: Alocações */}
        <TabsContent value="alocacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Alocações</CardTitle>
              <CardDescription>
                Todas as alocações propostas pelo algoritmo genético
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.proposta_alocacao.alocacoes.map((alocacao) => (
                  <div
                    key={alocacao.idx}
                    className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                      alocacao.match !== "✅"
                        ? "border-warning bg-warning/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex-1 grid grid-cols-5 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Disciplina</div>
                        <div className="font-semibold text-foreground">
                          {alocacao.disciplina_nome}
                        </div>
                        <div className="text-xs text-muted-foreground">Turma {alocacao.turma}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Professor</div>
                        <div className="font-medium text-foreground">
                          {alocacao.professor_nome}
                        </div>
                        <div className="text-xs text-muted-foreground">{alocacao.titulacao}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Competência</div>
                        <Badge variant="outline" className="mt-1">
                          {alocacao.area_disciplina}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Carga</div>
                        <div className="font-medium text-foreground">
                          {alocacao.carga_horaria}h
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {alocacao.carga_alocada}/{alocacao.carga_maxima}h total
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Status</div>
                        {alocacao.tem_competencia ? (
                          <Badge className="mt-1 bg-accent text-accent-foreground">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Compatível
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="mt-1 text-warning border-warning">
                            <XCircle className="h-3 w-3 mr-1" />
                            Incompatível
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Distribuição de Carga */}
        <TabsContent value="distribuicao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Carga por Professor</CardTitle>
              <CardDescription>
                Visualização da carga horária alocada para cada professor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Professor</TableHead>
                    <TableHead>Carga Alocada</TableHead>
                    <TableHead>Carga Máxima</TableHead>
                    <TableHead>Disponível</TableHead>
                    <TableHead>Utilização</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.resumo.distribuicao_carga
                    .sort((a, b) => b.percentual_utilizado - a.percentual_utilizado)
                    .map((dist, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{dist.professor}</TableCell>
                        <TableCell>{dist.carga_alocada}h</TableCell>
                        <TableCell>{dist.carga_maxima}h</TableCell>
                        <TableCell className="text-muted-foreground">{dist.carga_livre}h</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={dist.percentual_utilizado}
                              className="w-20 h-2"
                            />
                            <span className="text-sm font-medium">
                              {dist.percentual_utilizado.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Evolução */}
        <TabsContent value="evolucao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Evolução do Fitness
              </CardTitle>
              <CardDescription>
                Progresso da qualidade da solução ao longo das gerações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Estatísticas da Evolução */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-accent/10 rounded-lg">
                    <div className="text-sm text-muted-foreground">Fitness Inicial</div>
                    <div className="text-2xl font-bold text-foreground">
                      {data.evolucao_fitness.minimo[0].toFixed(2)}
                    </div>
                  </div>
                  <div className="p-4 bg-accent/10 rounded-lg">
                    <div className="text-sm text-muted-foreground">Fitness Final</div>
                    <div className="text-2xl font-bold text-accent">
                      {data.evolucao_fitness.minimo[data.evolucao_fitness.minimo.length - 1].toFixed(2)}
                    </div>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <div className="text-sm text-muted-foreground">Melhoria</div>
                    <div className="text-2xl font-bold text-primary">
                      {(
                        ((data.evolucao_fitness.minimo[0] -
                          data.evolucao_fitness.minimo[data.evolucao_fitness.minimo.length - 1]) /
                          data.evolucao_fitness.minimo[0]) * 100
                      ).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Tabela de Evolução */}
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Geração</TableHead>
                        <TableHead>Melhor</TableHead>
                        <TableHead>Média</TableHead>
                        <TableHead>Pior</TableHead>
                        <TableHead>Desvio Padrão</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.evolucao_fitness.geracoes.map((gen, idx) => (
                        <TableRow key={gen}>
                          <TableCell className="font-medium">#{gen}</TableCell>
                          <TableCell className="text-accent font-semibold">
                            {data.evolucao_fitness.minimo[idx].toFixed(2)}
                          </TableCell>
                          <TableCell>{data.evolucao_fitness.media[idx].toFixed(2)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {data.evolucao_fitness.maximo[idx].toFixed(2)}
                          </TableCell>
                          <TableCell>{data.evolucao_fitness.desvio[idx].toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Qualidade */}
        <TabsContent value="qualidade" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Métricas de Qualidade
                </CardTitle>
                <CardDescription>
                  Análise detalhada da qualidade da solução
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Fitness Total</span>
                    <span className="text-lg font-bold text-accent">
                      {data.qualidade.fitness_total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Penalidade Incompetência</span>
                    <span className={`text-lg font-bold ${data.qualidade.penalidades.incompetencia > 0 ? 'text-warning' : 'text-accent'}`}>
                      {data.qualidade.penalidades.incompetencia.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Penalidade Sobrecarga</span>
                    <span className={`text-lg font-bold ${data.qualidade.penalidades.sobrecarga > 0 ? 'text-warning' : 'text-accent'}`}>
                      {data.qualidade.penalidades.sobrecarga.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Penalidade Desbalanceamento</span>
                    <span className={`text-lg font-bold ${data.qualidade.penalidades.desbalanceamento > 0 ? 'text-warning' : 'text-accent'}`}>
                      {data.qualidade.penalidades.desbalanceamento.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Viabilidade da Solução</CardTitle>
                <CardDescription>
                  Verificação de restrições e problemas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data.viabilidade.viavel ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-16 w-16 text-accent mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Solução Viável
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      A alocação proposta atende a todas as restrições do sistema
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-warning/10 border border-warning rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Problemas Encontrados</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {data.viabilidade.problemas.map((problema, idx) => (
                            <li key={idx}>• {problema}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Parâmetros Utilizados */}
          <Card>
            <CardHeader>
              <CardTitle>Parâmetros do Algoritmo</CardTitle>
              <CardDescription>
                Configuração utilizada na execução
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">População</div>
                  <div className="text-xl font-bold text-foreground">
                    {data.parametros_utilizados.tamanho_populacao}
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">Gerações</div>
                  <div className="text-xl font-bold text-foreground">
                    {data.parametros_utilizados.num_geracoes}
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">Crossover</div>
                  <div className="text-xl font-bold text-foreground">
                    {data.parametros_utilizados.probabilidade_crossover}
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">Mutação</div>
                  <div className="text-xl font-bold text-foreground">
                    {data.parametros_utilizados.probabilidade_mutacao}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
