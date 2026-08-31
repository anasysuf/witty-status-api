# WittyStatus API

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-5.2-black?logo=fastify)](https://fastify.dev/)
[![Tests](https://img.shields.io/badge/Tests-14%20Passed-brightgreen)](tests/api.test.ts)
[![Quotes](https://img.shields.io/badge/Quotes%20Bank-394%20Quotes-orange)](#status-codes-and-quote-catalog)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?logo=github)](https://anasysuf.github.io/witty-status-api/)

A developer-friendly REST API and responsive HTML renderer for handling HTTP errors, scheduled maintenance, and downtime. It replaces cold, confusing stack traces with witty, relatable, and reassuring English copy while still providing structured diagnostic data and actionable recovery advice.

---

## Why WittyStatus API?

When an application throws an error or undergoes maintenance, users are often met with frightening technical traces or generic blank screens. 

WittyStatus API solves this by providing:

- **Human-Crafted Witty Messaging**: Over 390 relatable quotes reflecting real-world engineering situations (Friday afternoon deploys, cat on keyboard, trailing commas, carrier pigeons).
- **Dual Format Output**: Fetch structured JSON for your frontend or backend API clients, or serve pre-rendered accessible HTML pages with light/dark theme toggles.
- **Actionable Advice**: Every error response includes concrete recovery steps (`retry`, `back`, `contact_support`, `wait`, `login`).
- **Zero External Runtime CDN Dependencies**: Embedded styles and scripts ensure rendered HTML pages load cleanly even during total upstream network loss.
- **Interactive Playground & Live Demo**: Run locally via Fastify, or test directly in your browser with our client-side GitHub Pages demo.

---

## Quick Start (Run Locally)

### 1. Run with Node.js

```bash
# Clone the repository
git clone https://github.com/<your-username>/witty-status-api.git
cd witty-status-api

# Install dependencies
npm install

# Start development server with hot-reload
npm run dev
```

The server will start on `http://localhost:3001`.

- **Interactive Playground**: `http://localhost:3001/`
- **OpenAPI Documentation**: `http://localhost:3001/docs`

### 2. Run with Docker (Local Container)

```bash
# Build and start container locally
docker compose up -d
```

Access the local container instance at `http://localhost:3001`.

### 3. Build for Production

```bash
# Compile TypeScript to dist/
npm run build

# Start production server
npm start
```

### 4. Run Automated Tests

```bash
npm test
```

### 5. Client-Side Live Demo (GitHub Pages)

The repository includes a 100% self-contained client-side demo directly at `index.html`:

- **Live URL**: [https://anasysuf.github.io/witty-status-api/](https://anasysuf.github.io/witty-status-api/)
- **Local Preview**: Open `index.html` directly in any web browser without needing any backend server!
- **GitHub Pages Configuration**: Go to repository **Settings** > **Pages** > Select **Deploy from a branch** > Choose **`main`** branch and **`/ (root)`** folder > Click **Save**.
- Automated deployment is also supported via `.github/workflows/pages.yml`.

---

## Status Codes and Quote Catalog

WittyStatus API includes **exactly 30 unique quotes** for each of the 13 major HTTP status codes, plus dedicated maintenance and teaser responses:

| Status Code | Name | Quotes Count | Relatable Themes Covered |
| :--- | :--- | :---: | :--- |
| **400** | Bad Request | **30** | Syntax scrambles, trailing commas, cat on keyboard, unbalanced brackets, NaN values, duplicate keys |
| **401** | Unauthorized | **30** | Secret handshakes, keys in other coat, expired tokens, clock skew, revoked badges, test keys in prod |
| **403** | Forbidden | **30** | Velvet rope, need to know, read-only modes, tenant mismatch, geoblocking, department borders |
| **404** | Not Found | **30** | Existential walks, typo gremlins, unpushed git branches, Schroedinger page, black holes, desert islands |
| **405** | Method Not Allowed | **30** | Pulling on push door, deleting museum pieces, GET on payment actions, invalid verbs, WebDAV relics |
| **408** | Request Timeout | **30** | Carrier pigeons, dial-up modems, subway tunnels, high ping monsters, frozen streams, battery throttle |
| **409** | Conflict | **30** | Fast lane collisions, double clicks, git merge conflicts, taken slugs, optimistic locking sadness |
| **422** | Unprocessable Entity | **30** | End before start date, future birthdates, negative balances, 150% discounts, invalid IBAN/postal formats |
| **429** | Too Many Requests | **30** | Speed racers, caffeine overloads, F5 drum solos, runaway while loops, token bucket empty, thundering herd |
| **500** | Internal Server Error | **30** | Unruly semicolons, Friday afternoon deploys, wild null pointers, out of memory, connection pool dry |
| **502** | Bad Gateway | **30** | Upstream ghosting, telephone games, startup crashes, header too big, Nginx heavy sighs, OOM killer |
| **503** | Service Unavailable | **30** | Swapping hamsters, scheduled pit stops, vacuuming DB rugs, spa days, table migrations, backup snapshots |
| **504** | Gateway Timeout | **30** | Upstream daydreams, scenic database routes, serverless cold starts, third-party sloths, Raft elections |
| **Misc** | 418 & 501 | **4** | RFC 2324 authentic teapot refusing espresso, whiteboard drawings, sprint backlog items |
| **Total** | | **394** | |

---

## API Reference

### 1. Get Structured Error Payload

```http
GET /api/v1/errors/:code
```

Returns a structured error payload for any HTTP status code. If an unmapped code is requested (e.g., 451), a graceful fallback is automatically generated.

**Example Request**:
```bash
curl -s http://localhost:3001/api/v1/errors/404
```

**Example Response**:
```json
{
  "success": false,
  "status": 404,
  "title": "Not Found",
  "headline": "This page went on an existential walk",
  "wittyMessage": "We searched every digital nook, cranny, and database index. This page appears to have vanished into thin air, possibly seeking self discovery.",
  "technicalDetails": "The requested URL does not correspond to any active route or published document on this server.",
  "actionAdvice": "Check the URL for typographical slips, or head back to the main homepage.",
  "suggestedAction": "back",
  "timestamp": "2026-08-31T01:00:00.000Z",
  "requestId": "req_8x29a"
}
```

### 2. Random Witty Quote

```http
GET /api/v1/quotes/random?code=500
GET /api/v1/quotes/random?category=client_error
```

Returns a single witty quote object with its associated advice.

### 3. List All Quotes

```http
GET /api/v1/quotes
GET /api/v1/quotes?code=429
```

Returns all available quotes matching the given criteria.

### 4. Active Maintenance Status

```http
GET /api/v1/maintenance
```

Returns live maintenance progress, active migration tasks, estimated completion time, and support contact with HTTP 503 status.

### 5. Health Check

```http
GET /api/v1/health
```

Returns system health and server uptime.

---

## HTML Render Endpoints (Drop-in Browser Pages)

You can redirect users or configure reverse proxies directly to these URLs:

- **`GET /render/error/:code`**: Renders an accessible HTML error page matching the requested code.
  - Light/Dark theme toggle (saved in `localStorage`)
  - "Try Again" reload trigger
  - "Go Back" history trigger
  - Expandable "Technical Details" accordion
  - One-click "Copy JSON Payload" button
- **`GET /render/maintenance`**: Renders an animated maintenance page with real-time simulated progress bar and contact links.
- **`GET /`**: Full developer hub and playground.

---

## Multi-Stack Integration Examples

### Express.js (1-Line Drop-in Middleware)

```typescript
import express from 'express';
import { wittyErrorHandler, wittyNotFoundHandler } from 'witty-status-api';

const app = express();

// ... application routes ...

// Catch unrouted requests (404)
app.use(wittyNotFoundHandler({
  format: 'auto', // HTML for browser requests, JSON / RFC 7807 for API callers
  brand: { brandName: 'Acme Corp', primaryColor: '#38bdf8' }
}));

// Centralized error handler (catches exceptions, forwards X-Request-Id, renders witty copy)
app.use(wittyErrorHandler({
  format: 'auto',
  brand: {
    brandName: 'Acme Corp',
    primaryColor: '#38bdf8',
    supportUrl: 'https://help.acme.com'
  }
}));
```

### Next.js App Router (`app/not-found.tsx`)

```tsx
import Link from 'next/link';

export default async function NotFound() {
  const res = await fetch('http://localhost:3001/api/v1/errors/404', { cache: 'no-store' });
  const error = await res.json();

  return (
    <main style={{ padding: '40px 20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>{error.headline}</h1>
      <p style={{ fontStyle: 'italic', margin: '20px 0' }}>"{error.wittyMessage}"</p>
      <p><strong>Suggestion:</strong> {error.actionAdvice}</p>
      <Link href="/" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 20px', background: '#38bdf8', color: '#000', borderRadius: '6px', textDecoration: 'none' }}>
        Return Home
      </Link>
    </main>
  );
}
```

### Fastify (1-Line Plugin Registration)

```typescript
import Fastify from 'fastify';
import { wittyFastifyPlugin } from 'witty-status-api';

const fastify = Fastify({ logger: true });

// Registers automatic 404 handling and centralized witty error formatter
await fastify.register(wittyFastifyPlugin, {
  format: 'auto', // Content negotiation: HTML for browsers, JSON/RFC 7807 for APIs
  brand: {
    brandName: 'Acme Corp',
    primaryColor: '#38bdf8',
    supportUrl: 'https://help.acme.com'
  }
});
```

### Python (FastAPI)

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import httpx

app = FastAPI()

@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    async with httpx.AsyncClient() as client:
        res = await client.get("http://localhost:3001/api/v1/errors/404")
        return JSONResponse(status_code=404, content=res.json())
```

### PHP / Laravel (`bootstrap/app.php` or `Handler.php`)

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

$exceptions->render(function (NotFoundHttpException $e, Request $request) {
    if ($request->expectsJson()) {
        $response = Http::get('http://localhost:3001/api/v1/errors/404');
        return response()->json($response->json(), 404);
    }
});
```

### Nginx Reverse Proxy (Fallback Delegate)

```nginx
server {
    listen 80;
    server_name example.com;

    # Intercept errors and delegate to WittyStatus API
    proxy_intercept_errors on;
    error_page 404 = @handle_404;
    error_page 500 502 503 504 = @handle_500;

    location @handle_404 {
        proxy_pass http://127.0.0.1:3001/render/error/404;
    }

    location @handle_500 {
        proxy_pass http://127.0.0.1:3001/render/error/500;
    }
}
```

---

## Enterprise & Production Features

### 1. RFC 7807 / RFC 9457 Problem Details Support

Append `?format=rfc7807` to any error endpoint or specify `{ format: 'rfc7807' }` in middleware options:

```bash
curl -s http://localhost:3001/api/v1/errors/404?format=rfc7807
```

```json
{
  "type": "https://httpstatuses.io/404",
  "title": "Not Found",
  "status": 404,
  "detail": "We searched every digital nook and database cranny. This page appears to have vanished into thin air.",
  "instance": "/api/v1/resource",
  "headline": "This page went on an existential walk",
  "actionAdvice": "Verify your path segments or return to the base application url.",
  "suggestedAction": "back",
  "technicalDetails": "Target route is missing from active Fastify route tables.",
  "requestId": "trace_custom_999",
  "timestamp": "2026-08-31T12:00:00.000Z"
}
```

### 2. Distributed Tracing & Correlation ID (`X-Request-Id`)

Pass your microservice trace ID via the `X-Request-Id` header. WittyStatus API preserves and exposes it in JSON payloads and the embedded HTML payload inspector for seamless Sentry/Datadog triage:

```bash
curl -s -H "X-Request-Id: trace-datadog-uuid-8899" http://localhost:3001/api/v1/errors/500
```

### 3. White-Label Branding Customization

Customize HTML error and maintenance pages with your organization's visual identity:

```bash
# Query params on standalone server
http://localhost:3001/render/error/404?brand=AcmeCorp&color=%236366f1&support=https://help.acme.com
```

```typescript
// Via TypeScript library import
renderErrorPage(payload, {
  brandName: 'Acme Corp',
  primaryColor: '#6366f1',
  logoUrl: 'https://acme.com/logo.svg',
  supportUrl: 'https://help.acme.com'
});
```

### 4. Smart Content Negotiation

The error endpoint automatically inspects the `Accept` header:
- `Accept: text/html` (Browser visits) -> Returns pre-rendered responsive HTML view.
- `Accept: application/json` (API clients / fetch / cURL) -> Returns structured JSON response.

---

## Accessibility and Quality Standards

- **WCAG AA Color Contrast**: All foreground/background combinations strictly satisfy WCAG AA standards (4.5:1 for body copy, 3:1 for large headers and control boundaries).
- **Keyboard Navigation**: Interactive controls (theme switcher, retry, back, payload copy) support standard `Tab`, `Enter`, and `Escape` actions with visible 2px focus indicators.
- **Fluid Layout**: Responsive design reflows cleanly down to 320px mobile screens with zero horizontal overflow.
- **Antislop Copy Standard**: Zero em dashes (`—`) throughout documentation and code templates, natural developer voice, and zero hollow marketing buzzwords.

---

## Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Port number for the Fastify HTTP server | `3001` |
| `HOST` | Interface IP binding address | `0.0.0.0` |
| `NODE_ENV` | Application environment (`development`, `production`, `test`) | `development` |

---

## Contributing

Contributions are warmly welcome! Whether you are proposing witty new developer quotes, adding framework middleware examples, or refining UI components, please review our comprehensive [Contributing Guidelines](CONTRIBUTING.md) to get started.

1. Fork this repository.
2. Create your feature branch (`git checkout -b feat/my-new-quotes`).
3. Ensure quotes have no em dashes (`—`), adhere to tone standards, and pass both `npm test` and `npm run build`.
4. Open a Pull Request!

---

## License

Released under the [MIT License](LICENSE). Contributions and improvements are welcome!
