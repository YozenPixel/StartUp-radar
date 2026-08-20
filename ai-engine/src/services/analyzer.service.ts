import OpenAI from 'openai';
import { z } from 'zod';
import prisma from '../lib/db';
import 'dotenv/config';

export const StartupAnalysisSchema = z.object({
  summary: z.string().describe("Résumé concis de la proposition de valeur et des opportunités d'affaires"),
  score: z.number().int().min(1).max(10).describe("Score d'opportunité de marché de 1 à 10"),
  keySignals: z.array(z.string()).describe("Signaux forts détectés (ex: levées, expansion d'équipe, traction)"),
  risks: z.array(z.string()).describe("Risques majeurs de marché ou de concurrence"),
  opportunityVerdict: z.string().describe("Verdict actionnable pour les investisseurs et recruteurs"),
});

export type StartupAnalysis = z.infer<typeof StartupAnalysisSchema>;

export class AnalyzerService {
  private openai: OpenAI | null = null;
  private model: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    if (apiKey && apiKey !== 'sk-proj-your-openai-api-key') {
      this.openai = new OpenAI({ apiKey });
    } else {
      console.warn('⚠️ OPENAI_API_KEY non configurée ou valeur par défaut : mode heuristique / fallback activé.');
    }
  }

  /**
   * Analyse une startup et enregistre le résultat en base de données.
   */
  async analyzeAndPersist(startupId: string): Promise<StartupAnalysis | null> {
    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
      include: { fundingRound: true },
    });

    if (!startup) {
      console.error(`Startup introuvable avec l'ID : ${startupId}`);
      return null;
    }

    console.log(`🤖 Analyse de la startup : "${startup.name}" (${startup.sector} - ${startup.country})...`);

    const analysis = await this.generateAnalysis(startup);

    await prisma.startup.update({
      where: { id: startupId },
      data: {
        summary: analysis.summary,
        score: analysis.score,
      },
    });

    console.log(`✅ Analyse complétée pour "${startup.name}" (Score: ${analysis.score}/10)`);
    return analysis;
  }

  /**
   * Analyse toutes les startups sans score ou en attente.
   */
  async analyzePendingStartups(limit = 10): Promise<number> {
    const pending = await prisma.startup.findMany({
      where: {
        OR: [{ score: null }, { summary: null }],
      },
      take: limit,
    });

    console.log(`🔍 ${pending.length} startup(s) en attente d'analyse IA trouvée(s).`);

    let processed = 0;
    for (const startup of pending) {
      try {
        await this.analyzeAndPersist(startup.id);
        processed++;
      } catch (error) {
        console.error(`❌ Échec de l'analyse pour "${startup.name}" :`, (error as Error).message);
      }
    }

    return processed;
  }

  /**
   * Génération de l'analyse via OpenAI ou Fallback heuristique.
   */
  private async generateAnalysis(startup: any): Promise<StartupAnalysis> {
    const totalFunding = startup.fundingRound?.reduce(
      (acc: number, curr: any) => acc + (curr.amount || 0),
      0,
    ) || 0;

    if (!this.openai) {
      return this.generateHeuristicAnalysis(startup, totalFunding);
    }

    try {
      const prompt = `
Vous êtes un analyste senior en intelligence d'affaires et capital-risque.
Analysez cette startup et déterminez un score d'opportunité d'affaires de 1 à 10.

Détails de la startup :
- Nom : ${startup.name}
- Secteur : ${startup.sector}
- Pays : ${startup.country}
- Taille de l'équipe : ${startup.size}
- Total levé : ${totalFunding > 0 ? `${totalFunding} €` : 'Non renseigné / Bootstrapped'}
- Nombre de tours de table : ${startup.fundingRound?.length || 0}

Règles de scoring :
- 8 à 10 : Forte croissance, secteur porteur (IA, CleanTech, Cybersécurité), levées significatives ou innovation de rupture.
- 5 à 7 : Modèle viable, croissance régulière, marché compétitif.
- 1 à 4 : Marché saturé, manque de différenciation ou signaux faibles.

Répondez exclusivement au format JSON conforme au schéma suivant :
{
  "summary": "Résumé percutant en 2 phrases de la proposition de valeur et du positionnement",
  "score": 8,
  "keySignals": ["Signal 1", "Signal 2"],
  "risks": ["Risque 1", "Risque 2"],
  "opportunityVerdict": "Recommandation stratégique"
}
`;

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: "Tu es un expert BI & VC d'élite. Tu retournes uniquement un JSON valide.",
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const rawContent = response.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(rawContent);

      const validated = StartupAnalysisSchema.safeParse(parsed);
      if (validated.success) {
        return validated.data;
      }

      console.warn('Format JSON invalide reçu de OpenAI, bascule vers le fallback structuré.');
      return this.generateHeuristicAnalysis(startup, totalFunding);
    } catch (error) {
      console.error("Erreur d'appel OpenAI :", (error as Error).message);
      return this.generateHeuristicAnalysis(startup, totalFunding);
    }
  }

  /**
   * Analyse heuristique locale si OpenAI est indisponible.
   */
  private generateHeuristicAnalysis(startup: any, totalFunding: number): StartupAnalysis {
    let baseScore = 6;

    const sectorLower = (startup.sector || '').toLowerCase();
    if (sectorLower.includes('ai') || sectorLower.includes('intelligence') || sectorLower.includes('cyber') || sectorLower.includes('health')) {
      baseScore += 2;
    }

    if (totalFunding > 5000000) {
      baseScore += 2;
    } else if (totalFunding > 1000000) {
      baseScore += 1;
    }

    const finalScore = Math.min(10, Math.max(1, baseScore));

    return {
      summary: `${startup.name} opère dans le secteur ${startup.sector} (${startup.country}). Entreprise dynamique positionnée sur des segments à forte valeur ajoutée.`,
      score: finalScore,
      keySignals: [
        `Taille d'équipe déclarée : ${startup.size}`,
        totalFunding > 0 ? `Levées cumulées : ${totalFunding.toLocaleString('fr-FR')} €` : "Croissance sur fonds propres (Bootstrapped)",
        `Secteur d'activité stratégique : ${startup.sector}`,
      ],
      risks: [
        'Pression concurrentielle croissante sur le segment',
        'Nécessité de maintenir un rythme soutenu d’acquisition client',
      ],
      opportunityVerdict: finalScore >= 8
        ? "Cible hautement prioritaire pour investissement, partenariat stratégique ou recrutement clé."
        : "Opportunité solide à placer sous surveillance active.",
    };
  }
}
