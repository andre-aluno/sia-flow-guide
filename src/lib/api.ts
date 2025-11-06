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

interface Semestre {
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

