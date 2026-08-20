import { AnalyzerService } from './services/analyzer.service';
import prisma from './lib/db';

async function main() {
  const args = process.argv.slice(2);
  const analyzer = new AnalyzerService();

  console.log('======================================================================');
  console.log('⚡ StartupRadar AI Engine - Moteur d\'Intelligence Artificielle');
  console.log('======================================================================');

  // Exécution du Healthcheck / Test de Connexion préalable
  console.log('🔍 Test de la connexion IA en cours...');
  const testResult = await analyzer.testConnection();

  if (testResult.ok) {
    console.log(`✅ [CONNEXION OK] Fournisseur : ${testResult.provider}`);
    console.log(`   Modèle actif : ${testResult.model}`);
    console.log(`   Temps de réponse : ${testResult.latencyMs}ms`);
  } else {
    console.log('----------------------------------------------------------------------');
    console.log(`❌ [ÉCHEC DU TEST DE CONNEXION IA]`);
    console.log(`   Fournisseur : ${testResult.provider}`);
    console.log(`   Modèle ciblé : ${testResult.model}`);
    console.log(`   Type d'erreur : ${testResult.errorType}`);
    console.log(`   Diagnostic : ${testResult.message}`);
    if (testResult.details) {
      console.log(`   Détails : ${testResult.details}`);
    }
    console.log('----------------------------------------------------------------------');
    console.log('⚠️  Mode de secours actif : les analyses utiliseront le moteur heuristique.');
  }
  console.log('======================================================================\n');

  // Si le script est appelé uniquement pour tester la clé (--test ou -t)
  if (args.includes('--test') || args.includes('-t')) {
    if (testResult.ok) {
      console.log('🎉 Test de clé API réussi ! Votre configuration IA est prête à l\'emploi.');
      process.exit(0);
    } else {
      console.error('🚫 Le test de connexion a échoué. Veuillez vérifier vos clés dans .env');
      process.exit(1);
    }
  }

  try {
    if (args.includes('--all') || args.length === 0) {
      console.log('🔄 Traitement des startups en attente d\'évaluation...');
      const count = await analyzer.analyzePendingStartups(20);
      console.log(`✨ Traitement terminé : ${count} startup(s) analysée(s).`);
    } else {
      const startupId = args.find((arg) => !arg.startsWith('-'));
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

