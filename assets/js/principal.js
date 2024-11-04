// Verificada A autenticaçao do Usuário
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'paginas/autenticacao.html';
    }
}
checkAuth() 

console.log('[App] Verificando cache e service worker...');

// Registra o Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
navigator.serviceWorker.register('/config/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registrado com sucesso:', registration);
            })
            .catch((error) => {
                console.error('Falha ao registrar o Service Worker:', error);
            });
    });
}

// Função  para testar o status do Serivce Worker
function testServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then(registration => {
                console.log('[App] Service Worker está activo');
                
                // Verifica o cache
                caches.keys().then(cacheNames => {
                    console.log('[App] Caches disponíveis:', cacheNames);
                });
                
                // Verifica o estado
                if (registration.active) {
                    console.log('[App] Estado: Activo');
                } else if (registration.installing) {
                    console.log('[App] Estado: Instalando');
                } else if (registration.waiting) {
                    console.log('[App] Estado: Aguardando');
                }
            })
            .catch(error => {
                console.error('[App] Erro ao verificar Service Worker:', error);
            });
    }
}

// Chama a função após o registro
testServiceWorker();

// Função para testar actualizações
function checkForUpdates() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then(registration => {
                registration.update();
                console.log('[App] Verificando por atualizações...');
            });
    }
}

setInterval(checkForUpdates, 1000 * 60 * 60); 

// Função para monitorar o estado da conexão
function checkConnectivity() {
    const updateOnlineStatus = () => {
        const condition = navigator.onLine ? 'online' : 'offline';
        console.log(`[App] Aplicação está ${condition}`);
        if (!navigator.onLine) {
            caches.match('/index.html')
                .then(response => {
                    if (response) {
                        console.log('[App] Cache está funcionando');
                    } else {
                        console.log('[App] Cache não encontrado');
                    }
                });
        }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
}

checkConnectivity();

// Instalar PWA 
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.querySelector('.install-prompt').style.display = 'block';
});

document.getElementById('installButton').addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            document.querySelector('.install-prompt').style.display = 'none';
        }
        deferredPrompt = null;
    }
});





