import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import Fastify from 'fastify';
import { wittyErrorHandler, wittyNotFoundHandler } from '../src/middleware/express.js';
import { wittyFastifyPlugin } from '../src/middleware/fastify.js';

describe('Express & Fastify Middleware Suite', () => {
  it('Express middleware serves standard witty error payload', async () => {
    const app = express();
    app.get('/trigger-error', (_req, _res, next) => {
      const err: any = new Error('Database connection failed');
      err.status = 500;
      next(err);
    });
    app.use(wittyErrorHandler());

    const res = await request(app).get('/trigger-error');
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.status).toBe(500);
    expect(res.body.headline).toBeDefined();
    expect(res.body.wittyMessage).toBe('Database connection failed');
  });

  it('Express middleware serves RFC 7807 problem details when configured', async () => {
    const app = express();
    app.get('/unauthorized', (_req, _res, next) => {
      const err: any = new Error('Token expired');
      err.status = 401;
      next(err);
    });
    app.use(wittyErrorHandler({ format: 'rfc7807' }));

    const res = await request(app).get('/unauthorized');
    expect(res.status).toBe(401);
    expect(res.headers['content-type']).toContain('application/problem+json');
    expect(res.body.type).toBe('https://httpstatuses.io/401');
    expect(res.body.title).toBe('Unauthorized');
    expect(res.body.detail).toBe('Token expired');
  });

  it('Express 404 handler catches unrouted requests', async () => {
    const app = express();
    app.use(wittyNotFoundHandler());

    const res = await request(app).get('/missing-page');
    expect(res.status).toBe(404);
    expect(res.body.status).toBe(404);
    expect(res.body.title).toBe('Not Found');
  });

  it('Fastify plugin handles errors and formats response', async () => {
    const fastify = Fastify();
    await fastify.register(wittyFastifyPlugin);

    fastify.get('/boom', async () => {
      const err: any = new Error('Boom');
      err.statusCode = 502;
      throw err;
    });

    const res = await fastify.inject({
      method: 'GET',
      url: '/boom'
    });

    expect(res.statusCode).toBe(502);
    const json = JSON.parse(res.payload);
    expect(json.status).toBe(502);
    expect(json.title).toBe('Bad Gateway');
  });
});
