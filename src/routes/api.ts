import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { statusService } from '../services/statusService.js';
import { renderErrorPage } from '../templates/errorPage.js';

const ErrorCodeParamSchema = z.object({
  code: z.coerce.number().int().min(400).max(599)
});

const ErrorQuerySchema = z.object({
  format: z.enum(['standard', 'rfc7807', 'html', 'json']).optional(),
  brand: z.string().optional()
});

const RandomQuerySchema = z.object({
  code: z.coerce.number().int().min(400).max(599).optional(),
  category: z.enum(['client_error', 'server_error', 'maintenance']).optional()
});

export const apiRoutes: FastifyPluginAsync = async (fastify) => {
  // Health check endpoint
  fastify.get(
    '/health',
    {
      schema: {
        description: 'Health check endpoint',
        tags: ['System'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              uptime: { type: 'number' },
              timestamp: { type: 'string' }
            }
          }
        }
      }
    },
    async () => {
      return {
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      };
    }
  );

  // List quotes with optional category filtering
  fastify.get(
    '/quotes',
    {
      schema: {
        description: 'Get all available witty status messages',
        tags: ['Quotes'],
        querystring: {
          type: 'object',
          properties: {
            code: { type: 'integer' },
            category: { type: 'string', enum: ['client_error', 'server_error', 'maintenance'] }
          }
        }
      }
    },
    async (request) => {
      const query = RandomQuerySchema.parse(request.query);
      if (query.code) {
        return { data: statusService.getQuotesByCode(query.code) };
      }
      if (query.category) {
        return { data: statusService.getQuotesByCategory(query.category) };
      }
      return { data: statusService.getAllQuotes() };
    }
  );

  // Random quote endpoint
  fastify.get(
    '/quotes/random',
    {
      schema: {
        description: 'Get a single random witty status quote',
        tags: ['Quotes'],
        querystring: {
          type: 'object',
          properties: {
            code: { type: 'integer' },
            category: { type: 'string', enum: ['client_error', 'server_error', 'maintenance'] }
          }
        }
      }
    },
    async (request) => {
      const query = RandomQuerySchema.parse(request.query);
      const quote = statusService.getRandomQuote(query.code, query.category);
      return {
        success: true,
        data: quote
      };
    }
  );

  // Structured error response payload by code
  fastify.get(
    '/errors/:code',
    {
      schema: {
        description: 'Get a structured error response payload with witty message and recovery guidance',
        tags: ['Errors'],
        params: {
          type: 'object',
          required: ['code'],
          properties: {
            code: { type: 'integer' }
          }
        },
        querystring: {
          type: 'object',
          properties: {
            format: { type: 'string', enum: ['standard', 'rfc7807', 'html', 'json'] },
            brand: { type: 'string' }
          }
        }
      }
    },
    async (request, reply) => {
      const requestId = (request.headers['x-request-id'] as string) || request.id;
      const params = ErrorCodeParamSchema.safeParse(request.params);
      if (!params.success) {
        reply.status(400);
        return {
          success: false,
          status: 400,
          title: 'Bad Request',
          headline: 'Invalid status code requested',
          wittyMessage: 'We need a standard HTTP error code between 400 and 599 to generate a proper message.',
          technicalDetails: 'Parameter code must be an integer between 400 and 599.',
          actionAdvice: 'Provide a supported status code such as 404 or 500.',
          suggestedAction: 'retry',
          timestamp: new Date().toISOString(),
          requestId: requestId || `err_${Date.now()}`
        };
      }

      const query = ErrorQuerySchema.parse(request.query);
      const acceptHeader = (request.headers['accept'] as string) || '';
      const wantsHtml =
        query.format === 'html' ||
        (query.format !== 'json' &&
          query.format !== 'rfc7807' &&
          acceptHeader.includes('text/html') &&
          !acceptHeader.includes('application/json'));

      if (wantsHtml) {
        const payload = statusService.buildErrorPayload(params.data.code, undefined, requestId);
        reply.status(payload.status).type('text/html; charset=utf-8');
        return renderErrorPage(payload, query.brand ? { brandName: query.brand } : undefined);
      }

      if (query.format === 'rfc7807') {
        const payload = statusService.buildRfc7807Payload(params.data.code, undefined, requestId, request.url);
        reply.status(payload.status).type('application/problem+json');
        return payload;
      }

      const payload = statusService.buildErrorPayload(params.data.code, undefined, requestId);
      reply.status(payload.status);
      return payload;
    }
  );

  // Maintenance payload endpoint
  fastify.get(
    '/maintenance',
    {
      schema: {
        description: 'Get structured maintenance state, estimated duration, and reassurance message',
        tags: ['Maintenance']
      }
    },
    async (request, reply) => {
      const maintenance = statusService.getMaintenanceData();
      reply.status(503);
      return {
        success: false,
        status: 503,
        title: 'Service Unavailable',
        headline: maintenance.wittyHeadline,
        message: maintenance.message,
        currentActivity: maintenance.currentActivity,
        progressPercent: maintenance.progressPercent,
        estimatedDuration: maintenance.estimatedDuration,
        estimatedCompletion: maintenance.estimatedCompletion,
        supportEmail: maintenance.supportEmail,
        timestamp: new Date().toISOString()
      };
    }
  );
};
