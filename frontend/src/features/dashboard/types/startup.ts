export interface FundingRound {
  id: string;
  startupId: string;
  amount: number;
  date: string;
  createdAt: string;
}

export interface Startup {
  id: string;
  name: string;
  sector: string;
  country: string;
  size: string;
  summary?: string | null;
  score?: number | null;
  createdAt: string;
  updatedAt: string;
  fundingRound?: FundingRound[];
}

export interface StartupsResponse {
  data: Startup[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardMetrics {
  totalStartups: number;
  totalFundingRounds: number;
  highPotentialCount: number;
  averageScore: number;
}

export interface FindStartupsParams {
  page?: number;
  limit?: number;
  sector?: string;
  country?: string;
  minScore?: number;
  search?: string;
}
