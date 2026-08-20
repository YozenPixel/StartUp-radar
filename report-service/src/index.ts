import { ReportGeneratorService } from './services/report-generator.service';
import prisma from './lib/db';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('📊 StartupRadar Report Service - Génération du Digest de Marché...');

  const generator = new ReportGeneratorService();

  try {
    const data = await generator.collectReportData();
    const markdown = generator.generateMarkdownDigest(data);

    // Sauvegarde du rapport généré
    const outputDir = path.resolve(__dirname, '../generated-reports');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `market-digest-${timestamp}.md`;
    const latestFile = `latest-market-digest.md`;

    fs.writeFileSync(path.join(outputDir, filename), markdown, 'utf-8');
    fs.writeFileSync(path.join(outputDir, latestFile), markdown, 'utf-8');

    console.log(`\n======================================================`);
    console.log(`📄 Digest généré avec succès dans : generated-reports/${latestFile}`);
    console.log(`======================================================\n`);
    console.log(markdown);
  } catch (error) {
    console.error('💥 Erreur lors de la génération du rapport :', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
