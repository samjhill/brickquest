# 🖼️ Render Generation Guide & PDF Compilation

## Overview
This guide provides instructions for generating step-by-step renders in Stud.io and compiling them into a professional PDF instruction booklet for the BrickQuest Starter Bots.

## 📋 Prerequisites

### Software Requirements
- **Bricklink Stud.io** (Latest version)
- **Python 3.7+** with required packages
- **ImageMagick** (for image processing, optional)

### Python Packages
```bash
pip install reportlab pillow
```

## 🎨 Stud.io Render Generation

### Step 1: Import Build Instructions
1. Open Bricklink Stud.io
2. Create new project for each bot:
   - `engineer_bot.io`
   - `warrior_bot.io`
   - `magecore_bot.io`
   - `trickster_bot.io`

### Step 2: Build Each Bot
Follow the detailed instructions in:
- `engineer_bot_instructions.md`
- `warrior_bot_instructions.md`
- `magecore_bot_instructions.md`
- `trickster_bot_instructions.md`

### Step 3: Create Step List
For each bot, create a Step List with 6-8 logical steps:

#### Engineer Bot Steps
1. Foundation (base plate)
2. Torso base (yellow brick)
3. Energy core (transparent blue)
4. Torso completion (yellow brick)
5. Head (yellow tile)
6. Arms (left and right)
7. Tools and sensors
8. Final details

#### Warrior Bot Steps
1. Foundation (4×4 base plate)
2. Main torso (dark gray)
3. Chest armor (red)
4. Head with sensor
5. Shoulder armor
6. Arms assembly
7. Shield and weapon
8. Final details

#### Mage Core Bot Steps
1. Foundation (round base)
2. Hover column
3. Energy core base
4. Energy core (yellow)
5. Core completion
6. Head with sensors
7. Arms and floating elements
8. Final magical effects

#### Trickster Bot Steps
1. Offset foundation (jumper plate)
2. Torso assembly
3. Head with sensors
4. Arms with clips
5. Stealth features
6. Mobility enhancements
7. Side details
8. Final details

### Step 4: Render Settings

#### Camera Configuration
- **Angle**: 30° isometric
- **Distance**: Medium (shows full bot)
- **Background**: White (#FFFFFF)
- **Lighting**: Standard LEGO instruction lighting

#### Export Settings
- **Resolution**: 1600px wide
- **DPI**: 300
- **Format**: PNG
- **Quality**: High

#### Step Number Bubbles
- **Color**: LEGO Blue (#0076CE)
- **Style**: Standard LEGO instruction bubbles
- **Position**: Top-left corner

### Step 5: Export Renders
Export each step as PNG with naming convention:
- `engineer_bot_step_01.png`
- `engineer_bot_step_02.png`
- etc.

Save all renders to `/designs/renders/` directory.

## 📄 PDF Compilation Script

### Python Script: `generate_instruction_booklet.py`

```python
#!/usr/bin/env python3
"""
BrickQuest Starter Bot Instruction Booklet Generator
Creates a professional PDF instruction booklet from Stud.io renders
"""

import os
import glob
from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from PIL import Image as PILImage

class BrickQuestInstructionGenerator:
    def __init__(self, output_path="docs/BrickQuest_Starter_Bot_Instructions.pdf"):
        self.output_path = output_path
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()
        
    def setup_custom_styles(self):
        """Setup custom styles for the instruction booklet"""
        # Title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Title'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=HexColor('#2F4F4F')
        ))
        
        # Bot title style
        self.styles.add(ParagraphStyle(
            name='BotTitle',
            parent=self.styles['Heading1'],
            fontSize=18,
            spaceAfter=20,
            alignment=TA_CENTER,
            textColor=HexColor('#0076CE')
        ))
        
        # Step title style
        self.styles.add(ParagraphStyle(
            name='StepTitle',
            parent=self.styles['Heading2'],
            fontSize=14,
            spaceAfter=10,
            alignment=TA_LEFT,
            textColor=HexColor('#2F4F4F')
        ))
        
        # Body text style
        self.styles.add(ParagraphStyle(
            name='BodyText',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceAfter=6,
            alignment=TA_LEFT
        ))

    def create_title_page(self, story):
        """Create the title page with all four bots"""
        # Main title
        story.append(Paragraph("🧱 BrickQuest", self.styles['CustomTitle']))
        story.append(Paragraph("Starter Bot Instructions", self.styles['CustomTitle']))
        story.append(Spacer(1, 20))
        
        # Subtitle
        story.append(Paragraph("Build your LEGO robot heroes!", self.styles['BotTitle']))
        story.append(Spacer(1, 30))
        
        # Bot overview
        bots_info = [
            ("🟡 Engineer Bot", "Construction, repair, defensive structures"),
            ("🔴 Warrior Bot", "Combat, shields, offensive capabilities"),
            ("🔵 Mage Core Bot", "Energy manipulation, sensors, magic"),
            ("🟢 Trickster Bot", "Mobility, stealth, tactical positioning")
        ]
        
        for bot_name, description in bots_info:
            story.append(Paragraph(f"<b>{bot_name}</b>", self.styles['StepTitle']))
            story.append(Paragraph(description, self.styles['BodyText']))
            story.append(Spacer(1, 10))
        
        story.append(Spacer(1, 30))
        
        # Footer info
        story.append(Paragraph("Built with LEGO Classic sets 11040 + 10698", self.styles['BodyText']))
        story.append(Paragraph("BrickQuest Game System", self.styles['BodyText']))
        
        story.append(PageBreak())

    def process_image(self, image_path, max_width=6*inch, max_height=8*inch):
        """Process and resize image for PDF"""
        if not os.path.exists(image_path):
            print(f"Warning: Image not found: {image_path}")
            return None
            
        # Open image to get dimensions
        with PILImage.open(image_path) as img:
            img_width, img_height = img.size
            
        # Calculate scaling to fit within max dimensions
        scale_x = max_width / img_width
        scale_y = max_height / img_height
        scale = min(scale_x, scale_y)
        
        new_width = img_width * scale
        new_height = img_height * scale
        
        return Image(image_path, width=new_width, height=new_height)

    def create_bot_instructions(self, story, bot_name, bot_color, bot_description, step_count):
        """Create instruction pages for a specific bot"""
        # Bot title page
        story.append(Paragraph(f"{bot_color} {bot_name}", self.styles['BotTitle']))
        story.append(Paragraph(bot_description, self.styles['BodyText']))
        story.append(Spacer(1, 20))
        
        # Bot overview
        story.append(Paragraph("Build Steps:", self.styles['StepTitle']))
        for i in range(1, step_count + 1):
            story.append(Paragraph(f"Step {i}: [See following pages]", self.styles['BodyText']))
        
        story.append(PageBreak())
        
        # Step pages
        for step_num in range(1, step_count + 1):
            # Step title
            story.append(Paragraph(f"Step {step_num}", self.styles['StepTitle']))
            story.append(Spacer(1, 10))
            
            # Step image
            image_path = f"designs/renders/{bot_name.lower().replace(' ', '_')}_step_{step_num:02d}.png"
            step_image = self.process_image(image_path)
            
            if step_image:
                story.append(step_image)
            else:
                story.append(Paragraph(f"[Image: {bot_name} Step {step_num}]", self.styles['BodyText']))
            
            story.append(Spacer(1, 20))
            
            # Step description
            step_descriptions = {
                "Engineer Bot": [
                    "Place the 2×2 base plate flat on the build surface.",
                    "Add the yellow torso brick on top of the base.",
                    "Stack the transparent blue energy core brick.",
                    "Complete the torso with the second yellow brick.",
                    "Place the yellow head tile on top.",
                    "Attach the left and right arms with clips.",
                    "Add tools and sensors to complete the build.",
                    "Add final details and accessories."
                ],
                "Warrior Bot": [
                    "Place the 4×4 base plate flat on the build surface.",
                    "Add the main dark gray torso brick.",
                    "Place the red chest armor on the front.",
                    "Add the red head with orange sensor.",
                    "Attach the left and right shoulder armor.",
                    "Build and attach both arms.",
                    "Equip the shield and weapon.",
                    "Add final details and accessories."
                ],
                "Mage Core Bot": [
                    "Place the round white base plate.",
                    "Build the transparent blue hover column.",
                    "Add the violet energy core base.",
                    "Place the yellow energy core brick.",
                    "Complete the core with violet top.",
                    "Add the transparent dome head with sensors.",
                    "Attach arms and floating energy elements.",
                    "Add final magical effects and details."
                ],
                "Trickster Bot": [
                    "Place the offset jumper plate base.",
                    "Build the asymmetrical torso assembly.",
                    "Add the head with dual sensors.",
                    "Attach arms with clip systems.",
                    "Add stealth and camouflage features.",
                    "Install mobility enhancements.",
                    "Add side details and sensors.",
                    "Complete with final details."
                ]
            }
            
            if step_num <= len(step_descriptions[bot_name]):
                story.append(Paragraph(step_descriptions[bot_name][step_num - 1], self.styles['BodyText']))
            
            story.append(PageBreak())

    def create_upgrade_section(self, story):
        """Create upgrade pack section"""
        story.append(Paragraph("🔧 Upgrade Packs", self.styles['BotTitle']))
        story.append(Paragraph("Enhance your bots with these upgrade modules:", self.styles['BodyText']))
        story.append(Spacer(1, 20))
        
        upgrades = [
            ("Turret Module", "Add ranged attack capabilities"),
            ("Sensor Array", "Enhanced detection and awareness"),
            ("Shield Generator", "Improved defensive capabilities"),
            ("Mobility Boost", "Increased movement and agility"),
            ("Energy Core", "Enhanced power and abilities")
        ]
        
        for upgrade_name, description in upgrades:
            story.append(Paragraph(f"<b>{upgrade_name}</b>", self.styles['StepTitle']))
            story.append(Paragraph(description, self.styles['BodyText']))
            story.append(Spacer(1, 10))
        
        story.append(PageBreak())

    def generate_pdf(self):
        """Generate the complete PDF instruction booklet"""
        doc = SimpleDocTemplate(
            self.output_path,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        story = []
        
        # Title page
        self.create_title_page(story)
        
        # Bot instructions
        bots = [
            ("Engineer Bot", "🟡", "Construction, repair, defensive structures", 8),
            ("Warrior Bot", "🔴", "Combat, shields, offensive capabilities", 8),
            ("Mage Core Bot", "🔵", "Energy manipulation, sensors, magic", 8),
            ("Trickster Bot", "🟢", "Mobility, stealth, tactical positioning", 8)
        ]
        
        for bot_name, bot_color, bot_description, step_count in bots:
            self.create_bot_instructions(story, bot_name, bot_color, bot_description, step_count)
        
        # Upgrade section
        self.create_upgrade_section(story)
        
        # Build PDF
        doc.build(story)
        print(f"PDF instruction booklet generated: {self.output_path}")

def main():
    """Main function to generate the instruction booklet"""
    generator = BrickQuestInstructionGenerator()
    generator.generate_pdf()

if __name__ == "__main__":
    main()
```

## 🚀 Usage Instructions

### Step 1: Prepare Renders
1. Follow the Stud.io render generation steps above
2. Export all step renders to `/designs/renders/`
3. Ensure proper naming convention is followed

### Step 2: Run PDF Generation
```bash
cd /Users/samhilll/Documents/opensource/brickquest
python scripts/generate_instruction_booklet.py
```

### Step 3: Verify Output
- Check `/docs/BrickQuest_Starter_Bot_Instructions.pdf`
- Verify all pages are included
- Ensure image quality is acceptable

## 📁 File Organization

### Directory Structure
```
/designs/
├── BUILD_SPECIFICATIONS.md
├── engineer_bot_instructions.md
├── warrior_bot_instructions.md
├── magecore_bot_instructions.md
├── trickster_bot_instructions.md
├── engineer_bot.io (Stud.io file)
├── warrior_bot.io (Stud.io file)
├── magecore_bot.io (Stud.io file)
├── trickster_bot.io (Stud.io file)
└── /renders/
    ├── engineer_bot_step_01.png
    ├── engineer_bot_step_02.png
    ├── ...
    ├── warrior_bot_step_01.png
    ├── warrior_bot_step_02.png
    ├── ...
    ├── magecore_bot_step_01.png
    ├── magecore_bot_step_02.png
    ├── ...
    ├── trickster_bot_step_01.png
    ├── trickster_bot_step_02.png
    └── ...
```

## 🎯 Quality Checklist

### Render Quality
- [ ] All renders are 1600px wide, 300 DPI
- [ ] Consistent camera angles (30° isometric)
- [ ] White background for all renders
- [ ] LEGO blue step number bubbles
- [ ] Clear part callouts and arrows

### PDF Quality
- [ ] Professional layout and typography
- [ ] All bot instructions included
- [ ] Proper page breaks and spacing
- [ ] High-quality image reproduction
- [ ] Consistent formatting throughout

### Content Quality
- [ ] All steps are logical and clear
- [ ] Part counts and descriptions accurate
- [ ] Build progression is smooth
- [ ] Instructions match LEGO style
- [ ] Upgrade section included

## 🔧 Troubleshooting

### Common Issues
1. **Missing Images**: Check file paths and naming convention
2. **Poor Image Quality**: Verify render settings in Stud.io
3. **PDF Generation Errors**: Check Python dependencies
4. **Layout Issues**: Adjust image sizing parameters

### Solutions
1. **Image Paths**: Use absolute paths or verify relative paths
2. **Render Settings**: Increase DPI and resolution in Stud.io
3. **Dependencies**: Install required Python packages
4. **Layout**: Adjust max_width and max_height parameters

## 📋 Final Deliverables

### Required Files
- [ ] 4 × `.io` files in `/designs/`
- [ ] 32 × step render PNGs in `/designs/renders/`
- [ ] 1 × PDF instruction booklet in `/docs/`
- [ ] Build specifications and instructions

### Optional Enhancements
- [ ] Upgrade pack renders
- [ ] QR codes for digital versions
- [ ] Color-coded section dividers
- [ ] Additional bot poses
