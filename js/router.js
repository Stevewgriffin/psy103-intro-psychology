// Hash-based SPA router
const routes = {};
let currentRoute = null;
let beforeEach = null;

export function addRoute(path, handler) {
  routes[path] = handler;
}

export function navigate(path) {
  window.location.hash = path;
}

export function setBeforeEach(fn) {
  beforeEach = fn;
}

export function getCurrentRoute() {
  return currentRoute;
}

function matchRoute(hash) {
  const path = hash.replace('#', '') || '/login';

  // Exact match first
  if (routes[path]) {
    return { handler: routes[path], params: {}, path };
  }

  // Pattern match (e.g., /week/:id, /chapter/:id)
  for (const pattern of Object.keys(routes)) {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');

    if (patternParts.length !== pathParts.length) continue;

    const params = {};
    let match = true;

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        match = false;
        break;
      }
    }

    if (match) {
      return { handler: routes[pattern], params, path };
    }
  }

  return null;
}

function handleRoute() {
  const hash = window.location.hash || '#/login';
  const matched = matchRoute(hash);

  if (!matched) {
    navigate('/login');
    return;
  }

  if (beforeEach && !beforeEach(matched.path)) {
    return;
  }

  currentRoute = matched.path;
  matched.handler(matched.params);
}

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}
