// Verifica o parametro da URL
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function goBack() {
    window.location.href = '/paginas/metas.html';
}

const goalId = getUrlParam('goalId');
const goals = JSON.parse(localStorage.getItem('goals')) || [];
const currentGoal = goals.find(g => g.id === parseInt(goalId));

if (!currentGoal) {
    alert('Meta não encontrada');
    goBack();
}

// Configuração do calendário
const startDate = new Date(currentGoal.startDate);
const endDate = new Date(currentGoal.endDate);
const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Gerenciamento de progresso
let completedDays = JSON.parse(localStorage.getItem(`completedDays_${goalId}`)) || {};

function loadProgress() {
    document.getElementById('goalTitle').textContent = currentGoal.title;
    document.getElementById('dateRange').textContent = 
        `Período: ${formatDate(startDate)} a ${formatDate(endDate)}`;
    updateStepsProgress();
    updateTotalProgress();
}

function formatDate(date) {
    return date.toLocaleDateString('pt-BR');
}

function updateStepsProgress() {
    const completedSteps = currentGoal.steps.filter(s => s.completed).length;
    const totalSteps = currentGoal.steps.length;
    const stepsProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
    
    document.getElementById('stepsProgress').textContent = 
        `Etapas: ${completedSteps}/${totalSteps} (${stepsProgress}% concluído)`;
}

function updateTotalProgress() {
    const daysProgress = calculateDaysProgress();
    const stepsProgress = calculateStepsProgress();
    
    // Média ponderada: 60% dias, 40% etapas
    const totalProgress = Math.round((daysProgress * 0.6) + (stepsProgress * 0.4));
    
    document.getElementById('progressText').textContent = `${totalProgress}% Completo`;
    document.getElementById('progressFill').style.width = `${totalProgress}%`;
}

function calculateDaysProgress() {
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const completedCount = Object.values(completedDays).filter(Boolean).length;
    return Math.round((completedCount / totalDays) * 100);
}

function calculateStepsProgress() {
    if (!currentGoal.steps.length) return 0;
    const completedSteps = currentGoal.steps.filter(step => step.completed).length;
    return Math.round((completedSteps / currentGoal.steps.length) * 100);
}

// Manipulação do calendário
function saveProgress() {
    localStorage.setItem(`completedDays_${goalId}`, JSON.stringify(completedDays));
    updateTotalProgress();
}

function toggleDay(date) {
    const dateKey = formatDateKey(date);
    completedDays[dateKey] = !completedDays[dateKey];
    saveProgress();
    return completedDays[dateKey];
}

function formatDateKey(date) {
    return date.toISOString().split('T')[0];
}

function getDaysArray() {
    const days = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        days.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
}

function getMonthsData() {
    const days = getDaysArray();
    const monthsData = {};
    days.forEach(date => {
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        if (!monthsData[monthKey]) {
            monthsData[monthKey] = [];
        }
        monthsData[monthKey].push(date);
    });
    return Object.entries(monthsData).map(([key, dates]) => ({
        key,
        dates
    }));
}

function renderCalendar() {
    const container = document.querySelector('.months-container');
    const monthsData = getMonthsData();

    monthsData.forEach(({ dates }) => {
        const monthCard = document.createElement('div');
        monthCard.className = 'month-card';

        const monthTitle = document.createElement('div');
        monthTitle.className = 'month-title';
        monthTitle.textContent = `${months[dates[0].getMonth()]} ${dates[0].getFullYear()}`;

        const calendar = document.createElement('div');
        calendar.className = 'calendar';

        weekDays.forEach(day => {
            const weekday = document.createElement('div');
            weekday.className = 'weekday';
            weekday.textContent = day;
            calendar.appendChild(weekday);
        });

        for (let i = 0; i < dates[0].getDay(); i++) {
            const empty = document.createElement('div');
            empty.className = 'day empty';
            calendar.appendChild(empty);
        }

        dates.forEach(date => {
            const day = document.createElement('div');
            day.className = 'day';
            if (completedDays[formatDateKey(date)]) {
                day.classList.add('completed');
            }
            day.textContent = date.getDate();
            
            day.addEventListener('click', () => {
                const isCompleted = toggleDay(date);
                day.classList.toggle('completed', isCompleted);
            });

            calendar.appendChild(day);
        });

        monthCard.appendChild(monthTitle);
        monthCard.appendChild(calendar);
        container.appendChild(monthCard);
    });
}

// Inicialização
loadProgress();
renderCalendar();