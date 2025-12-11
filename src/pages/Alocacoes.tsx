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
import { UserCheck, Plus, Loader2, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  fetchAlocacoes,
  createAlocacao,
  deleteAlocacao,
  fetchOfertas,
  fetchProfessores
} from "@/lib/api";

export default function Alocacoes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    oferta_id: "",
    professor_id: "",
  });

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['alocacoes'],
    queryFn: () => fetchAlocacoes({ per_page: 100 }),
  });

  const { data: ofertasData, isLoading: isLoadingOfertas } = useQuery({
    queryKey: ['ofertas'],
    queryFn: () => fetchOfertas({ per_page: 100 }),
  });

  const { data: professoresData, isLoading: isLoadingProfessores } = useQuery({
    queryKey: ['professores'],
    queryFn: () => fetchProfessores({ per_page: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: createAlocacao,
    onSuccess: () => {
      toast.success("Alocação criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['alocacoes'] });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar alocação: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAlocacao,
    onSuccess: () => {
      toast.success("Alocação excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['alocacoes'] });
      setDeletingId(null);
    },
    onError: (error: Error) => {
      toast.error(`Erro ao excluir alocação: ${error.message}`);
      setDeletingId(null);
    },
  });

  const alocacoes = data?.data || [];
  const ofertas = ofertasData?.data || [];
  const professores = professoresData?.data || [];

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFormData({
      oferta_id: "",
      professor_id: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      oferta_id: Number(formData.oferta_id),
      professor_id: Number(formData.professor_id),
    };

    createMutation.mutate(payload);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const filteredAlocacoes = alocacoes.filter((alocacao) => {
    const searchLower = searchTerm.toLowerCase();
    const professorNome = alocacao.professor?.nome.toLowerCase() || "";
    const disciplinaNome = alocacao.oferta?.disciplina.nome.toLowerCase() || "";
    const turma = alocacao.oferta?.turma.toLowerCase() || "";
    const semestreNome = alocacao.oferta?.semestre.nome.toLowerCase() || "";

    return (
      professorNome.includes(searchLower) ||
      disciplinaNome.includes(searchLower) ||
      turma.includes(searchLower) ||
      semestreNome.includes(searchLower)
    );
  });

  if (error) {
    return (
      <div className="p-8 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive">Erro ao carregar alocações: {error.message}</p>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alocações</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as alocações de professores às ofertas de disciplinas
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Alocação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Alocação</DialogTitle>
              <DialogDescription>
                Associe um professor a uma oferta de disciplina
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="oferta_id">Oferta</Label>
                  <Select
                    value={formData.oferta_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, oferta_id: value })
                    }
                    disabled={isLoadingOfertas}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma oferta" />
                    </SelectTrigger>
                    <SelectContent>
                      {ofertas.map((oferta) => (
                        <SelectItem key={oferta.id} value={oferta.id.toString()}>
                          {oferta.disciplina.nome} - Turma {oferta.turma} ({oferta.semestre.nome})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="professor_id">Professor</Label>
                  <Select
                    value={formData.professor_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, professor_id: value })
                    }
                    disabled={isLoadingProfessores}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um professor" />
                    </SelectTrigger>
                    <SelectContent>
                      {professores.map((professor) => (
                        <SelectItem key={professor.id} value={professor.id.toString()}>
                          {professor.nome} - {professor.titulacao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || !formData.oferta_id || !formData.professor_id}
                >
                  {createMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Criar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Alocações</p>
                <p className="text-2xl font-bold">{alocacoes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <UserCheck className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Professores Alocados</p>
                <p className="text-2xl font-bold">
                  {new Set(alocacoes.map(a => a.professor_id)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ofertas Alocadas</p>
                <p className="text-2xl font-bold">
                  {new Set(alocacoes.map(a => a.oferta_id)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por professor, disciplina ou turma..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredAlocacoes.length === 0 ? (
            <div className="text-center py-12">
              <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Nenhuma alocação encontrada com esse filtro"
                  : "Nenhuma alocação cadastrada ainda"}
              </p>
              {!searchTerm && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Criar primeira alocação
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Professor
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Disciplina
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Turma
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Semestre
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Carga Horária
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Titulação
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAlocacoes.map((alocacao) => (
                    <tr key={alocacao.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{alocacao.professor?.nome || "N/A"}</div>
                        <div className="text-sm text-muted-foreground">
                          {alocacao.professor?.modelo_contratacao || "N/A"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">
                          {alocacao.oferta?.disciplina?.nome || "N/A"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">
                          {alocacao.oferta?.turma || "N/A"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          {alocacao.oferta?.semestre?.nome || "N/A"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {alocacao.oferta?.semestre?.ano || "N/A"} - {alocacao.oferta?.semestre?.periodo || "N/A"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">
                          {alocacao.oferta?.disciplina?.carga_horaria || "N/A"}h
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">
                          {alocacao.professor?.titulacao || "N/A"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingId(alocacao.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deletingId !== null} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta alocação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && handleDelete(deletingId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

