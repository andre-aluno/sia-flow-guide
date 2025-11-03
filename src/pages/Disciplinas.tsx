import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, BookOpen, Search, Upload, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Disciplina {
  id: string;
  codigo: string;
  nome: string;
  cargaHoraria: number;
  departamento: string;
}

const mockDisciplinas: Disciplina[] = [
  { id: "1", codigo: "INF101", nome: "Introdução à Programação", cargaHoraria: 60, departamento: "Informática" },
  { id: "2", codigo: "INF201", nome: "Estruturas de Dados", cargaHoraria: 60, departamento: "Informática" },
  { id: "3", codigo: "MAT101", nome: "Cálculo I", cargaHoraria: 80, departamento: "Matemática" },
  { id: "4", codigo: "INF301", nome: "Banco de Dados", cargaHoraria: 60, departamento: "Informática" },
];

export default function Disciplinas() {
  const [disciplinas] = useState<Disciplina[]>(mockDisciplinas);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDisciplinas = disciplinas.filter(
    (d) =>
      d.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <div className="text-2xl font-bold text-foreground">48</div>
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
                <div className="text-2xl font-bold text-foreground">35</div>
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
                <div className="text-2xl font-bold text-foreground">3.2k</div>
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Carga Horária</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDisciplinas.map((disciplina) => (
                <TableRow key={disciplina.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{disciplina.codigo}</TableCell>
                  <TableCell>{disciplina.nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{disciplina.departamento}</Badge>
                  </TableCell>
                  <TableCell>{disciplina.cargaHoraria}h</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
