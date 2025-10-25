#!/bin/bash
# BrickQuest Card Printer Script
# Converts generated cards into printable format

echo "🃏 BrickQuest Card Printer"
echo "=========================="

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if cards file exists
CARDS_FILE="../cards/generated_cards.json"
if [ ! -f "$CARDS_FILE" ]; then
    echo "❌ Cards file not found: $CARDS_FILE"
    echo "💡 Generate cards first with: ./generate_cards.sh"
    exit 1
fi

# Run the card printer
echo "📚 Converting cards to printable format..."
python3 print_cards.py --cards "$CARDS_FILE" --output "../cards/printable_cards.html"

echo "✅ Card printing setup complete!"
echo "📄 Open cards/printable_cards.html in your browser"
echo "🖨️ Use Ctrl+P to print the cards"
