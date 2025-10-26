#!/usr/bin/env node

const { mdToPdf } = require('md-to-pdf');
const path = require('path');
const fs = require('fs');

async function buildCheatSheet() {
  const inputFile = path.join(__dirname, '..', 'docs', 'BrickQuest_CheatSheet.md');
  const outputFile = path.join(__dirname, '..', 'docs', 'BrickQuest_CheatSheet.pdf');
  
  console.log('📄 Building BrickQuest Cheat Sheet...');
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
  margin: 0.5in;
}

body {
  font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 11px;
  line-height: 1.3;
  color: #333;
  margin: 0;
  padding: 0;
}

h1 {
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 10px 0;
  text-align: center;
  color: #2c3e50;
}

h2 {
  font-size: 14px;
  font-weight: bold;
  margin: 15px 0 8px 0;
  color: #34495e;
  border-bottom: 2px solid #3498db;
  padding-bottom: 2px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 8px 0;
  font-size: 10px;
}

th, td {
  border: 1px solid #bdc3c7;
  padding: 4px 6px;
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
  border-top: 2px solid #3498db;
  margin: 15px 0;
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
  margin-top: 12px;
  margin-bottom: 6px;
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
  margin-top: 10px;
  color: #7f8c8d;
  font-style: italic;
}

/* Additional CSS for better print layout */
@media print {
  body { -webkit-print-color-adjust: exact; }
  table { page-break-inside: avoid; }
  h2 { page-break-after: avoid; }
}
    `;
    
    fs.writeFileSync(cssFile, cssContent);
    
    // PDF generation options for single-page landscape layout
    const pdfOptions = {
      pdf_options: {
        format: 'A4',
        landscape: true,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        },
        printBackground: true,
        displayHeaderFooter: false,
        scale: 0.8
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
      console.log('✅ Cheat sheet PDF generated successfully!');
      console.log(`📁 Output: ${outputFile}`);
      
      // Get file size
      const stats = fs.statSync(outputFile);
      const fileSizeInKB = Math.round(stats.size / 1024);
      console.log(`📊 File size: ${fileSizeInKB} KB`);
      
      // Clean up temporary CSS file
      if (fs.existsSync(cssFile)) {
        fs.unlinkSync(cssFile);
        console.log('🧹 Cleaned up temporary files');
      }
      
    } else {
      throw new Error('PDF generation failed - no content generated');
    }
    
  } catch (error) {
    console.error('❌ Error generating cheat sheet:', error.message);
    process.exit(1);
  }
}

// Run the build
if (require.main === module) {
  buildCheatSheet();
}

module.exports = { buildCheatSheet };
