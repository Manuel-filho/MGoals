function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'paginas/autenticacao.html';
    }
}
checkAuth() 

console.log('[App] Verificando cache e service worker...');

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

//navigator.serviceWorker.addEventListener('message', (event) => {
//    if (event.data === 'Service worker actualizado! Por favor, actualize a página.') {
//        alert(event.data);
//    }
//});


// Função  para testar o status
function testServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then(registration => {
                console.log('[App] Service Worker está ativo');
                
                // Verifica o cache
                caches.keys().then(cacheNames => {
                    console.log('[App] Caches disponíveis:', cacheNames);
                });
                
                // Verifica o estado
                if (registration.active) {
                    console.log('[App] Estado: Ativo');
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

// Função para testar atualizações
function checkForUpdates() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then(registration => {
                registration.update();
                console.log('[App] Verificando por atualizações...');
            });
    }
}

// Chamar periodicamente
setInterval(checkForUpdates, 1000 * 60 * 60); // A cada hora

// Adicione esta função para monitorar o estado da conexão
function checkConnectivity() {
    const updateOnlineStatus = () => {
        const condition = navigator.onLine ? 'online' : 'offline';
        console.log(`[App] Aplicação está ${condition}`);
        
        // Teste o cache se estiver offline
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
let deferredPrompt; // Declaração da variável para armazenar o evento

// Detecta quando o navegador dispara o evento `beforeinstallprompt`
window.addEventListener('beforeinstallprompt', (event) => {
  // Impede que o prompt seja exibido automaticamente
  event.preventDefault();
  // Armazena o evento para uso posterior
  deferredPrompt = event;
  
  // Exibe o botão de instalação para o usuário
  document.getElementById('installButton').style.display = 'block';
  console.log("O evento 'beforeinstallprompt' foi acionado e armazenado.");
});

// Configura o clique no botão de instalação
document.getElementById('installButton').addEventListener('click', async () => {
  if (deferredPrompt) {
    // Exibe o prompt de instalação usando o evento armazenado
    deferredPrompt.prompt();
    
    // Espera pela resposta do usuário ao prompt
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      console.log('Usuário aceitou o prompt de instalação');
    } else {
      console.log('Usuário recusou o prompt de instalação');
    }
    
    // Reseta `deferredPrompt` para `null` para evitar reutilização
    deferredPrompt = null;
  }
});





