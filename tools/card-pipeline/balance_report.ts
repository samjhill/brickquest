#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';

interface BrickQuestCard {
  id: string;
  name: string;
  type: string;
  subtype?: string[];
  faction: string;
  classLock?: string[];
  rarity: string;
  cost: {
    energy: number;
    exhaust?: boolean;
    sacrifice?: string;
  };
  stats?: any;
  buildReq?: {
    lego?: string[];
    stl?: string[];
    footprint?: string;
  };
  text: string;
  rules?: any;
  icons?: string[];
  flavor?: string;
  limits?: {
    perDeck?: number;
    perField?: number;
  };
  designerNotes?: string;
  v: number;
}

interface BalanceStats {
  energyCurve: { [energy: number]: number };
  damagePerEnergy: { energy: number; damage: number; card: string }[];
  controlEffects: { type: string; count: number; cards: string[] }[];
  missingCounters: string[];
  structureStats: { hp: number; armor: number; card: string }[];
  programDurations: { duration: number; card: string }[];
  auraStacks: { maxStacks: number; card: string }[];
}

class BalanceAnalyzer {
  private cards: BrickQuestCard[] = [];

  loadCards(filePath: string): void {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      this.cards = data.cards || [data];
    } catch (error) {
      console.error(`Error loading cards from ${filePath}:`, error);
      this.cards = [];
    }
  }

  loadCardsFromDirectory(dirPath: string): void {
    const files = fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.json'))
      .map(file => path.join(dirPath, file));

    this.cards = [];
    files.forEach(file => {
      this.loadCards(file);
    });
  }

  analyze(): BalanceStats {
    const stats: BalanceStats = {
      energyCurve: {},
      damagePerEnergy: [],
      controlEffects: [],
      missingCounters: [],
      structureStats: [],
      programDurations: [],
      auraStacks: []
    };

    // Energy curve analysis
    this.cards.forEach(card => {
      const energy = card.cost.energy;
      stats.energyCurve[energy] = (stats.energyCurve[energy] || 0) + 1;
    });

    // Damage per energy analysis
    this.cards.forEach(card => {
      const rules = card.rules || {};
      if (rules.damage && typeof rules.damage === 'number') {
        stats.damagePerEnergy.push({
          energy: card.cost.energy,
          damage: rules.damage,
          card: card.name
        });
      }
    });

    // Control effects analysis
    const controlTypes = ['stun', 'immobilize', 'silence', 'root', 'charm', 'fear'];
    controlTypes.forEach(type => {
      const cards = this.cards.filter(card => {
        const rules = card.rules || {};
        return rules[type] || (rules.tags && rules.tags.includes(type));
      });
      
      if (cards.length > 0) {
        stats.controlEffects.push({
          type,
          count: cards.length,
          cards: cards.map(c => c.name)
        });
      }
    });

    // Missing counter-play analysis
    this.cards.forEach(card => {
      const rules = card.rules || {};
      const hasHardControl = rules.stun || rules.immobilize || rules.silence || 
                            rules.area || (rules.tags && rules.tags.includes('trap'));
      
      if (hasHardControl && (!rules.counters || rules.counters.length === 0)) {
        stats.missingCounters.push(card.name);
      }
    });

    // Structure stats analysis
    this.cards.forEach(card => {
      if (card.type === 'Structure' && card.stats) {
        stats.structureStats.push({
          hp: card.stats.hp || 0,
          armor: card.stats.armor || 0,
          card: card.name
        });
      }
    });

    // Program duration analysis
    this.cards.forEach(card => {
      if (card.type === 'Program' && card.rules) {
        const duration = card.rules.duration || card.rules.durationRounds || 1;
        stats.programDurations.push({
          duration,
          card: card.name
        });
      }
    });

    // Aura stacking analysis
    this.cards.forEach(card => {
      if (card.type === 'Aura' && card.rules) {
        const maxStacks = card.rules.maxStacks || 1;
        stats.auraStacks.push({
          maxStacks,
          card: card.name
        });
      }
    });

    return stats;
  }

  generateReport(stats: BalanceStats): string {
    let report = '# BrickQuest Balance Report\n\n';
    report += `Generated: ${new Date().toISOString()}\n\n`;

    // Energy curve
    report += '## Energy Curve\n\n';
    report += '| Energy | Count |\n';
    report += '|--------|-------|\n';
    Object.entries(stats.energyCurve)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .forEach(([energy, count]) => {
        report += `| ${energy}E | ${count} |\n`;
      });
    report += '\n';

    // Damage per energy scatter
    report += '## Damage per Energy Analysis\n\n';
    report += '| Card | Energy | Damage | Ratio |\n';
    report += '|------|--------|--------|-------|\n';
    stats.damagePerEnergy
      .sort((a, b) => a.energy - b.energy)
      .forEach(item => {
        const ratio = (item.damage / item.energy).toFixed(2);
        report += `| ${item.card} | ${item.energy}E | ${item.damage} | ${ratio} |\n`;
      });
    report += '\n';

    // Control effects
    report += '## Control Effects\n\n';
    report += '| Type | Count | Cards |\n';
    report += '|------|-------|-------|\n';
    stats.controlEffects.forEach(effect => {
      report += `| ${effect.type} | ${effect.count} | ${effect.cards.join(', ')} |\n`;
    });
    report += '\n';

    // Missing counter-play
    if (stats.missingCounters.length > 0) {
      report += '## Missing Counter-Play Warnings\n\n';
      report += 'The following cards have hard control effects but no counter-play options:\n\n';
      stats.missingCounters.forEach(card => {
        report += `- ${card}\n`;
      });
      report += '\n';
    }

    // Structure stats
    if (stats.structureStats.length > 0) {
      report += '## Structure Statistics\n\n';
      report += '| Card | HP | Armor | Total Defense |\n';
      report += '|------|----|----|----|\n';
      stats.structureStats.forEach(stat => {
        const totalDefense = stat.hp + stat.armor;
        report += `| ${stat.card} | ${stat.hp} | ${stat.armor} | ${totalDefense} |\n`;
      });
      report += '\n';
    }

    // Program durations
    if (stats.programDurations.length > 0) {
      report += '## Program Durations\n\n';
      report += '| Card | Duration |\n';
      report += '|------|----------|\n';
      stats.programDurations.forEach(prog => {
        report += `| ${prog.card} | ${prog.duration} rounds |\n`;
      });
      report += '\n';
    }

    // Aura stacking
    if (stats.auraStacks.length > 0) {
      report += '## Aura Stacking\n\n';
      report += '| Card | Max Stacks |\n';
      report += '|------|------------|\n';
      stats.auraStacks.forEach(aura => {
        report += `| ${aura.card} | ${aura.maxStacks} |\n`;
      });
      report += '\n';
    }

    // Balance recommendations
    report += '## Balance Recommendations\n\n';
    
    // Energy curve recommendations
    const totalCards = Object.values(stats.energyCurve).reduce((a, b) => a + b, 0);
    const lowEnergyCards = (stats.energyCurve[0] || 0) + (stats.energyCurve[1] || 0);
    const highEnergyCards = (stats.energyCurve[4] || 0) + (stats.energyCurve[5] || 0);
    
    if (lowEnergyCards / totalCards < 0.3) {
      report += '- Consider adding more low-energy (0-1E) cards for early game\n';
    }
    if (highEnergyCards / totalCards > 0.4) {
      report += '- Consider reducing high-energy (4E+) cards to avoid late-game dominance\n';
    }

    // Damage curve recommendations
    const highDamageCards = stats.damagePerEnergy.filter(item => item.damage / item.energy > 2);
    if (highDamageCards.length > 0) {
      report += '- Review high damage-to-energy ratio cards for potential power creep\n';
    }

    // Control effect recommendations
    if (stats.controlEffects.length > 0) {
      const totalControlCards = stats.controlEffects.reduce((sum, effect) => sum + effect.count, 0);
      if (totalControlCards / totalCards > 0.2) {
        report += '- High concentration of control effects may slow gameplay\n';
      }
    }

    if (stats.missingCounters.length > 0) {
      report += '- Add counter-play options for hard control effects\n';
    }

    return report;
  }
}

async function main() {
  const analyzer = new BalanceAnalyzer();
  const args = process.argv.slice(2);
  
  let targetPath: string;
  if (args.length > 0) {
    targetPath = args[0];
  } else {
    targetPath = path.join(__dirname, '..', 'cards', 'expansions');
  }

  const isDirectory = fs.statSync(targetPath).isDirectory();
  
  if (isDirectory) {
    analyzer.loadCardsFromDirectory(targetPath);
  } else {
    analyzer.loadCards(targetPath);
  }

  const stats = analyzer.analyze();
  const report = analyzer.generateReport(stats);
  
  const outputPath = path.join(__dirname, '..', 'docs', 'BALANCE.md');
  fs.writeFileSync(outputPath, report);
  
  console.log('✅ Balance report generated:', outputPath);
  console.log(`📊 Analyzed ${Object.values(stats.energyCurve).reduce((a, b) => a + b, 0)} cards`);
}

if (require.main === module) {
  main();
}
