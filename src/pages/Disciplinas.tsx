import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, BookOpen, Search, Upload, Download, Loader2, Trash2, Edit2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { fetchDisciplinas, createDisciplina, fetchAreas, deleteDisciplina, updateDisciplina, CreateDisciplinaData } from "@/lib/api";

interface Disciplina {
  id: string;
  nome: string;
  carga_horaria: number;
  nivel_esperado?: number;
  area: {
    id: string;
    nome: string;
  };
}

export default function Disciplinas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    carga_horaria: "",
    area_id: "",
    nivel_esperado: "3",
  });

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['disciplinas'],
    queryFn: () => fetchDisciplinas({ per_page: 100 }),
  });

  const { data: areasData, isLoading: isLoadingAreas } = useQuery({
    queryKey: ['areas'],
    queryFn: () => fetchAreas({ per_page: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: createDisciplina,
    onSuccess: () => {
      toast.success("Disciplina criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['disciplinas'] });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar disciplina: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateDisciplinaData }) => updateDisciplina(id, data),
    onSuccess: () => {
      toast.success("Disciplina atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['disciplinas'] });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar disciplina: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDisciplina,
    onSuccess: () => {
      toast.success("Disciplina excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['disciplinas'] });
      setDeletingId(null);
    },
    onError: (error: Error) => {
      toast.error(`Erro ao excluir disciplina: ${error.message}`);
      setDeletingId(null);
    },
  });

  const disciplinas = data?.data || [];
  const areas = areasData?.data || [];

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setFormData({
      nome: "",
      carga_horaria: "",
      area_id: "",
      nivel_esperado: "3",
    });
  };

  const handleEdit = (disciplina: Disciplina) => {
    setEditingId(Number(disciplina.id));
    setFormData({
      nome: disciplina.nome,
      carga_horaria: disciplina.carga_horaria.toString(),
      area_id: disciplina.area.id.toString(),
      nivel_esperado: disciplina.nivel_esperado?.toString() || "3",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      nome: formData.nome,
      carga_horaria: Number(formData.carga_horaria),
      area_id: Number(formData.area_id),
      nivel_esperado: Number(formData.nivel_esperado),
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const filteredDisciplinas = disciplinas.filter(
    (d) =>
      d.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.area.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (error) {
    return (
      <div className="p-8 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive">Erro ao carregar disciplinas: {error.message}</p>
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
          <h1 className="text-3xl font-bold text-foreground">Disciplinas</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as disciplinas do curso
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Nova Disciplina
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Disciplina" : "Criar Nova Disciplina"}</DialogTitle>
                <DialogDescription>
                  {editingId ? "Atualize os dados da disciplina" : "Preencha os dados da nova disciplina"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome da Disciplina</Label>
                    <Input
                      id="nome"
                      placeholder="Ex: Programação Python"
                      value={formData.nome}
                      onChange={(e) =>
                        setFormData({ ...formData, nome: e.target.value })
                      }
                      required
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carga_horaria">Carga Horária (horas)</Label>
                    <Input
                      id="carga_horaria"
                      type="number"
                      placeholder="Ex: 64"
                      value={formData.carga_horaria}
                      onChange={(e) =>
                        setFormData({ ...formData, carga_horaria: e.target.value })
                      }
                      required
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area_id">Área de Competência</Label>
                    <Select
                      value={formData.area_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, area_id: value })
                      }
                      required
                    >
                      <SelectTrigger id="area_id">
                        <SelectValue placeholder="Selecione uma área" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingAreas ? (
                          <SelectItem value="loading" disabled>
                            <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                            Carregando áreas...
                          </SelectItem>
                        ) : areas.length === 0 ? (
                          <SelectItem value="empty" disabled>
                            Nenhuma área cadastrada
                          </SelectItem>
                        ) : (
                          areas.map((area) => (
                            <SelectItem key={area.id} value={area.id.toString()}>
                              {area.nome}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nivel_esperado">Nível Esperado</Label>
                    <Select
                      value={formData.nivel_esperado}
                      onValueChange={(value) =>
                        setFormData({ ...formData, nivel_esperado: value })
                      }
                    >
                      <SelectTrigger id="nivel_esperado">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Ensino Médio</SelectItem>
                        <SelectItem value="1">Graduado</SelectItem>
                        <SelectItem value="2">Especialista</SelectItem>
                        <SelectItem value="3">Mestre</SelectItem>
                        <SelectItem value="4">Doutor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending || !formData.area_id}
                  >
                    {createMutation.isPending || updateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingId ? "Atualizando..." : "Criando..."}
                      </>
                    ) : (
                      editingId ? "Salvar Alterações" : "Criar Disciplina"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : disciplinas.length}
                </div>
                <div className="text-sm text-muted-foreground">Total de Disciplinas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : disciplinas.filter(d => d.area).length}
                </div>
                <div className="text-sm text-muted-foreground">Com Ofertas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : disciplinas.reduce((total, d) => total + +d.carga_horaria, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total de Horas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando disciplinas...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Competência</TableHead>
                  <TableHead>Carga Horária</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDisciplinas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "Nenhuma disciplina encontrada para a busca." : "Nenhuma disciplina cadastrada."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDisciplinas.map((disciplina) => (
                    <TableRow key={disciplina.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{disciplina.id}</TableCell>
                      <TableCell>{disciplina.nome}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{disciplina.area?.nome || 'Não definida'}</Badge>
                      </TableCell>
                      <TableCell>{disciplina.carga_horaria}h</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(disciplina)}
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => setDeletingId(Number(disciplina.id))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta disciplina? Esta ação não pode ser desfeita.
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
