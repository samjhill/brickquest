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

interface DuplicateGroup {
  similarity: number;
  cards: BrickQuestCard[];
  reason: string;
}

class DuplicateDetector {
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

  private createRulesFingerprint(card: BrickQuestCard): string {
    const rules = card.rules || {};
    const keyProps = [
      'damage', 'heal', 'move', 'draw', 'energy', 'range', 'area',
      'statusAdd', 'statusRemove', 'trigger', 'duration', 'target'
    ];
    
    const fingerprint: any = {};
    keyProps.forEach(prop => {
      if (rules[prop] !== undefined) {
        fingerprint[prop] = rules[prop];
      }
    });
    
    // Add cost and type to fingerprint
    fingerprint.cost = card.cost.energy;
    fingerprint.type = card.type;
    
    return JSON.stringify(fingerprint, Object.keys(fingerprint).sort());
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  private calculateRulesSimilarity(rules1: any, rules2: any): number {
    const fp1 = this.createRulesFingerprint({ rules: rules1 } as BrickQuestCard);
    const fp2 = this.createRulesFingerprint({ rules: rules2 } as BrickQuestCard);
    
    if (fp1 === fp2) return 1.0;
    
    // Calculate Jaccard similarity for rule properties
    const props1 = new Set(Object.keys(rules1 || {}));
    const props2 = new Set(Object.keys(rules2 || {}));
    
    const intersection = new Set([...props1].filter(x => props2.has(x)));
    const union = new Set([...props1, ...props2]);
    
    return intersection.size / union.size;
  }

  private calculateCardSimilarity(card1: BrickQuestCard, card2: BrickQuestCard): { similarity: number, reason: string } {
    // Exact duplicate check
    if (card1.id === card2.id) {
      return { similarity: 1.0, reason: 'Exact ID match' };
    }

    // Same type and identical rules fingerprint
    const rulesSim = this.calculateRulesSimilarity(card1.rules, card2.rules);
    if (card1.type === card2.type && rulesSim === 1.0) {
      return { similarity: 1.0, reason: 'Identical rules fingerprint' };
    }

    // High text similarity
    const textSim = this.calculateTextSimilarity(card1.text, card2.text);
    if (textSim > 0.8) {
      return { similarity: textSim, reason: 'High text similarity' };
    }

    // Same type, similar cost, similar rules
    if (card1.type === card2.type && 
        Math.abs(card1.cost.energy - card2.cost.energy) <= 1 && 
        rulesSim > 0.7) {
      return { similarity: rulesSim, reason: 'Similar type, cost, and rules' };
    }

    // Same energy cost and damage output
    const damage1 = card1.rules?.damage || 0;
    const damage2 = card2.rules?.damage || 0;
    if (card1.cost.energy === card2.cost.energy && 
        Math.abs(damage1 - damage2) <= 1 && 
        damage1 > 0 && damage2 > 0) {
      return { similarity: 0.8, reason: 'Same energy cost and similar damage' };
    }

    return { similarity: 0, reason: 'No significant similarity' };
  }

  findDuplicates(threshold: number = 0.7): DuplicateGroup[] {
    const groups: DuplicateGroup[] = [];
    const processed = new Set<string>();

    for (let i = 0; i < this.cards.length; i++) {
      if (processed.has(this.cards[i].id)) continue;

      const group: BrickQuestCard[] = [this.cards[i]];
      let maxSimilarity = 0;
      let reason = '';

      for (let j = i + 1; j < this.cards.length; j++) {
        if (processed.has(this.cards[j].id)) continue;

        const { similarity, reason: simReason } = this.calculateCardSimilarity(this.cards[i], this.cards[j]);
        
        if (similarity >= threshold) {
          group.push(this.cards[j]);
          processed.add(this.cards[j].id);
          maxSimilarity = Math.max(maxSimilarity, similarity);
          reason = simReason;
        }
      }

      if (group.length > 1) {
        groups.push({
          similarity: maxSimilarity,
          cards: group,
          reason
        });
        group.forEach(card => processed.add(card.id));
      }
    }

    return groups.sort((a, b) => b.similarity - a.similarity);
  }

  generateReport(duplicates: DuplicateGroup[]): string {
    let report = '# BrickQuest Duplicate Detection Report\n\n';
    report += `Generated: ${new Date().toISOString()}\n\n`;

    if (duplicates.length === 0) {
      report += '✅ No duplicate cards detected!\n';
      return report;
    }

    report += `Found ${duplicates.length} duplicate groups:\n\n`;

    duplicates.forEach((group, index) => {
      report += `## Group ${index + 1} (${Math.round(group.similarity * 100)}% similarity)\n\n`;
      report += `**Reason:** ${group.reason}\n\n`;
      
      group.cards.forEach(card => {
        report += `- **${card.name}** (${card.id})\n`;
        report += `  - Type: ${card.type}, Cost: ${card.cost.energy}E, Rarity: ${card.rarity}\n`;
        report += `  - Text: "${card.text}"\n`;
        if (card.rules) {
          report += `  - Rules: ${JSON.stringify(card.rules)}\n`;
        }
        report += '\n';
      });
    });

    // Recommendations
    report += '## Recommendations\n\n';
    report += '1. **Exact Duplicates**: Remove or merge identical cards\n';
    report += '2. **High Similarity**: Consider differentiating mechanics or costs\n';
    report += '3. **Similar Damage/Cost**: Review if both cards serve distinct purposes\n';
    report += '4. **Text Similarity**: Rewrite flavor text to be more unique\n\n';

    return report;
  }
}

async function main() {
  const detector = new DuplicateDetector();
  const args = process.argv.slice(2);
  
  let targetPath: string;
  let threshold = 0.7;
  
  if (args.length > 0) {
    targetPath = args[0];
  } else {
    targetPath = path.join(__dirname, '..', 'cards', 'expansions');
  }
  
  if (args.length > 1) {
    threshold = parseFloat(args[1]);
  }

  const isDirectory = fs.statSync(targetPath).isDirectory();
  
  if (isDirectory) {
    detector.loadCardsFromDirectory(targetPath);
  } else {
    detector.loadCards(targetPath);
  }

  const duplicates = detector.findDuplicates(threshold);
  const report = detector.generateReport(duplicates);
  
  const outputPath = path.join(__dirname, '..', 'docs', 'DUPLICATES.md');
  fs.writeFileSync(outputPath, report);
  
  console.log('✅ Duplicate detection report generated:', outputPath);
  console.log(`🔍 Found ${duplicates.length} duplicate groups`);
  
  if (duplicates.length > 0) {
    console.log('⚠️  Review the report for potential duplicates');
  }
}

if (require.main === module) {
  main();
}
