import {useState} from "react";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Plus, Calendar, Edit2, Trash2, Loader2, CheckCircle} from "lucide-react";
import {toast} from "sonner";
import {fetchSemestres, createSemestre, updateSemestre, CreateSemestreData} from "@/lib/api";
import {Badge} from "@/components/ui/badge";

interface Semestre {
    id: number;
    nome: string;
    ano: number;
    periodo: string;
    data_inicio: string;
    data_fim: string;
}

export default function Semestres() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        nome: "",
        ano: new Date().getFullYear(),
        periodo: "EADS1",
        dataInicio: "",
        dataFim: "",
    });

    const queryClient = useQueryClient();

    const {data, isLoading, error} = useQuery({
        queryKey: ['semestres'],
        queryFn: () => fetchSemestres({per_page: 100}),
    });

    const createMutation = useMutation({
        mutationFn: createSemestre,
        onSuccess: () => {
            toast.success("Semestre criado com sucesso!");
            queryClient.invalidateQueries({queryKey: ['semestres']});
            handleCloseDialog();
        },
        onError: (error: Error) => {
            toast.error(`Erro ao criar semestre: ${error.message}`);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({id, data}: {id: number, data: CreateSemestreData}) => updateSemestre(id, data),
        onSuccess: () => {
            toast.success("Semestre atualizado com sucesso!");
            queryClient.invalidateQueries({queryKey: ['semestres']});
            handleCloseDialog();
        },
        onError: (error: Error) => {
            toast.error(`Erro ao atualizar semestre: ${error.message}`);
        },
    });

    const semestres = data?.data || [];

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingId(null);
        setFormData({
            nome: "",
            ano: new Date().getFullYear(),
            periodo: "EADS1",
            dataInicio: "",
            dataFim: "",
        });
    };

    const handleEdit = (semestre: Semestre) => {
        setEditingId(semestre.id);

        // Converter datas para o formato YYYY-MM-DD
        const formatDateForInput = (dateString: string) => {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        setFormData({
            nome: semestre.nome,
            ano: semestre.ano,
            periodo: semestre.periodo,
            dataInicio: formatDateForInput(semestre.data_inicio),
            dataFim: formatDateForInput(semestre.data_fim),
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            nome: formData.nome,
            ano: formData.ano,
            periodo: formData.periodo,
            data_inicio: formData.dataInicio,
            data_fim: formData.dataFim,
        };

        if (editingId) {
            updateMutation.mutate({id: editingId, data: payload});
        } else {
            createMutation.mutate(payload);
        }
    };

    const handleDelete = (_id: number) => {
        // TODO: Implement API call to delete semester
        toast.success("Funcionalidade de exclusão será implementada!");
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const isSemestreAtivo = (semestre: Semestre) => {
        const hoje = new Date();
        const dataInicio = new Date(semestre.data_inicio);
        const dataFim = new Date(semestre.data_fim);

        // Remove a parte do tempo para comparar apenas as datas
        hoje.setHours(0, 0, 0, 0);
        dataInicio.setHours(0, 0, 0, 0);
        dataFim.setHours(0, 0, 0, 0);

        return hoje >= dataInicio && hoje <= dataFim;
    };

    // Contar semestres ativos
    const semestresAtivos = semestres.filter(isSemestreAtivo);

    if (error) {
        return (
            <div className="p-8 space-y-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-destructive">Erro ao carregar semestres: {error.message}</p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => window.location.reload()}
                            >
                                Tentar novamente
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Semestres</h1>
                    <p className="text-muted-foreground mt-1">
                        Gerencie os semestres letivos
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4"/>
                            Novo Semestre
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Editar Semestre" : "Criar Novo Semestre"}</DialogTitle>
                            <DialogDescription>
                                {editingId ? "Atualize os dados do semestre letivo." : "Preencha os dados do semestre letivo"}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nome">Nome do Semestre</Label>
                                    <Input
                                        id="nome"
                                        placeholder="Ex: 2022EADS2"
                                        value={formData.nome}
                                        onChange={(e) =>
                                            setFormData({...formData, nome: e.target.value})
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="ano">Ano</Label>
                                        <Input
                                            id="ano"
                                            type="number"
                                            value={formData.ano}
                                            onChange={(e) =>
                                                setFormData({...formData, ano: Number(e.target.value)})
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="periodo">Período</Label>
                                        <Input
                                            id="periodo"
                                            placeholder="Ex: EADS1, EADS2"
                                            value={formData.periodo}
                                            onChange={(e) =>
                                                setFormData({...formData, periodo: e.target.value})
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="dataInicio">Data Início</Label>
                                        <Input
                                            id="dataInicio"
                                            type="date"
                                            value={formData.dataInicio}
                                            onChange={(e) =>
                                                setFormData({...formData, dataInicio: e.target.value})
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dataFim">Data Fim</Label>
                                        <Input
                                            id="dataFim"
                                            type="date"
                                            value={formData.dataFim}
                                            onChange={(e) =>
                                                setFormData({...formData, dataFim: e.target.value})
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                                    {createMutation.isPending || updateMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                            {editingId ? "Atualizando..." : "Criando..."}
                                        </>
                                    ) : (
                                        editingId ? "Salvar Alterações" : "Criar Semestre"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <Calendar className="h-6 w-6 text-primary"/>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-foreground">
                                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin"/> : semestres.length}
                                </div>
                                <div className="text-sm text-muted-foreground">Total de Semestres</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CheckCircle className="h-6 w-6 text-green-600"/>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-foreground">
                                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin"/> : semestresAtivos.length}
                                </div>
                                <div className="text-sm text-muted-foreground">Semestres Ativos</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin"/>
                    <span className="ml-2">Carregando semestres...</span>
                </div>
            ) : (
                /* Semestres Grid */
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {semestres.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-muted-foreground">Nenhum semestre cadastrado.</p>
                        </div>
                    ) : (
                        semestres.map((semestre) => {
                            const isAtivo = isSemestreAtivo(semestre);
                            return (
                                <Card
                                    key={semestre.id}
                                    className={`hover:shadow-lg transition-all ${
                                        isAtivo ? "ring-2 ring-green-500 bg-green-50/50" : ""
                                    }`}
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-5 w-5 text-primary"/>
                                                <CardTitle>{semestre.nome}</CardTitle>
                                            </div>
                                            {isAtivo && (
                                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                                    <CheckCircle className="h-3 w-3 mr-1"/>
                                                    Ativo
                                                </Badge>
                                            )}
                                        </div>
                                        <CardDescription>
                                            {formatDate(semestre.data_inicio)} até {formatDate(semestre.data_fim)}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            <div>Ano: {semestre.ano}</div>
                                            <div>Período: {semestre.periodo}</div>
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => handleEdit(semestre)}
                                            >
                                                <Edit2 className="h-4 w-4 mr-1"/>
                                                Editar
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(semestre.id)}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive"
                                            >
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
