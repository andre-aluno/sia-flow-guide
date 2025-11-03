import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, Calendar, Edit2, Trash2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Semestre {
  id: string;
  nome: string;
  ano: number;
  periodo: string;
  ativo: boolean;
  dataInicio: string;
  dataFim: string;
}

const mockSemestres: Semestre[] = [
  {
    id: "1",
    nome: "2024.1",
    ano: 2024,
    periodo: "1",
    ativo: true,
    dataInicio: "2024-02-01",
    dataFim: "2024-06-30",
  },
  {
    id: "2",
    nome: "2023.2",
    ano: 2023,
    periodo: "2",
    ativo: false,
    dataInicio: "2023-08-01",
    dataFim: "2023-12-20",
  },
];

export default function Semestres() {
  const [semestres, setSemestres] = useState<Semestre[]>(mockSemestres);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    ano: new Date().getFullYear(),
    periodo: "1",
    dataInicio: "",
    dataFim: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const novoSemestre: Semestre = {
      id: String(Date.now()),
      nome: formData.nome,
      ano: formData.ano,
      periodo: formData.periodo,
      ativo: true,
      dataInicio: formData.dataInicio,
      dataFim: formData.dataFim,
    };
    setSemestres([novoSemestre, ...semestres]);
    setIsDialogOpen(false);
    toast.success("Semestre criado com sucesso!");
    setFormData({
      nome: "",
      ano: new Date().getFullYear(),
      periodo: "1",
      dataInicio: "",
      dataFim: "",
    });
  };

  const handleDelete = (id: string) => {
    setSemestres(semestres.filter((s) => s.id !== id));
    toast.success("Semestre removido com sucesso!");
  };

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
              <Plus className="mr-2 h-4 w-4" />
              Novo Semestre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Semestre</DialogTitle>
              <DialogDescription>
                Preencha os dados do semestre letivo
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Semestre</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: 2024.1"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
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
                        setFormData({ ...formData, ano: Number(e.target.value) })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="periodo">Período</Label>
                    <Input
                      id="periodo"
                      placeholder="1 ou 2"
                      value={formData.periodo}
                      onChange={(e) =>
                        setFormData({ ...formData, periodo: e.target.value })
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
                        setFormData({ ...formData, dataInicio: e.target.value })
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
                        setFormData({ ...formData, dataFim: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Criar Semestre</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Semestres Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {semestres.map((semestre) => (
          <Card
            key={semestre.id}
            className={`hover:shadow-lg transition-all ${
              semestre.ativo ? "ring-2 ring-primary" : ""
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <CardTitle>{semestre.nome}</CardTitle>
                </div>
                {semestre.ativo && (
                  <span className="flex items-center gap-1 text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                    <CheckCircle className="h-3 w-3" />
                    Ativo
                  </span>
                )}
              </div>
              <CardDescription>
                {semestre.dataInicio} até {semestre.dataFim}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Ano: {semestre.ano}</div>
                <div>Período: {semestre.periodo}º</div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit2 className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(semestre.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
