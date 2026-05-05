import { defineConfig } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

const movementConfigPath = resolve(
  import.meta.dirname,
  'public/assets/config/character-movement.json'
);

function readRequestBody(request: IncomingMessage): Promise<string> {
  return new Promise((resolveBody, reject) => {
    let body = '';

    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => resolveBody(body));
    request.on('error', reject);
  });
}

function sendJson(response: ServerResponse, statusCode: number, payload: object): void {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(payload));
}

export default defineConfig({
  plugins: [
    {
      name: 'character-movement-config-writer',
      configureServer(server) {
        server.middlewares.use('/__debug/character-movement-config', async (request, response, next) => {
          if (request.method !== 'PUT' && request.method !== 'POST') {
            next();
            return;
          }

          try {
            const body = await readRequestBody(request);
            const parsed = JSON.parse(body) as unknown;

            if (!parsed || typeof parsed !== 'object') {
              sendJson(response, 400, { ok: false, error: 'Expected a JSON object' });
              return;
            }

            await mkdir(dirname(movementConfigPath), { recursive: true });
            await writeFile(movementConfigPath, `${JSON.stringify(parsed, null, 2)}\n`);
            sendJson(response, 200, { ok: true, path: movementConfigPath });
          } catch (error) {
            sendJson(response, 500, {
              ok: false,
              error: error instanceof Error ? error.message : 'Unknown save error'
            });
          }
        });
      }
    }
  ],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
});
