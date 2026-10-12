# Contexto del Ejercicio 4: Cache API y Estrategia de Caché Estática (Cache-First)

## Objetivo
Implementar la Cache API en el Service Worker utilizando la estrategia **Cache-First** (Caché Primero) para precargar los recursos estáticos críticos y asegurar un funcionamiento eficiente y offline-first.

## Tareas Realizadas
- Creación de la carpeta `ejercicio4/`.
- Estructuración del App Shell (`index.html`, `styles.css`, `app.js`, `manifest.json`, iconos).
- Configuración de `sw.js` con:
  - Cacheo estático durante el evento `install` (`ejercicio4-cache-v1`).
  - Limpieza de cachés antiguas en el evento `activate`.
  - Intercepción de peticiones con la estrategia **Cache-First** en el evento `fetch` (buscando primero en caché, y si no existe, consultando red y almacenando copia dinámica).
- Validación de almacenamiento en el panel **Application > Cache Storage** de DevTools.
