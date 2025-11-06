import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, BookOpen, Search, Upload, Download, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { fetchDisciplinas } from "@/lib/api";

interface Disciplina {
  id: string;
  codigo: string;
  nome: string;
  carga_horaria: number;
  departamento: string;
  area: {
    id: string;
    nome: string;
  };
}

export default function Disciplinas() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ['disciplinas'],
    queryFn: () => fetchDisciplinas({ per_page: 100 }), // Fetch more items to enable local search
  });

  const disciplinas = data?.data || [];

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
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Nova Disciplina
          </Button>
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
                        <Button variant="ghost" size="sm">
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
