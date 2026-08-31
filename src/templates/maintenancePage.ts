import { MaintenanceStatus } from '../types/index.js';

export function renderMaintenancePage(data: MaintenanceStatus): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>System Maintenance in Progress</title>
  <meta name="description" content="${data.wittyHeadline}">
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
      --progress-bg: #334155;
      --focus-ring: #38bdf8;
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
      --progress-bg: #e2e8f0;
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
      max-width: 640px;
    }

    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .status-indicator {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      color: #f59e0b;
    }

    .pulse-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #f59e0b;
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
      padding: 36px 28px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    }

    h1 {
      font-size: clamp(1.6rem, 4vw, 2.2rem);
      font-weight: 700;
      margin-bottom: 12px;
      line-height: 1.2;
    }

    .subheading {
      color: var(--text-muted);
      font-size: 1.05rem;
      margin-bottom: 24px;
    }

    .progress-box {
      margin-bottom: 24px;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    .progress-bar-container {
      width: 100%;
      height: 10px;
      background-color: var(--progress-bg);
      border-radius: 999px;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      width: ${data.progressPercent}%;
      background-color: var(--primary);
      border-radius: 999px;
      transition: width 0.4s ease;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }

    .info-item {
      background: var(--bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 14px 16px;
    }

    .info-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 4px;
    }

    .info-value {
      font-size: 0.95rem;
      font-weight: 600;
    }

    .actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
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
      transition: background-color 0.15s ease;
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
      background-color: var(--bg);
    }

    .footer {
      margin-top: 24px;
      text-align: center;
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    @media (max-width: 500px) {
      .info-grid {
        grid-template-columns: 1fr;
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
      <div class="status-indicator">
        <span class="pulse-dot"></span>
        <span>Maintenance Active</span>
      </div>
      <button id="themeToggle" class="theme-toggle" type="button" aria-label="Toggle theme">
        <span id="themeIcon" aria-hidden="true">&#9788;</span>
        <span id="themeLabel">Light Mode</span>
      </button>
    </div>

    <main class="card">
      <h1>${data.wittyHeadline}</h1>
      <p class="subheading">${data.message}</p>

      <div class="progress-box">
        <div class="progress-header">
          <span>Current Task: ${data.currentActivity}</span>
          <span id="progressText">${data.progressPercent}%</span>
        </div>
        <div class="progress-bar-container" role="progressbar" aria-valuenow="${data.progressPercent}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar-fill" id="progressBar"></div>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Estimated Window</div>
          <div class="info-value">${data.estimatedDuration}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Estimated Ready Time</div>
          <div class="info-value">${data.estimatedCompletion}</div>
        </div>
      </div>

      <div class="actions">
        <button class="btn btn-primary" type="button" onclick="window.location.reload()">
          Check Status Now
        </button>
        <a class="btn btn-secondary" href="mailto:${data.supportEmail}">
          Contact Support
        </a>
      </div>
    </main>

    <footer class="footer">
      Automated status monitor. This page periodically checks for service resumption.
    </footer>
  </div>

  <script>
    (function () {
      const themeToggle = document.getElementById('themeToggle');
      const themeIcon = document.getElementById('themeIcon');
      const themeLabel = document.getElementById('themeLabel');

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

      // Periodic check simulation
      let currentProgress = ${data.progressPercent};
      const bar = document.getElementById('progressBar');
      const text = document.getElementById('progressText');

      setInterval(function () {
        if (currentProgress < 96) {
          currentProgress += 1;
          bar.style.width = currentProgress + '%';
          text.textContent = currentProgress + '%';
        }
      }, 8000);
    })();
  </script>
</body>
</html>`;
}
