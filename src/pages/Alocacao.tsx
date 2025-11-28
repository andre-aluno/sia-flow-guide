import {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {
    Zap,
    Play,
    Settings,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertTriangle,
    Users,
    BookOpen,
    BarChart3,
    XCircle,
    Save,
    Download,
    Brain,
    Cpu,
    Activity
} from "lucide-react";
import {Progress} from "@/components/ui/progress";
import {Slider} from "@/components/ui/slider";
import {Label} from "@/components/ui/label";
import {toast} from "sonner";
import {
    fetchAGConfigDefaults,
    executarAG,
    fetchSemestres,
    createAlocacao,
    createBulkAlocacoes,
    type Semestre,
    type ExecutarAGResponse
} from "@/lib/api";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Badge} from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export default function Alocacao() {
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [populacao, setPopulacao] = useState([100]);
    const [geracoes, setGeracoes] = useState([50]);
    const [mutacao, setMutacao] = useState([0.2]);
    const [crossover, setCrossover] = useState([0.7]);
    const [semestres, setSemestres] = useState<Semestre[]>([]);
    const [semestreSelecionado, setSemestreSelecionado] = useState<string>("");
    const [geracaoAtual, setGeracaoAtual] = useState(0);
    const [resultado, setResultado] = useState<ExecutarAGResponse | null>(null);
    const [salvandoTodas, setSalvandoTodas] = useState(false);
    const [salvandoIndividual, setSalvandoIndividual] = useState<number | null>(null);
    const [alocacoesSalvas, setAlocacoesSalvas] = useState<Set<number>>(new Set());
    const [etapaIA, setEtapaIA] = useState<string>("");
    const [progressoEtapa, setProgressoEtapa] = useState(0);

    useEffect(() => {
        carregarConfiguracoes();
        carregarSemestres();
    }, []);

    const carregarConfiguracoes = async () => {
        try {
            const response = await fetchAGConfigDefaults();
            setPopulacao([response.data.tamanho_populacao]);
            setGeracoes([response.data.num_geracoes]);
            setMutacao([response.data.probabilidade_mutacao]);
            setCrossover([response.data.probabilidade_crossover]);
        } catch (error) {
            console.error("Erro ao carregar configurações:", error);
        }
    };

    const carregarSemestres = async () => {
        try {
            const response = await fetchSemestres({per_page: 100});
            setSemestres(response.data);

            // Selecionar semestre ativo automaticamente
            const hoje = new Date();
            const semestreAtivo = response.data.find(s => {
                const inicio = new Date(s.data_inicio);
                const fim = new Date(s.data_fim);
                return hoje >= inicio && hoje <= fim;
            });

            if (semestreAtivo) {
                setSemestreSelecionado(semestreAtivo.nome);
            }
        } catch (error) {
            console.error("Erro ao carregar semestres:", error);
            toast.error("Erro ao carregar semestres");
        }
    };

    const handleExecutar = async () => {
        if (!semestreSelecionado) {
            toast.error("Selecione um semestre!");
            return;
        }

        setIsRunning(true);
        setProgress(0);
        setGeracaoAtual(0);
        setEtapaIA("");
        setProgressoEtapa(0);

        // Etapas da simulação de IA
        const etapas = [
            {mensagem: "Analisando competências dos professores...", duracao: 1000},
            {mensagem: "Gerando população inicial de soluções...", duracao: 1000},
            {mensagem: "Executando seleção natural e crossover...", duracao: 1200},
            {mensagem: "Aplicando mutações adaptativas...", duracao: 1000},
            {mensagem: "Otimizando alocações por fitness...", duracao: 800}
        ];

        const duracaoTotal = etapas.reduce((acc, e) => acc + e.duracao, 0);

        // Função para simular progresso de uma etapa
        const simularEtapa = (etapa: typeof etapas[0], indice: number): Promise<void> => {
            return new Promise((resolve) => {
                setEtapaIA(etapa.mensagem);
                setProgressoEtapa(0);

                const steps = 20;
                const intervalTime = etapa.duracao / steps;
                let currentStep = 0;

                const interval = setInterval(() => {
                    currentStep++;
                    const progressoEtapaAtual = (currentStep / steps) * 100;
                    setProgressoEtapa(progressoEtapaAtual);

                    // Atualizar progresso total
                    const progressoAnterior = etapas.slice(0, indice).reduce((acc, e) => acc + e.duracao, 0);
                    const progressoAtual = progressoAnterior + (etapa.duracao * currentStep / steps);
                    const progressoPercentual = (progressoAtual / duracaoTotal) * 100;
                    setProgress(progressoPercentual);

                    // Atualizar métricas
                    setGeracaoAtual(Math.floor((progressoPercentual / 100) * geracoes[0]));

                    if (currentStep >= steps) {
                        clearInterval(interval);
                        resolve();
                    }
                }, intervalTime);
            });
        };

        try {
            // Executar chamada real em paralelo com a animação
            const apiPromise = executarAG({
                semestre_nome: semestreSelecionado,
                tamanho_populacao: populacao[0],
                num_geracoes: geracoes[0],
                probabilidade_crossover: crossover[0],
                probabilidade_mutacao: mutacao[0],
            });

            // Executar animação das etapas
            for (let i = 0; i < etapas.length; i++) {
                await simularEtapa(etapas[i], i);
            }

            // Aguardar a API terminar (se ainda não terminou)
            const response = await apiPromise;

            // Pequeno delay final
            await new Promise(resolve => setTimeout(resolve, 200));

            setProgress(100);
            setGeracaoAtual(geracoes[0]);
            setEtapaIA("Alocação concluída!");

            // Armazenar resultado localmente
            setResultado(response);
            setIsRunning(false);

            toast.success("Alocação concluída com sucesso!", {
                description: `${response.data.resumo.percentual_compatibilidade}% de compatibilidade atingida`,
            });

        } catch (error) {
            setIsRunning(false);
            setProgress(0);
            setEtapaIA("");
            toast.error("Erro ao executar alocação", {
                description: error instanceof Error ? error.message : "Erro desconhecido",
            });
        }
    };

    const handleSalvarTodas = async () => {
        if (!resultado) return;

        setSalvandoTodas(true);
        try {
            // Filtrar apenas as alocações que ainda não foram salvas
            const alocacoesNaoSalvas = resultado.data.proposta_alocacao.alocacoes
                .filter(a => !alocacoesSalvas.has(a.oferta_id))
                .map(a => ({
                    oferta_id: a.oferta_id,
                    professor_id: a.professor_id,
                }));

            // Se não houver alocações para salvar
            if (alocacoesNaoSalvas.length === 0) {
                toast.info("Todas as alocações já foram salvas!");
                setSalvandoTodas(false);
                return;
            }

            await createBulkAlocacoes({alocacoes: alocacoesNaoSalvas});

            // Marcar todas como salvas (incluindo as que já estavam)
            const novasAlocacoesSalvas = new Set(
                resultado.data.proposta_alocacao.alocacoes.map(a => a.oferta_id)
            );
            setAlocacoesSalvas(novasAlocacoesSalvas);

            toast.success("Alocações salvas com sucesso!", {
                description: `${alocacoesNaoSalvas.length} ${alocacoesNaoSalvas.length === 1 ? 'alocação criada' : 'alocações criadas'}`,
            });
        } catch (error) {
            toast.error("Erro ao salvar alocações", {
                description: error instanceof Error ? error.message : "Erro desconhecido",
            });
        } finally {
            setSalvandoTodas(false);
        }
    };

    const handleSalvarIndividual = async (ofertaId: number, professorId: number) => {
        setSalvandoIndividual(ofertaId);
        try {
            await createAlocacao({
                oferta_id: ofertaId,
                professor_id: professorId,
            });

            // Marcar como salva
            setAlocacoesSalvas(prev => new Set(prev).add(ofertaId));

            toast.success("Alocação salva com sucesso!");
        } catch (error) {
            toast.error("Erro ao salvar alocação", {
                description: error instanceof Error ? error.message : "Erro desconhecido",
            });
        } finally {
            setSalvandoIndividual(null);
        }
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
                    className="bg-warning text-warning-foreground hover:bg-warning/90 relative overflow-hidden"
                >
                    {isRunning ? (
                        <>
                            <div className="absolute inset-0 animate-data-flow opacity-30"></div>
                            <Brain className="mr-2 h-4 w-4 animate-ai-pulse relative z-10"/>
                            <span className="relative z-10">IA Processando...</span>
                        </>
                    ) : (
                        <>
                            <Play className="mr-2 h-4 w-4"/>
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
                            <Settings className="h-5 w-5 text-primary"/>
                            Parâmetros do Algoritmo
                        </CardTitle>
                        <CardDescription>
                            Configure os parâmetros do algoritmo genético
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label>Semestre</Label>
                            <Select
                                value={semestreSelecionado}
                                onValueChange={setSemestreSelecionado}
                                disabled={isRunning}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um semestre"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {semestres.map((semestre) => (
                                        <SelectItem key={semestre.id} value={semestre.nome}>
                                            {semestre.nome} ({semestre.ano})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

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

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label>Taxa de Crossover</Label>
                                <span className="text-sm font-semibold text-primary">
                  {crossover[0].toFixed(2)}
                </span>
                            </div>
                            <Slider
                                value={crossover}
                                onValueChange={setCrossover}
                                min={0.5}
                                max={1.0}
                                step={0.05}
                                disabled={isRunning}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-warning"/>
                            Status da Execução
                        </CardTitle>
                        <CardDescription>
                            Acompanhe o progresso do algoritmo
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Indicador de IA trabalhando */}
                        {isRunning && etapaIA && (
                            <div
                                className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Brain className="h-8 w-8 text-primary animate-pulse"/>
                                        <div
                                            className="absolute -inset-1 bg-primary/20 rounded-full blur-md animate-ping"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-primary flex items-center gap-2">
                                            <Activity className="h-4 w-4"/>
                                            IA Processando
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {etapaIA}
                                        </div>
                                    </div>
                                    <Cpu className="h-6 w-6 text-primary/60 animate-spin"
                                         style={{animationDuration: '2s'}}/>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Progresso da Etapa</span>
                                        <span
                                            className="font-semibold text-primary">{Math.round(progressoEtapa)}%</span>
                                    </div>
                                    <Progress value={progressoEtapa} className="h-1.5"/>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Progresso Geral</span>
                                <span className="font-semibold text-foreground">{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-2"/>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <span className="text-sm text-muted-foreground">Geração Atual</span>
                                <span className="font-semibold text-foreground">
                  {geracaoAtual} / {geracoes[0]}
                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Resultados - Só aparecem após execução */}
            {resultado && (
                <div className="space-y-6 animate-fade-in">
                    {/* Ações de Salvamento */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">Resultados da Alocação</h2>
                            <p className="text-muted-foreground mt-1">
                                Semestre: {resultado.data.semestre} | Tempo de
                                execução: {resultado.data.tempo_execucao_segundos.toFixed(2)}s
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                            >
                                <Download className="mr-2 h-4 w-4"/>
                                Exportar
                            </Button>
                            <Button
                                onClick={handleSalvarTodas}
                                disabled={salvandoTodas || alocacoesSalvas.size === resultado.data.proposta_alocacao.alocacoes.length}
                                className="bg-accent text-accent-foreground hover:bg-accent/90"
                            >
                                {salvandoTodas ? (
                                    <>
                                        <Clock className="mr-2 h-4 w-4 animate-spin"/>
                                        Salvando...
                                    </>
                                ) : alocacoesSalvas.size === resultado.data.proposta_alocacao.alocacoes.length ? (
                                    <>
                                        <CheckCircle2 className="mr-2 h-4 w-4"/>
                                        Todas Salvas
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4"/>
                                        Salvar Todas
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Métricas Principais */}
                    <div className="grid gap-6 md:grid-cols-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`p-3 rounded-lg ${resultado.data.resumo.percentual_compatibilidade === 100 ? 'bg-accent/10' : 'bg-warning/10'}`}>
                                        <CheckCircle2
                                            className={`h-6 w-6 ${resultado.data.resumo.percentual_compatibilidade === 100 ? 'text-accent' : 'text-warning'}`}/>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-foreground">
                                            {Math.round(resultado.data.resumo.percentual_compatibilidade)}%
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
                                        <BookOpen className="h-6 w-6 text-primary"/>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-foreground">
                                            {resultado.data.resumo.ofertas_com_match}/{resultado.data.resumo.ofertas_totais}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Ofertas Compatíveis</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`p-3 rounded-lg ${resultado.data.proposta_alocacao.alocacoes.filter(a => a.match !== "✅").length > 0 ? 'bg-warning/10' : 'bg-accent/10'}`}>
                                        {resultado.data.proposta_alocacao.alocacoes.filter(a => a.match !== "✅").length > 0 ? (
                                            <AlertTriangle className="h-6 w-6 text-warning"/>
                                        ) : (
                                            <CheckCircle2 className="h-6 w-6 text-accent"/>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-foreground">
                                            {resultado.data.proposta_alocacao.alocacoes.filter(a => a.match !== "✅").length}
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
                                        <Users className="h-6 w-6 text-primary"/>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-foreground">
                                            {resultado.data.resumo.professores_utilizados}/{resultado.data.resumo.total_professores}
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
                                        {resultado.data.proposta_alocacao.alocacoes.map((alocacao) => (
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
                                                        <div
                                                            className="text-xs text-muted-foreground">Turma {alocacao.turma}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-muted-foreground">Professor</div>
                                                        <div className="font-medium text-foreground">
                                                            {alocacao.professor_nome}
                                                        </div>
                                                        <div
                                                            className="text-xs text-muted-foreground">{alocacao.titulacao}</div>
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
                                                            Total: {alocacao.carga_maxima}h
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-muted-foreground">Status</div>
                                                        {alocacao.tem_competencia ? (
                                                            <Badge className="mt-1 bg-accent text-accent-foreground">
                                                                <CheckCircle2 className="h-3 w-3 mr-1"/>
                                                                Compatível
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline"
                                                                   className="mt-1 text-warning border-warning">
                                                                <XCircle className="h-3 w-3 mr-1"/>
                                                                Incompatível
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    {alocacoesSalvas.has(alocacao.oferta_id) ? (
                                                        <Button size="sm" variant="outline" disabled>
                                                            <CheckCircle2 className="h-4 w-4 mr-2 text-accent"/>
                                                            Salva
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleSalvarIndividual(alocacao.oferta_id, alocacao.professor_id)}
                                                            disabled={salvandoIndividual === alocacao.oferta_id}
                                                        >
                                                            {salvandoIndividual === alocacao.oferta_id ? (
                                                                <>
                                                                    <Clock className="h-4 w-4 mr-2 animate-spin"/>
                                                                    Salvando...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Save className="h-4 w-4 mr-2"/>
                                                                    Salvar
                                                                </>
                                                            )}
                                                        </Button>
                                                    )}
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
                                            {resultado.data.resumo.distribuicao_carga
                                                .sort((a, b) => b.percentual_utilizado - a.percentual_utilizado)
                                                .map((dist, idx) => (
                                                    <TableRow key={idx}>
                                                        <TableCell className="font-medium">{dist.professor}</TableCell>
                                                        <TableCell>{dist.carga_alocada}h</TableCell>
                                                        <TableCell>{dist.carga_maxima}h</TableCell>
                                                        <TableCell
                                                            className="text-muted-foreground">{dist.carga_livre}h</TableCell>
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
                                        <TrendingUp className="h-5 w-5 text-primary"/>
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
                                                    {resultado.data.evolucao_fitness.minimo[0].toFixed(2)}
                                                </div>
                                            </div>
                                            <div className="p-4 bg-accent/10 rounded-lg">
                                                <div className="text-sm text-muted-foreground">Fitness Final</div>
                                                <div className="text-2xl font-bold text-accent">
                                                    {resultado.data.evolucao_fitness.minimo[resultado.data.evolucao_fitness.minimo.length - 1].toFixed(2)}
                                                </div>
                                            </div>
                                            <div className="p-4 bg-primary/10 rounded-lg">
                                                <div className="text-sm text-muted-foreground">Melhoria</div>
                                                <div className="text-2xl font-bold text-primary">
                                                    {(
                                                        ((resultado.data.evolucao_fitness.minimo[0] -
                                                                resultado.data.evolucao_fitness.minimo[resultado.data.evolucao_fitness.minimo.length - 1]) /
                                                            resultado.data.evolucao_fitness.minimo[0]) * 100
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
                                                    {resultado.data.evolucao_fitness.geracoes.map((gen, idx) => (
                                                        <TableRow key={gen}>
                                                            <TableCell className="font-medium">#{gen}</TableCell>
                                                            <TableCell className="text-accent font-semibold">
                                                                {resultado.data.evolucao_fitness.minimo[idx].toFixed(2)}
                                                            </TableCell>
                                                            <TableCell>{resultado.data.evolucao_fitness.media[idx].toFixed(2)}</TableCell>
                                                            <TableCell className="text-muted-foreground">
                                                                {resultado.data.evolucao_fitness.maximo[idx].toFixed(2)}
                                                            </TableCell>
                                                            <TableCell>{resultado.data.evolucao_fitness.desvio[idx].toFixed(2)}</TableCell>
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
                                            <BarChart3 className="h-5 w-5 text-primary"/>
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
                          {resultado.data.qualidade.fitness_total.toFixed(2)}
                        </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Penalidade Incompetência</span>
                                                <span
                                                    className={`text-lg font-bold ${resultado.data.qualidade.penalidades.incompetencia > 0 ? 'text-warning' : 'text-accent'}`}>
                          {resultado.data.qualidade.penalidades.incompetencia.toFixed(2)}
                        </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Penalidade Sobrecarga</span>
                                                <span
                                                    className={`text-lg font-bold ${resultado.data.qualidade.penalidades.sobrecarga > 0 ? 'text-warning' : 'text-accent'}`}>
                          {resultado.data.qualidade.penalidades.sobrecarga.toFixed(2)}
                        </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Penalidade Desbalanceamento</span>
                                                <span
                                                    className={`text-lg font-bold ${resultado.data.qualidade.penalidades.desbalanceamento > 0 ? 'text-warning' : 'text-accent'}`}>
                          {resultado.data.qualidade.penalidades.desbalanceamento.toFixed(2)}
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
                                        {resultado.data.viabilidade.viavel ? (
                                            <div className="text-center py-8">
                                                <CheckCircle2 className="h-16 w-16 text-accent mx-auto mb-4"/>
                                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                                    Solução Viável
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    A alocação proposta atende a todas as restrições do sistema
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div
                                                    className="flex items-start gap-3 p-3 bg-warning/10 border border-warning rounded-lg">
                                                    <AlertTriangle className="h-5 w-5 text-warning mt-0.5"/>
                                                    <div>
                                                        <h4 className="font-semibold text-foreground mb-1">Problemas
                                                            Encontrados</h4>
                                                        <ul className="text-sm text-muted-foreground space-y-1">
                                                            {resultado.data.viabilidade.problemas.map((problema, idx) => (
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
                                                {resultado.data.parametros_utilizados.tamanho_populacao}
                                            </div>
                                        </div>
                                        <div className="p-4 bg-muted rounded-lg">
                                            <div className="text-sm text-muted-foreground">Gerações</div>
                                            <div className="text-xl font-bold text-foreground">
                                                {resultado.data.parametros_utilizados.num_geracoes}
                                            </div>
                                        </div>
                                        <div className="p-4 bg-muted rounded-lg">
                                            <div className="text-sm text-muted-foreground">Crossover</div>
                                            <div className="text-xl font-bold text-foreground">
                                                {resultado.data.parametros_utilizados.probabilidade_crossover}
                                            </div>
                                        </div>
                                        <div className="p-4 bg-muted rounded-lg">
                                            <div className="text-sm text-muted-foreground">Mutação</div>
                                            <div className="text-xl font-bold text-foreground">
                                                {resultado.data.parametros_utilizados.probabilidade_mutacao}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </div>
    );
}
