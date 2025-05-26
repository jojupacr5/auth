import type { MiddlewareNext } from "astro";
import { defineMiddleware } from "astro:middleware";
import { firebase } from "./firebase/config";
import { LocalsNotAnObject } from "node_modules/astro/dist/core/errors/errors-data";

const privateRoutes = ["/protected"];
const notAuthenticatedRoutes = ["/login", "/register"];

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware((context, next) => {

  const isLoggedIn = !!firebase.auth.currentUser;
  const user = firebase.auth.currentUser;

  context.locals.isLoggedIn = isLoggedIn;

  if (user) {
    context.locals.user = {
      avatar: user.photoURL ?? "",
      email: user.email!,
      name: user.displayName!,
      emailVerified: user.emailVerified,
    }
  }

  if (privateRoutes.includes(context.url.pathname) && !isLoggedIn) {
    return context.redirect("/");
  }
  if (notAuthenticatedRoutes.includes(context.url.pathname) && isLoggedIn) {
    return context.redirect("/");
  }

  return next();
});