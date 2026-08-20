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

export interface AIProviderConfig {
  provider: string;
  name: string;
  apiKey: string;
  baseURL: string;
  model: string;
}

export interface ConnectionTestResult {
  ok: boolean;
  provider: string;
  model: string;
  latencyMs?: number;
  statusCode?: number;
  errorType?: 'UNAUTHORIZED' | 'QUOTA_EXCEEDED' | 'CONNECTION_REFUSED' | 'NOT_FOUND' | 'UNKNOWN' | 'NO_CONFIG';
  message: string;
  details?: string;
}

/**
 * Détecte et configure automatiquement le fournisseur d'IA selon la clé ou l'environnement.
 */
export function resolveAIConfig(): AIProviderConfig | null {
  const apiKey =
    process.env.AI_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GROQ_API_KEY ||
    process.env.OPENROUTER_API_KEY;

  const explicitProvider = (process.env.AI_PROVIDER || 'auto').toLowerCase();
  const customBaseURL = process.env.AI_BASE_URL;
  const customModel = process.env.AI_MODEL || process.env.OPENAI_MODEL;

  const isPlaceholder =
    !apiKey ||
    apiKey === 'sk-proj-your-openai-api-key' ||
    apiKey === 'votre-cle-api' ||
    apiKey.trim() === '';

  // Mode local Ollama sans clé requise si l'URL locale est spécifiée
  if (isPlaceholder && !customBaseURL && explicitProvider !== 'ollama') {
    return null;
  }

  const effectiveKey = isPlaceholder ? 'ollama-local-key' : apiKey!.trim();

  let provider = explicitProvider;
  let baseURL = customBaseURL || 'https://api.openai.com/v1';
  let defaultModel = 'gpt-4o-mini';
  let friendlyName = 'OpenAI';

  if (explicitProvider === 'gemini' || effectiveKey.startsWith('AIza')) {
    provider = 'gemini';
    friendlyName = 'Google Gemini';
    baseURL = customBaseURL || 'https://generativelanguage.googleapis.com/v1beta/openai/';
    defaultModel = 'gemini-2.5-flash';
  } else if (explicitProvider === 'groq' || effectiveKey.startsWith('gsk_')) {
    provider = 'groq';
    friendlyName = 'Groq Cloud (LLaMA ultra-rapide)';
    baseURL = customBaseURL || 'https://api.groq.com/openai/v1';
    defaultModel = 'llama-3.3-70b-versatile';
  } else if (explicitProvider === 'openrouter' || effectiveKey.startsWith('sk-or-')) {
    provider = 'openrouter';
    friendlyName = 'OpenRouter (Agrégateur universel)';
    baseURL = customBaseURL || 'https://openrouter.ai/api/v1';
    defaultModel = 'meta-llama/llama-3.3-70b-instruct';
  } else if (explicitProvider === 'deepseek') {
    provider = 'deepseek';
    friendlyName = 'DeepSeek AI';
    baseURL = customBaseURL || 'https://api.deepseek.com/v1';
    defaultModel = 'deepseek-chat';
  } else if (explicitProvider === 'mistral') {
    provider = 'mistral';
    friendlyName = 'Mistral AI';
    baseURL = customBaseURL || 'https://api.mistral.ai/v1';
    defaultModel = 'mistral-small-latest';
  } else if (
    explicitProvider === 'ollama' ||
    customBaseURL?.includes('localhost:11434') ||
    customBaseURL?.includes('127.0.0.1:11434')
  ) {
    provider = 'ollama';
    friendlyName = 'Ollama (Modèle Local)';
    baseURL = customBaseURL || 'http://localhost:11434/v1';
    defaultModel = 'llama3';
  } else if (customBaseURL) {
    provider = 'custom';
    friendlyName = `Serveur Personnalisé (${customBaseURL})`;
    defaultModel = 'default';
  }

  return {
    provider,
    name: friendlyName,
    apiKey: effectiveKey,
    baseURL,
    model: customModel || defaultModel,
  };
}

export class AnalyzerService {
  private client: OpenAI | null = null;
  public aiConfig: AIProviderConfig | null = null;

  constructor() {
    this.aiConfig = resolveAIConfig();

    if (this.aiConfig) {
      this.client = new OpenAI({
        apiKey: this.aiConfig.apiKey,
        baseURL: this.aiConfig.baseURL,
      });
    }
  }

  /**
   * Effectue un test de connexion préalable (healthcheck) auprès du fournisseur IA configuré.
   */
  async testConnection(): Promise<ConnectionTestResult> {
    if (!this.aiConfig || !this.client) {
      return {
        ok: false,
        provider: 'Non configuré',
        model: 'Aucun',
        errorType: 'NO_CONFIG',
        message: 'Aucune clé API configurée dans .env (variables AI_API_KEY ou OPENAI_API_KEY).',
      };
    }

    const startTime = Date.now();
    try {
      // Test léger avec une mini-complétion de 5 tokens maximum
      await this.client.chat.completions.create({
        model: this.aiConfig.model,
        messages: [{ role: 'user', content: 'Ping. Réponds par "pong".' }],
        max_tokens: 5,
        temperature: 0,
      });

      const latencyMs = Date.now() - startTime;
      return {
        ok: true,
        provider: this.aiConfig.name,
        model: this.aiConfig.model,
        latencyMs,
        message: `Connexion validée avec succès auprès de ${this.aiConfig.name} (Modèle: ${this.aiConfig.model}, Latence: ${latencyMs}ms)`,
      };
    } catch (error: any) {
      const latencyMs = Date.now() - startTime;
      const status = error.status || error.statusCode;
      const rawMessage = error.message || String(error);

      let errorType: ConnectionTestResult['errorType'] = 'UNKNOWN';
      let userFriendlyMessage = `Erreur inattendue lors de la connexion (${rawMessage})`;

      if (
        status === 401 ||
        rawMessage.includes('401') ||
        rawMessage.toLowerCase().includes('incorrect api key') ||
        rawMessage.toLowerCase().includes('unauthorized') ||
        rawMessage.toLowerCase().includes('invalid api key')
      ) {
        errorType = 'UNAUTHORIZED';
        userFriendlyMessage = `Clé API invalide, expirée ou non autorisée pour le fournisseur ${this.aiConfig.name}.`;
      } else if (
        status === 429 ||
        rawMessage.includes('429') ||
        rawMessage.toLowerCase().includes('quota') ||
        rawMessage.toLowerCase().includes('rate limit')
      ) {
        errorType = 'QUOTA_EXCEEDED';
        userFriendlyMessage = `Quota dépassé ou crédits insuffisants sur votre compte ${this.aiConfig.name}.`;
      } else if (
        status === 404 ||
        rawMessage.includes('404') ||
        rawMessage.toLowerCase().includes('model not found')
      ) {
        errorType = 'NOT_FOUND';
        userFriendlyMessage = `Le modèle "${this.aiConfig.model}" est introuvable ou non supporté par ${this.aiConfig.name}.`;
      } else if (
        error.code === 'ECONNREFUSED' ||
        error.code === 'ENOTFOUND' ||
        rawMessage.includes('ECONNREFUSED') ||
        rawMessage.includes('fetch failed')
      ) {
        errorType = 'CONNECTION_REFUSED';
        userFriendlyMessage = `Impossible de contacter l'endpoint ${this.aiConfig.baseURL}. Vérifiez votre accès réseau ou l'état du serveur local.`;
      }

      return {
        ok: false,
        provider: this.aiConfig.name,
        model: this.aiConfig.model,
        latencyMs,
        statusCode: status,
        errorType,
        message: userFriendlyMessage,
        details: rawMessage,
      };
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
      console.error(`❌ Startup introuvable avec l'ID : ${startupId}`);
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
   * Nettoie les éventuels blocs de code Markdown (```json ... ```) renvoyés par certains LLMs.
   */
  private cleanJsonString(raw: string): string {
    let cleaned = raw.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.substring(7);
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.substring(3);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.substring(0, cleaned.length - 3);
    }
    return cleaned.trim();
  }

  /**
   * Génération de l'analyse via LLM connecté ou Fallback heuristique.
   */
  private async generateAnalysis(startup: any): Promise<StartupAnalysis> {
    const totalFunding =
      startup.fundingRound?.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0) || 0;

    if (!this.client || !this.aiConfig) {
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

      const response = await this.client.chat.completions.create({
        model: this.aiConfig.model,
        messages: [
          {
            role: 'system',
            content: "Tu es un expert BI & VC d'élite. Tu retournes uniquement un JSON valide sans texte superflu.",
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
      });

      const rawContent = response.choices[0]?.message?.content || '{}';
      const cleaned = this.cleanJsonString(rawContent);
      const parsed = JSON.parse(cleaned);

      const validated = StartupAnalysisSchema.safeParse(parsed);
      if (validated.success) {
        return validated.data;
      }

      console.warn('⚠️ Format JSON partiel reçu du modèle, bascule vers le fallback structuré.');
      return this.generateHeuristicAnalysis(startup, totalFunding);
    } catch (error) {
      console.error(`❌ Erreur d'appel API IA (${this.aiConfig.name}) :`, (error as Error).message);
      return this.generateHeuristicAnalysis(startup, totalFunding);
    }
  }

  /**
   * Analyse heuristique locale si le modèle IA est indisponible ou non configuré.
   */
  private generateHeuristicAnalysis(startup: any, totalFunding: number): StartupAnalysis {
    let baseScore = 6;

    const sectorLower = (startup.sector || '').toLowerCase();
    if (
      sectorLower.includes('ai') ||
      sectorLower.includes('intelligence') ||
      sectorLower.includes('cyber') ||
      sectorLower.includes('health')
    ) {
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
        totalFunding > 0
          ? `Levées cumulées : ${totalFunding.toLocaleString('fr-FR')} €`
          : 'Croissance sur fonds propres (Bootstrapped)',
        `Secteur d'activité stratégique : ${startup.sector}`,
      ],
      risks: [
        'Pression concurrentielle croissante sur le segment',
        'Nécessité de maintenir un rythme soutenu d’acquisition client',
      ],
      opportunityVerdict:
        finalScore >= 8
          ? 'Cible hautement prioritaire pour investissement, partenariat stratégique ou recrutement clé.'
          : 'Opportunité solide à placer sous surveillance active.',
    };
  }
}
