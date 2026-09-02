import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { statusService } from '../services/statusService.js';
import { renderErrorPage } from '../templates/errorPage.js';
import { renderMaintenancePage } from '../templates/maintenancePage.js';
import { renderPlaygroundPage } from '../templates/playgroundPage.js';

const ErrorCodeParamSchema = z.object({
  code: z.coerce.number().int().min(400).max(599)
});

const RenderQuerySchema = z.object({
  brand: z.string().max(80).optional(),
  color: z.string().max(50).optional(),
  logo: z.string().max(300).optional(),
  support: z.string().max(300).optional()
});

export const renderRoutes: FastifyPluginAsync = async (fastify) => {
  // Developer hub and interactive playground
  fastify.get('/', async (_request, reply) => {
    reply
      .type('text/html; charset=utf-8')
      .header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    return renderPlaygroundPage();
  });

  // Render standalone HTML error page
  fastify.get('/render/error/:code', async (request, reply) => {
    const params = ErrorCodeParamSchema.safeParse(request.params);
    const code = params.success ? params.data.code : 404;
    const requestId = (request.headers['x-request-id'] as string) || request.id;
    const query = RenderQuerySchema.parse(request.query || {});

    const payload = statusService.buildErrorPayload(code, undefined, requestId);
    reply
      .status(payload.status)
      .type('text/html; charset=utf-8')
      .header('Cache-Control', 'no-cache, no-store, must-revalidate');

    return renderErrorPage(payload, {
      brandName: query.brand,
      primaryColor: query.color,
      logoUrl: query.logo,
      supportUrl: query.support
    });
  });

  // Render standalone HTML maintenance page
  fastify.get('/render/maintenance', async (request, reply) => {
    const data = statusService.getMaintenanceData();
    const query = RenderQuerySchema.parse(request.query || {});

    reply
      .status(503)
      .type('text/html; charset=utf-8')
      .header('Cache-Control', 'no-cache, no-store, must-revalidate');

    return renderMaintenancePage(data, {
      brandName: query.brand,
      primaryColor: query.color,
      logoUrl: query.logo,
      supportUrl: query.support
    });
  });
};
