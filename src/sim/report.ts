/**
 * Report Generator - Create BALANCE.md from simulation metrics
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  ScenarioMetrics,
  BalanceRecommendation,
  aggregateMetrics,
  generateRecommendations,
  generateSparkline,
  generateSummaryStats,
} from './metrics';
import { SimulationResult } from './runner';

/**
 * Generate balance report markdown
 */
export function generateBalanceReport(results: SimulationResult[]): string {
  const metrics = aggregateMetrics(results);
  const recommendations = generateRecommendations(metrics);
  const summary = generateSummaryStats(metrics);

  let report = '';

  // Header
  report += '# BrickQuest Balance Report\n\n';
  report += `*Generated: ${new Date().toISOString()}*\n\n`;
  report += '---\n\n';

  // Executive Summary
  report += '## Executive Summary\n\n';
  report += `- **Total Games Simulated**: ${summary.totalGames.toLocaleString()}\n`;
  report += `- **Scenarios Tested**: ${summary.scenarioCount}\n`;
  report += `- **Average TTK (Time to Kill)**: ${summary.avgTTK.toFixed(1)} rounds\n`;
  report += `- **Average Damage per Energy**: ${summary.avgDamagePerEnergy.toFixed(2)} (Target: 2.0)\n`;
  report += `- **Balance Issues Found**: ${recommendations.filter(r => r.priority === 'high').length} high priority\n\n`;

  // Top Recommendations
  report += '## Top 5 Recommendations\n\n';
  const topRecs = recommendations.slice(0, 5);
  topRecs.forEach((rec, idx) => {
    report += `${idx + 1}. **[${rec.priority.toUpperCase()}]** ${rec.reason}\n`;
    report += `   - Current: ${formatValue(rec.current)}\n`;
    report += `   - Suggested: ${formatValue(rec.suggested)}\n\n`;
  });

  if (recommendations.length === 0) {
    report += '*No major balance issues detected. Game is well balanced!*\n\n';
  }

  // Scenario Details
  report += '## Scenario Analysis\n\n';
  
  metrics.forEach((metric, scenarioId) => {
    report += `### ${scenarioId}\n\n`;
    
    // Games and TTK
    report += `- **Games Played**: ${metric.totalGames}\n`;
    report += `- **Average TTK**: ${metric.avgTTK.toFixed(1)} rounds\n`;
    report += `- **Damage per Energy**: ${metric.avgDamagePerEnergy.toFixed(2)}\n\n`;

    // Team Win Rates
    report += '#### Team Win Rates\n\n';
    report += '| Team | Win Rate | Sparkline |\n';
    report += '|------|----------|----------|\n';
    Object.entries(metric.teamWinRates).forEach(([team, winRate]) => {
      const percentage = (winRate * 100).toFixed(1);
      const bar = generateProgressBar(winRate, 20);
      report += `| ${team} | ${percentage}% | ${bar} |\n`;
    });
    report += '\n';

    // Class Win Rates
    report += '#### Class Win Rates\n\n';
    report += '| Class | Win Rate | Sparkline |\n';
    report += '|-------|----------|----------|\n';
    Object.entries(metric.classWinRates).forEach(([playerClass, winRate]) => {
      const percentage = (winRate * 100).toFixed(1);
      const bar = generateProgressBar(winRate, 20);
      report += `| ${playerClass} | ${percentage}% | ${bar} |\n`;
    });
    report += '\n';

    // Card Play Rates
    report += '#### Card Type Distribution\n\n';
    report += '| Card Type | Play Rate |\n';
    report += '|-----------|----------|\n';
    Object.entries(metric.cardPlayRates).forEach(([type, rate]) => {
      report += `| ${type} | ${rate.toFixed(1)}% |\n`;
    });
    report += '\n';

    // Damage Curve
    report += '#### Damage Distribution (by Energy)\n\n';
    report += '| Energy Spent | Avg Damage | Games |\n';
    report += '|--------------|-----------|-------|\n';
    Object.entries(metric.damageDistribution.byEnergyBuckets).forEach(([bucket, data]) => {
      report += `| ${bucket} | ${data.avgDamage.toFixed(1)} | ${data.count} |\n`;
    });
    report += '\n';

    // Control Prevalence
    report += `#### Control Effects\n\n`;
    report += `- **Control Prevalence**: ${metric.controlPrevalence.toFixed(1)}% of turns\n`;
    if (metric.controlPrevalence > 30) {
      report += `  - ⚠️ **WARNING**: Control is too prevalent (target: <25%)\n`;
    } else if (metric.controlPrevalence < 5) {
      report += `  - ℹ️ **NOTE**: Control is rarely used (target: 10-25%)\n`;
    } else {
      report += `  - ✅ Control usage is healthy\n`;
    }
    report += '\n';

    // Armor Effectiveness
    report += `#### Armor Effectiveness\n\n`;
    report += `- **Damage Mitigation**: ${metric.avgMitigationByArmor.toFixed(1)}%\n`;
    if (metric.avgMitigationByArmor > 40) {
      report += `  - ⚠️ **WARNING**: Armor is too effective (target: 20-30%)\n`;
    } else if (metric.avgMitigationByArmor < 15) {
      report += `  - ⚠️ **WARNING**: Armor is too weak (target: 20-30%)\n`;
    } else {
      report += `  - ✅ Armor effectiveness is healthy\n`;
    }
    report += '\n';

    // Outlier Cards
    if (metric.outlierCards.length > 0) {
      report += '#### Outlier Cards\n\n';
      metric.outlierCards.forEach(outlier => {
        report += `- **${outlier.cardId}**: ${outlier.reason} (${outlier.playRate.toFixed(1)}% play rate)\n`;
        report += `  - ${outlier.recommendation}\n`;
      });
      report += '\n';
    }

    report += '---\n\n';
  });

  // All Recommendations
  if (recommendations.length > 5) {
    report += '## All Recommendations\n\n';
    recommendations.forEach((rec, idx) => {
      report += `${idx + 1}. **[${rec.priority.toUpperCase()}]** ${rec.type} - ${rec.target}\n`;
      report += `   - ${rec.reason}\n`;
      report += `   - Current: ${formatValue(rec.current)} → Suggested: ${formatValue(rec.suggested)}\n\n`;
    });
  }

  // Balance Rails Reference
  report += '## Balance Rails Reference\n\n';
  report += 'These are the target guidelines for card balance:\n\n';
  report += '1. **Energy to Damage**: 1 Energy ≈ 2 Damage (single-target, no control)\n';
  report += '2. **Repeatable Actions**: Value ≤ 2×E + 1\n';
  report += '3. **Ranged Height Bonus**: Caps at +2 damage\n';
  report += '4. **Cover Bonus**: +1 AR, stacks with base AR\n';
  report += '5. **Hard Control** (stun/immobilize): Rare+, usually 2E minimum\n';
  report += '6. **Structures**:\n';
  report += '   - Utility: HP 4-6, AR 0-1\n';
  report += '   - Turret: HP 6-10, AR 1-2 (requires bricks or Blueprint discount)\n';
  report += '7. **Control Prevalence**: Target 10-25% of turns\n';
  report += '8. **Armor Mitigation**: Target 20-30% damage reduction\n';
  report += '9. **Class Win Rates**: Target 40-60% (within 10% of each other)\n\n';

  // Methodology
  report += '## Methodology\n\n';
  report += 'This report was generated from automated game simulations using:\n\n';
  report += '- **Deterministic AI**: Simple policy-based decision making\n';
  report += '- **Seeded RNG**: Reproducible results across runs\n';
  report += '- **Multiple Scenarios**: Varied map layouts, team compositions, and objectives\n';
  report += '- **Large Sample Size**: Thousands of games per scenario\n\n';
  report += 'The AI policy prioritizes:\n';
  report += '1. Moving to high ground when beneficial\n';
  report += '2. Actions with best (expected damage - enemy AR)\n';
  report += '3. Control effects for objective denial or power turn prevention\n';
  report += '4. Energy efficiency (leftover E ≤ 1 at end of turn)\n';
  report += '5. Reactions when threatened\n\n';

  // Footer
  report += '---\n\n';
  report += '*This report is auto-generated. Review recommendations carefully before applying changes.*\n';

  return report;
}

/**
 * Format numeric values for display
 */
function formatValue(value: number): string {
  if (value < 1) {
    return `${(value * 100).toFixed(1)}%`;
  }
  return value.toFixed(2);
}

/**
 * Generate progress bar
 */
function generateProgressBar(ratio: number, width: number): string {
  const filled = Math.round(ratio * width);
  const empty = width - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

/**
 * Write report to file
 */
export function writeBalanceReport(results: SimulationResult[], outputPath: string): void {
  const report = generateBalanceReport(results);
  
  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, report, 'utf-8');
  console.log(`Balance report written to: ${outputPath}`);
}

/**
 * Append entry to PLAYTEST_RESULTS.md
 */
export function appendPlaytestResults(
  results: SimulationResult[],
  recommendations: BalanceRecommendation[],
  playtestPath: string
): void {
  const metrics = aggregateMetrics(results);
  const summary = generateSummaryStats(metrics);

  let entry = '\n\n---\n\n';
  entry += `## Simulation Run - ${new Date().toISOString().split('T')[0]}\n\n`;
  entry += `**Date**: ${new Date().toLocaleDateString()}\n\n`;
  entry += `**Games**: ${summary.totalGames.toLocaleString()}\n\n`;
  entry += `**Scenarios**: ${Array.from(metrics.keys()).join(', ')}\n\n`;
  entry += `**Seeds**: Multiple (deterministic)\n\n`;

  entry += '### Highlights\n\n';
  entry += `- Average TTK: ${summary.avgTTK.toFixed(1)} rounds\n`;
  entry += `- Damage per Energy: ${summary.avgDamagePerEnergy.toFixed(2)}\n`;
  entry += `- Balance Issues: ${recommendations.filter(r => r.priority === 'high').length} high priority\n\n`;

  entry += '### Top 5 Fixes\n\n';
  const topRecs = recommendations.slice(0, 5);
  topRecs.forEach((rec, idx) => {
    entry += `${idx + 1}. ${rec.reason}\n`;
  });

  if (recommendations.length === 0) {
    entry += '*No major balance issues detected.*\n';
  }

  entry += '\n';

  // Append to file
  if (fs.existsSync(playtestPath)) {
    fs.appendFileSync(playtestPath, entry, 'utf-8');
  } else {
    // Create new file with header
    const header = '# BrickQuest Playtest Results\n\n';
    const content = header + entry;
    fs.writeFileSync(playtestPath, content, 'utf-8');
  }

  console.log(`Playtest results appended to: ${playtestPath}`);
}

/**
 * CLI Entry point
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  
  let outputPath = path.join(__dirname, '../../docs/BALANCE.md');
  let inputPath = path.join(__dirname, '../../sim_results.json');

  // Parse CLI args
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--out' && args[i + 1]) {
      outputPath = args[i + 1];
      i++;
    } else if (args[i] === '--in' && args[i + 1]) {
      inputPath = args[i + 1];
      i++;
    }
  }

  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    console.error('Run simulations first with: npm run sim:run');
    process.exit(1);
  }

  console.log(`Reading simulation results from: ${inputPath}`);
  const resultsJson = fs.readFileSync(inputPath, 'utf-8');
  const results: SimulationResult[] = JSON.parse(resultsJson);

  console.log(`Generating balance report...`);
  writeBalanceReport(results, outputPath);

  // Also append to PLAYTEST_RESULTS.md
  const playtestPath = path.join(__dirname, '../../PLAYTEST_RESULTS.md');
  const recommendations = generateRecommendations(aggregateMetrics(results));
  appendPlaytestResults(results, recommendations, playtestPath);

  console.log('Done!');
}

