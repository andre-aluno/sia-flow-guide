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
import { ClipboardList, Plus, Sparkles, Loader2, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { fetchOfertas, createOferta, fetchDisciplinas, fetchSemestres, deleteOferta } from "@/lib/api";

export default function Ofertas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    disciplina_id: "",
    semestre_id: "",
    turma: "",
  });

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['ofertas'],
    queryFn: () => fetchOfertas({ per_page: 100 }),
  });

  const { data: disciplinasData, isLoading: isLoadingDisciplinas } = useQuery({
    queryKey: ['disciplinas'],
    queryFn: () => fetchDisciplinas({ per_page: 100 }),
  });

  const { data: semestresData, isLoading: isLoadingSemestres } = useQuery({
    queryKey: ['semestres'],
    queryFn: () => fetchSemestres({ per_page: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: createOferta,
    onSuccess: () => {
      toast.success("Oferta criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['ofertas'] });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar oferta: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOferta,
    onSuccess: () => {
      toast.success("Oferta excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['ofertas'] });
      setDeletingId(null);
    },
    onError: (error: Error) => {
      toast.error(`Erro ao excluir oferta: ${error.message}`);
      setDeletingId(null);
    },
  });

  const ofertas = data?.data || [];
  const disciplinas = disciplinasData?.data || [];
  const semestres = semestresData?.data || [];

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFormData({
      disciplina_id: "",
      semestre_id: "",
      turma: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      disciplina_id: Number(formData.disciplina_id),
      semestre_id: Number(formData.semestre_id),
      turma: formData.turma,
    };

    createMutation.mutate(payload);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const filteredOfertas = ofertas.filter(
    (o) =>
      o.disciplina.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.semestre.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.turma.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="p-8 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive">Erro ao carregar ofertas: {error.message}</p>
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
          <h1 className="text-3xl font-bold text-foreground">Ofertas</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as ofertas de disciplinas por semestre
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-accent/10 text-accent hover:bg-accent/20">
            <Sparkles className="mr-2 h-4 w-4" />
            Gerar Ofertas Automáticas
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Nova Oferta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Oferta</DialogTitle>
                <DialogDescription>
                  Preencha os dados da nova oferta de disciplina
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="semestre_id">Semestre</Label>
                    <Select
                      value={formData.semestre_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, semestre_id: value })
                      }
                      required
                    >
                      <SelectTrigger id="semestre_id">
                        <SelectValue placeholder="Selecione o semestre" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingSemestres ? (
                          <SelectItem value="loading" disabled>
                            <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                            Carregando semestres...
                          </SelectItem>
                        ) : semestres.length === 0 ? (
                          <SelectItem value="empty" disabled>
                            Nenhum semestre cadastrado
                          </SelectItem>
                        ) : (
                          semestres.map((semestre) => (
                            <SelectItem key={semestre.id} value={semestre.id.toString()}>
                              {semestre.nome} - {semestre.ano}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="disciplina_id">Disciplina</Label>
                    <Select
                      value={formData.disciplina_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, disciplina_id: value })
                      }
                      required
                    >
                      <SelectTrigger id="disciplina_id">
                        <SelectValue placeholder="Selecione a disciplina" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {isLoadingDisciplinas ? (
                          <SelectItem value="loading" disabled>
                            <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                            Carregando disciplinas...
                          </SelectItem>
                        ) : disciplinas.length === 0 ? (
                          <SelectItem value="empty" disabled>
                            Nenhuma disciplina cadastrada
                          </SelectItem>
                        ) : (
                          disciplinas.map((disciplina) => (
                            <SelectItem key={disciplina.id} value={disciplina.id.toString()}>
                              {disciplina.nome} ({parseFloat(String(disciplina.carga_horaria)).toFixed(0)}h)
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="turma">Turma</Label>
                    <Input
                      id="turma"
                      placeholder="Ex: A, B, C"
                      value={formData.turma}
                      onChange={(e) =>
                        setFormData({ ...formData, turma: e.target.value.toUpperCase() })
                      }
                      required
                      maxLength={5}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || !formData.disciplina_id || !formData.semestre_id || !formData.turma}
                  >
                    {createMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      "Criar Oferta"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : ofertas.length}
                </div>
                <div className="text-sm text-muted-foreground">Total de Ofertas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <ClipboardList className="h-6 w-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : new Set(ofertas.map(o => o.disciplina.id)).size}
                </div>
                <div className="text-sm text-muted-foreground">Disciplinas Ofertadas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <ClipboardList className="h-6 w-6 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : new Set(ofertas.map(o => o.semestre.id)).size}
                </div>
                <div className="text-sm text-muted-foreground">Semestres</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por disciplina, semestre ou turma..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Ofertas List */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando ofertas...</span>
            </div>
          ) : filteredOfertas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm ? "Nenhuma oferta encontrada para a busca." : "Nenhuma oferta cadastrada."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOfertas.map((oferta) => (
                <div
                  key={oferta.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold text-foreground">
                        {oferta.disciplina.nome} - Turma {oferta.turma}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {oferta.semestre.nome} • {parseFloat(oferta.disciplina.carga_horaria).toFixed(0)}h
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {oferta.semestre.ano}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => setDeletingId(oferta.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta oferta? Esta ação não pode ser desfeita.
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
