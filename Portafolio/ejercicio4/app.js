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

// Registro y ciclo de vida del Service Worker (Ejercicio 4)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js');
      console.log('Service Worker (Ejercicio 4) registrado correctamente:', registration.scope);
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

// Vista: Instalación (Cache API)
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
      regInfo.textContent = `Worker registrado. Scope: ${reg.scope} | Caché activa: ejercicio4-cache-v1`;
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
      lifecycleInfo.textContent = 'Estado actual: Instalando y precargando Cache API.';
    } else if (reg.waiting) {
      document.getElementById('step-waiting')?.classList.add('active-step');
      lifecycleInfo.textContent = 'Estado actual: En espera (waiting).';
    } else if (reg.active) {
      document.getElementById('step-active')?.classList.add('active-step');
      lifecycleInfo.textContent = 'Estado actual: Activo con Cache-First habilitado.';
    }
  });
}

// Vista: Offline y Cache Storage
const networkStatus = document.getElementById('network-status');
const testCacheBtn = document.getElementById('test-cache-btn');
const testFetchResult = document.getElementById('test-fetch-result');

function updateNetworkBadge() {
  if (!networkStatus) return;
  if (navigator.onLine) {
    networkStatus.innerHTML = '<span class="badge-online">🟢 EN LÍNEA (Conectado a internet)</span>';
  } else {
    networkStatus.innerHTML = '<span class="badge-offline">🔴 SIN CONEXIÓN (Estrategia Cache-First activa)</span>';
  }
}

updateNetworkBadge();
window.addEventListener('online', updateNetworkBadge);
window.addEventListener('offline', updateNetworkBadge);

if (testCacheBtn && testFetchResult) {
  testCacheBtn.addEventListener('click', async () => {
    testFetchResult.textContent = 'Consultando manifest.json mediante Cache-First...';
    try {
      const response = await fetch('./manifest.json');
      if (response.ok) {
        const data = await response.json();
        testFetchResult.textContent = `¡Éxito! Recurso obtenido de caché (Estrategia Cache-First). Nombre de app: ${data.name}`;
      } else {
        testFetchResult.textContent = `Error HTTP: ${response.status}`;
      }
    } catch (error) {
      testFetchResult.textContent = `Fallo: ${error.message}`;
    }
  });
}
