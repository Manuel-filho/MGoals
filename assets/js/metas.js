let goals = JSON.parse(localStorage.getItem('goals')) || [];

function goBack() {
    window.location.href = '/index.html';
}

function validateDates(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end;
}

function addGoal() {
    const title = document.getElementById('goalTitle').value.trim();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!title || !startDate || !endDate) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (!validateDates(startDate, endDate)) {
        alert('A data de fim deve ser posterior à data de início.');
        return;
    }

    const goal = {
        id: Date.now(),
        title,
        startDate,
        endDate,
        steps: []
    };
    goals.push(goal);
    localStorage.setItem('goals', JSON.stringify(goals));
    document.getElementById('goalTitle').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    renderGoals();
}

function deleteGoal(goalId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Erro: Usuário não encontrado.');
        return;
    }

    const password = prompt("Digite sua senha para confirmar a exclusão:");
    if (password === currentUser.password) {
        goals = goals.filter(goal => goal.id !== goalId);
        localStorage.setItem('goals', JSON.stringify(goals));
        renderGoals();
    } else {
        alert("Senha incorreta.");
    }
}

function addStep(goalId) {
    const stepInput = document.getElementById(`stepInput-${goalId}`);
    const stepTitle = stepInput.value.trim();
    if (stepTitle) {
        const goal = goals.find(g => g.id === goalId);
        goal.steps.push({ title: stepTitle, completed: false });
        stepInput.value = '';
        localStorage.setItem('goals', JSON.stringify(goals));
        renderGoals();
    }
}

function deleteStep(goalId, stepIndex) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Erro: Usuário não encontrado.');
        return;
    }

    const password = prompt("Digite sua senha para confirmar a exclusão:");
    if (password === currentUser.password) {
        const goal = goals.find(g => g.id === goalId);
        goal.steps.splice(stepIndex, 1);
        localStorage.setItem('goals', JSON.stringify(goals));
        renderGoals();
    } else {
        alert("Senha incorreta.");
    }
}

function toggleStep(goalId, stepIndex) {
    const goal = goals.find(g => g.id === goalId);
    goal.steps[stepIndex].completed = !goal.steps[stepIndex].completed;
    localStorage.setItem('goals', JSON.stringify(goals));
    renderGoals();
}

function updateProgress(goal) {
    if (!goal.steps.length) return 0;
    const completedSteps = goal.steps.filter(step => step.completed).length;
    return Math.round((completedSteps / goal.steps.length) * 100);
}

function toggleGoal(goalId) {
const content = document.querySelector(`#goal-content-${goalId}`);
const button = document.querySelector(`#toggle-btn-${goalId}`);
content.classList.toggle('collapsed');
button.classList.toggle('rotated');

// Salvar estado no localStorage
const collapsedStates = JSON.parse(localStorage.getItem('collapsedGoals') || '{}');
collapsedStates[goalId] = content.classList.contains('collapsed');
localStorage.setItem('collapsedGoals', JSON.stringify(collapsedStates));
}

function renderGoals() {
const goalsContainer = document.getElementById('goalsList');
goalsContainer.innerHTML = '';
const collapsedStates = JSON.parse(localStorage.getItem('collapsedGoals') || '{}');

goals.forEach(goal => {
    const progress = updateProgress(goal);
    const goalElement = document.createElement('div');
    goalElement.className = 'goal-card';
    goalElement.innerHTML = `
        <div class="goal-header">
            <div class="goal-title-section">
                <button class="toggle-btn ${collapsedStates[goal.id] ? 'rotated' : ''}" 
                        id="toggle-btn-${goal.id}" 
                        onclick="event.stopPropagation(); toggleGoal(${goal.id})">
                    <i class="fas fa-chevron-down"></i>
                </button>
                <h3>${goal.title}</h3>
                <span class="progress-preview">(${progress}%)</span>
            </div>
            <div class="goal-header-buttons">
                <button class="delete-btn" onclick="event.stopPropagation(); deleteGoal(${goal.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div id="goal-content-${goal.id}" 
             class="goal-content ${collapsedStates[goal.id] ? 'collapsed' : ''}">
             <a href="../paginas/progresso.html?goalId=${goal.id}" class="calendar-btn">
                <i class="fas fa-calendar"></i>
                Ver Calendário
            </a>
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%;"></div>
                </div>
                <p class="progress-text">${progress}% concluído</p>
            </div>
            <div class="steps-container">
                <div class="steps-list" data-goal-id="${goal.id}">
                    ${goal.steps.map((step, index) => `
                        <div class="step-item">
                            <div>
                                <input type="checkbox" ${step.completed ? 'checked' : ''} 
                                    onclick="toggleStep(${goal.id}, ${index})">
                                <label>${step.title}</label>
                            </div>
                            <button class="delete-btn" onclick="deleteStep(${goal.id}, ${index})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
                <div class="form-group">
                    <input type="text" id="stepInput-${goal.id}" placeholder="Nova etapa">
                    <button class="btn" onclick="addStep(${goal.id})">Adicionar Etapa</button>
                </div>
            </div>
        </div>
    `;
    goalsContainer.appendChild(goalElement);

    // Inicializar Sortable para a lista de etapas
    const stepsList = goalElement.querySelector(`.steps-list[data-goal-id="${goal.id}"]`);
    new Sortable(stepsList, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: function(evt) {
            const goal = goals.find(g => g.id === parseInt(evt.target.dataset.goalId));
            if (goal) {
                const step = goal.steps.splice(evt.oldIndex, 1)[0];
                goal.steps.splice(evt.newIndex, 0, step);
                localStorage.setItem('goals', JSON.stringify(goals));
            }
        }
    });
});
}

renderGoals();