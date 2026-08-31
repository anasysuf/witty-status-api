import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app.js';

describe('WittyStatus API Suite', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/health returns healthy status', async () => {
    const res = await request(app.server).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /api/v1/quotes returns an array of status quotes', async () => {
    const res = await request(app.server).get('/api/v1/quotes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/quotes/random returns a single quote with valid fields', async () => {
    const res = await request(app.server).get('/api/v1/quotes/random');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.code).toBeDefined();
    expect(res.body.data.wittyMessage).toBeDefined();
    expect(res.body.data.actionAdvice).toBeDefined();
  });

  it('GET /api/v1/errors/404 returns HTTP 404 with structured payload', async () => {
    const res = await request(app.server).get('/api/v1/errors/404');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.status).toBe(404);
    expect(res.body.title).toBe('Not Found');
    expect(res.body.wittyMessage).toBeDefined();
    expect(res.body.requestId).toBeDefined();
  });

  it('GET /api/v1/errors/500 returns HTTP 500 with structured payload', async () => {
    const res = await request(app.server).get('/api/v1/errors/500');
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.status).toBe(500);
    expect(res.body.title).toBe('Internal Server Error');
  });

  it('GET /api/v1/maintenance returns HTTP 503 with maintenance metadata', async () => {
    const res = await request(app.server).get('/api/v1/maintenance');
    expect(res.status).toBe(503);
    expect(res.body.status).toBe(503);
    expect(res.body.progressPercent).toBeDefined();
    expect(res.body.estimatedDuration).toBeDefined();
  });

  it('GET /render/error/404 renders an accessible HTML error page', async () => {
    const res = await request(app.server).get('/render/error/404');
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toContain('text/html');
    expect(res.text).toContain('HTTP 404');
    expect(res.text).toContain('System Response');
  });

  it('GET /render/maintenance renders the HTML maintenance view', async () => {
    const res = await request(app.server).get('/render/maintenance');
    expect(res.status).toBe(503);
    expect(res.headers['content-type']).toContain('text/html');
    expect(res.text).toContain('System Maintenance in Progress');
  });

  it('GET / renders the interactive playground page', async () => {
    const res = await request(app.server).get('/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
    expect(res.text).toContain('WittyStatus API');
  });

  it('GET /api/v1/errors/451 gracefully handles unmapped error codes', async () => {
    const res = await request(app.server).get('/api/v1/errors/451');
    expect(res.status).toBe(451);
    expect(res.body.success).toBe(false);
    expect(res.body.status).toBe(451);
    expect(res.body.title).toBe('Client Error');
    expect(res.body.wittyMessage).toBeDefined();
  });

  it('GET /api/v1/errors/999 rejects invalid status codes with 400', async () => {
    const res = await request(app.server).get('/api/v1/errors/999');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.status).toBe(400);
  });

  it('GET /api/v1/quotes/random?code=451 returns a fallback quote with matching status code', async () => {
    const res = await request(app.server).get('/api/v1/quotes/random?code=451');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.code).toBe(451);
  });

  it('GET /api/v1/quotes?category=server_error filters quotes by category', async () => {
    const res = await request(app.server).get('/api/v1/quotes?category=server_error');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.every((q: any) => q.category === 'server_error')).toBe(true);
  });

  it('GET /api/v1/nonexistent returns structured 404 JSON', async () => {
    const res = await request(app.server).get('/api/v1/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.status).toBe(404);
  });
});
