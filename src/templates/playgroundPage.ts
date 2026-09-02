let cachedPlaygroundHtml: string | null = null;

export function renderPlaygroundPage(): string {
  if (cachedPlaygroundHtml) {
    return cachedPlaygroundHtml;
  }

  cachedPlaygroundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WittyStatus API: Developer Playground & Hub</title>
  <meta name="description" content="Interactive playground for witty and professional HTTP error and maintenance status handling.">
  <style>
    :root {
      --bg: #0b1120;
      --surface: #1e293b;
      --border: #334155;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --primary: #38bdf8;
      --primary-hover: #0284c7;
      --primary-contrast: #0b1120;
      --code-bg: #020617;
      --focus-ring: #38bdf8;
    }

    [data-theme="light"] {
      --bg: #f8fafc;
      --surface: #ffffff;
      --border: #e2e8f0;
      --text: #0f172a;
      --text-muted: #475569;
      --primary: #0284c7;
      --primary-hover: #0369a1;
      --primary-contrast: #ffffff;
      --code-bg: #f1f5f9;
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
      line-height: 1.5;
      padding: 32px 16px;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    .wrapper {
      max-width: 980px;
      margin: 0 auto;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      gap: 16px;
      flex-wrap: wrap;
    }

    .brand-title {
      font-size: clamp(1.5rem, 4vw, 2.2rem);
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .brand-subtitle {
      color: var(--text-muted);
      font-size: 1.05rem;
      margin-top: 4px;
    }

    .nav-actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .btn {
      min-height: 44px;
      padding: 10px 18px;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border);
      transition: all 0.15s ease;
      background: var(--surface);
      color: var(--text);
    }

    .btn-primary {
      background: var(--primary);
      color: var(--primary-contrast);
      border-color: var(--primary);
    }

    .btn-primary:hover {
      background: var(--primary-hover);
    }

    .btn:focus-visible,
    select:focus-visible,
    button:focus-visible {
      outline: 2px solid var(--focus-ring);
      outline-offset: 2px;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }

    .panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }

    .panel-title {
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .form-group {
      margin-bottom: 18px;
    }

    label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 6px;
    }

    select, input {
      width: 100%;
      min-height: 44px;
      padding: 10px 12px;
      border-radius: 6px;
      background: var(--bg);
      border: 1px solid var(--border);
      color: var(--text);
      font-size: 0.95rem;
    }

    .button-row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 20px;
    }

    .preview-box {
      background: var(--code-bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px;
      min-height: 280px;
      max-height: 380px;
      overflow: auto;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.85rem;
      color: var(--text);
      white-space: pre-wrap;
      word-break: break-all;
    }

    .snippet-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }

    .tab-btn {
      padding: 6px 12px;
      border-radius: 4px;
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .tab-btn.active {
      background: var(--primary);
      color: var(--primary-contrast);
      border-color: var(--primary);
    }

    .endpoint-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    .endpoint-method {
      background: rgba(56, 189, 248, 0.15);
      color: var(--primary);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;
      margin-right: 8px;
    }

    .endpoint-path {
      font-family: ui-monospace, monospace;
      font-size: 0.9rem;
      color: var(--text);
    }

    .endpoint-desc {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 4px;
    }

    @media (max-width: 768px) {
      .grid {
        grid-template-columns: 1fr;
      }
      header {
        flex-direction: column;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <header>
      <div>
        <h1 class="brand-title">WittyStatus API</h1>
        <p class="brand-subtitle">Witty and professional HTTP error & maintenance responses</p>
      </div>
      <div class="nav-actions">
        <a href="/docs" class="btn">OpenAPI Docs</a>
        <button id="themeToggle" class="btn" type="button" aria-label="Toggle theme">
          <span id="themeLabel">Light Mode</span>
        </button>
      </div>
    </header>

    <div class="grid">
      <!-- Control Panel -->
      <section class="panel">
        <h2 class="panel-title">Interactive Tester</h2>

        <div class="form-group">
          <label for="statusCodeSelect">HTTP Status Code</label>
          <select id="statusCodeSelect">
            <option value="404" selected>404 Not Found</option>
            <option value="400">400 Bad Request</option>
            <option value="401">401 Unauthorized</option>
            <option value="403">403 Forbidden</option>
            <option value="405">405 Method Not Allowed</option>
            <option value="408">408 Request Timeout</option>
            <option value="409">409 Conflict</option>
            <option value="418">418 I'm a Teapot</option>
            <option value="422">422 Unprocessable Entity</option>
            <option value="429">429 Too Many Requests</option>
            <option value="500">500 Internal Server Error</option>
            <option value="501">501 Not Implemented</option>
            <option value="502">502 Bad Gateway</option>
            <option value="503">503 Service Unavailable</option>
            <option value="504">504 Gateway Timeout</option>
            <option value="maintenance">Maintenance Window</option>
          </select>
        </div>

        <div class="button-row">
          <button id="fetchBtn" class="btn btn-primary" type="button">
            Generate Response
          </button>
          <a id="openHtmlLink" href="/render/error/404" target="_blank" rel="noopener" class="btn">
            View Rendered HTML
          </a>
        </div>
      </section>

      <!-- Preview Panel -->
      <section class="panel">
        <div class="panel-title">
          <span>JSON Response</span>
          <button id="copyJsonBtn" class="btn" style="min-height: 32px; padding: 4px 10px; font-size: 0.8rem;" type="button">
            Copy JSON
          </button>
        </div>
        <pre id="jsonPreview" class="preview-box">Click "Generate Response" to inspect API output...</pre>
      </section>
    </div>

    <!-- Integration Code Section -->
    <section class="panel" style="margin-bottom: 32px;">
      <h2 class="panel-title">Integration Snippets</h2>
      <div class="snippet-tabs">
        <button class="tab-btn active" data-tab="curl" type="button">cURL</button>
        <button class="tab-btn" data-tab="fetch" type="button">JavaScript Fetch</button>
        <button class="tab-btn" data-tab="express" type="button">Express / Node.js Middleware</button>
      </div>
      <pre id="codeSnippetBox" class="preview-box" style="min-height: 120px; max-height: 200px;"></pre>
    </section>

    <!-- Available Endpoints -->
    <section class="panel">
      <h2 class="panel-title" style="margin-bottom: 20px;">Available API Endpoints</h2>

      <div class="endpoint-card">
        <div>
          <span class="endpoint-method">GET</span>
          <span class="endpoint-path">/api/v1/errors/:code</span>
          <div class="endpoint-desc">Returns structured JSON with witty headline, technical notes, and action guidance</div>
        </div>
        <a href="/api/v1/errors/404" target="_blank" class="btn">Try</a>
      </div>

      <div class="endpoint-card">
        <div>
          <span class="endpoint-method">GET</span>
          <span class="endpoint-path">/api/v1/quotes/random</span>
          <div class="endpoint-desc">Returns a random witty quote filtered by status code or category</div>
        </div>
        <a href="/api/v1/quotes/random" target="_blank" class="btn">Try</a>
      </div>

      <div class="endpoint-card">
        <div>
          <span class="endpoint-method">GET</span>
          <span class="endpoint-path">/api/v1/maintenance</span>
          <div class="endpoint-desc">Returns current maintenance status, ETA, and progress percentage</div>
        </div>
        <a href="/api/v1/maintenance" target="_blank" class="btn">Try</a>
      </div>

      <div class="endpoint-card">
        <div>
          <span class="endpoint-method">GET</span>
          <span class="endpoint-path">/render/error/:code</span>
          <div class="endpoint-desc">Directly renders an accessible, responsive HTML error page</div>
        </div>
        <a href="/render/error/500" target="_blank" class="btn">View</a>
      </div>

      <div class="endpoint-card">
        <div>
          <span class="endpoint-method">GET</span>
          <span class="endpoint-path">/render/maintenance</span>
          <div class="endpoint-desc">Directly renders an animated, responsive HTML maintenance page</div>
        </div>
        <a href="/render/maintenance" target="_blank" class="btn">View</a>
      </div>
    </section>
  </div>

  <script>
    (function () {
      const codeSelect = document.getElementById('statusCodeSelect');
      const fetchBtn = document.getElementById('fetchBtn');
      const openHtmlLink = document.getElementById('openHtmlLink');
      const jsonPreview = document.getElementById('jsonPreview');
      const copyJsonBtn = document.getElementById('copyJsonBtn');
      const codeSnippetBox = document.getElementById('codeSnippetBox');
      const tabButtons = document.querySelectorAll('.tab-btn');
      const themeToggle = document.getElementById('themeToggle');
      const themeLabel = document.getElementById('themeLabel');

      let currentTab = 'curl';

      function updateTheme(theme) {
        if (theme === 'light') {
          document.documentElement.setAttribute('data-theme', 'light');
          themeLabel.textContent = 'Dark Mode';
        } else {
          document.documentElement.removeAttribute('data-theme');
          themeLabel.textContent = 'Light Mode';
        }
        localStorage.setItem('theme', theme);
      }

      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        updateTheme(savedTheme);
      }

      themeToggle.addEventListener('click', function () {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        updateTheme(isLight ? 'dark' : 'light');
      });

      function updateSnippets() {
        const val = codeSelect.value;
        const host = window.location.origin;

        if (val === 'maintenance') {
          openHtmlLink.href = '/render/maintenance';
        } else {
          openHtmlLink.href = '/render/error/' + val;
        }

        if (currentTab === 'curl') {
          if (val === 'maintenance') {
            codeSnippetBox.textContent = 'curl -s ' + host + '/api/v1/maintenance';
          } else {
            codeSnippetBox.textContent = 'curl -s ' + host + '/api/v1/errors/' + val;
          }
        } else if (currentTab === 'fetch') {
          const endpoint = val === 'maintenance' ? '/api/v1/maintenance' : '/api/v1/errors/' + val;
          codeSnippetBox.textContent =
            'fetch("' + host + endpoint + '")\\n' +
            '  .then(res => res.json())\\n' +
            '  .then(data => console.log(data));';
        } else if (currentTab === 'express') {
          codeSnippetBox.textContent =
            '// Express 404 handler fallback\\n' +
            'app.use(async (req, res) => {\\n' +
            '  const response = await fetch("' + host + '/api/v1/errors/404");\\n' +
            '  const payload = await response.json();\\n' +
            '  res.status(404).json(payload);\\n' +
            '});';
        }
      }

      codeSelect.addEventListener('change', updateSnippets);

      tabButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          tabButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentTab = btn.getAttribute('data-tab');
          updateSnippets();
        });
      });

      async function triggerFetch() {
        const val = codeSelect.value;
        const endpoint = val === 'maintenance' ? '/api/v1/maintenance' : '/api/v1/errors/' + val;

        jsonPreview.textContent = 'Loading response...';
        try {
          const res = await fetch(endpoint);
          const data = await res.json();
          jsonPreview.textContent = JSON.stringify(data, null, 2);
        } catch (err) {
          jsonPreview.textContent = 'Failed to load response: ' + err.message;
        }
      }

      fetchBtn.addEventListener('click', triggerFetch);

      copyJsonBtn.addEventListener('click', function () {
        navigator.clipboard.writeText(jsonPreview.textContent).then(function () {
          const orig = copyJsonBtn.textContent;
          copyJsonBtn.textContent = 'Copied!';
          setTimeout(() => copyJsonBtn.textContent = orig, 1800);
        });
      });

      // Initial execution
      updateSnippets();
      triggerFetch();
    })();
  </script>
</body>
</html>`;

  return cachedPlaygroundHtml;
}
