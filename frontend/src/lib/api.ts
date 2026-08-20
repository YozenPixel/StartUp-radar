import {
  DashboardMetrics,
  FindStartupsParams,
  Startup,
  StartupsResponse,
} from '@/features/dashboard/types/startup';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

export async function fetchMetrics(): Promise<{ data: DashboardMetrics; isLive: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}/startups/metrics`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

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
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

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
