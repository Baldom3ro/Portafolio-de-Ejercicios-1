# Ejercicio 5 — Interceptor de peticiones y manejo de estado offline

Implementación de un **fallback offline** mediante el interceptor del evento `fetch` en el Service Worker: cuando una petición falla por falta de conexión, se sirve la página `offline.html` precargada.

## Objetivo

Extender la estrategia **Cache-First** con un sistema de recuperación ante fallos de red:
1. Precargar `offline.html` junto con el App Shell en `install`.
2. En `fetch`, si la caché no tiene la respuesta y la red falla, servir la página de fallback offline.
3. Permitir la recuperación automática al restablecer la conexión.

## Flujo del interceptor `fetch`

```js
event.respondWith(
  (async () => {
    const cache = await caches.open(CACHE_NAME);

    // 1. Cache-First: buscar en caché
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) return cachedResponse;

    // 2. Consultar la red
    try {
      const networkResponse = await fetch(event.request);
      if (networkResponse.status === 200) {
        cache.put(event.request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      // 3. Red falló: servir fallback offline
      const offlineResponse = await cache.match(OFFLINE_PAGE);
      return offlineResponse || new Response('Offline sin conexión', { status: 503 });
    }
  })()
);
```

## Archivos

| Archivo | Rol |
|---------|-----|
| `index.html` | App Shell con vistas (Inicio, Offline, Validación). |
| `styles.css` | Estilos de la interfaz y de la página offline. |
| `app.js` | Registro del Service Worker, control de estado, navegación y botones de prueba. |
| `sw.js` | Lógica de `install`, `activate` y `fetch` con fallback offline. |
| `offline.html` | Página de fallback mostrada cuando no hay conexión. |
| `offline.js` | Detección de estado `online`/`offline` y botón de reintento con recarga automática. |
| `manifest.json` | Metadatos PWA. |
| `icons/icon-192.png`, `icons/icon-512.png` | Iconos. |

## Caché usada

- Nombre: `ejercicio5-cache-v1`
- Recursos precargados: App Shell + `offline.html` + `offline.js`.

## Instrucciones de validación manual

1. Ejecuta un servidor local en la carpeta del ejercicio:
   ```bash
   python -m http.server 8000
   ```
   y abre `http://localhost:8000/ejercicio5/`.
2. Abre DevTools → **Application** → **Cache Storage**. Expande `ejercicio5-cache-v1` y verifica que `offline.html` y `offline.js` estén precargados.
3. Ve a **Service Workers** y confirma que el worker está activo.
4. En la vista **Offline**, haz clic en **Simular petición sin conexión**.
5. Activa **Offline** en la pestaña **Network** y recarga la página. Debes ver la pantalla de fallback (`offline.html`).
6. Desactiva **Offline** y verifica que la página se recupera automáticamente (el script `offline.js` detecta el evento `online` y recarga).
7. Usa el botón **Reintentar conexión** de la página offline para probar la recuperación manual.

## Notas

- La página de fallback es una vista independiente, no una substitución del App Shell.
- La detección de conexión usa los eventos `navigator.onLine`, `online` y `offline`.
- Todas las pruebas son manuales; el proyecto no incluye automatización.