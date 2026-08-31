// Core services and quotes data
export { StatusService, statusService } from './services/statusService.js';
export { STATUS_QUOTES, MAINTENANCE_DATA } from './data/quotes.js';

// Modular quote arrays by status code
export { QUOTES_400 } from './data/quotes/400.js';
export { QUOTES_401 } from './data/quotes/401.js';
export { QUOTES_403 } from './data/quotes/403.js';
export { QUOTES_404 } from './data/quotes/404.js';
export { QUOTES_405 } from './data/quotes/405.js';
export { QUOTES_408 } from './data/quotes/408.js';
export { QUOTES_409 } from './data/quotes/409.js';
export { QUOTES_422 } from './data/quotes/422.js';
export { QUOTES_429 } from './data/quotes/429.js';
export { QUOTES_500 } from './data/quotes/500.js';
export { QUOTES_502 } from './data/quotes/502.js';
export { QUOTES_503 } from './data/quotes/503.js';
export { QUOTES_504 } from './data/quotes/504.js';
export { QUOTES_MISC } from './data/quotes/misc.js';

// Standalone HTML template renderers
export { renderErrorPage } from './templates/errorPage.js';
export { renderMaintenancePage } from './templates/maintenancePage.js';
export { renderPlaygroundPage } from './templates/playgroundPage.js';

// Fastify application builder
export { buildApp } from './app.js';

// TypeScript types
export type {
  StatusQuote,
  ErrorResponsePayload,
  MaintenanceStatus,
  HttpStatusCategory
} from './types/index.js';
