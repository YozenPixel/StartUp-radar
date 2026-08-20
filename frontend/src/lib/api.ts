import {
  DashboardMetrics,
  FindStartupsParams,
  FundingRound,
  Startup,
  StartupsResponse,
} from '@/features/dashboard/types/startup';
import { AuthResponse, LoginDto, RegisterDto, User } from '@/features/auth/types/auth';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem('startupradar_token');
  } catch {
    return null;
  }
}

export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

const FALLBACK_STARTUPS: Startup[] = [
  {
    id: '1',
    name: 'NeuralPulse AI',
    sector: 'Artificial Intelligence',
    country: 'France',
    size: '11-50',
    summary: 'Plateforme d’optimisation automatique des modèles LLM pour entreprises.',
    score: 9,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fundingRound: [{ id: 'f-1', startupId: '1', amount: 3500000, date: '2026-04-10', createdAt: new Date().toISOString() }],
  },
  {
    id: '2',
    name: 'GreenGrid Mobility',
    sector: 'CleanTech',
    country: 'Germany',
    size: '51-200',
    summary: 'Infrastructure de recharge intelligente et stockage décentralisé d’énergie.',
    score: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fundingRound: [{ id: 'f-2', startupId: '2', amount: 12000000, date: '2026-03-01', createdAt: new Date().toISOString() }],
  },
  {
    id: '3',
    name: 'BioSynthetix',
    sector: 'HealthTech',
    country: 'Switzerland',
    size: '1-10',
    summary: 'Découverte de molécules thérapeutiques assistée par modèles génératifs.',
    score: 9,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fundingRound: [{ id: 'f-3', startupId: '3', amount: 5000000, date: '2026-05-18', createdAt: new Date().toISOString() }],
  },
  {
    id: '4',
    name: 'QuantumVault',
    sector: 'Cybersecurity',
    country: 'USA',
    size: '11-50',
    summary: 'Cryptographie post-quantique pour la protection des flux financiers critiques.',
    score: 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fundingRound: [{ id: 'f-4', startupId: '4', amount: 8000000, date: '2026-02-14', createdAt: new Date().toISOString() }],
  },
  {
    id: '5',
    name: 'OmniLogistics',
    sector: 'Supply Chain',
    country: 'Netherlands',
    size: '1-10',
    summary: 'Automatisation prédictive des chaînes d’approvisionnement maritimes.',
    score: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const FALLBACK_METRICS: DashboardMetrics = {
  totalStartups: 142,
  totalFundingRounds: 58,
  highPotentialCount: 39,
  averageScore: 7.6,
};

export async function loginUser(dto: LoginDto): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Identifiants invalides' }));
    throw new Error(err.message || 'Échec de la connexion');
  }

  return res.json();
}

export async function registerUser(dto: RegisterDto): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Erreur lors de l\'inscription' }));
    throw new Error(err.message || 'Échec de l\'inscription');
  }

  return res.json();
}

export async function fetchMetrics(): Promise<{ data: DashboardMetrics; isLive: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}/startups/metrics`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: DashboardMetrics = await res.json();
    return { data, isLive: true };
  } catch (error) {
    console.warn('API backend non joignable pour les métriques, fallback local actif:', error);
    return { data: FALLBACK_METRICS, isLive: false };
  }
}

export async function fetchStartups(
  params: FindStartupsParams = {},
): Promise<{ data: StartupsResponse; isLive: boolean }> {
  try {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.sector) query.set('sector', params.sector);
    if (params.country) query.set('country', params.country);
    if (params.minScore) query.set('minScore', params.minScore.toString());
    if (params.search) query.set('search', params.search);

    const url = `${API_BASE_URL}/startups${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: StartupsResponse = await res.json();
    return { data: json, isLive: true };
  } catch (error) {
    console.warn('API backend non joignable pour les startups, fallback local actif:', error);

    let filtered = [...FALLBACK_STARTUPS];
    if (params.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(
        (st) =>
          st.name.toLowerCase().includes(s) ||
          st.sector.toLowerCase().includes(s) ||
          st.country.toLowerCase().includes(s),
      );
    }
    if (params.sector) {
      filtered = filtered.filter((st) => st.sector.toLowerCase() === params.sector?.toLowerCase());
    }
    if (params.country) {
      filtered = filtered.filter((st) => st.country.toLowerCase() === params.country?.toLowerCase());
    }
    if (params.minScore) {
      filtered = filtered.filter((st) => (st.score || 0) >= (params.minScore || 0));
    }

    const page = params.page || 1;
    const limit = params.limit || 10;
    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return {
      data: {
        data: paginated,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
      isLive: false,
    };
  }
}

export async function fetchStartupById(id: string): Promise<{ data: Startup | null; isLive: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}/startups/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: Startup = await res.json();
    return { data, isLive: true };
  } catch (error) {
    console.warn(`API non joignable pour startup ${id}, recherche locale fallback :`, error);
    const local = FALLBACK_STARTUPS.find((s) => s.id === id) || null;
    return { data: local, isLive: false };
  }
}

export async function createStartup(data: {
  name: string;
  sector: string;
  country: string;
  size: string;
  summary?: string;
  score?: number;
}): Promise<Startup> {
  const res = await fetch(`${API_BASE_URL}/startups`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Erreur lors de la création' }));
    throw new Error(err.message || `Erreur HTTP ${res.status}`);
  }

  return res.json();
}

export async function updateStartup(
  id: string,
  data: Partial<{
    name: string;
    sector: string;
    country: string;
    size: string;
    summary?: string;
    score?: number;
  }>,
): Promise<Startup> {
  const res = await fetch(`${API_BASE_URL}/startups/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Erreur lors de la modification' }));
    throw new Error(err.message || `Erreur HTTP ${res.status}`);
  }

  return res.json();
}

export async function deleteStartup(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/startups/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Erreur HTTP ${res.status} lors de la suppression`);
  }
}

export async function createFundingRound(data: {
  startupId: string;
  amount: number;
  date: string;
}): Promise<FundingRound> {
  const res = await fetch(`${API_BASE_URL}/funding-rounds`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Erreur lors de l\'ajout du tour' }));
    throw new Error(err.message || `Erreur HTTP ${res.status}`);
  }

  return res.json();
}
