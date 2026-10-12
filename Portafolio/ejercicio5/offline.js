const retryBtn = document.getElementById('retry-btn');
const retryStatus = document.getElementById('retry-status');

function updateOfflineStatus() {
  if (!retryStatus) return;
  if (navigator.onLine) {
    retryStatus.innerHTML = '<span class="badge-online">🟢 Conexión restablecida. Recargando la página...</span>';
    setTimeout(() => {
      window.location.reload();
    }, 800);
  } else {
    retryStatus.innerHTML = '<span class="badge-offline">🔴 Sin conexión. Inténtalo de nuevo cuando restablezcas internet.</span>';
  }
}

if (retryBtn) {
  retryBtn.addEventListener('click', () => {
    updateOfflineStatus();
    if (navigator.onLine) {
      window.location.reload();
    }
  });
}

window.addEventListener('online', updateOfflineStatus);
window.addEventListener('offline', updateOfflineStatus);

updateOfflineStatus();