import prisma from '../lib/db';

export interface MarketReportData {
  generatedAt: string;
  totalStartups: number;
  highPotentialStartups: any[];
  recentFundingRounds: any[];
  topSectors: { sector: string; count: number }[];
}

export class ReportGeneratorService {
  /**
   * Collecte les données de marché et génère le rapport d'intelligence économique.
   */
  async collectReportData(): Promise<MarketReportData> {
    const [totalStartups, highPotential, recentRounds, allStartups] = await Promise.all([
      prisma.startup.count(),
      prisma.startup.findMany({
        where: { score: { gte: 8 } },
        include: { fundingRound: true },
        orderBy: { score: 'desc' },
        take: 10,
      }),
      prisma.fundingRound.findMany({
        include: { startup: true },
        orderBy: { date: 'desc' },
        take: 10,
      }),
      prisma.startup.findMany({
        select: { sector: true },
      }),
    ]);

    // Calcul de la répartition par secteur
    const sectorCounts: Record<string, number> = {};
    for (const s of allStartups) {
      sectorCounts[s.sector] = (sectorCounts[s.sector] || 0) + 1;
    }

    const topSectors = Object.entries(sectorCounts)
      .map(([sector, count]) => ({ sector, count }))
      .sort((a, b) => b.count - a.count);

    return {
      generatedAt: new Date().toISOString(),
      totalStartups,
      highPotentialStartups: highPotential,
      recentFundingRounds: recentRounds,
      topSectors,
    };
  }

  /**
   * Génère un digest exécutif au format Markdown.
   */
  generateMarkdownDigest(data: MarketReportData): string {
    const formattedDate = new Date(data.generatedAt).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    let md = `# 📊 StartupRadar - Market Intelligence Digest\n\n`;
    md += `**Date d'édition** : ${formattedDate}\n`;
    md += `**Base d'entreprises analysées** : ${data.totalStartups} startups répertoriées\n\n`;
    md += `---\n\n`;

    md += `## 🌟 Top Opportunités à Fort Potentiel (Score IA ≥ 8/10)\n\n`;
    if (data.highPotentialStartups.length === 0) {
      md += `*Aucune startup avec un score ≥ 8 pour le moment.*\n\n`;
    } else {
      for (const st of data.highPotentialStartups) {
        md += `### 🚀 ${st.name} — Score : **${st.score}/10**\n`;
        md += `- **Secteur** : ${st.sector} | **Pays** : ${st.country} | **Effectif** : ${st.size}\n`;
        if (st.summary) {
          md += `- **Analyse IA** : ${st.summary}\n`;
        }
        if (st.fundingRound && st.fundingRound.length > 0) {
          const totalLevé = st.fundingRound.reduce((acc: number, curr: any) => acc + curr.amount, 0);
          md += `- **Financement cumulé** : ${totalLevé.toLocaleString('fr-FR')} €\n`;
        }
        md += `\n`;
      }
    }

    md += `## 💰 Derniers Tours de Financement Détectés\n\n`;
    if (data.recentFundingRounds.length === 0) {
      md += `*Aucune levée de fonds récente enregistrée.*\n\n`;
    } else {
      md += `| Startup | Secteur | Montant | Date |\n`;
      md += `| :--- | :--- | :---: | :---: |\n`;
      for (const r of data.recentFundingRounds) {
        md += `| **${r.startup?.name || 'N/A'}** | ${r.startup?.sector || 'N/A'} | **${r.amount.toLocaleString('fr-FR')} €** | ${new Date(r.date).toLocaleDateString('fr-FR')} |\n`;
      }
      md += `\n`;
    }

    md += `## 📈 Répartition Sectorielle des Signaux\n\n`;
    for (const sec of data.topSectors.slice(0, 5)) {
      md += `- **${sec.sector}** : ${sec.count} startup(s)\n`;
    }

    md += `\n---\n*Rapport généré automatiquement par le microservice report-service de StartupRadar.*\n`;
    return md;
  }
}
