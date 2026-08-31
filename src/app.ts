import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { apiRoutes } from './routes/api.js';
import { renderRoutes } from './routes/render.js';
import { statusService } from './services/statusService.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: process.env.NODE_ENV === 'test' ? false : true,
    trustProxy: true
  });

  // Enable CORS for cross origin client usage
  await app.register(cors, {
    origin: true
  });

  // Rate limiting to protect the server
  await app.register(rateLimit, {
    max: 120,
    timeWindow: '1 minute'
  });

  // OpenAPI / Swagger documentation
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'WittyStatus API',
        description: 'Witty and professional HTTP error and maintenance status handling API',
        version: '1.0.0'
      },
      servers: [
        {
          url: 'http://localhost:3001',
          description: 'Local development server'
        }
      ]
    }
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    }
  });

  // Register HTML render routes
  await app.register(renderRoutes);

  // Register REST API routes under /api/v1
  await app.register(apiRoutes, { prefix: '/api/v1' });

  // Custom 404 handler for API routes
  app.setNotFoundHandler(async (request, reply) => {
    if (request.url.startsWith('/api/')) {
      const payload = statusService.buildErrorPayload(404);
      reply.status(404).send(payload);
    } else {
      reply.redirect('/render/error/404');
    }
  });

  return app;
}
