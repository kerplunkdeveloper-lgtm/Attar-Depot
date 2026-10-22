// In-memory real-time sync version tracker for Attar Depot
// Ultra-high performance: sub-millisecond memory updates with zero database overhead.

const scopeVersions = {
  products: Date.now(),
  categories: Date.now(),
  taxonomy: Date.now(),
  banners: Date.now(),
  coupons: Date.now(),
  orders: Date.now(),
  global: Date.now(),
};

/**
 * Notify that a domain scope has been updated
 * @param {'products' | 'categories' | 'taxonomy' | 'banners' | 'coupons' | 'orders' | string} scope
 */
export function recordDataMutation(scope) {
  const now = Date.now();
  if (scope && scopeVersions[scope] !== undefined) {
    scopeVersions[scope] = now;
  }
  scopeVersions.global = now;
}

/**
 * Get current sync version snapshot
 */
export function getSyncVersions() {
  return {
    globalVersion: scopeVersions.global,
    scopes: { ...scopeVersions },
  };
}

/**
 * Express middleware to automatically track mutations from POST, PUT, PATCH, DELETE requests
 */
export function autoSyncTrackerMiddleware(req, res, next) {
  const method = req.method;
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    // When the response finishes with a success status code (2xx), bump version
    res.on('finish', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const url = req.baseUrl || req.originalUrl || req.url || '';
        if (url.includes('/products')) {
          recordDataMutation('products');
        } else if (url.includes('/categories')) {
          recordDataMutation('categories');
        } else if (url.includes('/taxonomy')) {
          recordDataMutation('taxonomy');
        } else if (url.includes('/banners')) {
          recordDataMutation('banners');
        } else if (url.includes('/coupons')) {
          recordDataMutation('coupons');
        } else if (url.includes('/orders')) {
          recordDataMutation('orders');
        } else {
          recordDataMutation('global');
        }
      }
    });
  }
  next();
}
