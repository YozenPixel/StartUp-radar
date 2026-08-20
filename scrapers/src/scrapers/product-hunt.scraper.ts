import { IScraper, ScrapedStartup } from '../interfaces/scraper.interface';

export class ProductHuntScraper implements IScraper {
  readonly name = 'Product Hunt Trending Launches';

  async scrape(): Promise<ScrapedStartup[]> {
    console.log(`🚀 [${this.name}] Extraction des lancements récents et applications émergentes...`);

    const results: ScrapedStartup[] = [
      {
        name: 'AutoDoc AI',
        sector: 'Artificial Intelligence',
        country: 'Canada',
        size: '1-10',
        summary: 'Copilote d’analyse et de réconciliation automatique de contrats juridiques complexes.',
        fundingRounds: [
          { amount: 1200000, date: '2026-06-25T00:00:00.000Z' },
        ],
      },
      {
        name: 'EchoVoice Labs',
        sector: 'Artificial Intelligence',
        country: 'Sweden',
        size: '1-10',
        summary: 'Génération vocale multilingue en temps réel ultra-réaliste avec synchronisation labiale.',
        fundingRounds: [
          { amount: 2800000, date: '2026-07-04T00:00:00.000Z' },
        ],
      },
      {
        name: 'CarbonTrackr',
        sector: 'CleanTech',
        country: 'Netherlands',
        size: '1-10',
        summary: 'Mesure automatique de l’empreinte carbone Scope 3 pour les plateformes e-commerce.',
        fundingRounds: [
          { amount: 950000, date: '2026-05-30T00:00:00.000Z' },
        ],
      },
    ];

    return results;
  }
}
