#!/usr/bin/env python3
"""
BrickQuest BrickLink Wanted List Generator

Generates a BrickLink-compatible XML file for the starter character parts list.
This can be imported directly to bricklink.com under Wanted Lists.

Usage:
    python scripts/generate_bricklink_xml.py

Output:
    brickquest_starter_bricklink_wantedlist.xml
"""

import xml.etree.ElementTree as ET
import os
from datetime import datetime

def generate_bricklink_xml():
    """Generate BrickLink wanted list XML for BrickQuest starter parts."""
    
    # Core LEGO System Parts
    # Format: (part_no, quantity, color_id, description)
    parts = [
        # Core torso parts (enough for 4 characters + spares)
        ("3002", 8, 86, "Brick 2×3 - Light Bluish Gray (Engineer torso + spares)"),
        ("3003", 8, 85, "Brick 2×2 - Dark Bluish Gray (Warrior torso)"),
        ("3004", 8, 1, "Brick 1×2 - White (MageCore torso)"),
        ("3003", 8, 106, "Brick 2×2 - Bright Orange (Trickster torso)"),
        
        # Base plates and feet
        ("3022", 16, 0, "Plate 2×2 - Black (Base feet)"),
        ("3023", 16, 0, "Plate 1×2 - Black (Jetpack mounts, connection plates)"),
        ("3024", 20, 0, "Plate 1×1 - Black (Small connections)"),
        
        # Slope pieces
        ("3040", 8, 106, "Slope 30° 1×2 - Bright Orange (Trickster front panel)"),
        ("3040", 4, 4, "Slope 30° 1×2 - Red (Warrior helmet crest)"),
        ("3747", 4, 86, "Inverted Slope 1×2 - Light Bluish Gray (Optional armor shaping)"),
        
        # Connection and arm parts
        ("4085b", 16, 0, "Clip Plate 1×1 - Black (Arm sockets)"),
        ("48729", 16, 0, "Bar 1L with Clip - Black (Arms, weapons)"),
        ("4589", 12, 0, "Cone 1×1 - Black (Emitters, jetpack nozzles)"),
        
        # Sensor and detail parts
        ("4073", 12, 41, "Round Plate 1×1 - Translucent Blue (Sensors, cores)"),
        ("3068b", 4, 85, "Tile 2×2 - Dark Bluish Gray (Shield faces)"),
        ("30367", 4, 1, "Dome 2×2 - White (MageCore sensor dome)"),
        ("3957", 8, 0, "Antenna 4H - Black (Sensor arrays)"),
        
        # Head parts (standard minifigure heads)
        ("3626b", 4, 4, "Minifigure Head - Yellow (Standard heads)"),
        ("4073", 8, 86, "Round Plate 1×1 - Light Bluish Gray (Engineer head assembly)"),
        
        # Accent parts
        ("3024", 4, 24, "Plate 1×1 - Yellow (Engineer belt accent)"),
        ("3003", 4, 4, "Brick 2×2 - Red (Warrior accent chest armor)"),
        ("3040", 4, 106, "Slope 30° 1×2 - Orange (Trickster accent slope front)"),
        
        # Specialized parts
        ("3024", 4, 41, "Plate 1×1 - Translucent Blue (MageCore energy core)"),
        ("3024", 4, 6, "Plate 1×1 - Teal (Trickster grappling hook)"),
        
        # Additional parts for upgrades and customization
        ("3001", 8, 86, "Brick 2×4 - Light Bluish Gray (Base plates)"),
        ("3001", 8, 85, "Brick 2×4 - Dark Bluish Gray (Base plates)"),
        ("3001", 8, 1, "Brick 2×4 - White (Base plates)"),
        ("3001", 8, 106, "Brick 2×4 - Bright Orange (Base plates)"),
    ]
    
    # Create XML structure
    root = ET.Element("INVENTORY")
    
    # Add comment with generation info
    comment = ET.Comment(f"BrickQuest Starter Parts List - Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    root.insert(0, comment)
    
    # Add each part to the inventory
    for part_no, qty, color_id, description in parts:
        item = ET.SubElement(root, "ITEM")
        ET.SubElement(item, "ITEMTYPE").text = "P"  # P = Part
        ET.SubElement(item, "ITEMID").text = part_no
        ET.SubElement(item, "COLOR").text = str(color_id)
        ET.SubElement(item, "MINQTY").text = str(qty)
        ET.SubElement(item, "CONDITION").text = "N"  # N = New condition
        
        # Add description as comment
        item_comment = ET.Comment(f" {description} ")
        item.append(item_comment)
    
    # Create XML tree and write to file
    tree = ET.ElementTree(root)
    
    # Format the XML nicely
    ET.indent(tree, space="  ", level=0)
    
    # Write to file
    output_file = "brickquest_starter_bricklink_wantedlist.xml"
    tree.write(output_file, encoding="utf-8", xml_declaration=True)
    
    print(f"✅ Generated {output_file}")
    print(f"📦 Total parts: {len(parts)}")
    print(f"🧱 Total quantity: {sum(qty for _, qty, _, _ in parts)}")
    print(f"📋 Import this file to BrickLink under Wanted Lists")
    
    return output_file

if __name__ == "__main__":
    generate_bricklink_xml()
