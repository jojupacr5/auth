// No funciona por el nombre del archivo
// Solo una demostracion

import type { MiddlewareNext } from "astro";
import { defineMiddleware } from "astro:middleware";

const privateRoutes = ["/protected"];

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware((context, next) => {
  const { request, url } = context;
  const authHeader = request.headers.get("Authorization") ?? '';

  if( privateRoutes.includes(url.pathname)) {
    return cheackLocalAuth(authHeader, next);
  }

  return next();
});

const cheackLocalAuth = ( authHeader: string, next: MiddlewareNext) => {
  if(authHeader) {
    const authValue = authHeader.split(" ").at(-1) ?? 'uesr:pass';
    const decodedValue = atob(authValue).split(":");
    const [username, password] = decodedValue;
  
    if( username === 'admin' && password === 'admin2') {
      return next();
    }
  }

  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    }
  });
}