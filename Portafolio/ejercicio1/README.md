# Ejercicio 1 — Web App Manifest

Configuración de los metadatos de instalación de una PWA mediante el archivo `manifest.json` y los iconos de alta resolución.

## Objetivo

Enlazar un **Web App Manifest** al documento HTML para que Chrome/Edge puedan generar la pantalla de instalación nativa, el splash screen y el icono de la pantalla de inicio del dispositivo.

## Archivos

| Archivo | Rol |
|---------|-----|
| `index.html` | Página principal con `<link rel="manifest" href="./manifest.json">` y tarjetas de visualización de metadatos e iconos. |
| `manifest.json` | Definición de `name`, `short_name`, `start_url`, `display`, colores e iconos. |
| `icons/icon-192.png` | Icono 192×192 px para móviles y pantalla de inicio. |
| `icons/icon-512.png` | Icono 512×512 px para splash screen de alta densidad. |

## Propiedades del manifest

- `name`: *"Mi Aplicación PWA"* — nombre completo mostrado en la pantalla de instalación.
- `short_name`: *"MiPWA"* — nombre corto para el icono del dispositivo.
- `start_url`: `./index.html` — URL de entrada al instalar.
- `display`: `standalone` — oculta la barra de navegación del navegador.
- `theme_color`: `#3b82f6` — color de la barra de sistema.
- `background_color`: `#0f172a` — color de fondo del splash screen.
- `icons`: 192 y 512 px con `purpose: "any maskable"`.

## Instrucciones de validación manual

1. Abre la carpeta en un navegador con un servidor local:
   ```bash
   python -m http.server 8000
   ```
   y visita `http://localhost:8000/ejercicio1/`.
2. Abre **Chrome DevTools** (F12) → pestaña **Application** → **Manifest**.
3. Verifica que las propiedades (`name`, `short_name`, `start_url`, `display`, colores) aparezcan correctamente.
4. En la sección **Icons**, Chrome muestra la previsualización del splash screen nativo.
5. Haz clic en **Install app** (o usa el botón de la barra de direcciones) para simular la instalación y observar el icono en pantalla completa.

## Notas

- El archivo incluye un botón de instalación (`#installBtn`) que se activa con el evento `beforeinstallprompt`.
- Los iconos deben ser PNG reales en las resoluciones indicadas; no se usan SVG.