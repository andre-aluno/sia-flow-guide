import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Edit2, Trash2, Loader2, Layers } from "lucide-react";
import { toast } from "sonner";
import { fetchAreas, createArea, updateArea, deleteArea, Area } from "@/lib/api";

export default function Areas() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        nome: "",
    });

    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ['areas'],
        queryFn: () => fetchAreas({ per_page: 100 }),
    });

    const createMutation = useMutation({
        mutationFn: createArea,
        onSuccess: () => {
            toast.success("Área de competência criada com sucesso!");
            queryClient.invalidateQueries({ queryKey: ['areas'] });
            handleCloseDialog();
        },
        onError: (error: Error) => {
            toast.error(`Erro ao criar área: ${error.message}`);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: { nome: string } }) => updateArea(id, data),
        onSuccess: () => {
            toast.success("Área de competência atualizada com sucesso!");
            queryClient.invalidateQueries({ queryKey: ['areas'] });
            handleCloseDialog();
        },
        onError: (error: Error) => {
            toast.error(`Erro ao atualizar área: ${error.message}`);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteArea,
        onSuccess: () => {
            toast.success("Área de competência excluída com sucesso!");
            queryClient.invalidateQueries({ queryKey: ['areas'] });
            setDeletingId(null);
        },
        onError: (error: Error) => {
            toast.error(`Erro ao excluir área: ${error.message}`);
            setDeletingId(null);
        },
    });

    const areas = data?.data || [];

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingId(null);
        setFormData({
            nome: "",
        });
    };

    const handleEdit = (area: Area) => {
        setEditingId(area.id);
        setFormData({
            nome: area.nome,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            updateMutation.mutate({ id: editingId, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id);
    };

    if (error) {
        return (
            <div className="p-8 space-y-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-destructive">Erro ao carregar áreas: {error.message}</p>
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
                    <h1 className="text-3xl font-bold text-foreground">Áreas de Competência</h1>
                    <p className="text-muted-foreground mt-1">
                        Gerencie as áreas de competência das disciplinas
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Área
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Editar Área" : "Criar Nova Área"}</DialogTitle>
                            <DialogDescription>
                                {editingId ? "Atualize o nome da área de competência." : "Preencha o nome da área de competência"}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nome">Nome da Área</Label>
                                    <Input
                                        id="nome"
                                        placeholder="Ex: Inteligência Artificial"
                                        value={formData.nome}
                                        onChange={(e) =>
                                            setFormData({ ...formData, nome: e.target.value })
                                        }
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                                    {createMutation.isPending || updateMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {editingId ? "Atualizando..." : "Criando..."}
                                        </>
                                    ) : (
                                        editingId ? "Salvar Alterações" : "Criar Área"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <Layers className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-foreground">
                                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : areas.length}
                            </div>
                            <div className="text-sm text-muted-foreground">Áreas Cadastradas</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Loading State */}
            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Carregando áreas...</span>
                </div>
            ) : (
                /* Areas Grid */
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {areas.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-4 bg-muted rounded-full">
                                    <Layers className="h-12 w-12 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-lg font-medium text-foreground">Nenhuma área cadastrada</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Clique em "Nova Área" para começar
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        areas.map((area) => (
                            <Card
                                key={area.id}
                                className="hover:shadow-lg transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <div className="p-2 bg-primary/10 rounded-md shrink-0">
                                                <Layers className="h-4 w-4 text-primary" />
                                            </div>
                                            <CardTitle className="text-base truncate" title={area.nome}>
                                                {area.nome}
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 hover:bg-primary hover:text-primary-foreground"
                                            onClick={() => handleEdit(area)}
                                        >
                                            <Edit2 className="h-3 w-3 mr-1" />
                                            Editar
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="hover:bg-destructive hover:text-destructive-foreground"
                                            onClick={() => setDeletingId(area.id)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir esta área de competência? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deletingId && handleDelete(deletingId)}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {deleteMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Excluindo...
                                </>
                            ) : (
                                "Excluir"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

