import { IngestionService } from './services/ingestion.service';
import { TechStartupsScraper } from './scrapers/tech-startups.scraper';
import { ProductHuntScraper } from './scrapers/product-hunt.scraper';
import prisma from './lib/db';

async function main() {
  console.log('🚀 StartupRadar Scrapers Engine - Lancement des tâches d\'extraction');

  const ingestionService = new IngestionService();
  const scrapers = [
    new TechStartupsScraper(),
    new ProductHuntScraper(),
  ];

  let totalInserted = 0;
  let totalUpdated = 0;
  let totalRounds = 0;

  for (const scraper of scrapers) {
    try {
      console.log(`\n========================================`);
      console.log(`▶ Exécution du scraper : ${scraper.name}`);
      console.log(`========================================`);

      const scrapedStartups = await scraper.scrape();
      console.log(`📥 ${scrapedStartups.length} startup(s) collectée(s). Ingestion en base...`);

      const stats = await ingestionService.ingestMany(scrapedStartups);
      totalInserted += stats.inserted;
      totalUpdated += stats.updated;
      totalRounds += stats.fundingRoundsAdded;

      console.log(`📊 Résultat [${scraper.name}] : +${stats.inserted} insérée(s), ${stats.updated} mise(s) à jour, +${stats.fundingRoundsAdded} levée(s).`);
    } catch (error) {
      console.error(`💥 Erreur lors de l'exécution de ${scraper.name} :`, error);
    }
  }

  console.log(`\n🎉 Ingestion globale terminée !`);
  console.log(`📈 Bilan : ${totalInserted} nouvelles startups, ${totalUpdated} mises à jour, ${totalRounds} levées de fonds ajoutées.`);

  await prisma.$disconnect();
}

main().catch(console.error);
