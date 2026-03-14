// Глобальное состояние
let state = {
    schedule: {},
    editMode: true,
    draggedElement: null,
    currentDay: null,
    currentTime: null,
    editingId: null,
    isDraft: false,
    teachers: [],
    editingTeacherId: null,
    subjects: [],
    editingSubjectId: null,
    currentUser: null, // "admin" (Андрей) или "user" (Никита)
    sleepData: {}
};

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const START_HOUR = 7;
const END_HOUR = 21;

// Цвета предметов
const SUBJECT_COLORS = {
    'Английский': { bg: '#ffeaa7', text: '#d35400' },
    'Математика': { bg: '#fab1a0', text: '#c0392b' },
    'Каллиграфия': { bg: '#e1b12c', text: '#ffffff' },
    'Логопедия': { bg: '#00b894', text: '#ffffff' },
    'Речь': { bg: '#55efc4', text: '#2d3436' },
    'Русский': { bg: '#74b9ff', text: '#ffffff' },
    'Скорочтение': { bg: '#0984e3', text: '#ffffff' },
    'Дефектолог': { bg: '#6c5ce7', text: '#ffffff' },
    'Баскетбол': { bg: '#d63031', text: '#ffffff' },
    'Волейбол': { bg: '#e84393', text: '#ffffff' },
    'Бассейн': { bg: '#81ecec', text: '#2d3436' },
    'Айкидо': { bg: '#00cec9', text: '#ffffff' },
    'Шахматы': { bg: '#b2bec3', text: '#2d3436' },
    'Барабаны': { bg: '#fdcb6e', text: '#2d3436' },
    'Массаж': { bg: '#a29bfe', text: '#ffffff' }
};

const DEFAULT_COLOR = { bg: '#dfe6e9', text: '#2d3436' };

// Платформы
const PLATFORMS = {
    'teams': { icon: '🟦', name: 'Teams' },
    'zoom': { icon: '📹', name: 'Zoom' },
    'telegram': { icon: '✈️', name: 'Telegram' },
    'skype': { icon: '💬', name: 'Skype' },
    'website': { icon: '🌐', name: 'Сайт' },
    'offline': { icon: '🚶', name: 'Очно' }
};

// =========================================
// АВТОРИЗАЦИЯ
// =========================================
function initAuth() {
    const savedUser = localStorage.getItem('schedule_user');
    if (savedUser) {
        state.currentUser = savedUser;
        showApp();
    } else {
        showLogin();
    }

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        const err = document.getElementById('loginError');

        if (!user) return;

        // Пароль 12345678 для обоих (простейшая проверка через base64: MTIzNDU2Nzg=)
        if (btoa(pass) === 'MTIzNDU2Nzg=') {
            state.currentUser = user;
            localStorage.setItem('schedule_user', user);
            showApp();
        } else {
            err.style.display = 'block';
            setTimeout(() => err.style.display = 'none', 3000);
        }
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('schedule_user');
        state.currentUser = null;
        location.reload();
    });
}

function showLogin() {
    document.getElementById('loginOverlay').classList.add('active');
    document.getElementById('app').style.display = 'none';
}

function showApp() {
    document.getElementById('loginOverlay').classList.remove('active');
    document.getElementById('app').style.display = 'flex';
    
    // Инициализация темы
    initTheme();
    // Применение ролей
    applyRoles();
    
    // Запуск приложения
    loadState();
    loadSleepData();
    initGrid();
    setupEventListeners();
    renderSchedule();
    renderSubjectsList();
    renderTeachersList();
}

function applyRoles() {
    const badge = document.getElementById('currentUserDisplay');
    
    if (state.currentUser === 'admin') {
        badge.textContent = '👤 Андрей (Админ)';
        // Админ, все доступы открыты - восстанавливаем сохраненный editMode (если есть логика) или включаем по умолчанию
        state.editMode = document.getElementById('modeToggle').checked;
    } else {
        badge.textContent = '👁 Никита (Зритель)';
        // Пользователь Никита - только просмотр
        state.editMode = false;
        
        // Скрываем элементы управления редактированием
        document.getElementById('editModeToggleGroup').style.display = 'none';
        document.getElementById('manageTeachersBtn').style.display = 'none';
        document.getElementById('logSleepBtn').style.display = 'none';
        
        // Применяем CSS класс view-mode на body
        document.body.classList.add('view-mode');
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('schedule_theme') || 'dark';
    if (savedTheme === 'light') {
        document.documentElement.classList.add('theme-light');
    }
    
    const themeBtn = document.getElementById('themeToggleBtn');
    if(themeBtn) {
        themeBtn.textContent = savedTheme === 'light' ? '🌜' : '🌞';
        themeBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('theme-light');
            const isLight = document.documentElement.classList.contains('theme-light');
            localStorage.setItem('schedule_theme', isLight ? 'light' : 'dark');
            themeBtn.textContent = isLight ? '🌜' : '🌞';
        });
    }
}

// =========================================
// ОСНОВНАЯ ЛОГИКА
// =========================================
function initGrid() {
    const grid = document.getElementById('scheduleGrid');
    grid.innerHTML = '';
    
    // Header
    grid.style.gridTemplateColumns = `60px repeat(${DAYS.length}, 1fr)`; // Компактнее первой колонке
    grid.appendChild(createCell('grid-header', ''));
    DAYS.forEach(day => grid.appendChild(createCell('grid-header day-name', day)));
    
    // Cells
    for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
        const timeStr = `${hour.toString().padStart(2, '0')}:00`;
        grid.appendChild(createCell('time-label', timeStr));
        
        DAYS.forEach(day => {
            const cell = createCell('grid-cell', '');
            cell.dataset.day = day;
            cell.dataset.time = timeStr;
            grid.appendChild(cell);
        });
    }

    // Summary row
    grid.appendChild(createCell('summary-cell summary-label', 'Итого'));
    DAYS.forEach(day => {
        const cell = createCell('summary-cell', '');
        cell.id = `summary-${day}`;
        grid.appendChild(cell);
    });
}

function createCell(className, content) {
    const div = document.createElement('div');
    div.className = className;
    if (content) div.innerHTML = content;
    return div;
}

// =========================================
// TEACHERS
// =========================================
function getTeacherById(id) {
    return state.teachers.find(t => t.id === id);
}

// =========================================
// RENDER SCHEDULE
// =========================================
function renderSchedule() {
    document.querySelectorAll('.grid-cell').forEach(cell => cell.innerHTML = '');
    let analytics = {}; // { subject: min }
    let dailyStats = {}; // { day: { lessons: 0, subjects: new Set(), duration: 0 } }
    
    DAYS.forEach(d => dailyStats[d] = { lessons: 0, subjects: new Set(), duration: 0 });

    Object.values(state.schedule).forEach(item => {
        const cell = document.querySelector(`.grid-cell[data-day="${item.day}"][data-time="${item.time}"]`);
        if (!cell) return;

        // Нормализация старых данных: Агапе/Логопед -> Логопедия, Калиграф -> Каллиграфия
        let normSubject = item.subject;
        if (normSubject.includes('Агапе') || normSubject === 'Логопед') normSubject = 'Логопедия';
        if (normSubject === 'Калиграф' || normSubject === 'Калиграфия') normSubject = 'Каллиграфия';

        // Update analytics
        if (!analytics[normSubject]) analytics[normSubject] = { min: 0, count: 0 };
        analytics[normSubject].min += Number(item.duration);
        analytics[normSubject].count += 1;

        // Daily stats
        dailyStats[item.day].lessons += 1;
        dailyStats[item.day].subjects.add(normSubject);
        dailyStats[item.day].duration += Number(item.duration);

        const tInfo = getTeacherById(item.teacherId);
        const tNameText = tInfo ? tInfo.name : item.teacherName || 'Не указан';
        const tPlatform = tInfo && tInfo.platform && PLATFORMS[tInfo.platform] 
            ? `<a href="${tInfo.platformLink || '#'}" target="_blank" class="platform-badge" title="${PLATFORMS[tInfo.platform].name}">${PLATFORMS[tInfo.platform].icon} ${PLATFORMS[tInfo.platform].name}</a>` 
            : '';

        const subjObj = state.subjects.find(s => s.name === normSubject);
        const subjColor = subjObj ? subjObj.color : (SUBJECT_COLORS[normSubject] ? SUBJECT_COLORS[normSubject].bg : DEFAULT_COLOR.bg);

        const block = document.createElement('div');
        block.style.setProperty('--subject-color', subjColor);
        block.draggable = state.editMode;
        block.dataset.id = item.id;
        
        let variantClass = 'variant-default';
        const lowerName = normSubject.toLowerCase();
        if (lowerName.includes('математика')) variantClass = 'variant-1';
        else if (lowerName.includes('русск')) variantClass = 'variant-2';
        else if (lowerName.includes('логопед') || lowerName.includes('агапе')) variantClass = 'variant-3';
        else if (lowerName.includes('английск')) variantClass = 'variant-4';
        
        block.className = `schedule-block ${variantClass}`;
        
        let actionsHtml = '';
        if (state.editMode) {
            actionsHtml = `
                <div class="block-actions" style="color: #333;">
                    <button class="action-icon" onclick="editItem('${item.id}', event)" title="Редактировать">📝</button>
                    <button class="action-icon delete-icon" onclick="deleteItem('${item.id}', event)" title="Удалить">🗑</button>
                </div>
            `;
        }

        let topHtml = '';
        if (variantClass === 'variant-1') {
            topHtml = `
                <div class="block-subject-wrapper v1-top">
                    <div class="block-subject">${normSubject}</div>
                    <div class="block-subject-line" style="background-color: ${subjColor};"></div>
                </div>
            `;
        } else if (variantClass === 'variant-2') {
            topHtml = `
                <div class="block-subject-wrapper v2-top" style="background-color: ${subjColor};">
                    <div class="block-subject" style="color: #fff;">${normSubject}</div>
                </div>
            `;
        } else if (variantClass === 'variant-3') {
            topHtml = `
                <div class="block-subject-wrapper v3-top">
                    <div class="block-subject" style="color: ${subjColor}; font-weight: 700;">${normSubject}</div>
                    <div class="block-subject-line" style="background-color: ${subjColor};"></div>
                </div>
            `;
        } else if (variantClass === 'variant-4') {
            topHtml = `
                <div class="block-subject-wrapper v4-top">
                    <div class="block-subject-bar" style="background-color: ${subjColor};"></div>
                    <div class="block-subject">${normSubject}</div>
                </div>
            `;
        } else {
            topHtml = `
                <div class="block-subject-wrapper">
                    <div class="block-subject-bar" style="background-color: ${subjColor};"></div>
                    <div class="block-subject">${normSubject}</div>
                </div>
            `;
        }

        block.innerHTML = `
            ${actionsHtml}
            ${topHtml}
            <div class="block-details">
                <div class="block-teacher">${tNameText}</div>
                <div class="block-meta">
                    <span class="block-duration">${item.duration} мин</span>
                    ${tPlatform}
                </div>
            </div>
        `;

        if (state.editMode) {
            block.addEventListener('dragstart', handleDragStart);
            block.addEventListener('dragend', handleDragEnd);
        }
        
        cell.appendChild(block);
    });

    renderDailySummary(dailyStats);
    updateAnalytics(analytics);
}

function renderDailySummary(stats) {
    DAYS.forEach(day => {
        const cell = document.getElementById(`summary-${day}`);
        const data = stats[day];
        if (data.lessons === 0) {
            cell.innerHTML = '<span style="color:#aaa;font-size:12px;">Выходной</span>';
        } else {
            cell.innerHTML = `
                <div class="summary-row">📚 ${data.lessons} зан.</div>
                <div class="summary-row">🎯 ${data.subjects.size} предм.</div>
                <div class="summary-row">⏱ ${(data.duration / 60).toFixed(1)} ч</div>
            `;
        }
    });
}

function updateAnalytics(analytics) {
    let totalMin = Object.values(analytics).reduce((sum, s) => sum + s.min, 0);
    const totalHours = (totalMin / 60).toFixed(1);
    document.getElementById('studyTimeText').textContent = `${totalHours} ч`;

    let totalSleepMins = 0;
    Object.values(state.sleepData).forEach(m => totalSleepMins += Number(m));
    const totalSleepHours = (totalSleepMins / 60).toFixed(1);
    
    // Свободное время = 7 дней * 24 часа = 168 ч - Учеба - Сон
    // или считаем от активного времени
    let freeHours = (168 - totalHours - totalSleepHours).toFixed(1);
    if(freeHours < 0) freeHours = 0;
    document.getElementById('restTimeText').textContent = `${freeHours} ч`;

    const subjectBreakdownArea = document.getElementById('subjectBreakdownArea');
    subjectBreakdownArea.innerHTML = '';
    
    Object.entries(analytics).sort((a,b) => b[1].min - a[1].min).forEach(([name, data]) => {
        const sc = SUBJECT_COLORS[name] || DEFAULT_COLOR;
        const card = document.createElement('div');
        card.className = 'subject-card';
        card.style.borderLeftColor = sc.bg;
        // background white, border left color matches subject
        card.innerHTML = `
            <span class="subject-name" style="color:${sc.bg}">${name}</span>
            <span class="subject-hours">${(data.min / 60).toFixed(1)} ч (${data.min} м, ${data.count} з.)</span>
        `;
        subjectBreakdownArea.appendChild(card);
    });
}

// =========================================
// Drag and Drop (Только Админ)
// =========================================
function handleDragStart(e) {
    if (!state.editMode) return;
    state.draggedElement = e.target;
    e.target.style.opacity = '0.5';
    // Для совместимости с Firefox
    if(e.dataTransfer) e.dataTransfer.setData('text/plain', e.target.dataset.id);
}

function handleDragEnd(e) {
    e.target.style.opacity = '1';
    document.querySelectorAll('.grid-cell').forEach(c => c.classList.remove('drag-over'));
}

function setupEventListeners() {
    const grid = document.getElementById('scheduleGrid');
    
    grid.addEventListener('dragover', e => {
        if (!state.editMode) return;
        e.preventDefault();
        const cell = e.target.closest('.grid-cell');
        if (cell) cell.classList.add('drag-over');
    });

    grid.addEventListener('dragleave', e => {
        if (!state.editMode) return;
        const cell = e.target.closest('.grid-cell');
        if (cell) cell.classList.remove('drag-over');
    });

    grid.addEventListener('drop', e => {
        if (!state.editMode) return;
        e.preventDefault();
        const cell = e.target.closest('.grid-cell');
        if (cell && state.draggedElement) {
            cell.classList.remove('drag-over');
            const id = state.draggedElement.dataset.id;
            state.schedule[id].day = cell.dataset.day;
            state.schedule[id].time = cell.dataset.time;
            saveState();
            renderSchedule();
        }
    });

    grid.addEventListener('click', e => {
        if (!state.editMode) return;
        const cell = e.target.closest('.grid-cell');
        if (!cell || e.target.closest('.schedule-block')) return;
        
        state.currentDay = cell.dataset.day;
        state.currentTime = cell.dataset.time;
        state.editingId = null;
        
        populateTeacherSelect();
        populateSubjectSelect();
        document.getElementById('scheduleForm').reset();
        document.getElementById('modalTitle').textContent = `Занятие (${state.currentDay} ${state.currentTime})`;
        document.getElementById('modalOverlay').classList.add('active');
    });

    // Обработчик тумблера
    document.getElementById('modeToggle').addEventListener('change', (e) => {
        if(state.currentUser !== 'admin') {
            e.target.checked = false; // блочим
            return;
        }
        state.editMode = e.target.checked;
        document.body.classList.toggle('view-mode', !state.editMode);
        renderSchedule();
    });

    // Tabs
    document.getElementById('activeTab').addEventListener('click', () => switchTab(false));
    document.getElementById('draftTab').addEventListener('click', () => switchTab(true));

    // Form submission
    document.getElementById('scheduleForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('closeModalBtn').addEventListener('click', () => {
        document.getElementById('modalOverlay').classList.remove('active');
    });

    // Subjects Management
    document.getElementById('addSubjectBtn').addEventListener('click', showAddSubjectForm);
    document.getElementById('subjectForm').addEventListener('submit', handleSubjectSubmit);
    document.getElementById('cancelSubjectEdit').addEventListener('click', () => {
        document.getElementById('subjectEditModal').classList.remove('active');
    });
    document.getElementById('deleteSubjectBtn').addEventListener('click', handleDeleteSubject);

    // Teacher Management
    document.getElementById('addTeacherBtn').addEventListener('click', showAddTeacherForm);
    document.getElementById('teacherForm').addEventListener('submit', handleTeacherSubmit);
    document.getElementById('cancelTeacherEdit').addEventListener('click', () => {
        document.getElementById('teacherEditModal').classList.remove('active');
    });
    document.getElementById('deleteTeacherBtn').addEventListener('click', handleDeleteTeacher);
    document.getElementById('teacherSortBy').addEventListener('change', renderTeachersList);

    // Mobile buttons (Toggle sidebars)
    document.getElementById('mobileSubjectsBtn').addEventListener('click', () => {
        document.getElementById('sidebarLeft').style.display = document.getElementById('sidebarLeft').style.display === 'flex' ? 'none' : 'flex';
    });
    document.getElementById('mobileTeachersBtn').addEventListener('click', () => {
        document.getElementById('sidebarRight').style.display = document.getElementById('sidebarRight').style.display === 'flex' ? 'none' : 'flex';
    });

    // Click outside modal to close
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal) modal.classList.remove('active');
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    if (!state.editMode) return;

    const teacherSelect = document.getElementById('teacherSelect');
    
    const item = {
        id: state.editingId || Date.now().toString(),
        day: state.editingId ? state.schedule[state.editingId].day : state.currentDay,
        time: state.editingId ? state.schedule[state.editingId].time : state.currentTime,
        subject: document.getElementById('subjectInput').value,
        teacherId: teacherSelect.value,
        duration: document.getElementById('durationInput').value,
        color: document.getElementById('colorInput').value
    };

    state.schedule[item.id] = item;
    
    document.getElementById('modalOverlay').classList.remove('active');
    saveState();
    renderSchedule();
}

window.editItem = function(id, e) {
    e.stopPropagation();
    if (!state.editMode) return;

    const item = state.schedule[id];
    state.editingId = id;
    state.currentDay = item.day;
    state.currentTime = item.time;
    
    populateTeacherSelect();
    populateSubjectSelect();
    
    // Нормализация при открытии радактора
    let nSubj = item.subject;
    if (nSubj.includes('Агапе') || nSubj === 'Логопед') nSubj = 'Логопедия';
    if (nSubj === 'Калиграф' || nSubj === 'Калиграфия') nSubj = 'Каллиграфия';

    document.getElementById('subjectInput').value = nSubj;
    document.getElementById('teacherSelect').value = item.teacherId || '';
    document.getElementById('durationInput').value = item.duration;
    document.getElementById('colorInput').value = item.color || '#0984e3';

    document.getElementById('modalTitle').textContent = `Редактировать (${state.currentDay} ${state.currentTime})`;
    document.getElementById('modalOverlay').classList.add('active');
};

window.deleteItem = function(id, e) {
    e.stopPropagation();
    if (!state.editMode) return;
    
    if (confirm('Удалить предмет?')) {
        delete state.schedule[id];
        saveState();
        renderSchedule();
    }
}

// =========================================
// SUBJECTS LOGIC
// =========================================
function renderSubjectsList() {
    const list = document.getElementById('sidebarSubjectsList');
    if(!list) return;
    list.innerHTML = '';
    
    [...state.subjects].sort((a,b) => a.name.localeCompare(b.name)).forEach(s => {
        const card = document.createElement('div');
        card.className = 'teacher-card';
        card.style.borderLeftColor = s.color;
        card.innerHTML = `
            <div class="tc-header">
                <span class="tc-name">${s.name}</span>
                <span class="status-badge" style="background:${s.color}; color:#fff;">Цвет</span>
            </div>
            <div class="tc-footer">
                <button class="primary-btn sm-btn" onclick="editSubject('${s.id}')">📝 Изменить</button>
            </div>
        `;
        list.appendChild(card);
    });
}

window.editSubject = function(id) {
    const s = state.subjects.find(x => x.id === id);
    if (!s) return;
    state.editingSubjectId = id;
    
    document.getElementById('subjectEditTitle').textContent = `📝 Редактировать предмет`;
    document.getElementById('editSubjectId').value = s.id;
    document.getElementById('subjNameInput').value = s.name;
    document.getElementById('subjColorInput').value = s.color;
    
    document.getElementById('deleteSubjectBtn').style.display = 'block';
    document.getElementById('subjectEditModal').classList.add('active');
};

function showAddSubjectForm() {
    state.editingSubjectId = null;
    document.getElementById('subjectForm').reset();
    document.getElementById('subjectEditTitle').textContent = `➕ Новый предмет`;
    document.getElementById('subjColorInput').value = '#0984e3';
    document.getElementById('deleteSubjectBtn').style.display = 'none';
    document.getElementById('subjectEditModal').classList.add('active');
}

function handleSubjectSubmit(e) {
    e.preventDefault();
    const sData = {
        name: document.getElementById('subjNameInput').value.trim() || 'Без названия',
        color: document.getElementById('subjColorInput').value
    };

    if (state.editingSubjectId) {
        const idx = state.subjects.findIndex(x => x.id === state.editingSubjectId);
        if (idx !== -1) {
            const oldName = state.subjects[idx].name;
            if (oldName !== sData.name) {
                Object.values(state.schedule).forEach(item => {
                    if(item.subject === oldName) item.subject = sData.name;
                });
            }
            state.subjects[idx] = { id: state.editingSubjectId, ...sData };
        }
    } else {
        sData.id = 'SUBJ_' + Date.now();
        state.subjects.push(sData);
    }
    
    saveState();
    document.getElementById('subjectEditModal').classList.remove('active');
    renderSubjectsList();
    renderSchedule();
    populateSubjectSelect();
}

function handleDeleteSubject() {
    if (!state.editingSubjectId) return;
    if (confirm('Точно удалить этот предмет?')) {
        state.subjects = state.subjects.filter(x => x.id !== state.editingSubjectId);
        saveState();
        document.getElementById('subjectEditModal').classList.remove('active');
        renderSubjectsList();
        renderSchedule();
        populateSubjectSelect();
    }
}

function populateSubjectSelect() {
    const sel = document.getElementById('subjectInput');
    const currentVal = sel.value;
    sel.innerHTML = '<option value="">— Выберите предмет —</option>';
    
    [...state.subjects].sort((a,b) => a.name.localeCompare(b.name)).forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.name;
        opt.textContent = s.name;
        sel.appendChild(opt);
    });
    if(currentVal) sel.value = currentVal;
}

// =========================================
// TEACHERS LOGIC
// =========================================
function renderTeachersList() {
    const list = document.getElementById('sidebarTeachersList');
    if(!list) return;
    list.innerHTML = '';
    
    const sortBy = document.getElementById('teacherSortBy').value;
    
    let sortedTeachers = [...state.teachers];
    if (sortBy === 'name') sortedTeachers.sort((a,b) => a.name.localeCompare(b.name));
    if (sortBy === 'price') sortedTeachers.sort((a,b) => Number(b.price || 0) - Number(a.price || 0));
    
    // группировка
    if (sortBy === 'subject') {
        const groups = {};
        sortedTeachers.forEach(t => {
            const sub = t.subjects ? t.subjects.split(',')[0].trim() : 'Другое';
            if(!groups[sub]) groups[sub] = [];
            groups[sub].push(t);
        });
        
        Object.keys(groups).sort().forEach(sub => {
            list.appendChild(createCell('teacher-group-header', sub));
            groups[sub].forEach(t => list.appendChild(createTeacherCard(t)));
        });
    } else if (sortBy === 'status') {
        const active = sortedTeachers.filter(t => t.status === 'active');
        const temp = sortedTeachers.filter(t => t.status === 'temporary');
        const inactive = sortedTeachers.filter(t => t.status === 'inactive');
        
        if(active.length) { list.appendChild(createCell('teacher-group-header', '✅ Активные')); active.forEach(t => list.appendChild(createTeacherCard(t))); }
        if(temp.length) { list.appendChild(createCell('teacher-group-header', '⏸ Временно недоступны')); temp.forEach(t => list.appendChild(createTeacherCard(t))); }
        if(inactive.length) { list.appendChild(createCell('teacher-group-header', '❌ Неактивные')); inactive.forEach(t => list.appendChild(createTeacherCard(t))); }
    } else {
        sortedTeachers.forEach(t => list.appendChild(createTeacherCard(t)));
    }
}

function createTeacherCard(tInfo) {
    const card = document.createElement('div');
    card.className = `teacher-card ${tInfo.status !== 'active' ? 'teacher-inactive' : ''}`;
    
    let pBadge = tInfo.platform && PLATFORMS[tInfo.platform] ? PLATFORMS[tInfo.platform].icon + ' ' + PLATFORMS[tInfo.platform].name : '—';
    let sBadge = tInfo.status === 'active' ? '<span class="status-badge status-active">Активен</span>' : 
                 tInfo.status === 'inactive' ? '<span class="status-badge status-inactive">Неактивен</span>' : 
                 '<span class="status-badge status-temporary">Пауза</span>';

    card.innerHTML = `
        <div class="tc-header">
            <span class="tc-name">${tInfo.name}</span>
            ${sBadge}
        </div>
        <div class="tc-body">
            <p>📞 ${tInfo.phone || '—'}</p>
            <p>📧 ${tInfo.email || '—'}</p>
            <p>✈️ ${tInfo.telegram || '—'}</p>
            <p>🌐 Платформа: ${pBadge}</p>
            <p>💳 Банк: ${tInfo.bank ? document.querySelector(`#teacherBank option[value="${tInfo.bank}"]`).textContent : '—'}</p>
            <p>📚 Предметы: ${tInfo.subjects || '—'}</p>
            <div class="teacher-price">💰 ${tInfo.price ? tInfo.price + ' ₽/урок' : 'Цена не указана'}</div>
        </div>
        <div class="tc-footer">
            <button class="primary-btn sm-btn" onclick="editTeacher('${tInfo.id}')">📝 Изменить</button>
        </div>
    `;
    return card;
}

window.editTeacher = function(id) {
    const t = getTeacherById(id);
    if (!t) return;
    state.editingTeacherId = id;
    
    document.getElementById('teacherEditTitle').textContent = `📝 Редактировать: ${t.name}`;
    document.getElementById('editTeacherId').value = t.id;
    
    document.getElementById('teacherName').value = t.name || '';
    document.getElementById('teacherPhone').value = t.phone || '';
    document.getElementById('teacherEmail').value = t.email || '';
    document.getElementById('teacherTelegram').value = t.telegram || '';
    
    document.getElementById('teacherPlatform').value = t.platform || '';
    document.getElementById('teacherPlatformLink').value = t.platformLink || '';
    
    document.getElementById('teacherBank').value = t.bank || '';
    document.getElementById('teacherCard').value = t.cardNumber || '';
    document.getElementById('teacherCardType').value = t.cardType || 'russian';
    document.getElementById('teacherPrice').value = t.price || '';
    
    document.getElementById('teacherSubjects').value = t.subjects || '';
    document.getElementById('teacherStatus').value = t.status || 'active';
    document.getElementById('teacherWorkedBefore').checked = t.workedBefore || false;
    
    document.getElementById('deleteTeacherBtn').style.display = 'block';
    document.getElementById('teacherEditModal').classList.add('active');
};

function showAddTeacherForm() {
    state.editingTeacherId = null;
    document.getElementById('teacherForm').reset();
    document.getElementById('teacherEditTitle').textContent = `➕ Новый преподаватель`;
    document.getElementById('deleteTeacherBtn').style.display = 'none';
    document.getElementById('teacherEditModal').classList.add('active');
}

function handleTeacherSubmit(e) {
    e.preventDefault();
    
    const tData = {
        name: document.getElementById('teacherName').value.trim() || 'Без имени',
        phone: document.getElementById('teacherPhone').value.trim(),
        email: document.getElementById('teacherEmail').value.trim(),
        telegram: document.getElementById('teacherTelegram').value.trim(),
        platform: document.getElementById('teacherPlatform').value,
        platformLink: document.getElementById('teacherPlatformLink').value.trim(),
        bank: document.getElementById('teacherBank').value,
        cardNumber: document.getElementById('teacherCard').value.trim(),
        cardType: document.getElementById('teacherCardType').value,
        price: document.getElementById('teacherPrice').value,
        subjects: document.getElementById('teacherSubjects').value,
        status: document.getElementById('teacherStatus').value,
        workedBefore: document.getElementById('teacherWorkedBefore').checked
    };

    if (state.editingTeacherId) {
        const idx = state.teachers.findIndex(t => t.id === state.editingTeacherId);
        if (idx !== -1) state.teachers[idx] = { id: state.editingTeacherId, ...tData };
    } else {
        tData.id = 'T' + Date.now();
        state.teachers.push(tData);
    }
    
    saveState();
    document.getElementById('teacherEditModal').classList.remove('active');
    renderTeachersList();
    populateTeacherSelect(); // update create lesson modal
}

function handleDeleteTeacher() {
    if (!state.editingTeacherId) return;
    if (confirm('Точно удалить этого преподавателя? Это не удалит его из расписания, но он исчезнет из базы.')) {
        state.teachers = state.teachers.filter(t => t.id !== state.editingTeacherId);
        saveState();
        document.getElementById('teacherEditModal').classList.remove('active');
        renderTeachersList();
        populateTeacherSelect();
    }
}

function populateTeacherSelect() {
    const sel = document.getElementById('teacherSelect');
    sel.innerHTML = '<option value="">— Выберите из базы —</option>';
    
    // Сортировка по имени для удобства выбора
    [...state.teachers].sort((a,b) => a.name.localeCompare(b.name)).forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = `${t.name} (${t.subjects ? t.subjects.split(',')[0] : '...'})`;
        sel.appendChild(opt);
    });
}

// =========================================
// DATA MANAGEMENT
// =========================================
function switchTab(isDraft) {
    state.isDraft = isDraft;
    document.getElementById('activeTab').classList.toggle('active', !isDraft);
    document.getElementById('draftTab').classList.toggle('active', isDraft);
    loadState();
    renderSchedule();
}

const STORAGE_KEY_ACTIVE = 'schedule_active';
const STORAGE_KEY_DRAFT = 'schedule_draft';
const STORAGE_TEACHERS = 'teachers_v2';

function loadState() {
    const key = state.isDraft ? STORAGE_KEY_DRAFT : STORAGE_KEY_ACTIVE;
    const saved = localStorage.getItem(key);
    state.schedule = saved ? JSON.parse(saved) : {};
    
    const teachersSaved = localStorage.getItem(STORAGE_TEACHERS);
    state.teachers = teachersSaved ? JSON.parse(teachersSaved) : [];

    const subjSaved = localStorage.getItem('subjects_v2');
    if (subjSaved) {
        state.subjects = JSON.parse(subjSaved);
    } else {
        state.subjects = Object.keys(SUBJECT_COLORS).map((name, i) => ({
            id: 'S_' + i, name: name, color: SUBJECT_COLORS[name].bg
        }));
        localStorage.setItem('subjects_v2', JSON.stringify(state.subjects));
    }
}

function saveState() {
    const key = state.isDraft ? STORAGE_KEY_DRAFT : STORAGE_KEY_ACTIVE;
    localStorage.setItem(key, JSON.stringify(state.schedule));
    localStorage.setItem(STORAGE_TEACHERS, JSON.stringify(state.teachers));
    localStorage.setItem('subjects_v2', JSON.stringify(state.subjects));
}

function loadSleepData() {
    const saved = localStorage.getItem('sleepLogs');
    state.sleepData = saved ? JSON.parse(saved) : {};
}

// Init
initAuth();

// --- EXCEL SEED LAYER ---
(function seedExcelData() {
    if (localStorage.getItem('excel_seeded_v1')) return;
    
    const tData = [
        { phone: '968 439-84-36', subj: 'Английский' }, { phone: '966 077-10-48', subj: 'Скорочтение' }, { phone: '909 170-90-76', subj: 'Каллиграфия' }, { phone: '900 236-99-90', subj: 'Математика' }, { phone: '906 296-91-25', subj: 'Логопедия' }, { phone: '916 147-38-00', subj: 'Русский' }, { phone: '937 311-75-02', subj: 'Речь' }, { phone: '913 431-88-86', subj: 'Английский' }, { phone: '952 530-54-54', subj: 'Английский' }, { phone: '902 327-20-54', subj: 'Логопедия' }, { phone: '905 862-09-36', subj: 'Каллиграфия' }, { phone: '989 282-26-29', subj: 'Английский' }, { phone: '928 863-68-88', subj: 'Логопедия' }, { phone: '965 187-25-73', subj: 'Логопедия' }, { phone: '926 217-37-29', subj: 'Речь' }, { phone: '911 237-90-72', subj: 'Логопедия' }, { phone: '918 174-21-16', subj: 'Логопедия' }, { phone: '960 946-92-71', subj: 'Английский' }, { phone: '904 026-07-26', subj: 'Логопедия' }, { phone: '903 290-97-66', subj: 'Логопедия' }, { phone: '910 748-62-20', subj: 'Логопедия' }, { phone: '920 605-77-33', subj: 'Логопедия' }, { phone: '902 007-99-72', subj: 'Английский' }, { phone: '983 304-32-41', subj: 'Логопедия' }, { phone: '926 030-28-34', subj: 'Логопедия' }, { phone: '916 330-51-77', subj: 'Логопедия' }, { phone: '964 909-79-87', subj: 'Логопедия' }, { phone: '375 25 912 0406', subj: 'Логопедия' }, { phone: '906 075-89-66', subj: 'Дефектолог' }, { phone: '963 106-56-53', subj: 'Логопедия' }, { phone: '919 675-64-55', subj: 'Логопедия' }, { phone: '908 027-50-33', subj: 'Логопедия' }, { phone: '915 000-92-55', subj: 'Логопедия' }, { phone: '912 626-43-30', subj: 'Логопедия' }, { phone: '903 255-39-30', subj: 'Логопедия' }, { phone: '927 055-09-18', subj: 'Логопедия' }, { phone: '951 608-63-70', subj: 'Русский' }, { phone: '909 096-12-31', subj: 'Речь' }, { phone: '926 085-18-18', subj: 'Английский' }, { phone: '952 267-40-32', subj: 'Логопедия' }, { phone: '908 107-59-23', subj: 'Математика' }, { phone: '900 352-24-43', subj: 'Логопедия' }, { phone: '925 250-75-05', subj: 'Английский' }, { phone: '964 858-33-61', subj: 'Математика' }
    ];
    let tMap = {}; let tArr = []; let tId = 1;
    tData.forEach(t => {
        if(!tMap[t.phone]) {
            let id = 'T_EXC_'+(tId++);
            tMap[t.phone] = { id: id, name: 'Преп. ' + t.phone.slice(-5), phone: t.phone, subjects: t.subj, status: 'active' };
            tArr.push(tMap[t.phone]);
        } else if(!tMap[t.phone].subjects.includes(t.subj)) {
            tMap[t.phone].subjects += ', ' + t.subj;
        }
    });

    // Избегаем перезаписи учителей, если там уже кто-то есть от пользователя, 
    // но в рамках задачи сказано "полностью заполнить нашим расписанием"
    localStorage.setItem('teachers_v2', JSON.stringify(tArr));

    let sch = {}; let sId = 1;
    function addBlocks(day, times, subj, dur, phone) {
        let tid = phone && tMap[phone] ? tMap[phone].id : '';
        let tname = phone ? phone : '';
        times.forEach(tm => {
            let id = 'S_EXC_'+(sId++);
            sch[id] = { id, day, time: tm, subject: subj, duration: String(dur), teacherId: tid, teacherName: tname, color: '#0984e3' };
        });
    }

    addBlocks('Пн', ['08:00'], 'Английский', 60, '968 439-84-36');
    addBlocks('Пн', ['09:00'], 'Скорочтение', 60, '966 077-10-48');
    addBlocks('Пн', ['10:00'], 'Каллиграфия', 40, '909 170-90-76');
    addBlocks('Пн', ['11:00'], 'Математика', 60, '900 236-99-90');
    addBlocks('Пн', ['12:00'], 'Логопедия', 45, '906 296-91-25');
    addBlocks('Пн', ['14:00'], 'Русский', 60, '916 147-38-00');
    addBlocks('Пн', ['15:00'], 'Речь', 60, '937 311-75-02');
    addBlocks('Пн', ['16:00'], 'Айкидо', 180, null);
    addBlocks('Пн', ['19:00'], 'Английский', 60, '913 431-88-86');

    addBlocks('Вт', ['08:00'], 'Английский', 60, '952 530-54-54');
    addBlocks('Вт', ['09:00'], 'Логопедия', 45, '902 327-20-54');
    addBlocks('Вт', ['10:00'], 'Каллиграфия', 40, '905 862-09-36');
    addBlocks('Вт', ['11:00'], 'Английский', 60, '989 282-26-29');
    addBlocks('Вт', ['12:00'], 'Логопедия', 40, '928 863-68-88');
    addBlocks('Вт', ['14:00'], 'Логопедия', 45, '965 187-25-73');
    addBlocks('Вт', ['15:00'], 'Речь', 60, '926 217-37-29');
    addBlocks('Вт', ['16:00'], 'Баскетбол', 180, null);

    addBlocks('Ср', ['09:00'], 'Логопедия', 45, '911 237-90-72');
    addBlocks('Ср', ['10:00'], 'Логопедия', 60, '918 174-21-16');
    addBlocks('Ср', ['11:00'], 'Английский', 60, '960 946-92-71');
    addBlocks('Ср', ['12:00'], 'Логопедия', 50, '904 026-07-26');
    addBlocks('Ср', ['14:00'], 'Логопедия', 30, '903 290-97-66');
    addBlocks('Ср', ['15:00'], 'Логопедия', 45, '910 748-62-20');
    addBlocks('Ср', ['16:00'], 'Логопедия', 45, '920 605-77-33');

    addBlocks('Чт', ['09:00'], 'Английский', 60, '902 007-99-72');
    addBlocks('Чт', ['10:00'], 'Логопедия', 45, '983 304-32-41');
    addBlocks('Чт', ['11:00'], 'Логопедия', 45, '926 030-28-34');
    addBlocks('Чт', ['12:00'], 'Математика', 60, '966 077-10-48');
    addBlocks('Чт', ['14:00'], 'Логопедия', 40, '916 330-51-77');
    addBlocks('Чт', ['15:00'], 'Логопедия', 40, '964 909-79-87');
    addBlocks('Чт', ['17:00'], 'Баскетбол', 120, null);

    addBlocks('Пт', ['09:00'], 'Логопедия', 60, '375 25 912 0406');
    addBlocks('Пт', ['10:00'], 'Дефектолог', 60, '906 075-89-66');
    addBlocks('Пт', ['11:00'], 'Логопедия', 45, '963 106-56-53');
    addBlocks('Пт', ['12:00'], 'Логопедия', 45, '919 675-64-55');
    addBlocks('Пт', ['14:00'], 'Логопедия', 30, '908 027-50-33');
    addBlocks('Пт', ['15:00'], 'Логопедия', 45, '915 000-92-55');
    addBlocks('Пт', ['16:00'], 'Волейбол', 90, null);

    addBlocks('Сб', ['08:00'], 'Логопедия', 30, '912 626-43-30');
    addBlocks('Сб', ['09:00'], 'Айкидо', 120, null);
    addBlocks('Сб', ['13:00'], 'Логопедия', 60, '903 255-39-30');
    addBlocks('Сб', ['14:00'], 'Логопедия', 60, '927 055-09-18');
    addBlocks('Сб', ['15:00'], 'Русский', 60, '951 608-63-70');
    addBlocks('Сб', ['16:00'], 'Шахматы', 120, null);
    addBlocks('Сб', ['18:00'], 'Речь', 60, '909 096-12-31');

    addBlocks('Вс', ['09:00'], 'Английский', 60, '926 085-18-18');
    addBlocks('Вс', ['10:00'], 'Логопедия', 60, '952 267-40-32');
    addBlocks('Вс', ['11:00'], 'Математика', 60, '908 107-59-23');
    addBlocks('Вс', ['12:00'], 'Логопедия', 60, '900 352-24-43');
    addBlocks('Вс', ['14:00'], 'Английский', 60, '925 250-75-05');
    addBlocks('Вс', ['15:00'], 'Математика', 60, '964 858-33-61');
    addBlocks('Вс', ['17:00'], 'Барабаны', 180, null);

    localStorage.setItem('schedule_active', JSON.stringify(sch));
    localStorage.setItem('excel_seeded_v1', 'true');
    location.reload();
})();
