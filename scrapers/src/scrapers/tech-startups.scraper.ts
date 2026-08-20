import { IScraper, ScrapedStartup } from '../interfaces/scraper.interface';

export class TechStartupsScraper implements IScraper {
  readonly name = 'TechCrunch / Sifted European & US Startups Feed';

  async scrape(): Promise<ScrapedStartup[]> {
    console.log(`📡 [${this.name}] Extraction des signaux de croissance et tours de table récents...`);

    // Dataset structuré simulant l'extraction des flux d'actualités économiques et levées
    const results: ScrapedStartup[] = [
      {
        name: 'Mistral Foundry',
        sector: 'Artificial Intelligence',
        country: 'France',
        size: '51-200',
        summary: 'Développement d’infrastructures de modèles de fondation souverains pour entreprises.',
        fundingRounds: [
          { amount: 105000000, date: '2026-06-01T00:00:00.000Z' },
          { amount: 450000000, date: '2026-01-15T00:00:00.000Z' },
        ],
      },
      {
        name: 'VoltStream Grid',
        sector: 'CleanTech',
        country: 'Germany',
        size: '11-50',
        summary: 'Gestion prédictive et équilibrage par IA des réseaux électriques haute tension.',
        fundingRounds: [
          { amount: 18000000, date: '2026-05-20T00:00:00.000Z' },
        ],
      },
      {
        name: 'ShieldOps Quantum',
        sector: 'Cybersecurity',
        country: 'Israel',
        size: '11-50',
        summary: 'Protection cryptographique résistante aux ordinateurs quantiques pour banques et gouvernements.',
        fundingRounds: [
          { amount: 24000000, date: '2026-07-10T00:00:00.000Z' },
        ],
      },
      {
        name: 'AeroDrone Logistics',
        sector: 'Robotics & Supply Chain',
        country: 'USA',
        size: '51-200',
        summary: 'Flottes autonomes de drones pour la livraison médicale d’urgence.',
        fundingRounds: [
          { amount: 65000000, date: '2026-04-12T00:00:00.000Z' },
        ],
      },
      {
        name: 'CellularGen Bio',
        sector: 'HealthTech',
        country: 'United Kingdom',
        size: '11-50',
        summary: 'Thérapies géniques ciblées synthétisées via des réseaux neuronaux profonds.',
        fundingRounds: [
          { amount: 32000000, date: '2026-08-01T00:00:00.000Z' },
        ],
      },
    ];

    return results;
  }
}
