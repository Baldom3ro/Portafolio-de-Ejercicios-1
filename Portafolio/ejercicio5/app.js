const statusLabel = document.getElementById('sw-status-label');
const swState = document.getElementById('sw-state');
const reloadBtn = document.getElementById('reload-btn');
const updateBtn = document.getElementById('update-btn');

function setStatus(message, active = false) {
  if (statusLabel) {
    statusLabel.textContent = message;
  }
  const dot = document.getElementById('status-dot');
  if (dot) {
    dot.style.background = active ? '#22c55e' : '#f43f5e';
    dot.style.boxShadow = active
      ? '0 0 12px rgba(34,197,94,0.8)'
      : '0 0 12px rgba(244,63,94,0.8)';
  }
  if (swState) {
    swState.textContent = active ? 'Registrado y activo' : 'No registrado';
  }
}

// Navegación entre vistas
const navButtons = document.querySelectorAll('.nav-item');
const viewSections = document.querySelectorAll('.view-section');

navButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-view');
    navButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    viewSections.forEach((section) => {
      section.hidden = section.id !== targetId;
    });
  });
});

// Registro del Service Worker (Ejercicio 5)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js');
      console.log('Service Worker (Ejercicio 5) registrado correctamente:', registration.scope);
      setStatus(`Registrado en ${registration.scope}`, true);
    } catch (error) {
      console.error('Error al registrar el Service Worker:', error);
      setStatus('Fallo en el registro. Necesita acceso HTTP/HTTPS.', false);
    }
  });

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    setStatus('Service Worker actualizado y controlando la app.', true);
  });
}

// Botones de acción en Inicio
if (reloadBtn) {
  reloadBtn.addEventListener('click', () => {
    window.location.reload();
  });
}

if (updateBtn) {
  updateBtn.addEventListener('click', async () => {
    if (!('serviceWorker' in navigator)) return;

    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      setStatus('Se ha intentado actualizar el Service Worker.', true);
    }
  });
}

// Vista: Offline y validación de fallback
const networkStatus = document.getElementById('network-status');
const testOfflineBtn = document.getElementById('test-offline-btn');
const testOfflineResult = document.getElementById('test-offline-result');

function updateNetworkBadge() {
  if (!networkStatus) return;
  if (navigator.onLine) {
    networkStatus.innerHTML = '<span class="badge-online">🟢 EN LÍNEA (Conectado a internet)</span>';
  } else {
    networkStatus.innerHTML = '<span class="badge-offline">🔴 SIN CONEXIÓN (Fallback offline activo)</span>';
  }
}

updateNetworkBadge();
window.addEventListener('online', updateNetworkBadge);
window.addEventListener('offline', updateNetworkBadge);

if (testOfflineBtn && testOfflineResult) {
  testOfflineBtn.addEventListener('click', async () => {
    testOfflineResult.textContent = 'Enviando petición a un recurso no cacheado...';
    try {
      // Petición a un recurso que no está precargado; si la red falla debe servir offline.html
      const response = await fetch('./offline.html');
      if (response.ok) {
        testOfflineResult.textContent = '¡Éxito! Recurso obtenido (offline.html está en caché).';
      } else {
        testOfflineResult.textContent = `Respuesta HTTP: ${response.status}`;
      }
    } catch (error) {
      testOfflineResult.textContent = `Petición fallida (modo offline): ${error.message}. El SW serviría offline.html.`;
    }
  });
}