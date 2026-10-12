# Portafolio de Ejercicios PWA

Progresión formativa de aplicaciones web progresivas (**PWA**), cubriendo desde la configuración del manifiesto hasta el manejo avanzado del estado offline.

## Estructura

Cada ejercicio vive en una carpeta independiente para facilitar su estudio, validación y despliegue por separado.

```
Portafolio/
├── README.md
├── ejercicio1/        # Web App Manifest
├── ejercicio2/        # App Shell + Splash Screen Nativa
├ ejercicio3/         # Registro y ciclo de vida del Service Worker
├── ejercicio4/        # Cache API + Estrategia Cache-First
└── ejercicio5/        # Interceptor de peticiones + Fallback offline
```

## Índice de ejercicios

| # | Ejercicio | Tema | Archivos clave |
|---|-----------|------|----------------|
| 1 | [Ejercicio 1](./ejercicio1/README.md) | Web App Manifest y metadatos de instalación | `index.html`, `manifest.json`, `icons/` |
| 2 | [Ejercicio 2](./ejercicio2/README.md) | Maquetado App Shell y Splash Screen nativa | `index.html`, `styles.css`, `app.js`, `sw.js`, `server.js` |
| 3 | [Ejercicio 3](./ejercicio3/README.md) | Registro y ciclo de vida del Service Worker | `index.html`, `app.js`, `sw.js`, `styles.css` |
| 4 | [Ejercicio 4](./ejercicio4/README.md) | Cache API y estrategia Cache-First | `index.html`, `app.js`, `sw.js`, `styles.css` |
| 5 | [Ejercicio 5](./ejercicio5/README.md) | Interceptor de peticiones y estado offline | `index.html`, `app.js`, `sw.js`, `offline.html`, `offline.js` |

## Cómo ejecutar

Cada carpeta es autónoma. Para probarla localmente, abre una terminal dentro de la carpeta del ejercicio y lanza:

```bash
python -m http.server 8000
```

Luego visita `http://localhost:8000` en Chrome (se requiere entorno seguro HTTP/HTTPS para que el Service Worker se registre).

## Validación

Las instrucciones de comprobación manual en Chrome DevTools (pestaña **Application** → **Service Workers**, **Cache Storage**, **Network → Offline**) se detallan en cada `README.md` y en las propias vistas de los ejercicios.