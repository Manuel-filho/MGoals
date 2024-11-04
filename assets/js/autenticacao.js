    let isLogin = true;
        let deferredPrompt = null;

        // Elementos do DOM
        const authForm = document.getElementById('authForm');
        const nameGroup = document.getElementById('nameGroup');
        const toggleBtn = document.getElementById('toggleBtn');
        const submitBtn = document.getElementById('submitBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const messageDiv = document.getElementById('message');
        const userInfo = document.getElementById('userInfo');
        const passwordInput = document.getElementById('password');
        const togglePassword = document.querySelector('.toggle-password');

        // Mudar visibilidade da senha
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Alterna o ícone
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });

        // Funções auxiliares
        function showMessage(text, type) {
            const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
            messageDiv.innerHTML = `<i class="fas ${icon}"></i><span>${text}</span>`;
            messageDiv.className = `message ${type}`;
            messageDiv.style.display = 'block';
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3000);
        }

        function updateUserInfo(user) {
            if (user) {
                userInfo.querySelector('span').textContent = `Olá, ${user.name || user.email}!`;
                userInfo.style.display = 'block';
                authForm.style.display = 'none';
                toggleBtn.style.display = 'none';
                logoutBtn.style.display = 'block';
            } else {
                userInfo.style.display = 'none';
                authForm.style.display = 'block';
                toggleBtn.style.display = 'block';
                logoutBtn.style.display = 'none';
            }
        }

        // Verificar se o usuário está logado
        function checkLoggedUser() {
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                window.location.href = '/index.html';
            }
        }

        // Mudar entre login/cadastro
        toggleBtn.addEventListener('click', () => {
            isLogin = !isLogin;
            document.querySelector('.title').textContent = isLogin ? 'Login' : 'Cadastro';
            nameGroup.style.display = isLogin ? 'none' : 'block';
            submitBtn.innerHTML = isLogin 
                ? '<i class="fas fa-sign-in-alt"></i><span>Entrar</span>' 
                : '<i class="fas fa-user-plus"></i><span>Cadastrar</span>';
            toggleBtn.innerHTML = isLogin 
                ? '<i class="fas fa-user-plus"></i> Não tem uma conta? Cadastre-se' 
                : '<i class="fas fa-sign-in-alt"></i> Já tem uma conta? Faça login';
            messageDiv.style.display = 'none';
        });

        // Submissão do formulário
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (isLogin) {
                // Login
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    showMessage('Login realizado com sucesso!', 'success');
                    updateUserInfo(user);
                    setTimeout(() => {
                        window.location.href = '/index.html';
                    }, 1000);
                } else {
                    showMessage('E-mail ou senha incorretos', 'error');
                }
            } else {
                // Cadastro
                const name = document.getElementById('name').value;
                if (!name) {
                    showMessage('Por favor, preencha o nome', 'error');
                    return;
                }

                const users = JSON.parse(localStorage.getItem('users') || '[]');
                
                if (users.some(u => u.email === email)) {
                    showMessage('Este e-mail já está cadastrado', 'error');
                    return;
                }

                const newUser = { name, email, password };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                showMessage('Cadastro realizado com sucesso!', 'success');
                
                setTimeout(() => {
                    isLogin = true;
                    document.querySelector('.title').textContent = 'Login';
                    nameGroup.style.display = 'none';
                    submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i><span>Entrar</span>';
                    toggleBtn.innerHTML = '<i class="fas fa-user-plus"></i> Não tem uma conta? Cadastre-se';
                    authForm.reset();
                }, 1500);
            }
        });

        // Sair
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            updateUserInfo(null);
            authForm.reset();
            window.location.href = '/paginas/autenticacap.html';
        });

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

        // Inicializar
        checkLoggedUser();