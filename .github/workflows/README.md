# GitHub Actions Workflows

This directory contains automated CI/CD workflows for the BrickQuest project.

## Workflows Overview

### 🤖 [CI](./ci.yml)
Main continuous integration workflow that runs on every push and pull request.

**Jobs:**
- **test**: Runs Jest tests on Node.js 18.x and 20.x
- **lint**: Validates card schemas and runs card validation
- **build-engine**: Builds the game engine and card pipeline
- **build-client**: Builds the React client application
- **build-cheatsheet**: Generates the PDF cheat sheet

**Triggers:** Push to `main`/`develop`, PRs to `main`/`develop`

---

### 🃏 [Card Pipeline](./card-pipeline.yml)
Dedicated workflow for card generation, validation, and analysis.

**Jobs:**
- **build-cards**: Generates JSON cards from CSV sources
- **lint-cards**: Runs card linter and schema validation
- **balance-analysis**: Generates balance reports and comments on PRs
- **dedupe-check**: Detects duplicate card designs
- **validate-all**: Runs complete card validation suite

**Triggers:** Changes to card sources, schema files, or pipeline tools

**Features:**
- Auto-comments balance reports on pull requests
- Uploads artifacts for 30-90 days
- Validates card count and structure

---

### 🐍 [Python Card Scripts](./python-cards.yml)
Runs Python-based card generation and printing scripts.

**Jobs:**
- **generate-cards**: Runs `generate_cards.py`
- **print-cards**: Validates printable cards HTML
- **generate-bricklink-xml**: Generates and validates BrickLink XML

**Triggers:** Changes to Python scripts in `scripts/` directory

**Features:**
- Uses Python 3.11
- Validates XML structure
- Uploads generated artifacts

---

### 🔒 [Security](./security.yml)
Comprehensive security scanning and dependency auditing.

**Jobs:**
- **dependency-review**: Reviews dependencies on PRs
- **audit-dependencies**: Runs npm audit on root and client packages
- **codeql-analysis**: GitHub CodeQL security analysis for JS/TS
- **check-secrets**: Scans for hardcoded secrets

**Triggers:** 
- Pushes to `main`/`develop`
- Pull requests
- Weekly schedule (Sundays)
- Manual dispatch

**Features:**
- Blocks PRs with moderate+ vulnerabilities
- Denies GPL-2.0/GPL-3.0 licenses
- Generates audit reports
- Secret scanning with TruffleHog

---

### 🚀 [Release](./release.yml)
Automated release workflow for version tags.

**Jobs:**
- **release**: Creates GitHub release with artifacts
- **publish-npm**: Publishes to npm registry

**Triggers:** Tags matching `v*` pattern (e.g., `v1.0.0`)

**Features:**
- Generates all build artifacts
- Creates release notes automatically
- Packages release tar.gz
- Detects pre-release versions (alpha/beta/rc)
- Optional npm publishing

**Artifacts Included:**
- Card JSON files
- Printable cards HTML
- BrickLink XML
- PDF cheat sheet
- All documentation

---

## Workflow Dependencies

```
CI ──────┬──→ Card Pipeline
         ├──→ Security (parallel)
         └──→ Release (tags only)
```

## Cache Strategy

All workflows use GitHub Actions caching for:
- **npm dependencies** (root and client)
- **Python packages** (pip cache)
- Node.js version caching

## Manual Triggers

Several workflows support manual dispatch:
- Card Pipeline (`workflow_dispatch`)
- Python Card Scripts (`workflow_dispatch`)
- Security (`workflow_dispatch`)
- Release (`workflow_dispatch`)

## Secrets Required

For full functionality, configure these secrets:
- `GITHUB_TOKEN` (automatically provided)
- `NPM_TOKEN` (for publishing to npm)
- `CODECOV_TOKEN` (optional, for coverage uploads)

## Workflow Status Badges

Add these to your README:

```markdown
![CI](https://github.com/OWNER/brickquest/workflows/CI/badge.svg)
![Card Pipeline](https://github.com/OWNER/brickquest/workflows/Card%20Pipeline/badge.svg)
![Security](https://github.com/OWNER/brickquest/workflows/Security/badge.svg)
```

## Troubleshooting

### Build failures
- Check artifact uploads for build outputs
- Review job logs for specific error messages
- Verify all dependencies are properly cached

### Security alerts
- Review `audit-report.md` artifact
- Check CodeQL results in Security tab
- Address secrets warnings

### Card validation errors
- Check `BALANCE.md` and `DUPLICATES.md` reports
- Review card schema in `cards/schema/`
- Verify CSV format in `cards/sources/`

## Performance

Typical workflow durations:
- **CI**: ~5-10 minutes
- **Card Pipeline**: ~3-5 minutes
- **Security**: ~5-15 minutes
- **Release**: ~10-15 minutes

## Updating Workflows

When updating workflows:
1. Test locally when possible
2. Use latest action versions (v4 for setup-node, v3 for codeql)
3. Keep cache keys consistent across workflows
4. Document any new secrets or permissions needed
