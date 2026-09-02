import { ErrorResponsePayload, BrandOptions } from '../types/index.js';
import { escapeHtml, sanitizeCssColor, sanitizeUrl } from '../utils/sanitize.js';

export function renderErrorPage(payload: ErrorResponsePayload, brand?: BrandOptions): string {
  const jsonString = escapeHtml(JSON.stringify(payload, null, 2));
  const brandName = escapeHtml(brand?.brandName || 'System Response');
  const safePrimary = sanitizeCssColor(brand?.primaryColor);
  const customPrimary = safePrimary
    ? `--primary: ${safePrimary}; --badge-text: ${safePrimary}; --focus-ring: ${safePrimary};`
    : '';

  const safeLogoUrl = sanitizeUrl(brand?.logoUrl);
  const safeSupportUrl = sanitizeUrl(brand?.supportUrl);
  const safeSupportEmail = brand?.supportEmail ? escapeHtml(brand.supportEmail) : undefined;

  const safeStatus = Number(payload.status) || 500;
  const safeTitle = escapeHtml(payload.title);
  const safeHeadline = escapeHtml(payload.headline);
  const safeWittyMessage = escapeHtml(payload.wittyMessage);
  const safeTechnicalDetails = escapeHtml(payload.technicalDetails);
  const safeActionAdvice = escapeHtml(payload.actionAdvice);
  const safeRequestId = escapeHtml(payload.requestId);
  const safeTimestamp = escapeHtml(payload.timestamp);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeStatus} ${safeTitle} | ${brandName}</title>
  <meta name="description" content="${safeHeadline}">
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --card-border: #334155;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --primary: #38bdf8;
      --primary-hover: #0284c7;
      --primary-contrast: #0f172a;
      --code-bg: #0b1120;
      --code-border: #1e293b;
      --badge-bg: rgba(56, 189, 248, 0.12);
      --badge-text: #38bdf8;
      --focus-ring: #38bdf8;
      ${customPrimary}
    }

    [data-theme="light"] {
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --card-border: #e2e8f0;
      --text: #0f172a;
      --text-muted: #475569;
      --primary: #0284c7;
      --primary-hover: #0369a1;
      --primary-contrast: #ffffff;
      --code-bg: #f1f5f9;
      --code-border: #cbd5e1;
      --badge-bg: rgba(2, 132, 199, 0.12);
      --badge-text: #0284c7;
      --focus-ring: #0284c7;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 24px 16px;
      line-height: 1.5;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    .container {
      width: 100%;
      max-width: 620px;
    }

    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .brand {
      font-size: 0.875rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      text-transform: uppercase;
    }

    .theme-toggle {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      color: var(--text);
      font-size: 0.875rem;
      font-weight: 500;
      padding: 8px 14px;
      border-radius: 6px;
      cursor: pointer;
      min-height: 44px;
      min-width: 44px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .theme-toggle:focus-visible,
    button:focus-visible,
    a:focus-visible {
      outline: 2px solid var(--focus-ring);
      outline-offset: 2px;
    }

    .card {
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 32px 24px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    }

    .status-badge {
      display: inline-block;
      background: var(--badge-bg);
      color: var(--badge-text);
      font-size: 1rem;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 6px;
      margin-bottom: 16px;
    }

    h1 {
      font-size: clamp(1.5rem, 4vw, 2rem);
      font-weight: 700;
      color: var(--text);
      margin-bottom: 12px;
      line-height: 1.25;
    }

    .witty-quote {
      font-size: 1.125rem;
      font-weight: 400;
      color: var(--text);
      background: var(--code-bg);
      border-left: 4px solid var(--primary);
      padding: 16px;
      border-radius: 4px;
      margin-bottom: 20px;
      line-height: 1.6;
    }

    .advice-section {
      margin-bottom: 24px;
      color: var(--text-muted);
      font-size: 0.95rem;
    }

    .advice-section p {
      margin-bottom: 8px;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 24px;
    }

    .btn {
      min-height: 44px;
      padding: 10px 20px;
      border-radius: 6px;
      font-size: 0.95rem;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: none;
      transition: background-color 0.15s ease, transform 0.1s ease;
    }

    .btn-primary {
      background-color: var(--primary);
      color: var(--primary-contrast);
    }

    .btn-primary:hover {
      background-color: var(--primary-hover);
    }

    .btn-secondary {
      background-color: transparent;
      color: var(--text);
      border: 1px solid var(--card-border);
    }

    .btn-secondary:hover {
      background-color: var(--code-bg);
    }

    details {
      margin-top: 20px;
      border: 1px solid var(--card-border);
      border-radius: 6px;
      overflow: hidden;
    }

    summary {
      padding: 12px 16px;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      user-select: none;
      background-color: var(--code-bg);
    }

    summary:focus-visible {
      outline: 2px solid var(--focus-ring);
    }

    .details-content {
      padding: 16px;
      background-color: var(--code-bg);
      border-top: 1px solid var(--card-border);
    }

    pre {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.825rem;
      color: var(--text-muted);
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .copy-btn {
      margin-top: 12px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      color: var(--text);
      padding: 8px 14px;
      font-size: 0.8rem;
      border-radius: 4px;
      cursor: pointer;
      min-height: 38px;
    }

    .footer-meta {
      margin-top: 24px;
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    @media (max-width: 480px) {
      .card {
        padding: 24px 16px;
      }
      .actions {
        flex-direction: column;
      }
      .btn {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="top-bar">
      <div style="display:flex; align-items:center; gap:8px;">
        ${safeLogoUrl ? `<img src="${safeLogoUrl}" alt="${brandName} Logo" style="height:24px; width:auto; border-radius:4px;">` : ''}
        <span class="brand">${brandName}</span>
      </div>
      <button id="themeToggle" class="theme-toggle" type="button" aria-label="Toggle theme">
        <span id="themeIcon" aria-hidden="true">&#9788;</span>
        <span id="themeLabel">Light Mode</span>
      </button>
    </div>

    <main class="card">
      <div class="status-badge" role="status">HTTP ${safeStatus} : ${safeTitle}</div>
      <h1>${safeHeadline}</h1>

      <div class="witty-quote">
        "${safeWittyMessage}"
      </div>

      <div class="advice-section">
        <p><strong>What occurred:</strong> ${safeTechnicalDetails}</p>
        <p><strong>Suggested step:</strong> ${safeActionAdvice}</p>
      </div>

      <div class="actions">
        <button id="retryBtn" class="btn btn-primary" type="button" onclick="window.location.reload()">
          Try Again
        </button>
        <button id="backBtn" class="btn btn-secondary" type="button" onclick="window.history.back()">
          Go Back
        </button>
        ${safeSupportUrl ? `<a class="btn btn-secondary" href="${safeSupportUrl}" target="_blank" rel="noopener noreferrer">Support Center</a>` : ''}
        ${!safeSupportUrl && safeSupportEmail ? `<a class="btn btn-secondary" href="mailto:${safeSupportEmail}">Contact Support</a>` : ''}
      </div>

      <details>
        <summary>Technical Details & Payload</summary>
        <div class="details-content">
          <pre id="payloadPre">${jsonString}</pre>
          <button id="copyBtn" class="copy-btn" type="button">Copy JSON Payload</button>
        </div>
      </details>
    </main>

    <footer class="footer-meta">
      Request ID: <code>${safeRequestId}</code> &bull; Timestamp: ${safeTimestamp}
    </footer>
  </div>

  <script>
    (function () {
      const themeToggle = document.getElementById('themeToggle');
      const themeIcon = document.getElementById('themeIcon');
      const themeLabel = document.getElementById('themeLabel');
      const copyBtn = document.getElementById('copyBtn');
      const payloadPre = document.getElementById('payloadPre');

      function updateTheme(theme) {
        if (theme === 'light') {
          document.documentElement.setAttribute('data-theme', 'light');
          themeIcon.textContent = '\u263D';
          themeLabel.textContent = 'Dark Mode';
        } else {
          document.documentElement.removeAttribute('data-theme');
          themeIcon.textContent = '\u2600';
          themeLabel.textContent = 'Light Mode';
        }
        localStorage.setItem('theme', theme);
      }

      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        updateTheme(savedTheme);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        updateTheme('light');
      }

      themeToggle.addEventListener('click', function () {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        updateTheme(currentTheme === 'light' ? 'dark' : 'light');
      });

      copyBtn.addEventListener('click', function () {
        navigator.clipboard.writeText(payloadPre.textContent).then(function () {
          const original = copyBtn.textContent;
          copyBtn.textContent = 'Copied to Clipboard!';
          copyBtn.style.color = '#38bdf8';
          setTimeout(function () {
            copyBtn.textContent = original;
            copyBtn.style.color = '';
          }, 2000);
        }).catch(function () {
          copyBtn.textContent = 'Press Ctrl+C to copy';
        });
      });
    })();
  </script>
</body>
</html>`;
}
