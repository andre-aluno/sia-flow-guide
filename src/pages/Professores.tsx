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
import { Plus, Users, Search, Upload, Download, Loader2, Edit2, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { fetchProfessores, createProfessor, fetchAreas, updateProfessor, deleteProfessor, CreateProfessorData, Professor } from "@/lib/api";

export default function Professores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    titulacao: "Mestre",
    modelo_contratacao: "Mensalista ",
    area_ids: [] as number[],
  });

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['professores'],
    queryFn: () => fetchProfessores({ per_page: 100 }),
  });

  const { data: areasData, isLoading: isLoadingAreas } = useQuery({
    queryKey: ['areas'],
    queryFn: () => fetchAreas({ per_page: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: createProfessor,
    onSuccess: () => {
      toast.success("Professor criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['professores'] });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar professor: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateProfessorData }) => updateProfessor(id, data),
    onSuccess: () => {
      toast.success("Professor atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['professores'] });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar professor: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProfessor,
    onSuccess: () => {
      toast.success("Professor excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['professores'] });
      setDeletingId(null);
    },
    onError: (error: Error) => {
      toast.error(`Erro ao excluir professor: ${error.message}`);
      setDeletingId(null);
    },
  });

  const professores = data?.data || [];
  const areas = areasData?.data || [];

  const titulacoes = [
    { value: "Ensino Médio", label: "Ensino Médio", nivel: 0 },
    { value: "Graduado", label: "Graduado", nivel: 1 },
    { value: "Especialista", label: "Especialista", nivel: 2 },
    { value: "Mestre", label: "Mestre", nivel: 3 },
    { value: "Doutor", label: "Doutor", nivel: 4 },
  ];

  const modelosContratacao = [
    { value: "Mensalista ", label: "Mensalista ", carga: "256.00" },
    { value: "Horista", label: "Horista", carga: "128.00" },
  ];

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setFormData({
      nome: "",
      titulacao: "Mestre",
      modelo_contratacao: "Mensalista ",
      area_ids: [],
    });
  };

  const handleEdit = (professor: Professor) => {
    setEditingId(professor.id);
    setFormData({
      nome: professor.nome,
      titulacao: professor.titulacao,
      modelo_contratacao: professor.modelo_contratacao,
      area_ids: professor.areas.map((area) => area.id),
    });
    setIsDialogOpen(true);
  };

  const handleAreaToggle = (areaId: number) => {
    setFormData(prev => ({
      ...prev,
      area_ids: prev.area_ids.includes(areaId)
        ? prev.area_ids.filter(id => id !== areaId)
        : [...prev.area_ids, areaId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const titulacao = titulacoes.find(t => t.value === formData.titulacao);
    const modelo = modelosContratacao.find(m => m.value === formData.modelo_contratacao);

    const payload = {
      nome: formData.nome,
      titulacao: formData.titulacao,
      nivel: titulacao?.nivel || 3,
      modelo_contratacao: formData.modelo_contratacao,
      carga_maxima: modelo?.carga || "256.00",
      area_ids: formData.area_ids,
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

  const filteredProfessores = professores.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.areas.some(area => area.nome.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getInitials = (nome: string) => {
    return nome
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const totalCargaHoraria = professores.reduce((acc, prof) => acc + parseFloat(prof.carga_maxima || "0"), 0);

  if (error) {
    return (
      <div className="p-8 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive">Erro ao carregar professores: {error.message}</p>
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
          <h1 className="text-3xl font-bold text-foreground">Professores</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os professores do sistema
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
                Novo Professor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Professor" : "Criar Novo Professor"}</DialogTitle>
                <DialogDescription>
                  {editingId ? "Atualize os dados do professor" : "Preencha os dados do novo professor"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Professor</Label>
                    <Input
                      id="nome"
                      placeholder="Ex: Dr. João Silva"
                      value={formData.nome}
                      onChange={(e) =>
                        setFormData({ ...formData, nome: e.target.value })
                      }
                      required
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="titulacao">Titulação</Label>
                      <Select
                        value={formData.titulacao}
                        onValueChange={(value) =>
                          setFormData({ ...formData, titulacao: value })
                        }
                      >
                        <SelectTrigger id="titulacao">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {titulacoes.map((tit) => (
                            <SelectItem key={tit.value} value={tit.value}>
                              {tit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="modelo_contratacao">Modelo de Contratação</Label>
                      <Select
                        value={formData.modelo_contratacao}
                        onValueChange={(value) =>
                          setFormData({ ...formData, modelo_contratacao: value })
                        }
                      >
                        <SelectTrigger id="modelo_contratacao">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {modelosContratacao.map((modelo) => (
                            <SelectItem key={modelo.value} value={modelo.value}>
                              {modelo.label} ({parseFloat(modelo.carga).toFixed(0)}h)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Áreas de Competência</Label>
                    {isLoadingAreas ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span className="text-sm text-muted-foreground">Carregando áreas...</span>
                      </div>
                    ) : areas.length === 0 ? (
                      <div className="text-sm text-muted-foreground py-4 text-center">
                        Nenhuma área cadastrada
                      </div>
                    ) : (
                      <div className="border rounded-md p-4 max-h-60 overflow-y-auto space-y-2">
                        {areas.map((area) => (
                          <div key={area.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`area-${area.id}`}
                              checked={formData.area_ids.includes(area.id)}
                              onCheckedChange={() => handleAreaToggle(area.id)}
                            />
                            <Label
                              htmlFor={`area-${area.id}`}
                              className="text-sm font-normal cursor-pointer flex-1"
                            >
                              {area.nome}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formData.area_ids.length} área(s) selecionada(s)
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending || !formData.nome}
                  >
                    {createMutation.isPending || updateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingId ? "Atualizando..." : "Criando..."}
                      </>
                    ) : (
                      editingId ? "Salvar Alterações" : "Criar Professor"
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
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : professores.length}
                </div>
                <div className="text-sm text-muted-foreground">Total de Professores</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : professores.filter(p => p.areas.length > 0).length}
                </div>
                <div className="text-sm text-muted-foreground">Com Áreas Definidas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <Users className="h-6 w-6 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : Math.round(totalCargaHoraria)}
                </div>
                <div className="text-sm text-muted-foreground">Horas Totais</div>
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
                placeholder="Buscar por nome ou área de competência..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando professores...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Professor</TableHead>
                  <TableHead>Titulação</TableHead>
                  <TableHead>Modelo Contratação</TableHead>
                  <TableHead>Áreas de Competência</TableHead>
                  <TableHead>Carga Máxima</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfessores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "Nenhum professor encontrado para a busca." : "Nenhum professor cadastrado."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProfessores.map((professor) => (
                    <TableRow key={professor.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials(professor.nome)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{professor.nome}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{professor.titulacao}</Badge>
                      </TableCell>
                      <TableCell>{professor.modelo_contratacao}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {professor.areas.length > 0 ? (
                            <>
                              {professor.areas.map((area) => (
                                <Badge key={area.id} variant="secondary" className="text-xs">
                                  {area.nome}
                                </Badge>
                              ))}
                            </>
                          ) : (
                            <span className="text-muted-foreground text-sm">Nenhuma área</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{parseFloat(professor.carga_maxima).toFixed(0)}h</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(professor)}
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => setDeletingId(professor.id)}
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
              Tem certeza que deseja excluir este professor? Esta ação não pode ser desfeita.
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
