import http from 'node:http';
import type { HttpMethod } from './models/Routes.js';
import { routes } from './routes/routes.js';

const PORT = 8000;

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host}`);
  const { pathname } = url;
  if (!request.method) {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ data: null, error: 'Method not found' }));
    return;
  }

  const method = request.method as HttpMethod;

  let result = false;

  for (const str of Object.keys(routes[method])) {
    const regexp = new RegExp(
      `^${str.replace(
        ':userId',
        '([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})'
      )}$`
    );
    const matches = pathname.match(regexp);
    if (matches) {
      const route = routes[method][str];
      const data = await route.handler(request, response, matches);
      if (route.cache) {
        response.setHeader(
          'Cache-Control',
          `${route.cache.private ? 'private' : 'public'}, max-age=${
            route.cache.ttl
          }`
        );
      }

      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify(data));
      result = true;
      break;
    }
  }

  if (!result) {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ data: null, error: 'Route not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
