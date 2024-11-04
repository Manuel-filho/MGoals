// Mudar Menu
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.toggle('open');
    content.classList.toggle('full-width');
    overlay.classList.toggle('active');
}

// Ir para a página de metas
function goToGoals() {
    window.location.href = 'paginas/metas.html';
}

// Marcar menu activo
document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('.sidebar a').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Terminar Sessão
document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'paginas/autenticacao.html';
});
