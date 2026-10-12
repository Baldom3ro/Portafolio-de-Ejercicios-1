# Ejercicio 3: Registro y ciclo de vida del Service Worker

## Objetivo

Implementar la lógica de registro de un Service Worker y verificar su comportamiento durante los eventos `install`, `activate` y `fetch`.

## Archivos principales

- `index.html`: estructura base de la PWA.
- `app.js`: registro del Service Worker y control del estado visual.
- `sw.js`: lógica del ciclo de vida del worker.
- `manifest.json`: metadatos de instalación.

## Validación manual

1. Abrir una terminal en la carpeta del proyecto.
2. Ejecutar un servidor local:
   - `python -m http.server 8000`
3. Abrir en el navegador la URL:
   - `http://localhost:8000/ejercicio3/`
4. Abrir DevTools y entrar en la pestaña `Application`.
5. Revisar la sección `Service Workers` para comprobar que está registrado.
6. Comprobar `Cache Storage` para confirmar que se creó el caché del App Shell.
7. Activar `Offline` en Network y recargar la página para comprobar el comportamiento de caché.

## Resultado esperado

- `install`: precarga los recursos y activa el worker.
- `activate`: limpia cachés anteriores y toma el control de la app.
- `fetch`: entrega recursos del caché y, si falla la red, devuelve el contenido disponible.
