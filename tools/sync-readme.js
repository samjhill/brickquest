#!/usr/bin/env node

/**
 * Sync README with latest simulation results
 */

const fs = require('fs');
const path = require('path');

const README_PATH = path.join(__dirname, '../README.md');
const BALANCE_PATH = path.join(__dirname, '../docs/BALANCE.md');

function syncReadme() {
  console.log('Syncing README with latest simulation data...');

  if (!fs.existsSync(README_PATH)) {
    console.error('README.md not found');
    process.exit(1);
  }

  let readme = fs.readFileSync(README_PATH, 'utf-8');

  // Extract key metrics from BALANCE.md if it exists
  if (fs.existsSync(BALANCE_PATH)) {
    const balance = fs.readFileSync(BALANCE_PATH, 'utf-8');
    
    // Extract total games
    const gamesMatch = balance.match(/\*\*Total Games Simulated\*\*: ([\d,]+)/);
    const totalGames = gamesMatch ? gamesMatch[1] : 'TBD';
    
    // Extract average damage per energy
    const dpeMatch = balance.match(/\*\*Average Damage per Energy\*\*: ([\d.]+)/);
    const avgDPE = dpeMatch ? dpeMatch[1] : 'TBD';

    // Update simulation stats section in README if it exists
    const statsSection = `## Simulation Stats\n\n- **Total Games Simulated**: ${totalGames}\n- **Average Damage per Energy**: ${avgDPE} (Target: 2.0)\n- **Last Updated**: ${new Date().toLocaleDateString()}\n\nSee [BALANCE.md](docs/BALANCE.md) for full balance report.\n`;

    // Check if simulation stats section exists
    if (readme.includes('## Simulation Stats')) {
      readme = readme.replace(
        /## Simulation Stats[\s\S]*?(?=\n## |\n---|\z)/,
        statsSection
      );
    } else {
      // Add before contributing or at end
      if (readme.includes('## Contributing')) {
        readme = readme.replace('## Contributing', statsSection + '\n## Contributing');
      } else {
        readme += '\n\n' + statsSection;
      }
    }

    fs.writeFileSync(README_PATH, readme, 'utf-8');
    console.log('✓ README.md updated with latest simulation stats');
  } else {
    console.log('ℹ BALANCE.md not found, skipping README update');
  }
}

if (require.main === module) {
  try {
    syncReadme();
  } catch (err) {
    console.error('Error syncing README:', err.message);
    process.exit(1);
  }
}

module.exports = { syncReadme };

