const statusLabel = document.getElementById('sw-status-label');
const swState = document.getElementById('sw-state');
const reloadBtn = document.getElementById('reload-btn');
const updateBtn = document.getElementById('update-btn');

function setStatus(message, active = false) {
  if (statusLabel) {
    statusLabel.textContent = message;
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

// Registro y ciclo de vida del Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js');
      console.log('Service Worker registrado correctamente:', registration.scope);
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

// Vista: Instalación
const checkRegBtn = document.getElementById('check-reg-btn');
const regInfo = document.getElementById('reg-info');

if (checkRegBtn && regInfo) {
  checkRegBtn.addEventListener('click', async () => {
    if (!('serviceWorker' in navigator)) {
      regInfo.textContent = 'Service Worker no soportado por este navegador.';
      return;
    }
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg) {
      regInfo.textContent = `Worker registrado. Scope: ${reg.scope} | Estado activo: ${reg.active ? 'Sí' : 'No'}`;
    } else {
      regInfo.textContent = 'Ningún Service Worker registrado aún.';
    }
  });
}

// Vista: Ciclo de vida
const inspectLifecycleBtn = document.getElementById('inspect-lifecycle-btn');
const lifecycleInfo = document.getElementById('lifecycle-info');

if (inspectLifecycleBtn && lifecycleInfo) {
  inspectLifecycleBtn.addEventListener('click', async () => {
    if (!('serviceWorker' in navigator)) {
      lifecycleInfo.textContent = 'Service Worker no soportado.';
      return;
    }

    const reg = await navigator.serviceWorker.getRegistration();
    document.querySelectorAll('.step-box').forEach((box) => box.classList.remove('active-step'));

    if (!reg) {
      lifecycleInfo.textContent = 'No hay Service Worker registrado actualmente.';
      return;
    }

    if (reg.installing) {
      document.getElementById('step-installing')?.classList.add('active-step');
      lifecycleInfo.textContent = 'Estado actual: Instalando (installing).';
    } else if (reg.waiting) {
      document.getElementById('step-waiting')?.classList.add('active-step');
      lifecycleInfo.textContent = 'Estado actual: En espera (waiting).';
    } else if (reg.active) {
      document.getElementById('step-active')?.classList.add('active-step');
      lifecycleInfo.textContent = 'Estado actual: Activo y en control (active).';
    }
  });
}

// Vista: Offline
const networkStatus = document.getElementById('network-status');
const testCacheBtn = document.getElementById('test-cache-btn');
const testFetchResult = document.getElementById('test-fetch-result');

function updateNetworkBadge() {
  if (!networkStatus) return;
  if (navigator.onLine) {
    networkStatus.innerHTML = '<span class="badge-online">🟢 EN LÍNEA (Conectado a internet)</span>';
  } else {
    networkStatus.innerHTML = '<span class="badge-offline">🔴 SIN CONEXIÓN (Modo offline activo)</span>';
  }
}

updateNetworkBadge();
window.addEventListener('online', updateNetworkBadge);
window.addEventListener('offline', updateNetworkBadge);

if (testCacheBtn && testFetchResult) {
  testCacheBtn.addEventListener('click', async () => {
    testFetchResult.textContent = 'Consultando recurso manifest.json...';
    try {
      const response = await fetch('./manifest.json');
      if (response.ok) {
        testFetchResult.textContent = `Petición exitosa (${response.status} OK). Recurso entregado por caché o red.`;
      } else {
        testFetchResult.textContent = `Error HTTP: ${response.status}`;
      }
    } catch (error) {
      testFetchResult.textContent = `Fallo de conexión: ${error.message}`;
    }
  });
}

