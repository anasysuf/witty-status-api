import { statusService } from '../services/statusService.js';
import { renderErrorPage } from '../templates/errorPage.js';
import { BrandOptions } from '../types/index.js';

export interface WittyMiddlewareOptions {
  brand?: BrandOptions;
  format?: 'auto' | 'json' | 'html' | 'rfc7807';
  defaultStatusCode?: number;
}

/**
 * Drop-in Express Error Handling Middleware.
 * Catches errors, logs them if necessary, and serves a witty status response
 * via content negotiation (HTML for browser requests, JSON or RFC 7807 for API callers).
 */
export function wittyErrorHandler(options: WittyMiddlewareOptions = {}) {
  return (err: any, req: any, res: any, next: any) => {
    const statusCode = err.status || err.statusCode || options.defaultStatusCode || 500;
    const requestId = (req.headers && req.headers['x-request-id']) || req.id || undefined;
    const format = options.format || 'auto';

    const wantsHtml =
      format === 'html' ||
      (format === 'auto' && req.accepts && typeof req.accepts === 'function' && req.accepts('html') && !req.accepts('json'));

    if (wantsHtml) {
      const payload = statusService.buildErrorPayload(statusCode, err.message, requestId);
      const html = renderErrorPage(payload, options.brand);
      res.status(statusCode).type('text/html; charset=utf-8').send(html);
    } else if (format === 'rfc7807') {
      const payload = statusService.buildRfc7807Payload(statusCode, err.message, requestId, req.originalUrl || req.url);
      res.status(statusCode).type('application/problem+json').json(payload);
    } else {
      const payload = statusService.buildErrorPayload(statusCode, err.message, requestId);
      res.status(statusCode).json(payload);
    }
  };
}

/**
 * Drop-in Express 404 Catch-all Route Handler.
 * Place at the bottom of your route definitions before wittyErrorHandler.
 */
export function wittyNotFoundHandler(options: WittyMiddlewareOptions = {}) {
  return (req: any, res: any) => {
    const requestId = (req.headers && req.headers['x-request-id']) || req.id || undefined;
    const format = options.format || 'auto';

    const wantsHtml =
      format === 'html' ||
      (format === 'auto' && req.accepts && typeof req.accepts === 'function' && req.accepts('html') && !req.accepts('json'));

    if (wantsHtml) {
      const payload = statusService.buildErrorPayload(404, undefined, requestId);
      const html = renderErrorPage(payload, options.brand);
      res.status(404).type('text/html; charset=utf-8').send(html);
    } else if (format === 'rfc7807') {
      const payload = statusService.buildRfc7807Payload(404, undefined, requestId, req.originalUrl || req.url);
      res.status(404).type('application/problem+json').json(payload);
    } else {
      const payload = statusService.buildErrorPayload(404, undefined, requestId);
      res.status(404).json(payload);
    }
  };
}
