/**
 * Metrics - Aggregate and analyze simulation results
 */

import { SimulationResult, PlayerSimStats } from './runner';

export interface ScenarioMetrics {
  scenarioId: string;
  totalGames: number;
  classWinRates: Record<string, number>;
  teamWinRates: Record<string, number>;
  avgTTK: number; // Average time to kill (rounds)
  avgDamagePerEnergy: number;
  avgMitigationByArmor: number;
  controlPrevalence: number; // % of turns with control
  cardPlayRates: Record<string, number>; // Card type frequency
  damageDistribution: DamageDistribution;
  armorEffectiveness: ArmorEffectiveness;
  outlierCards: OutlierCard[];
}

export interface DamageDistribution {
  byEnergyBuckets: Record<string, { avgDamage: number; count: number }>;
  curve: { energy: number; damage: number }[];
}

export interface ArmorEffectiveness {
  byArmorRating: Record<number, { damageBlocked: number; count: number }>;
  curve: { ar: number; blocked: number }[];
}

export interface OutlierCard {
  cardId: string;
  reason: string;
  valueScore: number;
  playRate: number;
  recommendation: string;
}

export interface BalanceRecommendation {
  type: 'damage' | 'energy' | 'armor' | 'control' | 'baseline';
  target: string; // Card ID or class
  current: number;
  suggested: number;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

/**
 * Aggregate metrics from simulation results
 */
export function aggregateMetrics(results: SimulationResult[]): Map<string, ScenarioMetrics> {
  const metricsByScenario = new Map<string, ScenarioMetrics>();

  // Group results by scenario
  const resultsByScenario = new Map<string, SimulationResult[]>();
  results.forEach(result => {
    if (!resultsByScenario.has(result.scenarioId)) {
      resultsByScenario.set(result.scenarioId, []);
    }
    resultsByScenario.get(result.scenarioId)!.push(result);
  });

  // Aggregate for each scenario
  resultsByScenario.forEach((scenarioResults, scenarioId) => {
    metricsByScenario.set(scenarioId, aggregateScenarioMetrics(scenarioId, scenarioResults));
  });

  return metricsByScenario;
}

/**
 * Aggregate metrics for a single scenario
 */
function aggregateScenarioMetrics(scenarioId: string, results: SimulationResult[]): ScenarioMetrics {
  const totalGames = results.length;

  // Class win rates
  const classWins = new Map<string, number>();
  const classGames = new Map<string, number>();
  
  // Team win rates
  const teamWins = new Map<string, number>();
  const teamGames = new Map<string, number>();

  // Damage and energy tracking
  let totalDamage = 0;
  let totalEnergy = 0;
  let totalRounds = 0;
  
  // Armor tracking
  let totalDamageTaken = 0;
  let totalDamageDealt = 0;
  
  // Card play rates
  const cardTypeCounts = new Map<string, number>();
  let totalCardsPlayed = 0;

  // Control tracking
  let totalControlTurns = 0;
  let totalTurns = 0;

  // Damage by energy buckets
  const damageByEnergy = new Map<number, { total: number; count: number }>();

  results.forEach(result => {
    totalRounds += result.totalRounds;

    result.playersStats.forEach(stats => {
      const playerClass = stats.playerClass;
      const teamId = stats.teamId;

      // Track games per class
      classGames.set(playerClass, (classGames.get(playerClass) || 0) + 1);
      teamGames.set(teamId, (teamGames.get(teamId) || 0) + 1);

      // Track wins
      if (result.winner === teamId) {
        classWins.set(playerClass, (classWins.get(playerClass) || 0) + 1);
        teamWins.set(teamId, (teamWins.get(teamId) || 0) + 1);
      }

      // Damage and energy
      totalDamage += stats.damageDealt;
      totalEnergy += stats.energySpent;
      totalDamageTaken += stats.damageTaken;
      totalDamageDealt += stats.damageDealt;

      // Card types
      Object.entries(stats.cardsByType).forEach(([type, count]) => {
        cardTypeCounts.set(type, (cardTypeCounts.get(type) || 0) + count);
        totalCardsPlayed += count;
      });

      // Control
      totalControlTurns += stats.controlTurns;
      totalTurns += stats.survivedRounds;

      // Damage by energy buckets
      if (stats.energySpent > 0) {
        const energyBucket = Math.floor(stats.energySpent / 5) * 5;
        if (!damageByEnergy.has(energyBucket)) {
          damageByEnergy.set(energyBucket, { total: 0, count: 0 });
        }
        const bucket = damageByEnergy.get(energyBucket)!;
        bucket.total += stats.damageDealt;
        bucket.count++;
      }
    });
  });

  // Calculate class win rates
  const classWinRates: Record<string, number> = {};
  classGames.forEach((games, playerClass) => {
    const wins = classWins.get(playerClass) || 0;
    classWinRates[playerClass] = games > 0 ? wins / games : 0;
  });

  // Calculate team win rates
  const teamWinRates: Record<string, number> = {};
  teamGames.forEach((games, teamId) => {
    const wins = teamWins.get(teamId) || 0;
    teamWinRates[teamId] = games > 0 ? wins / games : 0;
  });

  // Average TTK
  const avgTTK = totalGames > 0 ? totalRounds / totalGames : 0;

  // Average damage per energy
  const avgDamagePerEnergy = totalEnergy > 0 ? totalDamage / totalEnergy : 0;

  // Armor effectiveness (damage mitigated)
  const avgMitigationByArmor = totalDamageDealt > 0 
    ? ((totalDamageDealt - totalDamageTaken) / totalDamageDealt) * 100 
    : 0;

  // Control prevalence
  const controlPrevalence = totalTurns > 0 ? (totalControlTurns / totalTurns) * 100 : 0;

  // Card play rates
  const cardPlayRates: Record<string, number> = {};
  cardTypeCounts.forEach((count, type) => {
    cardPlayRates[type] = totalCardsPlayed > 0 ? (count / totalCardsPlayed) * 100 : 0;
  });

  // Damage distribution curve
  const damageCurve: { energy: number; damage: number }[] = [];
  Array.from(damageByEnergy.entries())
    .sort((a, b) => a[0] - b[0])
    .forEach(([energy, { total, count }]) => {
      damageCurve.push({
        energy,
        damage: count > 0 ? total / count : 0,
      });
    });

  // Armor effectiveness curve (simplified)
  const armorCurve: { ar: number; blocked: number }[] = [
    { ar: 0, blocked: 0 },
    { ar: 1, blocked: 1 },
    { ar: 2, blocked: 2 },
    { ar: 3, blocked: 3 },
  ];

  // Detect outliers (placeholder - would need card-level tracking)
  const outlierCards: OutlierCard[] = detectOutliers(results);

  return {
    scenarioId,
    totalGames,
    classWinRates,
    teamWinRates,
    avgTTK,
    avgDamagePerEnergy,
    avgMitigationByArmor,
    controlPrevalence,
    cardPlayRates,
    damageDistribution: {
      byEnergyBuckets: Object.fromEntries(
        Array.from(damageByEnergy.entries()).map(([e, { total, count }]) => [
          `${e}E`,
          { avgDamage: count > 0 ? total / count : 0, count },
        ])
      ),
      curve: damageCurve,
    },
    armorEffectiveness: {
      byArmorRating: {
        0: { damageBlocked: 0, count: 1 },
        1: { damageBlocked: 1, count: 1 },
        2: { damageBlocked: 2, count: 1 },
        3: { damageBlocked: 3, count: 1 },
      },
      curve: armorCurve,
    },
    outlierCards,
  };
}

/**
 * Detect outlier cards that may need balance adjustments
 */
function detectOutliers(results: SimulationResult[]): OutlierCard[] {
  const outliers: OutlierCard[] = [];

  // Track card play frequency
  const cardPlayCounts = new Map<string, number>();
  let totalCardPlays = 0;

  results.forEach(result => {
    result.events.forEach(event => {
      if (event.cardId) {
        cardPlayCounts.set(event.cardId, (cardPlayCounts.get(event.cardId) || 0) + 1);
        totalCardPlays++;
      }
    });
  });

  // Detect cards with low play rate (< 2%)
  cardPlayCounts.forEach((count, cardId) => {
    const playRate = (count / totalCardPlays) * 100;
    
    if (playRate < 2.0 && totalCardPlays > 100) {
      outliers.push({
        cardId,
        reason: 'Low play rate',
        valueScore: 0,
        playRate,
        recommendation: `Increase value or reduce cost of ${cardId}`,
      });
    }
  });

  return outliers;
}

/**
 * Generate balance recommendations based on metrics
 */
export function generateRecommendations(
  metrics: Map<string, ScenarioMetrics>
): BalanceRecommendation[] {
  const recommendations: BalanceRecommendation[] = [];

  metrics.forEach((scenarioMetric, scenarioId) => {
    // Check damage per energy (should be ~2.0 per balance rails)
    if (scenarioMetric.avgDamagePerEnergy < 1.5) {
      recommendations.push({
        type: 'damage',
        target: 'Global damage values',
        current: scenarioMetric.avgDamagePerEnergy,
        suggested: 2.0,
        reason: `Damage per energy (${scenarioMetric.avgDamagePerEnergy.toFixed(2)}) is below target 2.0 in ${scenarioId}`,
        priority: 'high',
      });
    } else if (scenarioMetric.avgDamagePerEnergy > 2.5) {
      recommendations.push({
        type: 'damage',
        target: 'Global damage values',
        current: scenarioMetric.avgDamagePerEnergy,
        suggested: 2.0,
        reason: `Damage per energy (${scenarioMetric.avgDamagePerEnergy.toFixed(2)}) is above target 2.0 in ${scenarioId}`,
        priority: 'high',
      });
    }

    // Check control prevalence (should be moderate, not overwhelming)
    if (scenarioMetric.controlPrevalence > 30) {
      recommendations.push({
        type: 'control',
        target: 'Control cards',
        current: scenarioMetric.controlPrevalence,
        suggested: 20,
        reason: `Control prevalence (${scenarioMetric.controlPrevalence.toFixed(1)}%) is too high in ${scenarioId}`,
        priority: 'high',
      });
    }

    // Check class balance
    Object.entries(scenarioMetric.classWinRates).forEach(([playerClass, winRate]) => {
      if (winRate < 0.35) {
        recommendations.push({
          type: 'baseline',
          target: playerClass,
          current: winRate,
          suggested: 0.5,
          reason: `${playerClass} win rate (${(winRate * 100).toFixed(1)}%) is too low in ${scenarioId}`,
          priority: 'high',
        });
      } else if (winRate > 0.65) {
        recommendations.push({
          type: 'baseline',
          target: playerClass,
          current: winRate,
          suggested: 0.5,
          reason: `${playerClass} win rate (${(winRate * 100).toFixed(1)}%) is too high in ${scenarioId}`,
          priority: 'high',
        });
      }
    });

    // Check armor effectiveness
    if (scenarioMetric.avgMitigationByArmor > 40) {
      recommendations.push({
        type: 'armor',
        target: 'Armor ratings',
        current: scenarioMetric.avgMitigationByArmor,
        suggested: 25,
        reason: `Armor is too effective (${scenarioMetric.avgMitigationByArmor.toFixed(1)}% mitigation) in ${scenarioId}`,
        priority: 'medium',
      });
    }

    // Check outlier cards
    scenarioMetric.outlierCards.forEach(outlier => {
      recommendations.push({
        type: 'damage',
        target: outlier.cardId,
        current: outlier.playRate,
        suggested: 5.0,
        reason: outlier.recommendation,
        priority: 'medium',
      });
    });
  });

  // Deduplicate and prioritize
  const uniqueRecs = deduplicateRecommendations(recommendations);
  return uniqueRecs.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

/**
 * Deduplicate similar recommendations
 */
function deduplicateRecommendations(
  recommendations: BalanceRecommendation[]
): BalanceRecommendation[] {
  const seen = new Set<string>();
  const unique: BalanceRecommendation[] = [];

  recommendations.forEach(rec => {
    const key = `${rec.type}_${rec.target}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(rec);
    }
  });

  return unique;
}

/**
 * Generate ASCII sparkline for visualization
 */
export function generateSparkline(values: number[], width: number = 20): string {
  if (values.length === 0) return '';

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  if (range === 0) return '─'.repeat(width);

  const bars = '▁▂▃▄▅▆▇█';
  const normalized = values.map(v => Math.floor(((v - min) / range) * (bars.length - 1)));

  return normalized.map(i => bars[i]).join('');
}

/**
 * Generate summary statistics
 */
export function generateSummaryStats(metrics: Map<string, ScenarioMetrics>): {
  totalGames: number;
  avgTTK: number;
  avgDamagePerEnergy: number;
  scenarioCount: number;
} {
  let totalGames = 0;
  let sumTTK = 0;
  let sumDPE = 0;
  let count = 0;

  metrics.forEach(metric => {
    totalGames += metric.totalGames;
    sumTTK += metric.avgTTK;
    sumDPE += metric.avgDamagePerEnergy;
    count++;
  });

  return {
    totalGames,
    avgTTK: count > 0 ? sumTTK / count : 0,
    avgDamagePerEnergy: count > 0 ? sumDPE / count : 0,
    scenarioCount: count,
  };
}

