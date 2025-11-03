import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Plus, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Ofertas() {
  const [ofertas] = useState([
    { id: "1", semestre: "2024.1", disciplina: "INF101", turma: "A", vagas: 40, status: "pendente" },
    { id: "2", semestre: "2024.1", disciplina: "INF201", turma: "A", vagas: 35, status: "alocada" },
    { id: "3", semestre: "2024.1", disciplina: "MAT101", turma: "B", vagas: 50, status: "pendente" },
  ]);

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
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Nova Oferta
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">42</div>
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
                <div className="text-2xl font-bold text-foreground">28</div>
                <div className="text-sm text-muted-foreground">Alocadas</div>
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
                <div className="text-2xl font-bold text-foreground">14</div>
                <div className="text-sm text-muted-foreground">Pendentes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {ofertas.map((oferta) => (
              <div
                key={oferta.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold text-foreground">
                      {oferta.disciplina} - Turma {oferta.turma}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {oferta.semestre} • {oferta.vagas} vagas
                    </div>
                  </div>
                </div>
                <Badge
                  variant={oferta.status === "alocada" ? "default" : "secondary"}
                  className={
                    oferta.status === "alocada"
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }
                >
                  {oferta.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
