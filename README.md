# Playwright Web Automation Framework

[![Playwright Tests](https://github.com/Alvarin2022/playwright-web-automation-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/TU-USUARIO/playwright-web-automation-framework/actions/workflows/playwright.yml)
[![Test Report](https://img.shields.io/badge/Test%20Report-Live-blue?logo=github)](https://Alvarin2022.github.io/playwright-web-automation-framework/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.49+-green?logo=playwright)](https://playwright.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

End-to-end test automation framework for [SauceDemo](https://www.saucedemo.com/) built with **Playwright + TypeScript**, following industry best practices: Page Object Model with separated locators, custom fixtures, data-driven testing, structured logging, and full CI/CD integration.

## 📊 Live Test Report

The latest test run is published automatically: **[View Live Report](https://Alvarin2022.github.io/playwright-web-automation-framework/)**

## 🎯 Features

- **Page Object Model** with three-layer separation: Locators, Pages, Tests
- **Custom Fixtures** for dependency injection and session management
- **Data-Driven Testing** for scalable test scenarios
- **Multi-Browser Support**: Chromium, Firefox, WebKit running in parallel
- **Centralized Configuration** via `Configurator` with pipeline mode support
- **Structured Logging** with Winston (timestamped, leveled, persisted)
- **CI/CD with GitHub Actions**: parallel execution, blob report merging, GitHub Pages deployment
- **Tag-based Test Organization**: `@smoke`, `@regression`, `@login`, `@purchase`, etc.

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| Playwright | Browser automation |
| TypeScript | Type-safe test code |
| Winston | Structured logging |
| GitHub Actions | CI/CD pipeline |
| GitHub Pages | Public test report hosting |

## 📁 Project Structure

```
src/
├── Calls/                      # Constants and external services
│   └── Constants.ts            # Centralized constants (users, products, environments)
├── Configuration/              # Framework configuration
│   └── Configurator.ts         # Singleton config with pipeline support
├── Helpers/                    # Reusable utilities
│   ├── Logger.ts               # Winston-based structured logging
│   └── RandomGenerator.ts      # Random test data generators
├── PageObjectsModel/           # Page Object Model
│   ├── Components/             # Shared components (Header, etc.)
│   ├── LoggedInPages/          # Pages requiring authentication
│   └── LoggedOutPages/         # Pre-login pages
├── data/                       # Test scenarios (data-driven)
│   └── loginScenarios.ts       # Login test cases
└── fixtures/                   # Custom Playwright fixtures
    └── baseTest.ts             # Test fixture with session modes

tests/
└── e2e/                        # End-to-end test specs
    ├── login.spec.ts
    └── purchase-flow.spec.ts
```

Each page in `PageObjectsModel/` follows a strict separation:

- **`Locators.ts`** → only selectors (lazy-evaluated arrow functions)
- **`PageName.ts`** → only methods and assertions

This pattern allows DOM changes to be fixed in one file without touching test logic.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/Alvarin2022/playwright-web-automation-framework.git
cd playwright-web-automation-framework
npm install
npx playwright install
cp .env.example .env
```

### Running Tests

```bash
# Run all tests on all browsers
npm test

# Run only on Chromium (faster local development)
npm run test:chromium

# Run smoke tests only
npm run test:smoke

# Open Playwright UI for interactive debugging
npm run test:ui

# View the last HTML report
npm run report
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run all tests on all browsers |
| `npm run test:smoke` | Run smoke tests only |
| `npm run test:login` | Run login tests only |
| `npm run test:purchase` | Run purchase flow tests only |
| `npm run test:negative` | Run negative scenarios only |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run test:debug` | Run in debug mode |
| `npm run report` | Open HTML report from last run |

## ⚙️ Configuration

The framework uses a `Configurator` singleton that supports two modes:

**Local mode (default):** uses sane defaults defined in `Configurator.ts`. Edit `.env` to override.

**Pipeline mode:** set `USE_PIPELINE_CONFIG=true` and provide `TEST_USER_TYPE`, `TEST_ENVIRONMENT`, `TEST_BROWSER`, `TEST_LANGUAGE`. Used by CI to dynamically configure runs.

## 🏗️ CI/CD Pipeline

The GitHub Actions workflow runs on every push and PR:

1. **Tests in parallel** across Chromium, Firefox, WebKit
2. **Merges blob reports** from all browsers into a unified HTML report
3. **Deploys to GitHub Pages** for public access (main branch only)
4. **Uploads artifacts**: logs and reports retained for 14-30 days
5. **Manual trigger** with custom suite/browser selection

### Trigger Manual Runs

From the **Actions** tab → **Playwright E2E Tests** → **Run workflow** → choose:

- **Test suite**: `all`, `smoke`, `login`, `purchase`, `negative`
- **Browser**: `all`, `chromium`, `firefox`, `webkit`

## 📝 Test Tags

Tests are organized with descriptive tags:

| Tag | Purpose |
|-----|---------|
| `@smoke` | Critical path, runs on every commit |
| `@regression` | Full suite, runs on PRs |
| `@login` | Login functionality |
| `@purchase` | Purchase flow |
| `@negative` | Negative scenarios |
| `@e2e` | End-to-end tests |

## 📄 License

MIT © [Alvaro Morales]
