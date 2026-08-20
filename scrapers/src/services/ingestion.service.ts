import prisma from '../lib/db';
import { ScrapedStartup } from '../interfaces/scraper.interface';

export interface IngestionStats {
  totalReceived: number;
  inserted: number;
  updated: number;
  fundingRoundsAdded: number;
}

export class IngestionService {
  /**
   * Ingère et déduplique une liste de startups dans PostgreSQL via Prisma.
   */
  async ingestMany(startups: ScrapedStartup[]): Promise<IngestionStats> {
    const stats: IngestionStats = {
      totalReceived: startups.length,
      inserted: 0,
      updated: 0,
      fundingRoundsAdded: 0,
    };

    for (const scraped of startups) {
      try {
        const result = await this.ingestSingle(scraped);
        if (result.isNew) {
          stats.inserted++;
        } else {
          stats.updated++;
        }
        stats.fundingRoundsAdded += result.roundsAdded;
      } catch (error) {
        console.error(`❌ Erreur d'ingestion pour "${scraped.name}" :`, (error as Error).message);
      }
    }

    return stats;
  }

  private async ingestSingle(scraped: ScrapedStartup): Promise<{ isNew: boolean; roundsAdded: number }> {
    // Vérification de l'existence par nom (insensible à la casse)
    const existing = await prisma.startup.findFirst({
      where: {
        name: {
          equals: scraped.name.trim(),
          mode: 'insensitive',
        },
      },
      include: {
        fundingRound: true,
      },
    });

    let startupId: string;
    let isNew = false;
    let roundsAdded = 0;

    if (!existing) {
      // Création de la nouvelle startup
      const created = await prisma.startup.create({
        data: {
          name: scraped.name.trim(),
          sector: scraped.sector.trim(),
          country: scraped.country.trim(),
          size: scraped.size.trim(),
          summary: scraped.summary?.trim() || null,
        },
      });
      startupId = created.id;
      isNew = true;
      console.log(`✨ Nouvelle startup insérée : "${created.name}" (ID: ${created.id})`);
    } else {
      startupId = existing.id;
      // Mise à jour si de nouvelles informations plus précises sont disponibles
      await prisma.startup.update({
        where: { id: existing.id },
        data: {
          sector: scraped.sector || existing.sector,
          country: scraped.country || existing.country,
          size: scraped.size || existing.size,
        },
      });
    }

    // Gestion des levées de fonds associées (déduplication par date & montant)
    if (scraped.fundingRounds && scraped.fundingRounds.length > 0) {
      const existingRounds = existing?.fundingRound || [];

      for (const round of scraped.fundingRounds) {
        const roundDate = new Date(round.date);
        const roundExists = existingRounds.some(
          (r) =>
            Math.abs(r.amount - round.amount) < 1 &&
            Math.abs(new Date(r.date).getTime() - roundDate.getTime()) < 86400000 * 30, // 30 jours
        );

        if (!roundExists) {
          await prisma.fundingRound.create({
            data: {
              startupId,
              amount: round.amount,
              date: roundDate,
            },
          });
          roundsAdded++;
          console.log(`  💰 Levée de fonds enregistrée pour "${scraped.name}" : ${round.amount.toLocaleString('fr-FR')} €`);
        }
      }
    }

    return { isNew, roundsAdded };
  }
}
