# Ejercicio 3 — Registro y ciclo de vida del Service Worker

Implementación de los eventos fundamentales del ciclo de vida de un Service Worker: `install`, `activate` y `fetch`.

## Objetivo

Demostrar cómo se registra un Service Worker desde la página, cómo se precarga el App Shell durante `install`, cómo se limpia la caché en `activate` y cómo se responde a las peticiones en `fetch` con estrategia de caché.

## Eventos del Service Worker

### `install`
Precarga los recursos críticos del App Shell en la Cache API y fuerza la activación inmediata con `self.skipWaiting()`.

```js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});
```

### `activate`
Elimina cualquier caché anterior (control de versiones) y toma el control de los clientes con `self.clients.claim()`.

```js
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});
```

### `fetch`
Sirve los recursos desde la caché y, si no están disponibles, los busca en la red (estrategia **Cache-First** con actualización dinámica).

## Archivos

| Archivo | Rol |
|---------|-----|
| `index.html` | App Shell con header, sidebar de navegación y vistas (Inicio, Instalación, Ciclo de vida, Offline). |
| `styles.css` | Estilos de la interfaz (tarjetas, stepper de ciclo de vida, grid de estadísticas). |
| `app.js` | Registro del Service Worker, control de estado visual, navegación entre vistas y botones de prueba. |
| `sw.js` | Lógica de los eventos `install`, `activate` y `fetch`. |
| `manifest.json` | Metadatos PWA. |
| `icons/icon-192.png`, `icons/icon-512.png` | Iconos. |

## Caché usada

- Nombre: `ejercicio3-cache-v2`
- Recursos precargados: `index.html`, `styles.css`, `app.js`, `manifest.json`, iconos.

## Instrucciones de validación manual

1. Ejecuta un servidor local en la carpeta del ejercicio:
   ```bash
   python -m http.server 8000
   ```
   y abre `http://localhost:8000/ejercicio3/`.
2. Abre DevTools → pestaña **Application** → **Service Workers**. Verifica que el worker esté registrado y en estado **activated**.
3. En **Cache Storage**, expande `ejercicio3-cache-v2` y comprueba que los recursos del App Shell estén precargados.
4. Activa **Offline** en la pestaña **Network** y recarga la página. La interfaz debe seguir funcionando desde caché.
5. Usa los botones de la vista **Ciclo de vida** para inspeccionar el estado del worker en tiempo real.
6. En la vista **Offline**, activa **Offline** y usa el botón **Probar petición a caché** para confirmar la respuesta local.

## Notas

- Todas las pruebas deben realizarse de forma manual; el proyecto no incluye automatización.
- Se requiere un entorno seguro (HTTP/HTTPS local) para que el Service Worker se registre.