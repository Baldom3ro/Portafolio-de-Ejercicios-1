const CACHE_NAME = 'ejercicio4-cache-v1';
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Evento Install: Crear caché y precargar recursos estáticos críticos
self.addEventListener('install', (event) => {
  console.log('[SW Ejercicio 4] Evento install: precargando recursos estáticos');
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(APP_SHELL);
      // Forzar activación inmediata del nuevo Service Worker
      await self.skipWaiting();
    })()
  );
});

// Evento Activate: Limpiar cachés antiguas
self.addEventListener('activate', (event) => {
  console.log('[SW Ejercicio 4] Evento activate: limpiando cachés obsoletas');
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log(`[SW Ejercicio 4] Eliminando caché antigua: ${key}`);
            return caches.delete(key);
          })
      );
      // Tomar el control de todas las pestañas abiertas inmediatamente
      await self.clients.claim();
    })()
  );
});

// Evento Fetch: Implementar estrategia Cache-First
self.addEventListener('fetch', (event) => {
  // Solo interceptar peticiones GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      
      // 1. Buscar primero en la caché (Cache-First)
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        console.log(`[SW Ejercicio 4] Entregado desde caché: ${event.request.url}`);
        return cachedResponse;
      }

      // 2. Si no está en caché, consultar la red
      try {
        const networkResponse = await fetch(event.request);

        // Guardar copia dinámica en caché si la respuesta es válida
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          event.request.url.startsWith(self.location.origin)
        ) {
          cache.put(event.request, networkResponse.clone());
          console.log(`[SW Ejercicio 4] Descargado de red y cacheado: ${event.request.url}`);
        }

        return networkResponse;
      } catch (error) {
        console.error(`[SW Ejercicio 4] Falló la red para: ${event.request.url}`, error);
        // Si falla la red y no está en caché, opcionalmente retornar página principal o fallback
        return cache.match('./index.html');
      }
    })()
  );
});
