// Nome do cache actual, incrementado para actualizações
const CACHE_NAME = 'mgoals-cache-v1';
const DYNAMIC_CACHE_NAME = 'mgoals-dynamic-cache-v1';

// Arquivos para cache (HTML, CSS, JS)
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/paginas/autenticacao.html',
    '/paginas/metas.html',
    '/paginas/progresso.html',
    '/assets/css/autenticacao.css',
    '/assets/css/index.css',
    '/assets/css/metas.css',
    '/assets/css/principal.css',
    '/assets/css/progresso.css',
    '/assets/js/autenticacao.js',
    '/assets/js/index.js',
    '/assets/js/metas.js',
    '/assets/js/principal.js',
    '/assets/js/progresso.js'
];

// Instala o Service Worker e faz o cache dos arquivos estáticos
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Iniciando instalação');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Cache aberto:', CACHE_NAME);
                // Tenta cachear cada arquivo individualmente
                return Promise.all(
                    FILES_TO_CACHE.map(url => {
                        return fetch(url)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`Falha ao buscar ${url}: ${response.status} ${response.statusText}`);
                                }
                                return cache.put(url, response);
                            })
                            .then(() => {
                                console.log('[Service Worker] Cacheado com sucesso:', url);
                            })
                            .catch(error => {
                                console.error('[Service Worker] Erro ao cachear:', url, error.message);
                                // Não interrompe o processo se um arquivo falhar
                                return Promise.resolve();
                            });
                    })
                )
                .then(() => {
                    console.log('[Service Worker] Processo de cache concluído');
                });
            })
            .catch((error) => {
                console.error('[Service Worker] Erro durante a instalação:', error);
                throw error;
            })
    );
    self.skipWaiting();
});

// Ativa o Service Worker e limpa o cache antigo
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Ativando');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
                            console.log('[Service Worker] Removendo cache antigo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[Service Worker] Ativação concluída');
            })
            .catch((error) => {
                console.error('[Service Worker] Erro durante a ativação:', error);
                throw error;
            })
    );
    self.clients.claim();
});

// Intercepta requisições e responde com cache
self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Interceptando fetch para:', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    console.log('[Service Worker] Retornando do cache:', event.request.url);
                    return response;
                }
                console.log('[Service Worker] Buscando recurso:', event.request.url);
                return fetch(event.request)
                    .then((fetchResponse) => {
                        if (!fetchResponse || fetchResponse.status !== 200) {
                            console.log('[Service Worker] Resposta inválida:', fetchResponse?.status);
                            return fetchResponse;
                        }
                        return caches.open(DYNAMIC_CACHE_NAME)
                            .then((cache) => {
                                console.log('[Service Worker] Cacheando novo recurso:', event.request.url);
                                cache.put(event.request, fetchResponse.clone());
                                return fetchResponse;
                            });
                    })
                    .catch((error) => {
                        console.error('[Service Worker] Erro ao buscar:', error);
                        if (event.request.mode === 'navigate') {
                            console.log('[Service Worker] Retornando página offline');
                            return caches.match('/index.html');
                        }
                        return new Response('Recurso não disponível offline', {
                            status: 404,
                            statusText: 'Not Found'
                        });
                    });
            })
            .catch((error) => {
                console.error('[Service Worker] Erro ao verificar cache:', error);
                throw error;
            })
    );
});

// Escuta por atualizações do Service Worker
self.addEventListener('message', (event) => {
    console.log('[Service Worker] Mensagem recebida:', event.data);
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});

// Notifica clientes sobre atualização
self.addEventListener('controllerchange', () => {
    console.log('[Service Worker] Controller changed');
    clients.matchAll()
        .then((clients) => {
            clients.forEach((client) => {
                console.log('[Service Worker] Notificando cliente sobre atualização');
                client.postMessage('Service worker atualizado! Por favor, atualize a página.');
            });
        })
        .catch((error) => {
            console.error('[Service Worker] Erro ao notificar clientes:', error);
        });
});