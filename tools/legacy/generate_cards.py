#!/usr/bin/env python3
"""
BrickQuest Card Generator
Generates card templates and helps create new cards for the game.
"""

import json
import random
import argparse
from typing import Dict, List, Any
from pathlib import Path

class CardGenerator:
    def __init__(self):
        self.card_templates = self.load_card_templates()
        self.card_types = ['action', 'structure', 'program', 'event', 'upgrade']
        self.rarities = ['common', 'uncommon', 'rare', 'legendary']
        
    def load_card_templates(self) -> Dict[str, List[Dict]]:
        """Load card templates from JSON file."""
        template_file = Path(__file__).parent.parent / 'cards' / 'base_set.json'
        if template_file.exists():
            with open(template_file, 'r') as f:
                data = json.load(f)
                return data.get('cards', [])
        return []
    
    def generate_random_card(self, card_type: str = None, rarity: str = None) -> Dict[str, Any]:
        """Generate a random card based on templates."""
        if not card_type:
            card_type = random.choice(self.card_types)
        if not rarity:
            rarity = random.choice(self.rarities)
            
        # Get templates for the specified type
        templates = [card for card in self.card_templates if card['type'] == card_type]
        
        if not templates:
            # Create a basic template if none exist
            return self.create_basic_template(card_type, rarity)
        
        # Choose a random template
        template = random.choice(templates)
        
        # Generate variations
        card = template.copy()
        card['id'] = self.generate_card_id(card['name'])
        card['rarity'] = rarity
        
        # Modify effects based on rarity
        self.modify_effects_by_rarity(card, rarity)
        
        return card
    
    def create_basic_template(self, card_type: str, rarity: str) -> Dict[str, Any]:
        """Create a basic card template."""
        templates = {
            'action': {
                'name': 'Basic Action',
                'cost': 2,
                'description': 'A basic action card',
                'effects': [{'type': 'damage', 'value': 1, 'target': 'enemy', 'description': 'Deal 1 damage'}],
                'range': 1,
                'damage': 1
            },
            'structure': {
                'name': 'Basic Structure',
                'cost': 3,
                'description': 'A basic structure card',
                'effects': [{'type': 'build', 'value': 1, 'target': 'terrain', 'description': 'Build a structure'}],
                'range': 0,
                'damage': 0
            },
            'program': {
                'name': 'Basic Program',
                'cost': 2,
                'description': 'A basic program card',
                'effects': [{'type': 'heal', 'value': 1, 'target': 'self', 'description': 'Heal 1 HP'}],
                'range': 0,
                'damage': 0,
                'duration': 2
            },
            'event': {
                'name': 'Basic Event',
                'cost': 0,
                'description': 'A basic event card',
                'effects': [{'type': 'energy', 'value': 1, 'target': 'all', 'description': 'All players gain 1 energy'}],
                'range': 0,
                'damage': 0
            },
            'upgrade': {
                'name': 'Basic Upgrade',
                'cost': 0,
                'description': 'A basic upgrade card',
                'effects': [{'type': 'energy', 'value': 1, 'target': 'self', 'description': 'Increase max energy by 1'}],
                'range': 0,
                'damage': 0
            }
        }
        
        template = templates[card_type].copy()
        template['type'] = card_type
        template['rarity'] = rarity
        template['id'] = self.generate_card_id(template['name'])
        
        return template
    
    def generate_card_id(self, name: str) -> str:
        """Generate a unique card ID from the name."""
        return name.lower().replace(' ', '_').replace('-', '_')
    
    def modify_effects_by_rarity(self, card: Dict[str, Any], rarity: str) -> None:
        """Modify card effects based on rarity."""
        rarity_multipliers = {
            'common': 1.0,
            'uncommon': 1.2,
            'rare': 1.5,
            'legendary': 2.0
        }
        
        multiplier = rarity_multipliers[rarity]
        
        # Modify cost
        if card['cost'] > 0:
            card['cost'] = max(1, int(card['cost'] * (2 - multiplier)))
        
        # Modify effects
        for effect in card['effects']:
            if effect['type'] in ['damage', 'heal', 'energy']:
                effect['value'] = max(1, int(effect['value'] * multiplier))
        
        # Modify range and damage
        if 'range' in card and card['range'] > 0:
            card['range'] = int(card['range'] * multiplier)
        if 'damage' in card and card['damage'] > 0:
            card['damage'] = int(card['damage'] * multiplier)
    
    def generate_card_set(self, count: int, card_type: str = None, rarity: str = None) -> List[Dict[str, Any]]:
        """Generate a set of random cards."""
        cards = []
        for _ in range(count):
            card = self.generate_random_card(card_type, rarity)
            cards.append(card)
        return cards
    
    def save_cards(self, cards: List[Dict[str, Any]], filename: str) -> None:
        """Save cards to a JSON file."""
        output_file = Path(__file__).parent.parent / 'cards' / filename
        output_file.parent.mkdir(exist_ok=True)
        
        with open(output_file, 'w') as f:
            json.dump({'cards': cards}, f, indent=2)
        
        print(f"Saved {len(cards)} cards to {output_file}")
    
    def validate_card(self, card: Dict[str, Any]) -> List[str]:
        """Validate a card and return any errors."""
        errors = []
        
        required_fields = ['id', 'name', 'type', 'cost', 'description', 'effects', 'rarity']
        for field in required_fields:
            if field not in card:
                errors.append(f"Missing required field: {field}")
        
        if card['type'] not in self.card_types:
            errors.append(f"Invalid card type: {card['type']}")
        
        if card['rarity'] not in self.rarities:
            errors.append(f"Invalid rarity: {card['rarity']}")
        
        if not isinstance(card['cost'], int) or card['cost'] < 0:
            errors.append("Cost must be a non-negative integer")
        
        if not card['effects']:
            errors.append("Card must have at least one effect")
        
        return errors
    
    def print_card(self, card: Dict[str, Any]) -> None:
        """Print a formatted card."""
        print(f"\n{'='*50}")
        print(f"Card: {card['name']}")
        print(f"Type: {card['type'].title()}")
        print(f"Cost: {card['cost']} energy")
        print(f"Rarity: {card['rarity'].title()}")
        print(f"Description: {card['description']}")
        
        if 'range' in card and card['range'] > 0:
            print(f"Range: {card['range']}")
        if 'damage' in card and card['damage'] > 0:
            print(f"Damage: {card['damage']}")
        if 'duration' in card and card['duration'] > 0:
            print(f"Duration: {card['duration']} turns")
        
        print("Effects:")
        for effect in card['effects']:
            print(f"  - {effect['description']}")
        print(f"{'='*50}")

def main():
    parser = argparse.ArgumentParser(description='Generate BrickQuest cards')
    parser.add_argument('--count', type=int, default=5, help='Number of cards to generate')
    parser.add_argument('--type', choices=['action', 'structure', 'program', 'event', 'upgrade'], help='Card type')
    parser.add_argument('--rarity', choices=['common', 'uncommon', 'rare', 'legendary'], help='Card rarity')
    parser.add_argument('--output', default='generated_cards.json', help='Output filename')
    parser.add_argument('--validate', action='store_true', help='Validate generated cards')
    parser.add_argument('--print', action='store_true', help='Print generated cards')
    
    args = parser.parse_args()
    
    generator = CardGenerator()
    
    # Generate cards
    cards = generator.generate_card_set(args.count, args.type, args.rarity)
    
    # Validate cards if requested
    if args.validate:
        print("Validating cards...")
        for i, card in enumerate(cards):
            errors = generator.validate_card(card)
            if errors:
                print(f"Card {i+1} ({card['name']}) has errors:")
                for error in errors:
                    print(f"  - {error}")
            else:
                print(f"Card {i+1} ({card['name']}) is valid")
    
    # Print cards if requested
    if args.print:
        for card in cards:
            generator.print_card(card)
    
    # Save cards
    generator.save_cards(cards, args.output)
    
    print(f"\nGenerated {len(cards)} cards successfully!")

if __name__ == '__main__':
    main()


