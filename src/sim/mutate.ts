/**
 * Mutate - Apply balance changes to cards
 */

import * as fs from 'fs';
import * as path from 'path';

export interface MutationConfig {
  cardId: string;
  changes: CardMutation[];
  reason: string;
}

export interface CardMutation {
  field: 'damage' | 'energy' | 'exhaust' | 'ar' | 'hp';
  operation: 'add' | 'set' | 'multiply';
  value: number;
}

export interface Card {
  id: string;
  name: string;
  type: string;
  cost: {
    energy: number;
    exhaust?: boolean;
  };
  rules?: {
    damage?: number;
    hp?: number;
    ar?: number;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Apply mutations to card files
 */
export function applyMutations(
  mutations: MutationConfig[],
  dryRun: boolean = true
): { success: boolean; applied: number; errors: string[] } {
  const errors: string[] = [];
  let applied = 0;

  console.log(`${dryRun ? '[DRY RUN] ' : ''}Applying ${mutations.length} mutations...`);

  for (const mutation of mutations) {
    try {
      const result = applyMutation(mutation, dryRun);
      if (result.success) {
        applied++;
        console.log(`  ✓ ${mutation.cardId}: ${mutation.reason}`);
      } else {
        errors.push(`${mutation.cardId}: ${result.error}`);
        console.error(`  ✗ ${mutation.cardId}: ${result.error}`);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      errors.push(`${mutation.cardId}: ${errorMsg}`);
      console.error(`  ✗ ${mutation.cardId}: ${errorMsg}`);
    }
  }

  return { success: errors.length === 0, applied, errors };
}

/**
 * Apply a single mutation
 */
function applyMutation(
  mutation: MutationConfig,
  dryRun: boolean
): { success: boolean; error?: string } {
  // Find card file
  const cardFile = findCardFile(mutation.cardId);
  if (!cardFile) {
    return { success: false, error: 'Card file not found' };
  }

  // Load card data
  const fileContent = fs.readFileSync(cardFile, 'utf-8');
  const cardData = JSON.parse(fileContent);

  // Find the specific card
  const cards = cardData.cards || [cardData];
  const cardIndex = cards.findIndex((c: Card) => c.id === mutation.cardId);
  
  if (cardIndex === -1) {
    return { success: false, error: 'Card not found in file' };
  }

  const card = cards[cardIndex];

  // Apply changes
  for (const change of mutation.changes) {
    applyChange(card, change);
  }

  // Validate card still meets schema
  const validation = validateCard(card);
  if (!validation.valid) {
    return { success: false, error: `Validation failed: ${validation.error}` };
  }

  // Write back (if not dry run)
  if (!dryRun) {
    cardData.cards = cards;
    fs.writeFileSync(cardFile, JSON.stringify(cardData, null, 2), 'utf-8');
  }

  return { success: true };
}

/**
 * Apply a single change to a card
 */
function applyChange(card: Card, change: CardMutation): void {
  switch (change.field) {
    case 'damage':
      if (!card.rules) card.rules = {};
      const currentDamage = card.rules.damage || 0;
      card.rules.damage = applyOperation(currentDamage, change.operation, change.value);
      break;

    case 'energy':
      const currentEnergy = card.cost.energy;
      card.cost.energy = Math.max(0, applyOperation(currentEnergy, change.operation, change.value));
      break;

    case 'exhaust':
      card.cost.exhaust = change.value === 1;
      break;

    case 'ar':
      if (!card.rules) card.rules = {};
      const currentAr = card.rules.ar || 0;
      card.rules.ar = applyOperation(currentAr, change.operation, change.value);
      break;

    case 'hp':
      if (!card.rules) card.rules = {};
      const currentHp = card.rules.hp || 0;
      card.rules.hp = applyOperation(currentHp, change.operation, change.value);
      break;
  }
}

/**
 * Apply arithmetic operation
 */
function applyOperation(current: number, operation: string, value: number): number {
  switch (operation) {
    case 'add':
      return current + value;
    case 'set':
      return value;
    case 'multiply':
      return current * value;
    default:
      return current;
  }
}

/**
 * Find card file by card ID
 */
function findCardFile(cardId: string): string | null {
  const cardDirs = [
    path.join(__dirname, '../../cards'),
    path.join(__dirname, '../../cards/expansions'),
    path.join(__dirname, '../../cards/factions'),
  ];

  for (const dir of cardDirs) {
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        const cards = data.cards || [data];
        
        if (cards.some((c: Card) => c.id === cardId)) {
          return filePath;
        }
      } catch (err) {
        // Skip invalid JSON files
        continue;
      }
    }
  }

  return null;
}

/**
 * Validate card against basic rules
 */
function validateCard(card: Card): { valid: boolean; error?: string } {
  // Check required fields
  if (!card.id || !card.name || !card.type) {
    return { valid: false, error: 'Missing required fields' };
  }

  // Check energy cost range
  if (card.cost.energy < 0 || card.cost.energy > 10) {
    return { valid: false, error: 'Energy cost out of range (0-10)' };
  }

  // Check damage range (if applicable)
  if (card.rules?.damage !== undefined) {
    if (card.rules.damage < 0 || card.rules.damage > 20) {
      return { valid: false, error: 'Damage out of range (0-20)' };
    }
  }

  // Check HP range (if applicable)
  if (card.rules?.hp !== undefined) {
    if (card.rules.hp < 1 || card.rules.hp > 50) {
      return { valid: false, error: 'HP out of range (1-50)' };
    }
  }

  // Check AR range (if applicable)
  if (card.rules?.ar !== undefined) {
    if (card.rules.ar < 0 || card.rules.ar > 5) {
      return { valid: false, error: 'AR out of range (0-5)' };
    }
  }

  return { valid: true };
}

/**
 * Generate mutations from recommendations
 */
export function generateMutationsFromRecommendations(
  recommendations: any[]
): MutationConfig[] {
  const mutations: MutationConfig[] = [];

  for (const rec of recommendations) {
    // Only process high priority recommendations
    if (rec.priority !== 'high') continue;

    // Skip global recommendations
    if (rec.target.includes('Global') || rec.target.includes('values')) {
      continue;
    }

    const mutation: MutationConfig = {
      cardId: rec.target,
      changes: [],
      reason: rec.reason,
    };

    // Determine mutation based on type
    switch (rec.type) {
      case 'damage':
        const damageDelta = Math.round(rec.suggested - rec.current);
        if (damageDelta !== 0) {
          mutation.changes.push({
            field: 'damage',
            operation: 'add',
            value: damageDelta,
          });
        }
        break;

      case 'energy':
        const energyDelta = Math.round(rec.suggested - rec.current);
        if (energyDelta !== 0) {
          mutation.changes.push({
            field: 'energy',
            operation: 'add',
            value: energyDelta,
          });
        }
        break;

      case 'armor':
        const armorDelta = Math.round(rec.suggested - rec.current);
        if (armorDelta !== 0) {
          mutation.changes.push({
            field: 'ar',
            operation: 'add',
            value: armorDelta,
          });
        }
        break;

      case 'control':
        // Increase energy cost for control cards
        mutation.changes.push({
          field: 'energy',
          operation: 'add',
          value: 1,
        });
        break;
    }

    if (mutation.changes.length > 0) {
      mutations.push(mutation);
    }
  }

  return mutations;
}

/**
 * CLI Entry point
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  
  let apply = false;
  let configPath = path.join(__dirname, '../../mutations.json');

  // Parse CLI args
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--apply') {
      apply = true;
    } else if (args[i] === '--config' && args[i + 1]) {
      configPath = args[i + 1];
      i++;
    }
  }

  if (!fs.existsSync(configPath)) {
    console.error(`Config file not found: ${configPath}`);
    console.error('Create a mutations.json file with desired changes, or use --config to specify path');
    process.exit(1);
  }

  console.log(`Reading mutations from: ${configPath}`);
  const mutationsJson = fs.readFileSync(configPath, 'utf-8');
  const mutations: MutationConfig[] = JSON.parse(mutationsJson);

  const result = applyMutations(mutations, !apply);

  if (result.success) {
    console.log(`\n✓ Successfully ${apply ? 'applied' : 'validated'} ${result.applied} mutations`);
    
    if (!apply) {
      console.log('\nRun with --apply to actually apply these changes');
    } else {
      console.log('\nRemember to run:');
      console.log('  npm run cards:lint');
      console.log('  npm run sim:run');
    }
  } else {
    console.error(`\n✗ Failed with ${result.errors.length} errors:`);
    result.errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }
}

