#!/usr/bin/env python3
"""
BrickQuest Card Printer
Converts generated cards into printable HTML/PDF format for physical card printing.
"""

import json
import argparse
from pathlib import Path
from typing import Dict, List, Any
import webbrowser
import tempfile
import os

class CardPrinter:
    def __init__(self):
        self.card_size = {
            'width': '2.5in',  # Standard playing card size
            'height': '3.5in'
        }
        self.margin = '0.125in'
        
    def load_cards(self, cards_file: str) -> List[Dict[str, Any]]:
        """Load cards from JSON file."""
        with open(cards_file, 'r') as f:
            data = json.load(f)
            return data.get('cards', [])
    
    def get_rarity_color(self, rarity: str) -> str:
        """Get color for card rarity."""
        colors = {
            'common': '#9ca3af',      # Gray
            'uncommon': '#10b981',    # Green
            'rare': '#3b82f6',        # Blue
            'legendary': '#f59e0b'    # Gold
        }
        return colors.get(rarity, '#9ca3af')
    
    def get_type_icon(self, card_type: str) -> str:
        """Get icon for card type."""
        icons = {
            'action': '⚡',
            'structure': '🏗️',
            'program': '💻',
            'event': '🎲',
            'upgrade': '⬆️'
        }
        return icons.get(card_type, '🃏')
    
    def generate_card_html(self, card: Dict[str, Any]) -> str:
        """Generate HTML for a single card."""
        rarity_color = self.get_rarity_color(card.get('rarity', 'common'))
        type_icon = self.get_type_icon(card.get('type', 'action'))
        
        # Format effects
        effects_html = ""
        if 'effects' in card and card['effects']:
            effects_html = "<div class='effects'>"
            for effect in card['effects']:
                effects_html += f"<div class='effect'>{effect.get('description', '')}</div>"
            effects_html += "</div>"
        
        # Format stats
        stats_html = ""
        if card.get('damage', 0) > 0:
            stats_html += f"<div class='stat'>⚔️ {card['damage']}</div>"
        if card.get('range', 0) > 0:
            stats_html += f"<div class='stat'>🎯 {card['range']}</div>"
        if card.get('duration', 0) > 0:
            stats_html += f"<div class='stat'>⏱️ {card['duration']}</div>"
        
        return f"""
        <div class="card" style="border-color: {rarity_color}">
            <div class="card-header" style="background: {rarity_color}20">
                <div class="card-title">
                    <span class="type-icon">{type_icon}</span>
                    <span class="card-name">{card.get('name', 'Unknown')}</span>
                </div>
                <div class="card-cost">{card.get('cost', {}).get('energy', 0)}</div>
            </div>
            
            <div class="card-body">
                <div class="card-description">{card.get('text', '')}</div>
                {effects_html}
                {stats_html}
            </div>
            
            <div class="card-footer">
                <div class="card-type">{card.get('type', 'action').title()}</div>
                <div class="card-rarity" style="color: {rarity_color}">
                    {card.get('rarity', 'common').title()}
                </div>
            </div>
        </div>
        """
    
    def generate_printable_html(self, cards: List[Dict[str, Any]], output_file: str) -> str:
        """Generate complete HTML file for printing."""
        cards_html = ""
        for card in cards:
            cards_html += self.generate_card_html(card)
        
        html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BrickQuest Printable Cards</title>
    <style>
        @page {{
            size: A4;
            margin: 0.5in;
        }}
        
        body {{
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background: #f5f5f5;
        }}
        
        .print-container {{
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.25in;
            padding: 0.25in;
        }}
        
        .card {{
            width: {self.card_size['width']};
            height: {self.card_size['height']};
            border: 2px solid #333;
            border-radius: 8px;
            background: white;
            display: flex;
            flex-direction: column;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            page-break-inside: avoid;
        }}
        
        .card-header {{
            padding: 8px;
            border-bottom: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        
        .card-title {{
            display: flex;
            align-items: center;
            gap: 4px;
            font-weight: bold;
            font-size: 20px;
        }}
        
        .type-icon {{
            font-size: 24px;
        }}
        
        .card-name {{
            font-size: 18px;
        }}
        
        .card-cost {{
            background: #333;
            color: white;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
        }}
        
        .card-body {{
            flex: 1;
            padding: 10px;
            font-size: 16px;
            line-height: 1.5;
        }}
        
        .card-description {{
            margin-bottom: 8px;
            color: #333;
            font-size: 15px;
        }}
        
        .effects {{
            margin: 4px 0;
        }}
        
        .effect {{
            background: #f0f0f0;
            padding: 4px 8px;
            margin: 3px 0;
            border-radius: 4px;
            font-size: 12px;
        }}
        
        .stat {{
            display: inline-block;
            background: #e0e0e0;
            padding: 3px 8px;
            margin: 3px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }}
        
        .card-footer {{
            padding: 8px 10px;
            border-top: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #666;
        }}
        
        .card-type {{
            font-weight: bold;
        }}
        
        .card-rarity {{
            font-weight: bold;
        }}
        
        @media print {{
            body {{
                background: white;
            }}
            
            .print-container {{
                grid-template-columns: repeat(3, 1fr);
                gap: 0.1in;
                padding: 0;
            }}
            
            .card {{
                break-inside: avoid;
            }}
        }}
        
        .print-instructions {{
            background: white;
            padding: 20px;
            margin: 20px;
            border: 2px solid #333;
            border-radius: 8px;
            font-family: Arial, sans-serif;
        }}
        
        .print-instructions h2 {{
            color: #333;
            margin-top: 0;
        }}
        
        .print-instructions ul {{
            margin: 10px 0;
            padding-left: 20px;
        }}
        
        .print-instructions li {{
            margin: 5px 0;
        }}
        
        @media print {{
            .print-instructions {{
                display: none !important;
            }}
        }}
    </style>
</head>
<body>
    <div class="print-instructions">
        <h2>🖨️ BrickQuest Card Printing Instructions</h2>
        <ul>
            <li><strong>Paper:</strong> Use 300gsm cardstock or photo paper for best results</li>
            <li><strong>Size:</strong> Standard A4 paper (8.27" x 11.69")</li>
            <li><strong>Layout:</strong> 3 cards per row, 9 cards per page</li>
            <li><strong>Print Settings:</strong> High quality, color printing</li>
            <li><strong>Cutting:</strong> Use a paper cutter or scissors to cut along the card borders</li>
            <li><strong>Finishing:</strong> Consider laminating for durability</li>
        </ul>
        <p><strong>Total Cards:</strong> {len(cards)} cards</p>
        <p><strong>Estimated Pages:</strong> {(len(cards) + 8) // 9} pages</p>
    </div>
    
    <div class="print-container">
        {cards_html}
    </div>
</body>
</html>
        """
        
        return html_content
    
    def save_html(self, html_content: str, output_file: str):
        """Save HTML content to file."""
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
        print(f"✅ Printable cards saved to: {output_file}")
    
    def open_in_browser(self, html_file: str):
        """Open HTML file in browser for printing."""
        file_path = Path(html_file).resolve()
        webbrowser.open(f"file://{file_path}")
        print(f"🌐 Opening {html_file} in browser for printing...")
    
    def print_cards(self, cards_file: str, output_file: str = None, open_browser: bool = True):
        """Main function to print cards."""
        if not output_file:
            output_file = "brickquest_printable_cards.html"
        
        print(f"📚 Loading cards from: {cards_file}")
        cards = self.load_cards(cards_file)
        print(f"📊 Found {len(cards)} cards")
        
        print("🎨 Generating printable HTML...")
        html_content = self.generate_printable_html(cards, output_file)
        
        print("💾 Saving HTML file...")
        self.save_html(html_content, output_file)
        
        if open_browser:
            self.open_in_browser(output_file)
        
        print("🎉 Card printing setup complete!")
        print(f"📄 Open {output_file} in your browser and use Ctrl+P to print")
        print("📋 Make sure to select 'More settings' > 'Options' > 'Background graphics' for best results")

def main():
    parser = argparse.ArgumentParser(description='Generate printable BrickQuest cards')
    parser.add_argument('--cards', default='cards/generated_cards.json', 
                       help='Path to cards JSON file')
    parser.add_argument('--output', default='brickquest_printable_cards.html',
                       help='Output HTML file name')
    parser.add_argument('--no-browser', action='store_true',
                       help='Don\'t open browser automatically')
    
    args = parser.parse_args()
    
    # Check if cards file exists
    if not Path(args.cards).exists():
        print(f"❌ Cards file not found: {args.cards}")
        print("💡 Generate cards first with: python scripts/generate_cards.py")
        return
    
    printer = CardPrinter()
    printer.print_cards(args.cards, args.output, not args.no_browser)

if __name__ == "__main__":
    main()
