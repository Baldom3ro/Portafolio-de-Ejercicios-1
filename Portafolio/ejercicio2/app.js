// Registro de Service Worker para habilitar PWA y Splash Screen Nativa
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Control de Splash Screen visible en escritorio
    const desktopSplash = document.getElementById('desktop-splash-screen');
    if (desktopSplash) {
      setTimeout(() => {
        desktopSplash.classList.add('fade-out');
      }, 1200);
    }

    navigator.serviceWorker
      .register('./sw.js')
      .then((registration) => {
        console.log('Service Worker registrado con éxito:', registration.scope);
        const statusBadge = document.getElementById('sw-status-badge');
        const statusLabel = document.getElementById('sw-status-label');
        if (statusBadge) {
          statusBadge.textContent = 'Activo';
          statusBadge.style.background = 'rgba(16, 185, 129, 0.2)';
          statusBadge.style.color = '#34d399';
        }
        if (statusLabel) {
          statusLabel.textContent = `Registrado en: ${registration.scope}`;
        }
      })
      .catch((error) => {
        console.error('Error al registrar Service Worker:', error);
        const statusBadge = document.getElementById('sw-status-badge');
        const statusLabel = document.getElementById('sw-status-label');
        if (statusBadge) {
          statusBadge.textContent = 'Error';
          statusBadge.style.background = 'rgba(239, 68, 68, 0.2)';
          statusBadge.style.color = '#f87171';
        }
        if (statusLabel) {
          statusLabel.textContent = 'Fallo en registro. Requiere servidor HTTP/HTTPS.';
        }
      });
  });
}

// Interceptación y gestión de instalación PWA
let deferredPrompt;
const btnInstall = document.getElementById('btn-install');

window.addEventListener('beforeinstallprompt', (e) => {
  // Previene el banner automático inmediato
  e.preventDefault();
  deferredPrompt = e;
  // Muestra el botón de instalación en el header
  if (btnInstall) {
    btnInstall.hidden = false;
  }
});

if (btnInstall) {
  btnInstall.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Resultado de instalación: ${outcome}`);
    deferredPrompt = null;
    btnInstall.hidden = true;
  });
}

window.addEventListener('appinstalled', () => {
  console.log('PWA instalada en sistema operativo con éxito.');
  if (btnInstall) btnInstall.hidden = true;
});

// Navegación responsiva (Mobile Drawer & Backdrop)
const navToggle = document.getElementById('nav-toggle');
const appNav = document.getElementById('app-nav');
const navBackdrop = document.getElementById('nav-backdrop');

function toggleNav() {
  const isOpen = appNav.classList.toggle('open');
  navBackdrop.classList.toggle('open', isOpen);
}

function closeNav() {
  appNav.classList.remove('open');
  navBackdrop.classList.remove('open');
}

if (navToggle) navToggle.addEventListener('click', toggleNav);
if (navBackdrop) navBackdrop.addEventListener('click', closeNav);

// Conmutación de Vistas del App Shell
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.content-view');

navItems.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const targetView = item.getAttribute('data-view');

    navItems.forEach((n) => n.classList.remove('active'));
    item.classList.add('active');

    views.forEach((v) => {
      if (v.id === `view-${targetView}`) {
        v.classList.add('active');
      } else {
        v.classList.remove('active');
      }
    });

    closeNav();
  });
});

// Botón de Vaciar Caché en Ajustes
const btnClearCache = document.getElementById('btn-clear-cache');
if (btnClearCache) {
  btnClearCache.addEventListener('click', async () => {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      alert('Caché de la aplicación vaciada correctamente.');
      window.location.reload();
    }
  });
}

// Simulador de animación de Splash Screen
const btnReplaySplash = document.getElementById('btn-replay-splash');
const simulatedSplash = document.getElementById('simulated-splash');

if (btnReplaySplash && simulatedSplash) {
  btnReplaySplash.addEventListener('click', () => {
    simulatedSplash.style.opacity = '0';
    setTimeout(() => {
      simulatedSplash.style.opacity = '1';
    }, 200);
  });
}
