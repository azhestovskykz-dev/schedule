document.addEventListener('DOMContentLoaded', () => {
    // Начальные данные со скриншота
    const initialSchedule = [
        // Пн (day: 0)
        { id: '1', day: 0, hour: 8, subject: 'Английский', phone: '968 439-84-36', duration: 60, color: '#ffeaa7' },
        { id: '2', day: 0, hour: 9, subject: 'Скорочтение', phone: '966 077-10-48', duration: 60, color: '#81ecec' },
        { id: '3', day: 0, hour: 10, subject: 'Калиграф', phone: '909 170-90-76', duration: 40, color: '#dec0f1' },
        { id: '4', day: 0, hour: 11, subject: 'Математика', phone: '900 236-99-90', duration: 60, color: '#fab1a0' },
        { id: '5', day: 0, hour: 12, subject: 'Логопед', phone: '906 296-91-25', duration: 45, color: '#dec0f1' },
        { id: '6', day: 0, hour: 14, subject: 'Русский', phone: '916 147-38-00', duration: 60, color: '#81ecec' },
        { id: '7', day: 0, hour: 15, subject: 'Речь', phone: '937 311-75-02', duration: 60, color: '#ffeaa7' },
        { id: '8', day: 0, hour: 16, subject: 'Айкидо', phone: 'в 17.00', duration: 60, color: '#81ecec' },
        { id: '9', day: 0, hour: 19, subject: 'Английский', phone: '913 431-88-86', duration: 60, color: '#ffeaa7' },
        // Вт (day: 1)
        { id: '10', day: 1, hour: 8, subject: 'Английский', phone: '952 530-54-54', duration: 60, color: '#ffeaa7' },
        { id: '11', day: 1, hour: 9, subject: 'Логопед', phone: '902 327-20-54', duration: 45, color: '#e2f0d9' },
        { id: '12', day: 1, hour: 10, subject: 'Калиграф', phone: '905 862-09-36', duration: 40, color: '#dec0f1' },
        { id: '13', day: 1, hour: 11, subject: 'Английский', phone: '989 282-26-29', duration: 60, color: '#ffeaa7' },
        { id: '14', day: 1, hour: 12, subject: 'Логопед', phone: '928 863-68-88', duration: 40, color: '#e2f0d9' },
        { id: '15', day: 1, hour: 14, subject: 'Логопед', phone: '965 187-25-73', duration: 45, color: '#e2f0d9' },
        { id: '16', day: 1, hour: 15, subject: 'Речь', phone: '926 217-37-29', duration: 60, color: '#e2f0d9' },
        { id: '17', day: 1, hour: 16, subject: 'Баскетбол', phone: '16.00-18.00', duration: 120, color: '#ff7675' },
        { id: '18', day: 1, hour: 18, subject: 'Бассейн', phone: '964 339 4753', duration: 60, color: '#dec0f1' },
        // Ср (day: 2)
        { id: '19', day: 2, hour: 8, subject: 'Калиграфия', phone: '900 969-30-21', duration: 60, color: '#a29bfe' },
        { id: '20', day: 2, hour: 9, subject: 'Логопед', phone: '911 237-90-72', duration: 45, color: '#dec0f1' },
        { id: '21', day: 2, hour: 10, subject: 'Логопед', phone: '918 174-21-16', duration: 60, color: '#dec0f1' },
        { id: '22', day: 2, hour: 11, subject: 'Английский', phone: '960 946-92-71', duration: 60, color: '#ffeaa7' },
        { id: '23', day: 2, hour: 12, subject: 'Логопед', phone: '904 026-07-26', duration: 50, color: '#dec0f1' },
        { id: '24', day: 2, hour: 14, subject: 'Логопед', phone: '903 290-97-66', duration: 30, color: '#a29bfe' },
        { id: '25', day: 2, hour: 15, subject: 'Логопед', phone: '910 748-62-20', duration: 45, color: '#e2f0d9' },
        { id: '26', day: 2, hour: 16, subject: 'Логопед', phone: '920 605-77-33', duration: 45, color: '#e2f0d9' },
        { id: '27', day: 2, hour: 18, subject: 'Волейбол', phone: '18.30-20.00', duration: 90, color: '#ff7675' },
        // Чт (day: 3)
        { id: '28', day: 3, hour: 9, subject: 'Английский', phone: '902 007-99-72', duration: 60, color: '#ffeaa7' },
        { id: '29', day: 3, hour: 10, subject: 'Логопед', phone: '983 304-32-41', duration: 45, color: '#e2f0d9' },
        { id: '30', day: 3, hour: 11, subject: 'Логопед', phone: '926 030-28-34', duration: 45, color: '#e2f0d9' },
        { id: '31', day: 3, hour: 12, subject: 'Математика', phone: '966 077-10-48', duration: 60, color: '#fab1a0' },
        { id: '32', day: 3, hour: 14, subject: 'Логопед', phone: '916 330-51-77', duration: 40, color: '#e2f0d9' },
        { id: '33', day: 3, hour: 15, subject: 'Речь', phone: '964 909-79-87', duration: 40, color: '#e2f0d9' },
        { id: '34', day: 3, hour: 16, subject: 'Баскетбол', phone: '17.00-18.30', duration: 90, color: '#ff7675' },
        { id: '35', day: 3, hour: 18, subject: 'Бассейн', phone: '964 339 4753', duration: 60, color: '#dec0f1' },
        // Пт (day: 4)
        { id: '36', day: 4, hour: 8, subject: 'Калиграф', phone: '900 969-30-21', duration: 60, color: '#a29bfe' },
        { id: '37', day: 4, hour: 9, subject: 'Логопед', phone: '375 25 912 0406', duration: 60, color: '#e2f0d9' },
        { id: '38', day: 4, hour: 10, subject: 'Дефектолог', phone: '906 075-89-66', duration: 60, color: '#dec0f1' },
        { id: '39', day: 4, hour: 11, subject: 'Логопед', phone: '963 106-56-53', duration: 45, color: '#dec0f1' },
        { id: '40', day: 4, hour: 12, subject: 'Логопед', phone: '919 675-64-55', duration: 45, color: '#e2f0d9' },
        { id: '41', day: 4, hour: 14, subject: 'Логопед', phone: '908 027-50-33', duration: 30, color: '#e2f0d9' },
        { id: '42', day: 4, hour: 15, subject: 'Логопед', phone: '915 000-92-55', duration: 45, color: '#e2f0d9' },
        { id: '43', day: 4, hour: 16, subject: 'Волейбол', phone: '16.30-18.00', duration: 90, color: '#ff7675' },
        { id: '44', day: 4, hour: 18, subject: 'Массаж', phone: 'в 18.00', duration: 60, color: '#a29bfe' },
        // Сб (day: 5)
        { id: '45', day: 5, hour: 8, subject: 'Логопед', phone: '912 626-43-30', duration: 30, color: '#e2f0d9' },
        { id: '46', day: 5, hour: 13, subject: 'Логопед', phone: '903 255-39-30', duration: 60, color: '#e2f0d9' },
        { id: '47', day: 5, hour: 14, subject: 'Логопед', phone: '927 055-09-18', duration: 60, color: '#e2f0d9' },
        { id: '48', day: 5, hour: 15, subject: 'Русский', phone: '951 608-63-70', duration: 60, color: '#81ecec' },
        { id: '49', day: 5, hour: 16, subject: 'Шахматы', phone: 'в 17.00', duration: 60, color: '#81ecec' },
        { id: '50', day: 5, hour: 19, subject: 'Речь', phone: '909 096-12-31', duration: 60, color: '#dec0f1' },
        // Вс (day: 6)
        { id: '51', day: 6, hour: 9, subject: 'Английский', phone: '926 085-18-18', duration: 60, color: '#ffeaa7' },
        { id: '52', day: 6, hour: 10, subject: 'Логопед', phone: '952 267-40-32', duration: 60, color: '#e2f0d9' },
        { id: '53', day: 6, hour: 11, subject: 'Математика', phone: '908 107-59-23', duration: 60, color: '#fab1a0' },
        { id: '54', day: 6, hour: 12, subject: 'Логопед', phone: '900 352-24-43', duration: 60, color: '#e2f0d9' },
        { id: '55', day: 6, hour: 14, subject: 'Английский', phone: '925 250-75-05', duration: 60, color: '#ffeaa7' },
        { id: '56', day: 6, hour: 15, subject: 'Математика', phone: '964 858-33-61', duration: 60, color: '#fab1a0' },
        { id: '57', day: 6, hour: 18, subject: 'Барабаны', phone: '18.00-20.00', duration: 120, color: '#ff7675' }
    ];

    // Состояние приложения
    let state = {
        teachers: JSON.parse(localStorage.getItem('teachers')) || {},
        activeSchedule: JSON.parse(localStorage.getItem('schedule_active')) || initialSchedule,
        draftSchedule: JSON.parse(localStorage.getItem('schedule_draft')) || JSON.parse(JSON.stringify(initialSchedule)),
        sleepLogs: JSON.parse(localStorage.getItem('sleepLogs')) || [],
        currentVersion: localStorage.getItem('currentVersion') || 'active', 
        editMode: localStorage.getItem('editMode') !== 'false' // default to true
    };

    // Применяем начальные стили на основе сохраненного режима
    document.body.classList.toggle('view-mode', !state.editMode);

    // Геттер для получения текущего расписания в зависимости от версии
    function getCurrentSchedule() {
        return state.currentVersion === 'active' ? state.activeSchedule : state.draftSchedule;
    }

    function setCurrentSchedule(data) {
        if (state.currentVersion === 'active') state.activeSchedule = data;
        else state.draftSchedule = data;
    }

    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 07:00 - 20:00

    const grid = document.getElementById('scheduleGrid');
    const manageTeachersBtn = document.getElementById('manageTeachersBtn');
    const logSleepBtn = document.getElementById('logSleepBtn');
    const modeToggle = document.getElementById('modeToggle');
    const modeLabel = document.getElementById('modeLabel');
    const activeTab = document.getElementById('activeTab');
    const draftTab = document.getElementById('draftTab');
    const subjectBreakdown = document.getElementById('subjectBreakdown');

    // Модальные окна
    const modalOverlay = document.getElementById('modalOverlay');
    const editIdInput = document.getElementById('editId');
    const subjectInput = document.getElementById('subjectInput');
    const phoneInput = document.getElementById('phoneInput');
    const durationInput = document.getElementById('durationInput');
    const colorInput = document.getElementById('colorInput');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const scheduleForm = document.getElementById('scheduleForm');

    // Элементы учителей
    const teachersModal = document.getElementById('teachersModal');
    const teachersList = document.getElementById('teachersList');
    const closeTeachersBtn = document.getElementById('closeTeachersBtn');
    const teacherEditModal = document.getElementById('teacherEditModal');
    const teacherForm = document.getElementById('teacherForm');
    const cancelTeacherEdit = document.getElementById('cancelTeacherEdit');

    function saveState() {
        localStorage.setItem('teachers', JSON.stringify(state.teachers));
        localStorage.setItem('schedule_active', JSON.stringify(state.activeSchedule));
        localStorage.setItem('schedule_draft', JSON.stringify(state.draftSchedule));
        localStorage.setItem('sleepLogs', JSON.stringify(state.sleepLogs));
        localStorage.setItem('currentVersion', state.currentVersion);
        localStorage.setItem('editMode', state.editMode);
        renderStats();
    }

    function renderStats() {
        const schedule = getCurrentSchedule();
        const studyMinutes = schedule.reduce((acc, item) => acc + (parseInt(item.duration) || 0), 0);
        document.getElementById('studyTime').textContent = `${Math.round(studyMinutes / 60 * 10) / 10} ч`;
        
        const totalWeeklyMinutes = 7 * 14 * 60; 
        const restMinutes = totalWeeklyMinutes - studyMinutes;
        document.getElementById('restTime').textContent = `${Math.round(restMinutes / 60 * 10) / 10} ч`;

        // Детальная аналитика по предметам
        const summary = {};
        schedule.forEach(item => {
            if (!summary[item.subject]) summary[item.subject] = { min: 0, color: item.color };
            summary[item.subject].min += parseInt(item.duration) || 0;
        });

        subjectBreakdown.innerHTML = '';
        Object.entries(summary).sort((a,b) => b[1].min - a[1].min).forEach(([name, data]) => {
            const card = document.createElement('div');
            card.className = 'subject-card';
            card.style.borderLeftColor = data.color;
            card.innerHTML = `
                <span class="subject-name">${name}</span>
                <span class="subject-hours">${Math.round(data.min / 60 * 10) / 10} ч <small>(${data.min} мин)</small></span>
            `;
            subjectBreakdown.appendChild(card);
        });
    }

    function renderGrid() {
        grid.innerHTML = '';
        grid.style.gridTemplateColumns = `60px repeat(${days.length}, 1fr)`;
        
        const corner = document.createElement('div');
        corner.className = 'grid-header corner';
        grid.appendChild(corner);

        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'grid-header day-name';
            dayHeader.textContent = day;
            grid.appendChild(dayHeader);
        });

        hours.forEach(hour => {
            const timeLabel = document.createElement('div');
            timeLabel.className = 'time-label';
            timeLabel.textContent = `${hour < 10 ? '0'+hour : hour}:00`;
            grid.appendChild(timeLabel);

            days.forEach((day, dayIndex) => {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.day = dayIndex;
                cell.dataset.hour = hour;
                
                if (state.editMode) {
                    cell.addEventListener('dragover', (e) => {
                        e.preventDefault();
                        cell.classList.add('drag-over');
                    });
                    cell.addEventListener('dragleave', () => cell.classList.remove('drag-over'));
                    cell.addEventListener('drop', (e) => {
                        e.preventDefault();
                        cell.classList.remove('drag-over');
                        const itemId = e.dataTransfer.getData('text/plain');
                        const schedule = getCurrentSchedule();
                        const item = schedule.find(i => i.id === itemId);
                        if (item) {
                            item.day = parseInt(cell.dataset.day);
                            item.hour = parseInt(cell.dataset.hour);
                            saveState();
                            renderGrid();
                        }
                    });
                }
                
                const schedule = getCurrentSchedule();
                const items = schedule.filter(i => i.day == dayIndex && i.hour == hour);
                items.forEach(item => {
                    const block = document.createElement('div');
                    block.className = 'schedule-block';
                    block.draggable = state.editMode;
                    block.style.borderLeftColor = item.color || '#0984e3';
                    block.innerHTML = `
                        ${state.editMode ? `<div class="block-actions"><span class="delete-btn" title="Удалить">×</span></div>` : ''}
                        <div class="block-phone">${item.phone || 'Нет тел.'}</div>
                        <div class="block-subject">${item.subject || 'Занятие'}</div>
                        <div class="block-duration">${item.duration} мин</div>
                    `;
                    
                    if (state.editMode) {
                        block.addEventListener('dragstart', (e) => {
                            e.dataTransfer.setData('text/plain', item.id);
                            setTimeout(() => block.style.display = 'none', 0);
                        });
                        block.addEventListener('dragend', () => block.style.display = 'block');
                        block.addEventListener('click', (e) => {
                            e.stopPropagation();
                            openModal(item);
                        });
                        block.querySelector('.delete-btn').addEventListener('click', (e) => {
                            e.stopPropagation();
                            if (confirm('Удалить это занятие?')) {
                                const newSchedule = getCurrentSchedule().filter(i => i.id !== item.id);
                                setCurrentSchedule(newSchedule);
                                saveState();
                                renderGrid();
                            }
                        });
                    }
                    cell.appendChild(block);
                });

                if (state.editMode) {
                    cell.addEventListener('click', (e) => {
                        if (e.target === cell) openModal(null, dayIndex, hour);
                    });
                }
                grid.appendChild(cell);
            });
        });
    }

    function openModal(item = null, day = 0, hour = 7) {
        modalOverlay.classList.add('active');
        if (item) {
            editIdInput.value = item.id;
            subjectInput.value = item.subject;
            phoneInput.value = item.phone || '';
            durationInput.value = item.duration || 60;
            colorInput.value = item.color || '#0984e3';
            document.getElementById('modalTitle').textContent = 'Редактировать занятие';
        } else {
            editIdInput.value = '';
            subjectInput.value = '';
            phoneInput.value = '';
            durationInput.value = 60;
            colorInput.value = '#0984e3';
            editIdInput.dataset.newDay = day;
            editIdInput.dataset.newHour = hour;
            document.getElementById('modalTitle').textContent = 'Добавить занятие';
        }
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        scheduleForm.reset();
    }

    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    scheduleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = editIdInput.value;
        const phone = phoneInput.value;
        const data = {
            subject: subjectInput.value,
            phone: phone,
            duration: parseInt(durationInput.value) || 60,
            color: colorInput.value
        };

        const schedule = getCurrentSchedule();
        if (id) {
            const item = schedule.find(i => i.id === id);
            if (item) Object.assign(item, data);
        } else {
            const newItem = {
                id: Date.now().toString(),
                day: parseInt(editIdInput.dataset.newDay),
                hour: parseInt(editIdInput.dataset.newHour),
                ...data
            };
            schedule.push(newItem);
        }

        if (phone && !state.teachers[phone]) {
            state.teachers[phone] = { color: data.color };
        }

        saveState();
        renderGrid();
        closeModal();
    });

    // Управление режимами и версиями
    modeToggle.checked = state.editMode;
    modeLabel.textContent = state.editMode ? 'Редактирование' : 'Просмотр';
    
    if (state.currentVersion === 'draft') {
        draftTab.classList.add('active');
        activeTab.classList.remove('active');
    }

    modeToggle.addEventListener('change', () => {
        state.editMode = modeToggle.checked;
        modeLabel.textContent = state.editMode ? 'Редактирование' : 'Просмотр';
        document.body.classList.toggle('view-mode', !state.editMode);
        saveState();
        renderGrid();
    });

    activeTab.addEventListener('click', () => {
        state.currentVersion = 'active';
        activeTab.classList.add('active');
        draftTab.classList.remove('active');
        saveState();
        renderGrid();
    });

    draftTab.addEventListener('click', () => {
        state.currentVersion = 'draft';
        draftTab.classList.add('active');
        activeTab.classList.remove('active');
        saveState();
        renderGrid();
    });

    manageTeachersBtn.addEventListener('click', () => {
        renderTeachers();
        teachersModal.classList.add('active');
    });

    function renderTeachers() {
        teachersList.innerHTML = '';
        const schedule = getCurrentSchedule();
        const uniquePhones = [...new Set(schedule.map(s => s.phone).filter(p => p && !p.startsWith('в ')))];
        
        uniquePhones.forEach(phone => {
            const teacher = state.teachers[phone] || { status: 'active' };
            const div = document.createElement('div');
            div.className = 'teacher-item';
            div.innerHTML = `
                <div class="teacher-info">
                    <div class="teacher-name">${phone}</div>
                    <div class="teacher-meta">
                        ${teacher.bank ? teacher.bank : 'Банк не указан'} | 
                        ${teacher.card ? teacher.card : 'Карта не указана'}
                    </div>
                </div>
                <span class="status-badge status-${teacher.status || 'active'}">${getStatusLabel(teacher.status)}</span>
                <button class="primary-btn sm-btn edit-teacher-btn" data-phone="${phone}">Изменить</button>
            `;
            
            div.querySelector('.edit-teacher-btn').addEventListener('click', () => {
                openTeacherEdit(phone);
            });
            
            teachersList.appendChild(div);
        });
    }

    function getStatusLabel(status) {
        const labels = { active: 'Активен', inactive: 'Неактивен', temporary: 'Временно' };
        return labels[status] || 'Активен';
    }

    function openTeacherEdit(phone) {
        const teacher = state.teachers[phone] || {};
        document.getElementById('editTeacherPhone').value = phone;
        document.getElementById('teacherBank').value = teacher.bank || '';
        document.getElementById('teacherCard').value = teacher.card || '';
        document.getElementById('teacherStatus').value = teacher.status || 'active';
        teacherEditModal.classList.add('active');
    }

    teacherForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const phone = document.getElementById('editTeacherPhone').value;
        state.teachers[phone] = {
            ...state.teachers[phone],
            bank: document.getElementById('teacherBank').value,
            card: document.getElementById('teacherCard').value,
            status: document.getElementById('teacherStatus').value
        };
        saveState();
        renderTeachers();
        teacherEditModal.classList.remove('active');
    });

    cancelTeacherEdit.addEventListener('click', () => teacherEditModal.classList.remove('active'));
    closeTeachersBtn.addEventListener('click', () => teachersModal.classList.remove('active'));

    logSleepBtn.addEventListener('click', () => {
        const sleep = prompt('Время отхода ко сну (ЧЧ:ММ):');
        const wake = prompt('Время пробуждения (ЧЧ:ММ):');
        if (sleep && wake) {
            state.sleepLogs.push({ date: new Date().toLocaleDateString(), sleep, wake });
            saveState();
            alert('Журнал обновлен!');
        }
    });

    renderGrid();
    renderStats();
});
