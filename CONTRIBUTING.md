# Contributing to WittyStatus API

First off, thank you for considering contributing to **WittyStatus API**! It is contributors like you who make developer tooling both functional and delightful.

This document provides complete guidelines and technical specifications for contributing code, witty quotes, framework middleware examples, and documentation improvements.

---

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can You Contribute?](#how-can-you-contribute)
- [Quote Specifications & Guidelines](#quote-specifications--guidelines)
  - [Quote Catalog File Structure](#quote-catalog-file-structure)
  - [TypeScript Schema](#typescript-schema)
  - [Valid Enum Values](#valid-enum-values)
  - [Editorial Standards](#editorial-standards)
- [Project Architecture](#project-architecture)
- [Local Development Setup](#local-development-setup)
- [TypeScript & ESM Conventions](#typescript--esm-conventions)
- [Commit Conventions](#commit-conventions)
- [Pull Request Checklist](#pull-request-checklist)

---

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free experience for everyone. Please treat fellow contributors with respect, constructiveness, and empathy.

---

## How Can You Contribute?

You can contribute to WittyStatus API in many ways:

1. **Expanding the Quote Bank**: Add relatable, funny developer quotes for HTTP status codes.
2. **Framework Integrations**: Submit drop-in integration snippets for backend frameworks (e.g., NestJS, Express, FastAPI, Django, Laravel, Go Gin, Spring Boot).
3. **Template & UI Enhancements**: Improve page accessibility (WCAG AA), themes, or animations in standalone HTML renderers without introducing runtime CDN dependencies.
4. **Core Enhancements & Bug Fixes**: Optimize route performance, expand unit/integration test coverage, or refine TypeScript types.

---

## Quote Specifications & Guidelines

Every quote in WittyStatus API turns an otherwise frustrating error into an engaging, empathetic, and actionable experience.

### Quote Catalog File Structure

All quotes reside under `src/data/quotes/`:

| Status Code | Description | File Path | Current Quotes |
| :--- | :--- | :--- | :---: |
| **400** | Bad Request | `src/data/quotes/400.ts` | 30 |
| **401** | Unauthorized | `src/data/quotes/401.ts` | 30 |
| **403** | Forbidden | `src/data/quotes/403.ts` | 30 |
| **404** | Not Found | `src/data/quotes/404.ts` | 30 |
| **405** | Method Not Allowed | `src/data/quotes/405.ts` | 30 |
| **408** | Request Timeout | `src/data/quotes/408.ts` | 30 |
| **409** | Conflict | `src/data/quotes/409.ts` | 30 |
| **422** | Unprocessable Entity | `src/data/quotes/422.ts` | 30 |
| **429** | Too Many Requests | `src/data/quotes/429.ts` | 30 |
| **500** | Internal Server Error | `src/data/quotes/500.ts` | 30 |
| **502** | Bad Gateway | `src/data/quotes/502.ts` | 30 |
| **503** | Service Unavailable | `src/data/quotes/503.ts` | 30 |
| **504** | Gateway Timeout | `src/data/quotes/504.ts` | 30 |
| **Misc** | 418 Teapot & 501 Not Implemented | `src/data/quotes/misc.ts` | 4 |

### TypeScript Schema

Each quote object must conform to the `StatusQuote` interface defined in `src/types/index.ts`:

```typescript
export interface StatusQuote {
  id: string;
  code: number;
  category: HttpStatusCategory;
  title: string;
  headline: string;
  wittyMessage: string;
  technicalDetails: string;
  actionAdvice: string;
  suggestedAction: 'retry' | 'back' | 'contact_support' | 'wait' | 'login';
}
```

### Valid Enum Values

When adding a quote, ensure your fields use only the allowed values:

#### 1. `category`
- `'client_error'`: Use for all `4xx` status codes.
- `'server_error'`: Use for all `5xx` status codes.
- `'maintenance'`: Use for scheduled downtime or service maintenance responses.

#### 2. `suggestedAction`
- `'retry'`: The client can immediately or shortly retry the exact request (e.g., 408, 429, 502, 503, 504).
- `'back'`: The user should navigate back or check their input URL (e.g., 404, 405, 501).
- `'login'`: The user needs authentication credentials or a session refresh (e.g., 401).
- `'contact_support'`: An administrative or account permission issue exists (e.g., 403).
- `'wait'`: The client should pause before making further requests (e.g., 429 rate limits).

### Example Quote

```typescript
{
  id: '404-desert-island',
  code: 404,
  category: 'client_error',
  title: 'Not Found',
  headline: 'Stranded on an uncharted digital island',
  wittyMessage: 'We sent search helicopters across the cluster, but this endpoint appears completely uninhabited.',
  technicalDetails: 'Target route is missing from active Fastify route tables.',
  actionAdvice: 'Verify your path segments or return to the base application url.',
  suggestedAction: 'back'
}
```

### Editorial Standards

- **ID Naming**: Must be kebab-case, prefixed with the status code (e.g., `429-caffeine-overdrive`).
- **Tone**: Professional developer humor (relatable situations like Friday deploys, DNS lag, trailing commas, runaway loops).
- **Constructive Advice**: Always provide realistic `technicalDetails` and helpful `actionAdvice`.
- **Zero Em Dashes**: Do not use the em dash (`—`) character anywhere in messages or templates. Use hyphens (`-`), colons (`:`), or commas instead.

---

## Project Architecture

```text
witty-status-api/
├── src/
│   ├── app.ts               # Fastify app builder with CORS, rate limiting, and Swagger
│   ├── server.ts            # Standalone CLI server entrypoint (bin target)
│   ├── index.ts             # Hybrid library exports (services, templates, quotes, types)
│   ├── data/
│   │   ├── quotes.ts        # Aggregated quotes bank
│   │   └── quotes/          # Modular quote arrays by status code (400.ts, 404.ts, etc.)
│   ├── routes/
│   │   ├── api.ts           # REST API endpoints under /api/v1
│   │   └── render.ts        # Standalone HTML render routes
│   ├── services/
│   │   └── statusService.ts # Filtering, random selection, and fallback generator
│   ├── templates/
│   │   ├── errorPage.ts     # Accessible HTML error page template
│   │   ├── maintenancePage.ts # Real-time maintenance view template
│   │   └── playgroundPage.ts  # Developer playground and hub template
│   └── types/
│       └── index.ts         # Central TypeScript type definitions
├── tests/
│   └── api.test.ts          # Vitest integration test suite
└── dist/                    # Compiled JavaScript and TypeScript declaration files
```

---

## Local Development Setup

### 1. Requirements
- Node.js `>= 20.0.0`
- npm `>= 10.0.0`
- Git

### 2. Fork and Clone
```bash
# Clone your fork
git clone https://github.com/<your-username>/witty-status-api.git
cd witty-status-api

# Install dependencies
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The server will boot with hot-reloading at `http://localhost:3001`:
- **Interactive Playground**: `http://localhost:3001/`
- **Swagger Documentation**: `http://localhost:3001/docs`

### 4. Run Automated Tests
```bash
# Single test run
npm test

# Watch mode for rapid test-driven development
npm run test:watch
```

### 5. Compile TypeScript
```bash
npm run build
```

---

## TypeScript & ESM Conventions

This project uses modern ECMAScript Modules (`"type": "module"` in `package.json`) with `NodeNext` module resolution.

- **Relative Imports Must Include `.js` Extensions**:
  ```typescript
  // Correct
  import { statusService } from '../services/statusService.js';
  import { StatusQuote } from '../types/index.js';

  // Incorrect (will fail TypeScript compilation)
  import { statusService } from '../services/statusService';
  ```
- **Strict Typing**: All new functions, parameters, and returned values must have explicit TypeScript types. Avoid using `any`.
- **Zero Runtime Dependencies for Templates**: HTML templates in `src/templates/` must remain self-contained with embedded CSS and minimal vanilla JavaScript. Do not import external CDNs or UI libraries.

---

## Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Usage | Example |
| :--- | :--- | :--- |
| `feat:` | New feature or quote addition | `feat(quotes): add 5 new quotes for 429 rate limit` |
| `fix:` | Bug fix | `fix(docker): update container server startup command` |
| `docs:` | Documentation changes | `docs(readme): add NestJS middleware integration example` |
| `test:` | Adding or improving tests | `test(api): verify random quote query filtering` |
| `refactor:`| Code refactoring without behavioral change | `refactor(statusService): streamline quote pool lookup` |

---

## Pull Request Checklist

Before submitting your PR, please verify:

- [ ] All tests pass locally via `npm test`.
- [ ] TypeScript compiles cleanly via `npm run build` with zero errors.
- [ ] New quotes follow the `StatusQuote` schema and valid enum values.
- [ ] No em dashes (`—`) are introduced in quotes, code, or documentation.
- [ ] If changing or adding quotes, verify quote bank count and update the badge in `README.md` if applicable.
- [ ] Conventional Commit messages are used.

Thank you for helping make WittyStatus API awesome!
