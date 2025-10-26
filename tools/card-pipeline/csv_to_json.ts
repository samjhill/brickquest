#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
const Ajv = require('ajv');

interface CardData {
  id: string;
  name: string;
  type: string;
  subtype?: string[];
  faction: string;
  classLock?: string[];
  rarity: string;
  cost_energy: number;
  cost_exhaust?: boolean;
  cost_sacrifice?: string;
  stats?: any;
  build_lego?: string;
  build_footprint?: string;
  text: string;
  rules?: any;
  icons?: string[];
  flavor?: string;
  limits_perDeck?: number;
  limits_perField?: number;
  tags?: string[];
}

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

function parseCSV(csvContent: string): CardData[] {
  const lines = csvContent.trim().split('\n');
  const headers = parseCSVLine(lines[0]);
  const cards: CardData[] = [];

  for (let i = 1; i < lines.length; i++) {
    let values = parseCSVLine(lines[i]);
    
    // Handle extra fields: remove trailing empty fields or truncate to match headers
    if (values.length > headers.length) {
      while (values.length > headers.length && (!values[values.length - 1] || values[values.length - 1].trim() === '')) {
        values.pop();
      }
      if (values.length > headers.length) {
        values = values.slice(0, headers.length);
      }
    }
    
    if (values.length !== headers.length) {
      console.warn(`Skipping row ${i}: field count mismatch (${values.length} vs ${headers.length})`);
      continue;
    }

    const card: any = {};
    headers.forEach((header, index) => {
      const value = values[index].trim();
      
      // Parse JSON fields
      if (['stats', 'rules'].includes(header)) {
        if (value && value.trim()) {
          try {
            card[header] = JSON.parse(value);
          } catch {
            // If JSON parsing fails, keep as string for now
            card[header] = value;
          }
        } else {
          card[header] = undefined;
        }
      }
      // Parse array fields
      else if (['subtype', 'classLock', 'icons', 'tags'].includes(header)) {
        card[header] = value ? value.split(';').map(s => s.trim()) : undefined;
      }
      // Parse boolean fields
      else if (header === 'cost_exhaust') {
        card[header] = value === 'true' || value === '1';
      }
      // Parse numeric fields
      else if (['cost_energy', 'limits_perDeck', 'limits_perField'].includes(header)) {
        card[header] = value ? parseInt(value) : undefined;
      }
      // Parse string fields
      else {
        card[header] = value || undefined;
      }
    });
    
    cards.push(card as CardData);
  }

  return cards;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let escapeNext = false;
  
  // Remove carriage returns
  line = line.replace(/\r/g, '');
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (escapeNext) {
      current += char;
      escapeNext = false;
    } else if (char === '\\') {
      escapeNext = true;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function transformCard(cardData: CardData): BrickQuestCard {
  // The CSV has the text and rules fields swapped
  // text field is empty, rules field contains the description text
  const text = cardData.rules || cardData.text || '';
  
  // Parse rules - the actual JSON rules are in the icons field
  let rules: any = {};
  if (cardData.icons && Array.isArray(cardData.icons)) {
    // Look for JSON in the icons array
    for (const icon of cardData.icons) {
      if (typeof icon === 'string' && icon.startsWith('{')) {
        try {
          rules = JSON.parse(icon);
          break;
        } catch (e) {
          // Continue looking
        }
      }
    }
  }
  
  

  const card: BrickQuestCard = {
    id: cardData.id,
    name: cardData.name,
    type: cardData.type.charAt(0).toUpperCase() + cardData.type.slice(1), // Capitalize type
    faction: cardData.faction.charAt(0).toUpperCase() + cardData.faction.slice(1), // Capitalize faction
    rarity: cardData.rarity.charAt(0).toUpperCase() + cardData.rarity.slice(1), // Capitalize rarity
    cost: {
      energy: cardData.cost_energy
    },
    text: text, // Use the corrected text field
    rules: rules, // Ensure rules field is an object
    v: 2
  };

  // Add optional fields
  if (cardData.subtype) card.subtype = cardData.subtype;
  if (cardData.classLock) card.classLock = cardData.classLock;
  if (cardData.cost_exhaust) card.cost.exhaust = cardData.cost_exhaust;
  if (cardData.cost_sacrifice) card.cost.sacrifice = cardData.cost_sacrifice;
  if (cardData.stats) card.stats = cardData.stats;
  if (cardData.icons) card.icons = cardData.icons;
  if (cardData.flavor) card.flavor = cardData.flavor;

  // Build requirements
  if (cardData.build_lego || cardData.build_footprint) {
    card.buildReq = {};
    if (cardData.build_lego) {
      card.buildReq.lego = cardData.build_lego.split(';').map(s => s.trim());
    }
    if (cardData.build_footprint) {
      card.buildReq.footprint = cardData.build_footprint;
    }
  }

  // Limits
  if (cardData.limits_perDeck || cardData.limits_perField) {
    card.limits = {};
    if (cardData.limits_perDeck) card.limits.perDeck = cardData.limits_perDeck;
    if (cardData.limits_perField) card.limits.perField = cardData.limits_perField;
  }

  return card;
}

function validateCards(cards: BrickQuestCard[]): { valid: BrickQuestCard[], errors: string[] } {
  const ajv = new Ajv();
  const schemaPath = path.join(__dirname, '..', '..', 'cards', 'schema', 'card.schema.json');
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const validate = ajv.compile(schema);

  const valid: BrickQuestCard[] = [];
  const errors: string[] = [];

  cards.forEach((card, index) => {
    const isValid = validate(card);
    if (isValid) {
      valid.push(card);
    } else {
      errors.push(`Card ${index + 1} (${card.id || 'unknown'}): ${JSON.stringify(validate.errors)}`);
    }
  });

  return { valid, errors };
}

function sortCards(cards: BrickQuestCard[]): BrickQuestCard[] {
  return cards.sort((a, b) => {
    // Sort by type, then rarity, then name
    const typeOrder = ['Action', 'Reaction', 'Structure', 'Program', 'Event', 'Trap', 'Aura', 'Quest', 'Weather', 'Consumable', 'Blueprint', 'BossTechnique', 'Loot'];
    const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Mythic'];
    
    const typeCompare = typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
    if (typeCompare !== 0) return typeCompare;
    
    const rarityCompare = rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
    if (rarityCompare !== 0) return rarityCompare;
    
    return a.name.localeCompare(b.name);
  });
}

async function main() {
  try {
    const csvPath = path.join(__dirname, '..', '..', 'cards', 'sources', 'cards.csv');
    const outputPath = path.join(__dirname, '..', '..', 'cards', 'expansions', 'core_plus.json');
    
    // Check if CSV exists
    if (!fs.existsSync(csvPath)) {
      console.log('CSV file not found, creating sample file...');
      const sampleCSV = `id,name,type,subtype,faction,classLock,rarity,cost_energy,cost_exhaust,cost_sacrifice,stats,build_lego,build_footprint,text,rules,icons,flavor,limits_perDeck,limits_perField,tags
BQ-REA-0001,Parry Matrix,Reaction,,Neutral,,Uncommon,1,false,,,,"","","When your automaton would take damage, prevent 2. Gain 1 Energy if the attacker is adjacent.","{\"trigger\":\"onIncomingDamage\",\"prevent\":2,\"bonusEnergyIf\":{\"rangeMax\":1,\"amount\":1}}","shield;bolt","Predict, deflect, perfect.",,,,"defense;counter"`;
      fs.writeFileSync(csvPath, sampleCSV);
    }

    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const cardData = parseCSV(csvContent);
    console.log(`Parsed ${cardData.length} cards from CSV`);
    const transformedCards = cardData.map(transformCard);
    console.log(`Transformed ${transformedCards.length} cards`);
    const { valid, errors } = validateCards(transformedCards);
    console.log(`Validated ${valid.length} valid cards, ${errors.length} errors`);
    const sortedCards = sortCards(valid);

    // Write output
    const output = {
      cards: sortedCards,
      metadata: {
        generated: new Date().toISOString(),
        totalCards: sortedCards.length,
        validationErrors: errors.length
      }
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    console.log(`✅ Generated ${sortedCards.length} valid cards`);
    if (errors.length > 0) {
      console.log(`❌ ${errors.length} validation errors:`);
      errors.slice(0, 3).forEach(error => console.log(`  - ${error}`));
      if (errors.length > 3) {
        console.log(`  ... and ${errors.length - 3} more errors`);
      }
    }

  } catch (error) {
    console.error('Error processing cards:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
