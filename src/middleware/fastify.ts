import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { statusService } from '../services/statusService.js';
import { renderErrorPage } from '../templates/errorPage.js';
import { BrandOptions } from '../types/index.js';

export interface WittyFastifyPluginOptions {
  brand?: BrandOptions;
  format?: 'auto' | 'json' | 'html' | 'rfc7807';
  handle404?: boolean;
}

const plugin: FastifyPluginAsync<WittyFastifyPluginOptions> = async (
  fastify,
  options = {}
) => {
  const format = options.format || 'auto';

  // Optional 404 Handler
  if (options.handle404 !== false) {
    fastify.setNotFoundHandler(async (request, reply) => {
      const requestId = (request.headers['x-request-id'] as string) || request.id;
      const acceptHeader = (request.headers['accept'] as string) || '';
      const wantsHtml =
        format === 'html' ||
        (format === 'auto' && acceptHeader.includes('text/html') && !acceptHeader.includes('application/json'));

      reply.status(404);

      if (wantsHtml) {
        const payload = statusService.buildErrorPayload(404, undefined, requestId);
        reply.type('text/html; charset=utf-8');
        return reply.send(renderErrorPage(payload, options.brand));
      } else if (format === 'rfc7807') {
        const payload = statusService.buildRfc7807Payload(404, undefined, requestId, request.url);
        reply.type('application/problem+json');
        return reply.send(payload);
      } else {
        return reply.send(statusService.buildErrorPayload(404, undefined, requestId));
      }
    });
  }

  // Central Error Handler
  fastify.setErrorHandler((error: any, request, reply) => {
    const statusCode = error.statusCode || 500;
    const requestId = (request.headers['x-request-id'] as string) || request.id;
    const acceptHeader = (request.headers['accept'] as string) || '';
    const wantsHtml =
      format === 'html' ||
      (format === 'auto' && acceptHeader.includes('text/html') && !acceptHeader.includes('application/json'));

    reply.status(statusCode);

    if (wantsHtml) {
      const payload = statusService.buildErrorPayload(statusCode, error.message, requestId);
      reply.type('text/html; charset=utf-8');
      reply.send(renderErrorPage(payload, options.brand));
    } else if (format === 'rfc7807') {
      const payload = statusService.buildRfc7807Payload(statusCode, error.message, requestId, request.url);
      reply.type('application/problem+json');
      reply.send(payload);
    } else {
      reply.send(statusService.buildErrorPayload(statusCode, error.message, requestId));
    }
  });
};

export const wittyFastifyPlugin = fp(plugin, {
  name: 'witty-status-plugin'
});

