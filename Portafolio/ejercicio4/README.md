# Ejercicio 4 — Cache API y estrategia Cache-First

Implementación de la **Cache API** en el Service Worker con la estrategia **Cache-First** (Caché Primero) para precargar recursos estáticos y garantizar funcionamiento offline-first.

## Objetivo

Configurar un Service Worker que:
1. Precargue los recursos estáticos críticos durante el evento `install`.
2. Limpie cachés obsoletas en `activate`.
3. Intercepte las peticiones en `fetch` y sirva la respuesta desde la caché primero, consultando la red solo si no hay copia local (estrategia **Cache-First**).

## Estrategia Cache-First

```js
event.respondWith(
  (async () => {
    const cache = await caches.open(CACHE_NAME);

    // 1. Buscar primero en la caché
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) return cachedResponse;

    // 2. Si no está en caché, consultar la red y almacenar copia dinámica
    const networkResponse = await fetch(event.request);
    if (networkResponse.status === 200) {
      cache.put(event.request, networkResponse.clone());
    }
    return networkResponse;
  })()
);
```

## Flujo completo

| Evento | Acción |
|--------|--------|
| `install` | Abre `ejercicio4-cache-v1` y precarga el App Shell. Fuerza activación con `skipWaiting()`. |
| `activate` | Purga cachés antiguas y toma control de los clientes con `clients.claim()`. |
| `fetch` | Cache-First: sirve desde caché si existe; si no, descarga de red y guarda copia. Si la red falla, devuelve `index.html` como fallback. |

## Archivos

| Archivo | Rol |
|---------|-----|
| `index.html` | App Shell con vistas (Inicio, Caché Install, Activación, Cache-First). |
| `styles.css` | Estilos de la interfaz (tarjetas, stepper, grid de estadísticas). |
| `app.js` | Registro del Service Worker, control de estado, navegación y botones de prueba. |
| `sw.js` | Lógica de `install`, `activate` y `fetch` con estrategia Cache-First. |
| `manifest.json` | Metadatos PWA. |
| `icons/icon-192.png`, `icons/icon-512.png` | Iconos. |

## Caché usada

- Nombre: `ejercicio4-cache-v1`
- Recursos precargados: `index.html`, `styles.css`, `app.js`, `manifest.json`, iconos.

## Instrucciones de validación manual

1. Ejecuta un servidor local en la carpeta del ejercicio:
   ```bash
   python -m http.server 8000
   ```
   y abre `http://localhost:8000/ejercicio4/`.
2. Abre DevTools → **Application** → **Cache Storage**. Expande `ejercicio4-cache-v1` y verifica que todos los recursos estáticos estén precargados.
3. Ve a **Service Workers** y confirma que el worker está activo.
4. En la vista **Cache-First**, usa el botón **Probar lectura desde Caché** para confirmar que las respuestas se sirven localmente.
5. Activa **Offline** en la pestaña **Network** y recarga la página. La interfaz debe seguir funcionando sin conexión.
6. Desactiva **Offline**, navega a un recurso nuevo y vuelve a **Cache Storage** para ver la copia dinámica almacenada.

## Notas

- La copia dinámica solo se guarda para respuestas `200` y URLs del mismo origen.
- Todas las pruebas son manuales; el proyecto no incluye automatización.