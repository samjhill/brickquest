#!/usr/bin/env node

const { mdToPdf } = require('md-to-pdf');
const path = require('path');
const fs = require('fs');

async function buildCheatSheet(inputFile, outputFile, title) {
  console.log(`📄 Building ${title}...`);
  console.log(`Input: ${inputFile}`);
  console.log(`Output: ${outputFile}`);
  
  try {
    // Check if input file exists
    if (!fs.existsSync(inputFile)) {
      throw new Error(`Input file not found: ${inputFile}`);
    }
    
    // Create CSS file for styling
    const cssFile = path.join(__dirname, '..', 'docs', 'cheatsheet.css');
    const cssContent = `
@page {
  size: A4 landscape;
  margin: 0.3in;
}

body {
  font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 11px;
  line-height: 1.3;
  color: #333;
  margin: 0;
  padding: 0;
  column-count: 2;
  column-gap: 25px;
  column-fill: auto;
}

h1 {
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 10px 0;
  text-align: center;
  color: #2c3e50;
  column-span: all;
}

h2 {
  font-size: 13px;
  font-weight: bold;
  margin: 10px 0 6px 0;
  color: #34495e;
  border-bottom: 1px solid #3498db;
  padding-bottom: 2px;
  break-after: avoid;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 6px 0;
  font-size: 10px;
  break-inside: avoid;
}

th, td {
  border: 1px solid #bdc3c7;
  padding: 3px 6px;
  text-align: left;
  vertical-align: top;
}

th {
  background-color: #ecf0f1;
  font-weight: bold;
  font-size: 10px;
}

tr:nth-child(even) {
  background-color: #f8f9fa;
}

hr {
  border: none;
  border-top: 1px solid #3498db;
  margin: 8px 0;
  column-span: all;
}

/* Ensure single page layout */
.page-break {
  page-break-before: always;
}

/* Compact spacing for single page */
* {
  margin-top: 0;
  margin-bottom: 0;
}

h2 {
  margin-top: 8px;
  margin-bottom: 4px;
}

table {
  margin-top: 4px;
  margin-bottom: 4px;
}

/* Icon styling */
.icon {
  font-size: 12px;
  margin-right: 2px;
}

/* Footer */
.footer {
  font-size: 9px;
  text-align: center;
  margin-top: 8px;
  color: #7f8c8d;
  font-style: italic;
  column-span: all;
}

/* Additional CSS for better print layout */
@media print {
  body { -webkit-print-color-adjust: exact; }
  table { page-break-inside: avoid; }
  h2 { page-break-after: avoid; }
  h1 { page-break-after: avoid; }
}

/* Force single page */
body {
  height: 100vh;
  overflow: hidden;
}
    `;
    
    fs.writeFileSync(cssFile, cssContent);
    
    // PDF generation options for single-page landscape layout
    const pdfOptions = {
      pdf_options: {
        format: 'A4',
        landscape: true,
        margin: {
          top: '0.3in',
          right: '0.3in',
          bottom: '0.3in',
          left: '0.3in'
        },
        printBackground: true,
        displayHeaderFooter: false,
        scale: 0.9
      },
      stylesheet: cssFile,
      body_class: 'cheatsheet',
      launch_options: {
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-software-rasterizer'
        ]
      }
    };
    
    // Generate PDF
    const pdf = await mdToPdf({ path: inputFile }, pdfOptions);
    
    if (pdf) {
      // Write PDF to file
      fs.writeFileSync(outputFile, pdf.content);
      console.log(`✅ ${title} PDF generated successfully!`);
      console.log(`📁 Output: ${outputFile}`);
      
      // Get file size
      const stats = fs.statSync(outputFile);
      const fileSizeInKB = Math.round(stats.size / 1024);
      console.log(`📊 File size: ${fileSizeInKB} KB`);
      
    } else {
      throw new Error('PDF generation failed - no content generated');
    }
    
  } catch (error) {
    console.error(`❌ Error generating ${title}:`, error.message);
    throw error;
  }
}

async function buildAllCheatSheets() {
  const docsDir = path.join(__dirname, '..', 'docs');
  
  const cheatSheets = [
    {
      input: path.join(docsDir, 'BrickQuest_CheatSheet.md'),
      output: path.join(docsDir, 'BrickQuest_CheatSheet.pdf'),
      title: 'Main BrickQuest Cheat Sheet'
    },
    {
      input: path.join(docsDir, 'BrickQuest_Engineer_CheatSheet.md'),
      output: path.join(docsDir, 'BrickQuest_Engineer_CheatSheet.pdf'),
      title: 'Engineer Class Cheat Sheet'
    },
    {
      input: path.join(docsDir, 'BrickQuest_Warrior_CheatSheet.md'),
      output: path.join(docsDir, 'BrickQuest_Warrior_CheatSheet.pdf'),
      title: 'Warrior Class Cheat Sheet'
    },
    {
      input: path.join(docsDir, 'BrickQuest_MageCore_CheatSheet.md'),
      output: path.join(docsDir, 'BrickQuest_MageCore_CheatSheet.pdf'),
      title: 'Mage Core Class Cheat Sheet'
    },
    {
      input: path.join(docsDir, 'BrickQuest_Trickster_CheatSheet.md'),
      output: path.join(docsDir, 'BrickQuest_Trickster_CheatSheet.pdf'),
      title: 'Trickster Class Cheat Sheet'
    }
  ];
  
  console.log('🚀 Building all BrickQuest cheat sheets...');
  console.log('=====================================');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const sheet of cheatSheets) {
    try {
      await buildCheatSheet(sheet.input, sheet.output, sheet.title);
      successCount++;
    } catch (error) {
      errorCount++;
      console.error(`Failed to build ${sheet.title}`);
    }
    console.log(''); // Add spacing between builds
  }
  
  // Clean up temporary CSS file
  const cssFile = path.join(__dirname, '..', 'docs', 'cheatsheet.css');
  if (fs.existsSync(cssFile)) {
    fs.unlinkSync(cssFile);
    console.log('🧹 Cleaned up temporary files');
  }
  
  console.log('=====================================');
  console.log(`✅ Successfully built ${successCount} cheat sheets`);
  if (errorCount > 0) {
    console.log(`❌ Failed to build ${errorCount} cheat sheets`);
  }
  console.log('🎉 All cheat sheet builds complete!');
}

// Run the build
if (require.main === module) {
  buildAllCheatSheets().catch(error => {
    console.error('❌ Build process failed:', error.message);
    process.exit(1);
  });
}

module.exports = { buildCheatSheet, buildAllCheatSheets };
