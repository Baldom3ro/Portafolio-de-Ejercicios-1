# Ejercicio 2 — App Shell & Splash Screen Nativa

Maquetado de la interfaz base de una PWA con una arquitectura **App Shell** y splash screen visible tanto en escritorio como en móvil.

## Objetivo

Implementar una estructura de aplicación de carga instantánea (App Shell) y un splash screen que se muestra mientras se inicializa la aplicación, verificable mediante Chrome DevTools al simular la instalación.

## Arquitectura App Shell

- **Header**: logo, título, indicador de estado y botón de instalación.
- **Menú de navegación lateral**: panel coniconos SVG, vistas (Dashboard, DevTools, Splash, Ajustes).
- **Contenedor principal**: vistas intercambiables renderizadas desde caché.
- **Splash screen desktop**: capa de carga con icono de 512 px y loader, con efecto `fade-out` al iniciar.

## Archivos

| Archivo | Rol |
|---------|-----|
| `index.html` | Estructura completa: splash, header, nav, body y vistas. |
| `styles.css` | Estilos responsivos (mobile-first, drawer, grid de tarjetas). |
| `app.js` | Registro del Service Worker, control del splash, gestión de install prompt y limpieza de caché. |
| `sw.js` | Ciclo de vida: `install` precarga el App Shell, `activate` limpia cachés antiguas, `fetch` sirve desde caché. |
| `manifest.json` | Metadatos PWA (`name`, `background_color`, `theme_color`, iconos). |
| `server.js` | Servidor Node.js opcional para servir con HTTPS/HTTP local. |
| `icon-192.png`, `icon-512.png` | Iconos de la PWA. |

## Estrategia de caché

El Service Worker precarga en `install`:

```js
const ASSETS_TO_CACHE = ['./', './index.html', './styles.css', './app.js', './manifest.json', './icon-192.png', './icon-512.png'];
```

En `fetch` usa **Cache-First** con fallback a red.

## Instrucciones de validación manual

1. Ejecuta un servidor local en la carpeta del ejercicio:
   ```bash
   python -m http.server 8000
   ```
   y abre `http://localhost:8000/ejercicio2/`.
2. **Splash screen desktop**: al recargar, observa que la capa `#desktop-splash-screen` aparece y desaparece con `fade-out` tras ~1.2 s.
3. Abre DevTools → **Application** → **Manifest** → verifica la预览 del splash screen nativo (generado por Chrome con el icono 512 px y `background_color: #0f172a`).
4. Ve a **Service Workers** y confirma que el worker está registrado y activo.
5. En **Cache Storage**, expande `app-shell-v2` y comprueba que todos los recursos del App Shell están precargados.
6. Activa **Offline** en la pestaña **Network** y recarga la página para verificar que la interfaz se sirve desde caché.
7. Simula la instalación con el botón **Instalar App** o desde la barra de direcciones de Chrome.

## Notas

- La validación de splash screen nativa es exclusivamente visual/manual; el proyecto no ejecuta pruebas automáticas.
- El diseño es 100% responsivo (header colapsable, drawer lateral en móvil, grid de tarjetas adaptativas).