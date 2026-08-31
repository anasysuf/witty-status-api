import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { statusService } from '../services/statusService.js';
import { renderErrorPage } from '../templates/errorPage.js';
import { renderMaintenancePage } from '../templates/maintenancePage.js';
import { renderPlaygroundPage } from '../templates/playgroundPage.js';

const ErrorCodeParamSchema = z.object({
  code: z.coerce.number().int().min(400).max(599)
});

export const renderRoutes: FastifyPluginAsync = async (fastify) => {
  // Developer hub and interactive playground
  fastify.get('/', async (request, reply) => {
    reply.type('text/html; charset=utf-8');
    return renderPlaygroundPage();
  });

  // Render standalone HTML error page
  fastify.get('/render/error/:code', async (request, reply) => {
    const params = ErrorCodeParamSchema.safeParse(request.params);
    const code = params.success ? params.data.code : 404;
    const requestId = (request.headers['x-request-id'] as string) || request.id;
    const query = request.query as { brand?: string; color?: string; logo?: string; support?: string };

    const payload = statusService.buildErrorPayload(code, undefined, requestId);
    reply.status(payload.status);
    reply.type('text/html; charset=utf-8');
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
    const query = request.query as { brand?: string; color?: string; logo?: string; support?: string };
    reply.status(503);
    reply.type('text/html; charset=utf-8');
    return renderMaintenancePage(data, {
      brandName: query.brand,
      primaryColor: query.color,
      logoUrl: query.logo,
      supportUrl: query.support
    });
  });
};
