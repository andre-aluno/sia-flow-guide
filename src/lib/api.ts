const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  per_page?: number;
  total_pages?: number;
}

interface Disciplina {
  id: string;
  nome: string;
  carga_horaria: number;
  area: {
    id: string;
    nome: string;
  }
}

export interface Semestre {
  id: number;
  nome: string;
  ano: number;
  periodo: string;
  data_inicio: string;
  data_fim: string;
}

export interface DisciplinasParams {
  page?: number;
  per_page?: number;
}

export async function fetchDisciplinas(params: DisciplinasParams = {}): Promise<ApiResponse<Disciplina[]>> {
  const { page = 1, per_page = 10 } = params;
  const url = new URL(`${API_BASE_URL}/api/disciplinas`);

  url.searchParams.set('page', page.toString());
  url.searchParams.set('per_page', per_page.toString());

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch disciplinas: ${response.statusText}`);
  }

  return response.json();
}

export interface CreateDisciplinaData {
  nome: string;
  carga_horaria: number;
  area_id: number;
  nivel_esperado: number;
}

export async function createDisciplina(data: CreateDisciplinaData): Promise<Disciplina> {
  const url = `${API_BASE_URL}/api/disciplinas`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create disciplina: ${response.statusText}`);
  }

  return response.json();
}

export async function updateDisciplina(id: number, data: CreateDisciplinaData): Promise<Disciplina> {
  const url = `${API_BASE_URL}/api/disciplinas/${id}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update disciplina: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteDisciplina(id: number): Promise<void> {
  const url = `${API_BASE_URL}/api/disciplinas/${id}`;

  const response = await fetch(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to delete disciplina: ${response.statusText}`);
  }
}

export async function fetchSemestres(params: DisciplinasParams = {}): Promise<ApiResponse<Semestre[]>> {
  const { page = 1, per_page = 10 } = params;
  const url = new URL(`${API_BASE_URL}/api/semestres`);

  url.searchParams.set('page', page.toString());
  url.searchParams.set('per_page', per_page.toString());

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch semestres: ${response.statusText}`);
  }

  return response.json();
}

export interface CreateSemestreData {
  nome: string;
  ano: number;
  periodo: string;
  data_inicio: string;
  data_fim: string;
}

export async function createSemestre(data: CreateSemestreData): Promise<Semestre> {
  const url = `${API_BASE_URL}/api/semestres`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create semestre: ${response.statusText}`);
  }

  return response.json();
}

export async function updateSemestre(id: number, data: CreateSemestreData): Promise<Semestre> {
  const url = `${API_BASE_URL}/api/semestres/${id}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update semestre: ${response.statusText}`);
  }

  return response.json();
}

// Areas API
export interface Area {
  id: number;
  nome: string;
}

export async function fetchAreas(params: DisciplinasParams = {}): Promise<ApiResponse<Area[]>> {
  const { page = 1, per_page = 100 } = params;
  const url = new URL(`${API_BASE_URL}/api/areas`);

  url.searchParams.set('page', page.toString());
  url.searchParams.set('per_page', per_page.toString());

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch areas: ${response.statusText}`);
  }

  return response.json();
}

export interface CreateAreaData {
  nome: string;
}

export async function createArea(data: CreateAreaData): Promise<Area> {
  const url = `${API_BASE_URL}/api/areas`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create area: ${response.statusText}`);
  }

  return response.json();
}

export async function updateArea(id: number, data: CreateAreaData): Promise<Area> {
  const url = `${API_BASE_URL}/api/areas/${id}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update area: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteArea(id: number): Promise<void> {
  const url = `${API_BASE_URL}/api/areas/${id}`;

  const response = await fetch(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to delete area: ${response.statusText}`);
  }
}

// Professores API
export interface Professor {
  id: number;
  nome: string;
  nivel: number;
  titulacao: string;
  modelo_contratacao: string;
  carga_maxima: string;
  areas: Area[];
}

export async function fetchProfessores(params: DisciplinasParams = {}): Promise<ApiResponse<Professor[]>> {
  const { page = 1, per_page = 100 } = params;
  const url = new URL(`${API_BASE_URL}/api/professores`);

  url.searchParams.set('page', page.toString());
  url.searchParams.set('per_page', per_page.toString());

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch professores: ${response.statusText}`);
  }

  return response.json();
}

export interface CreateProfessorData {
  nome: string;
  nivel: number;
  titulacao: string;
  modelo_contratacao: string;
  carga_maxima: string;
  area_ids: number[];
}

export async function createProfessor(data: CreateProfessorData): Promise<Professor> {
  const url = `${API_BASE_URL}/api/professores`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create professor: ${response.statusText}`);
  }

  return response.json();
}

export async function updateProfessor(id: number, data: CreateProfessorData): Promise<Professor> {
  const url = `${API_BASE_URL}/api/professores/${id}`;

  console.log(data)

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update professor: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteProfessor(id: number): Promise<void> {
  const url = `${API_BASE_URL}/api/professores/${id}`;

  const response = await fetch(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to delete professor: ${response.statusText}`);
  }
}

// Ofertas API
export interface Oferta {
  id: number;
  turma: string;
  disciplina: {
    id: number;
    nome: string;
    carga_horaria: string;
    nivel_esperado: number;
  };
  semestre: {
    id: number;
    nome: string;
    ano: number;
    periodo: string;
    data_inicio: string;
    data_fim: string;
  };
}

export async function fetchOfertas(params: DisciplinasParams = {}): Promise<ApiResponse<Oferta[]>> {
  const { page = 1, per_page = 100 } = params;
  const url = new URL(`${API_BASE_URL}/api/ofertas`);

  url.searchParams.set('page', page.toString());
  url.searchParams.set('per_page', per_page.toString());

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch ofertas: ${response.statusText}`);
  }

  return response.json();
}

export interface CreateOfertaData {
  disciplina_id: number;
  semestre_id: number;
  turma: string;
}

export async function createOferta(data: CreateOfertaData): Promise<Oferta> {
  const url = `${API_BASE_URL}/api/ofertas`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create oferta: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteOferta(id: number): Promise<void> {
  const url = `${API_BASE_URL}/api/ofertas/${id}`;

  const response = await fetch(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to delete oferta: ${response.statusText}`);
  }
}

// Algoritmo Genético API
export interface AGConfigDefaults {
  tamanho_populacao: number;
  num_geracoes: number;
  probabilidade_crossover: number;
  probabilidade_mutacao: number;
  elite_size: number;
  torneio_size: number;
  seed: number | null;
}

export interface AGConfigDefaultsResponse {
  data: AGConfigDefaults;
  message: string;
  status: string;
}

export async function fetchAGConfigDefaults(): Promise<AGConfigDefaultsResponse> {
  const url = `${API_BASE_URL}/api/ag/config/defaults`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch AG config defaults: ${response.statusText}`);
  }

  return response.json();
}

export interface ExecutarAGParams {
  semestre_nome: string;
  tamanho_populacao: number;
  num_geracoes: number;
  probabilidade_crossover: number;
  probabilidade_mutacao: number;
}

export interface AlocacaoItem {
  idx: number;
  oferta_id: number;
  professor_id: number;
  professor_nome: string;
  disciplina_nome: string;
  turma: string;
  carga_horaria: number;
  carga_maxima: number;
  carga_alocada: number;
  area_disciplina: string;
  tem_competencia: boolean;
  nivel_professor: number;
  nivel_esperado: number;
  titulacao: string;
  modelo_contratacao: string;
  match: string;
}

export interface DistribuicaoCarga {
  professor: string;
  carga_alocada: number;
  carga_maxima: number;
  carga_livre: number;
  percentual_utilizado: number;
}

export interface EvolucaoFitness {
  geracoes: number[];
  media: number[];
  minimo: number[];
  maximo: number[];
  desvio: number[];
}

export interface AGResultado {
  semestre: string;
  tempo_execucao_segundos: number;
  parametros_utilizados: {
    tamanho_populacao: number;
    num_geracoes: number;
    probabilidade_crossover: number;
    probabilidade_mutacao: number;
  };
  proposta_alocacao: {
    total_ofertas: number;
    alocacoes: AlocacaoItem[];
  };
  qualidade: {
    fitness_total: number;
    penalidades: {
      incompetencia: number;
      sobrecarga: number;
      desbalanceamento: number;
    };
  };
  resumo: {
    ofertas_totais: number;
    ofertas_com_match: number;
    ofertas_sem_match: number;
    percentual_compatibilidade: number;
    professores_utilizados: number;
    total_professores: number;
    distribuicao_carga: DistribuicaoCarga[];
    fitness_total: number;
  };
  viabilidade: {
    viavel: boolean;
    problemas: string[];
  };
  evolucao_fitness: EvolucaoFitness;
}

export interface ExecutarAGResponse {
  data: AGResultado;
  message: string;
  status: string;
}

export async function executarAG(params: ExecutarAGParams): Promise<ExecutarAGResponse> {
  const url = `${API_BASE_URL}/api/ag/executar`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to execute AG: ${response.statusText}`);
  }

  return response.json();
}

// Alocações API
export interface Alocacao {
  id: number;
  oferta_id: number;
  professor_id: number;
  oferta?: Oferta;
  professor?: Professor;
}

export async function fetchAlocacoes(params: DisciplinasParams = {}): Promise<ApiResponse<Alocacao[]>> {
  const { page = 1, per_page = 100 } = params;
  const url = new URL(`${API_BASE_URL}/api/alocacoes`);

  url.searchParams.set('page', page.toString());
  url.searchParams.set('per_page', per_page.toString());

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch alocacoes: ${response.statusText}`);
  }

  return response.json();
}

export interface CreateAlocacaoData {
  oferta_id: number;
  professor_id: number;
}

export interface BulkAlocacaoData {
  alocacoes: CreateAlocacaoData[];
}

export async function createAlocacao(data: CreateAlocacaoData): Promise<any> {
  const url = `${API_BASE_URL}/api/alocacoes`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create alocacao: ${response.statusText}`);
  }

  return response.json();
}

export async function createBulkAlocacoes(data: BulkAlocacaoData): Promise<any> {
  const url = `${API_BASE_URL}/api/alocacoes/bulk`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create bulk alocacoes: ${response.statusText}`);
  }

  return response.json();
}

