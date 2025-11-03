import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Users, Search, Upload, Download } from "lucide-react";
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

interface Professor {
  id: string;
  nome: string;
  email: string;
  departamento: string;
  cargaMaxima: number;
  status: "ativo" | "inativo";
}

const mockProfessores: Professor[] = [
  { id: "1", nome: "Dr. João Silva", email: "joao@univ.br", departamento: "Informática", cargaMaxima: 12, status: "ativo" },
  { id: "2", nome: "Dra. Maria Santos", email: "maria@univ.br", departamento: "Informática", cargaMaxima: 16, status: "ativo" },
  { id: "3", nome: "Prof. Carlos Souza", email: "carlos@univ.br", departamento: "Matemática", cargaMaxima: 10, status: "ativo" },
  { id: "4", nome: "Dra. Ana Costa", email: "ana@univ.br", departamento: "Informática", cargaMaxima: 14, status: "inativo" },
];

export default function Professores() {
  const [professores] = useState<Professor[]>(mockProfessores);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProfessores = professores.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (nome: string) => {
    return nome
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

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
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Novo Professor
          </Button>
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
                <div className="text-2xl font-bold text-foreground">23</div>
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
                <div className="text-2xl font-bold text-foreground">20</div>
                <div className="text-sm text-muted-foreground">Ativos</div>
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
                <div className="text-2xl font-bold text-foreground">278</div>
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
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Professor</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Carga Máxima</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfessores.map((professor) => (
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
                  <TableCell>{professor.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{professor.departamento}</Badge>
                  </TableCell>
                  <TableCell>{professor.cargaMaxima}h</TableCell>
                  <TableCell>
                    <Badge
                      variant={professor.status === "ativo" ? "default" : "secondary"}
                      className={
                        professor.status === "ativo"
                          ? "bg-accent text-accent-foreground"
                          : ""
                      }
                    >
                      {professor.status}
                    </Badge>
                  </TableCell>
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
