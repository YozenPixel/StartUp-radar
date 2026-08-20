export interface ScrapedFundingRound {
  amount: number;
  date: string;
}

export interface ScrapedStartup {
  name: string;
  sector: string;
  country: string;
  size: string;
  summary?: string;
  fundingRounds?: ScrapedFundingRound[];
  sourceUrl?: string;
}

export interface IScraper {
  readonly name: string;
  scrape(): Promise<ScrapedStartup[]>;
}
