#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
const Ajv = require('ajv');

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

interface LintResult {
  file: string;
  errors: string[];
  warnings: string[];
}

class CardLinter {
  private ajv: any;
  private schema: any;
  private validate: any;

  constructor() {
    this.ajv = new Ajv();
    const schemaPath = path.join(__dirname, '..', '..', 'cards', 'schema', 'card.schema.json');
    this.schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    this.validate = this.ajv.compile(this.schema);
  }

  lintFile(filePath: string): LintResult {
    const result: LintResult = {
      file: filePath,
      errors: [],
      warnings: []
    };

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      const cards = data.cards || [data];

      cards.forEach((card: BrickQuestCard, index: number) => {
        const cardErrors = this.lintCard(card, index);
        result.errors.push(...cardErrors.errors);
        result.warnings.push(...cardErrors.warnings);
      });

    } catch (error) {
      result.errors.push(`Failed to parse file: ${error}`);
    }

    return result;
  }

  private lintCard(card: BrickQuestCard, index: number): { errors: string[], warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const cardPrefix = `Card ${index + 1} (${card.id || 'unknown'})`;

    // Schema validation
    const isValid = this.validate(card);
    if (!isValid) {
      errors.push(`${cardPrefix}: Schema validation failed - ${JSON.stringify(this.validate.errors)}`);
    }

    // ID pattern validation
    if (card.id && !/^BQ-[A-Z]{3}-\d{4}$/.test(card.id)) {
      errors.push(`${cardPrefix}: Invalid ID format, should be BQ-XXX-0000`);
    }

    // Text length validation
    if (card.text && card.text.length > 220) {
      warnings.push(`${cardPrefix}: Text exceeds 220 characters (${card.text.length})`);
    }

    // Energy curve validation
    this.validateEnergyCurve(card, cardPrefix, errors, warnings);

    // Structure build requirements
    this.validateStructureRequirements(card, cardPrefix, warnings);

    // Counter-play validation
    this.validateCounterPlay(card, cardPrefix, warnings);

    // Duplicate detection (basic)
    this.validateUniqueness(card, cardPrefix, warnings);

    return { errors, warnings };
  }

  private validateEnergyCurve(card: BrickQuestCard, prefix: string, errors: string[], warnings: string[]): void {
    const energy = card.cost.energy;
    const rules = card.rules || {};

    // Energy curve rules
    if (energy === 0) {
      if (rules.damage && rules.damage > 0) {
        errors.push(`${prefix}: 0E cards cannot deal damage`);
      }
      if (rules.draw && rules.draw > 0) {
        errors.push(`${prefix}: 0E cards cannot draw cards`);
      }
    } else if (energy === 1) {
      if (rules.damage && rules.damage > 2) {
        warnings.push(`${prefix}: 1E cards should deal ≤2 damage`);
      }
      if (rules.move && rules.move > 2) {
        warnings.push(`${prefix}: 1E cards should give ≤2 movement`);
      }
    } else if (energy === 2) {
      if (rules.damage && rules.damage > 4) {
        warnings.push(`${prefix}: 2E cards should deal ≤4 damage`);
      }
    } else if (energy === 3) {
      if (rules.damage && rules.damage > 6) {
        warnings.push(`${prefix}: 3E cards should deal ≤6 damage`);
      }
    }

    // High energy cards should be rare or exhaust
    if (energy >= 4 && card.rarity === 'Common' && !card.cost.exhaust) {
      warnings.push(`${prefix}: High energy cards should be Rare+ or exhaust`);
    }
  }

  private validateStructureRequirements(card: BrickQuestCard, prefix: string, warnings: string[]): void {
    if (card.type === 'Structure' && !card.buildReq) {
      warnings.push(`${prefix}: Structure cards should specify buildReq for physical builds`);
    }

    if (card.buildReq) {
      if (card.type === 'Structure' && !card.buildReq.footprint) {
        warnings.push(`${prefix}: Structure buildReq should specify footprint`);
      }
    }
  }

  private validateCounterPlay(card: BrickQuestCard, prefix: string, warnings: string[]): void {
    const rules = card.rules || {};
    const hasHardControl = rules.stun || rules.immobilize || rules.silence || 
                          rules.area || (rules.tags && rules.tags.includes('trap'));

    if (hasHardControl && (!rules.counters || rules.counters.length === 0)) {
      warnings.push(`${prefix}: Hard control effects should specify counter-play options`);
    }
  }

  private validateUniqueness(card: BrickQuestCard, prefix: string, warnings: string[]): void {
    // This is a basic check - full deduplication would require cross-file analysis
    if (card.type === 'Action' && card.cost.energy === 1 && card.rules?.damage === 2) {
      warnings.push(`${prefix}: Potential duplicate of basic 1E/2D action`);
    }
  }

  lintDirectory(dirPath: string): LintResult[] {
    const results: LintResult[] = [];
    
    const files = fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.json'))
      .map(file => path.join(dirPath, file));

    files.forEach(file => {
      results.push(this.lintFile(file));
    });

    return results;
  }
}

async function main() {
  const linter = new CardLinter();
  const args = process.argv.slice(2);
  
  let targetPath: string;
  if (args.length > 0) {
    targetPath = args[0];
  } else {
    targetPath = path.join(__dirname, '..', '..', 'cards', 'expansions');
  }

  const isDirectory = fs.statSync(targetPath).isDirectory();
  const results = isDirectory 
    ? linter.lintDirectory(targetPath)
    : [linter.lintFile(targetPath)];

  let totalErrors = 0;
  let totalWarnings = 0;

  results.forEach(result => {
    if (result.errors.length > 0 || result.warnings.length > 0) {
      console.log(`\n📄 ${result.file}`);
      
      result.errors.forEach(error => {
        console.log(`  ❌ ${error}`);
        totalErrors++;
      });
      
      result.warnings.forEach(warning => {
        console.log(`  ⚠️  ${warning}`);
        totalWarnings++;
      });
    }
  });

  if (totalErrors === 0 && totalWarnings === 0) {
    console.log('✅ All cards passed linting!');
  } else {
    console.log(`\n📊 Summary: ${totalErrors} errors, ${totalWarnings} warnings`);
    if (totalErrors > 0) {
      process.exit(1);
    }
  }
}

if (require.main === module) {
  main();
}
