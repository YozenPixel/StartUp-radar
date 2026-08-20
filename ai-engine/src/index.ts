import { AnalyzerService } from './services/analyzer.service';
import prisma from './lib/db';

async function main() {
  const args = process.argv.slice(2);
  const analyzer = new AnalyzerService();

  console.log('⚡ StartupRadar AI Engine - Démarrage du service d\'analyse');

  try {
    if (args.includes('--all') || args.length === 0) {
      console.log('🔄 Traitement des startups en attente d\'évaluation...');
      const count = await analyzer.analyzePendingStartups(20);
      console.log(`✨ Traitement terminé : ${count} startup(s) analysée(s).`);
    } else {
      const startupId = args[0];
      if (startupId) {
        console.log(`🎯 Analyse de la startup ciblée : ${startupId}`);
        await analyzer.analyzeAndPersist(startupId);
      }
    }
  } catch (error) {
    console.error('💥 Erreur fatale dans le moteur IA :', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
