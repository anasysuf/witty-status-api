#!/usr/bin/env node
import dotenv from 'dotenv';
import { buildApp } from './app.js';

dotenv.config();

const port = Number(process.env.PORT) || 3001;
const host = process.env.HOST || '0.0.0.0';

export async function startServer() {
  try {
    const app = await buildApp();
    await app.listen({ port, host });
    console.log(`WittyStatus API listening at http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`);
    console.log(`Interactive Playground: http://localhost:${port}/`);
    console.log(`OpenAPI Documentation:  http://localhost:${port}/docs`);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Auto start if executed directly
startServer();
