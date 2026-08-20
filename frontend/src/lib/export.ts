import { Startup } from '@/features/dashboard/types/startup';

/**
 * Exporte une liste de startups au format CSV prêt pour Excel.
 */
export function exportStartupsToCSV(startups: Startup[], filename = 'startups-export.csv') {
  if (!startups || startups.length === 0) {
    throw new Error('Aucune startup à exporter.');
  }

  const headers = [
    'ID',
    'Nom',
    'Secteur',
    'Pays',
    'Effectif',
    'Total Levé (€)',
    'Nombre de Tours',
    'Score IA (/10)',
    'Résumé Exécutif',
    'Date de Création',
  ];

  const rows = startups.map((st) => {
    const totalFunding =
      st.fundingRound?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
    const roundCount = st.fundingRound?.length || 0;

    return [
      `"${st.id}"`,
      `"${st.name.replace(/"/g, '""')}"`,
      `"${st.sector.replace(/"/g, '""')}"`,
      `"${st.country.replace(/"/g, '""')}"`,
      `"${st.size.replace(/"/g, '""')}"`,
      totalFunding,
      roundCount,
      st.score || 'N/A',
      `"${(st.summary || '').replace(/"/g, '""')}"`,
      `"${new Date(st.createdAt).toLocaleDateString('fr-FR')}"`,
    ];
  });

  const csvContent =
    '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exporte les détails complets d'une startup au format JSON.
 */
export function exportStartupToJSON(startup: Startup, filename?: string) {
  const name = filename || `${startup.name.toLowerCase().replace(/\s+/g, '-')}-intelligence.json`;
  const jsonContent = JSON.stringify(startup, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
