document.addEventListener('DOMContentLoaded', () => {
    // === Цветовая карта предметов ===
    const SUBJECT_COLORS = {
        'Английский':   { bg: '#fff9c4', border: '#f9a825', text: '#5d4037' },
        'Математика':   { bg: '#ffe0b2', border: '#e65100', text: '#4e342e' },
        'Логопедия':    { bg: '#c8e6c9', border: '#388e3c', text: '#1b5e20' },
        'Каллиграфия':  { bg: '#e1bee7', border: '#8e24aa', text: '#4a148c' },
        'Скорочтение':  { bg: '#b2ebf2', border: '#00838f', text: '#004d40' },
        'Русский':      { bg: '#b2ebf2', border: '#0097a7', text: '#004d40' },
        'Речь':         { bg: '#fff9c4', border: '#c0ca33', text: '#33691e' },
        'Баскетбол':    { bg: '#ffcdd2', border: '#c62828', text: '#b71c1c' },
        'Волейбол':     { bg: '#f8bbd0', border: '#ad1457', text: '#880e4f' },
        'Бассейн':      { bg: '#bbdefb', border: '#1565c0', text: '#0d47a1' },
        'Айкидо':       { bg: '#b2ebf2', border: '#00695c', text: '#004d40' },
        'Шахматы':      { bg: '#b2ebf2', border: '#00796b', text: '#004d40' },
        'Массаж':       { bg: '#d1c4e9', border: '#5e35b1', text: '#311b92' },
        'Барабаны':     { bg: '#ffcdd2', border: '#d32f2f', text: '#b71c1c' },
        'Дефектолог':   { bg: '#e1bee7', border: '#7b1fa2', text: '#4a148c' }
    };
    const DEFAULT_COLOR = { bg: '#f5f5f5', border: '#90a4ae', text: '#37474f' };

    function getSubjectColor(subject) {
        return SUBJECT_COLORS[subject] || DEFAULT_COLOR;
    }

    // === Иконки платформ ===
    const PLATFORM_ICONS = {
        'teams': { icon: '🟦', name: 'Teams' },
        'zoom': { icon: '📹', name: 'Zoom' },
        'telegram': { icon: '✈️', name: 'Telegram' },
        'skype': { icon: '☁️', name: 'Skype' },
        'website': { icon: '🌐', name: 'Сайт' },
        'offline': { icon: '🏢', name: 'Очно' }
    };

    // Обновлённые начальные данные
    const initialSchedule = [
        { id: '1', day: 0, hour: 8, subject: 'Английский', teacherId: 't1', duration: 60 },
        { id: '2', day: 0, hour: 9, subject: 'Скорочтение', teacherId: 't2', duration: 60 },
        { id: '3', day: 0, hour: 10, subject: 'Каллиграфия', teacherId: 't3', duration: 40 },
        { id: '4', day: 0, hour: 11, subject: 'Математика', teacherId: 't4', duration: 60 },
        { id: '5', day: 0, hour: 12, subject: 'Логопедия', teacherId: 't5', duration: 45 },
        { id: '6', day: 0, hour: 14, subject: 'Русский', teacherId: 't15', duration: 60 },
        { id: '7', day: 0, hour: 15, subject: 'Речь', teacherId: 't6', duration: 60 },
        { id: '8', day: 0, hour: 16, subject: 'Айкидо', teacherId: 't7', duration: 60 },
        { id: '9', day: 0, hour: 19, subject: 'Английский', teacherId: 't8', duration: 60 },
        // День 1
        { id: '10', day: 1, hour: 8, subject: 'Английский', teacherId: 't9', duration: 60 },
        { id: '11', day: 1, hour: 9, subject: 'Логопедия', teacherId: 't10', duration: 45 },
        { id: '12', day: 1, hour: 10, subject: 'Каллиграфия', teacherId: 't11', duration: 40 },
        { id: '13', day: 1, hour: 11, subject: 'Английский', teacherId: 't12', duration: 60 },
        { id: '14', day: 1, hour: 12, subject: 'Логопедия', teacherId: 't13', duration: 40 },
        { id: '15', day: 1, hour: 14, subject: 'Логопедия', teacherId: 't14', duration: 45 },
        { id: '16', day: 1, hour: 15, subject: 'Речь', teacherId: 't16', duration: 60 },
        { id: '17', day: 1, hour: 16, subject: 'Баскетбол', teacherId: 't17', duration: 120 },
        { id: '18', day: 1, hour: 18, subject: 'Бассейн', teacherId: 't18', duration: 60 },
        // ... (остальные дни для примера сокращены, но данные сохраняются в LS)
    ];

    const initialTeachers = {
        't1': { id: 't1', name: 'Елена (Англ)', phone: '968 439-84-36', platform: 'zoom', subjects: 'Английский', status: 'active' },
        't2': { id: 't2', name: 'Ирина (Скорочт)', phone: '966 077-10-48', platform: 'teams', subjects: 'Скорочтение', status: 'active' },
        't3': { id: 't3', name: 'Анна (Каллиграф)', phone: '909 170-90-76', platform: 'telegram', subjects: 'Каллиграфия', status: 'active' },
        't4': { id: 't4', name: 'Светлана (Мат)', phone: '900 236-99-90', platform: 'teams', subjects: 'Математика', status: 'active' },
        't5': { id: 't5', name: 'Агапе (Логопед)', phone: '906 296-91-25', platform: 'offline', subjects: 'Логопедия', status: 'active' }
    };

    // Полная миграция старых данных (Логопед -> Логопедия, Калиграф -> Каллиграфия)
    function migrateSchedule(schedule) {
        if (!schedule) return [];
        return schedule.map(item => {
            let s = item.subject;
            if (s === 'Логопед') s = 'Логопедия';
            if (s === 'Калиграф' || s === 'Калиграфия') s = 'Каллиграфия';
            
            // Если есть старый телефон, создадим/привяжем teacherId
            if (item.phone && !item.teacherId) {
                const existing = Object.values(state.teachers).find(t => t.phone === item.phone || t.name === item.phone);
                if (existing) {
                    item.teacherId = existing.id;
                } else {
                    const newId = 't_' + Date.now() + Math.random().toString(36).substr(2, 5);
                    state.teachers[newId] = {
                        id: newId,
                        name: item.phone,
                        phone: item.phone,
                        subjects: s,
                        status: 'active'
                    };
                    item.teacherId = newId;
                }
            }
            return { ...item, subject: s };
        });
    }

    // Состояние
    let state = {
        teachers: JSON.parse(localStorage.getItem('teachers_v2')) || initialTeachers,
        activeSchedule: [],
        draftSchedule: [],
        sleepLogs: JSON.parse(localStorage.getItem('sleepLogs')) || [],
        currentVersion: localStorage.getItem('currentVersion') || 'active',
        editMode: localStorage.getItem('editMode') !== 'false'
    };

    // Загрузка расписания с миграцией
    const rawActive = JSON.parse(localStorage.getItem('schedule_active')) || initialSchedule;
    const rawDraft = JSON.parse(localStorage.getItem('schedule_draft')) || JSON.parse(JSON.stringify(initialSchedule));
    state.activeSchedule = migrateSchedule(rawActive);
    state.draftSchedule = migrateSchedule(rawDraft);

    // Старые данные учителей (если есть) можно перенести
    const oldTeachers = JSON.parse(localStorage.getItem('teachers')) || {};
    if (Object.keys(oldTeachers).length > 0 && Object.keys(state.teachers).length === Object.keys(initialTeachers).length) {
        Object.entries(oldTeachers).forEach(([phone, data]) => {
            const newId = 't_' + Date.now() + Math.random().toString(36).substr(2, 5);
            state.teachers[newId] = {
                id: newId,
                name: phone,
                phone: phone,
                bank: data.bank || '',
                cardNumber: data.card || '',
                status: data.status || 'active'
            };
        });
        localStorage.removeItem('teachers'); // Удаляем старый формат
    }


    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const hours = Array.from({ length: 14 }, (_, i) => i + 7);

    // Селекторы
    const grid = document.getElementById('scheduleGrid');
    const modeToggle = document.getElementById('modeToggle');
    const modeLabel = document.getElementById('modeLabel');
    const activeTabBtn = document.getElementById('activeTab');
    const draftTabBtn = document.getElementById('draftTab');
    const studyTimeText = document.getElementById('studyTimeText');
    const restTimeText = document.getElementById('restTimeText');
    const subjectBreakdownArea = document.getElementById('subjectBreakdownArea');
    
    // Модалка занятия
    const modalOverlay = document.getElementById('modalOverlay');
    const scheduleForm = document.getElementById('scheduleForm');
    const editIdInput = document.getElementById('editId');
    const subjectInput = document.getElementById('subjectInput');
    const teacherSelect = document.getElementById('teacherSelect');
    const phoneInput = document.getElementById('phoneInput');
    const durationInput = document.getElementById('durationInput');
    const colorInput = document.getElementById('colorInput');

    function getCurrentSchedule() {
        return state.currentVersion === 'active' ? state.activeSchedule : state.draftSchedule;
    }

    function saveState() {
        localStorage.setItem('teachers_v2', JSON.stringify(state.teachers));
        localStorage.setItem('schedule_active', JSON.stringify(state.activeSchedule));
        localStorage.setItem('schedule_draft', JSON.stringify(state.draftSchedule));
        localStorage.setItem('sleepLogs', JSON.stringify(state.sleepLogs));
        localStorage.setItem('currentVersion', state.currentVersion);
        localStorage.setItem('editMode', state.editMode);
        renderStats();
    }

    // === Глобальная аналитика ===
    function renderStats() {
        if (!studyTimeText || !restTimeText || !subjectBreakdownArea) return;
        const schedule = getCurrentSchedule();
        const studyMinutes = schedule.reduce((acc, item) => acc + (parseInt(item.duration) || 0), 0);
        studyTimeText.textContent = `${(studyMinutes / 60).toFixed(1)} ч`;
        const totalWeeklyMinutes = 7 * 14 * 60;
        const restMinutes = totalWeeklyMinutes - studyMinutes;
        restTimeText.textContent = `${(restMinutes / 60).toFixed(1)} ч`;

        // Разбивка по предметам
        const summary = {};
        schedule.forEach(item => {
            const subject = item.subject || 'Без названия';
            if (!summary[subject]) summary[subject] = { min: 0, count: 0 };
            summary[subject].min += parseInt(item.duration) || 0;
            summary[subject].count++;
        });

        subjectBreakdownArea.innerHTML = '';
        Object.entries(summary).sort((a, b) => b[1].min - a[1].min).forEach(([name, data]) => {
            const sc = getSubjectColor(name);
            const card = document.createElement('div');
            card.className = 'subject-card';
            card.style.borderLeftColor = sc.border;
            card.style.background = sc.bg;
            card.innerHTML = `
                <span class="subject-name" style="color:${sc.text}">${name}</span>
                <span class="subject-hours">${(data.min / 60).toFixed(1)} ч (${data.min} мин, ${data.count} зан.)</span>
            `;
            subjectBreakdownArea.appendChild(card);
        });
    }

    // === Сетка расписания ===
    function renderGrid() {
        if (!grid) return;
        grid.innerHTML = '';
        grid.style.gridTemplateColumns = `60px repeat(${days.length}, 1fr)`;

        // Заголовки
        const corner = document.createElement('div');
        corner.className = 'grid-header corner';
        grid.appendChild(corner);

        days.forEach(day => {
            const h = document.createElement('div');
            h.className = 'grid-header day-name';
            h.textContent = day;
            grid.appendChild(h);
        });

        // Ячейки
        const schedule = getCurrentSchedule();
        hours.forEach(hour => {
            const tl = document.createElement('div');
            tl.className = 'time-label';
            tl.textContent = `${hour < 10 ? '0' + hour : hour}:00`;
            grid.appendChild(tl);

            days.forEach((_, dayIndex) => {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.day = dayIndex;
                cell.dataset.hour = hour;

                if (state.editMode) {
                    cell.addEventListener('dragover', e => { e.preventDefault(); cell.classList.add('drag-over'); });
                    cell.addEventListener('dragleave', () => cell.classList.remove('drag-over'));
                    cell.addEventListener('drop', e => {
                        e.preventDefault();
                        cell.classList.remove('drag-over');
                        const itemId = e.dataTransfer.getData('text/plain');
                        const item = getCurrentSchedule().find(i => i.id === itemId);
                        if (item) {
                            item.day = parseInt(cell.dataset.day);
                            item.hour = parseInt(cell.dataset.hour);
                            saveState();
                            renderGrid();
                        }
                    });
                    // Клик по пустой ячейке добавляет новое занятие
                    cell.addEventListener('click', e => {
                        if (e.target === cell) openModal(null, dayIndex, hour);
                    });
                }

                const items = schedule.filter(i => i.day == dayIndex && i.hour == hour);
                items.forEach(item => {
                    const sc = getSubjectColor(item.subject);
                    const teacher = state.teachers[item.teacherId];
                    const teacherName = teacher ? (teacher.name || teacher.phone) : (item.phone || '');
                    
                    const pData = teacher && teacher.platform ? PLATFORM_ICONS[teacher.platform] : null;
                    const pLink = teacher && teacher.platformLink ? teacher.platformLink : '#';
                    const linkTarget = teacher && teacher.platformLink ? 'target="_blank"' : '';

                    const block = document.createElement('div');
                    block.className = 'schedule-block';
                    block.draggable = state.editMode;
                    block.style.background = sc.bg;
                    block.style.borderLeftColor = sc.border;
                    block.style.color = sc.text;
                    
                    let actionsHtml = '';
                    if (state.editMode) {
                        actionsHtml = `
                            <div class="block-actions">
                                <button class="action-icon edit-icon" title="Редактировать">📝</button>
                                <button class="action-icon delete-icon" title="Удалить">🗑</button>
                            </div>
                        `;
                    }

                    let platformHtml = '';
                    if (pData) {
                        platformHtml = `
                            <a href="${pLink}" ${linkTarget} class="platform-badge" title="${pData.name}" onclick="event.stopPropagation()">
                                ${pData.icon} <span>${pData.name}</span>
                            </a>
                        `;
                    }

                    block.innerHTML = `
                        ${actionsHtml}
                        <div class="block-subject" title="${item.subject}">${item.subject || 'Занятие'}</div>
                        <div class="block-teacher" title="${teacherName}">${teacherName}</div>
                        <div class="block-meta">
                            <span class="block-duration">⏱ ${item.duration} мин</span>
                            ${platformHtml}
                        </div>
                    `;

                    if (state.editMode) {
                        block.addEventListener('dragstart', e => {
                            e.dataTransfer.setData('text/plain', item.id);
                            setTimeout(() => block.style.opacity = '0.4', 0);
                        });
                        block.addEventListener('dragend', () => block.style.opacity = '1');
                        
                        // Редактирование
                        const editBtn = block.querySelector('.edit-icon');
                        if (editBtn) {
                            editBtn.addEventListener('click', e => {
                                e.stopPropagation();
                                openModal(item);
                            });
                        }
                        
                        // Удаление
                        const delBtn = block.querySelector('.delete-icon');
                        if (delBtn) {
                            delBtn.addEventListener('click', e => {
                                e.stopPropagation();
                                if (state.currentVersion === 'active') {
                                    state.activeSchedule = state.activeSchedule.filter(i => i.id !== item.id);
                                } else {
                                    state.draftSchedule = state.draftSchedule.filter(i => i.id !== item.id);
                                }
                                saveState();
                                renderGrid();
                            });
                        }
                    }
                    cell.appendChild(block);
                });
                grid.appendChild(cell);
            });
        });

        // === Итоговая строка под каждым днём ===
        const summaryLabel = document.createElement('div');
        summaryLabel.className = 'time-label summary-label';
        summaryLabel.textContent = 'Итого';
        grid.appendChild(summaryLabel);

        days.forEach((_, dayIndex) => {
            const dayItems = schedule.filter(i => i.day == dayIndex);
            const totalMin = dayItems.reduce((s, i) => s + (parseInt(i.duration) || 0), 0);
            const uniqueSubjects = new Set(dayItems.map(i => i.subject)).size;

            const cell = document.createElement('div');
            cell.className = 'grid-cell summary-cell';
            cell.innerHTML = `
                <div class="summary-row"><span class="summary-icon">📚</span> ${dayItems.length} зан.</div>
                <div class="summary-row"><span class="summary-icon">🎯</span> ${uniqueSubjects} предм.</div>
                <div class="summary-row"><span class="summary-icon">⏱</span> ${(totalMin / 60).toFixed(1)} ч</div>
            `;
            grid.appendChild(cell);
        });
    }

    // === Заполнение селекта преподавателей ===
    function populateTeacherSelect() {
        teacherSelect.innerHTML = '<option value="">— Создать нового (вписать тел.) —</option>';
        Object.values(state.teachers).forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id;
            const subStr = t.subjects ? ` [${t.subjects}]` : '';
            opt.textContent = `${t.name || t.phone}${subStr} ${t.status !== 'active' ? '(не активен)' : ''}`;
            teacherSelect.appendChild(opt);
        });
    }

    teacherSelect?.addEventListener('change', () => {
        const id = teacherSelect.value;
        if (id && state.teachers[id]) {
            phoneInput.value = state.teachers[id].phone || state.teachers[id].name;
        }
    });

    subjectInput?.addEventListener('change', () => {
        const subject = subjectInput.value;
        if (subject) {
            const sc = getSubjectColor(subject);
            colorInput.value = sc.border;
        }
    });

    // === Модальное окно занятия ===
    function openModal(item = null, day = 0, hour = 7) {
        if (!state.editMode) return;
        populateTeacherSelect();
        modalOverlay.classList.add('active');
        
        if (item) {
            editIdInput.value = item.id;
            
            // Если предмет отсутствует в списке, добавим его временно (хотя теперь список фикс.)
            let optExists = Array.from(subjectInput.options).some(o => o.value === item.subject);
            if (!optExists && item.subject) {
                const opt = document.createElement('option');
                opt.value = opt.textContent = item.subject;
                subjectInput.appendChild(opt);
            }
            
            subjectInput.value = item.subject || '';
            teacherSelect.value = item.teacherId || '';
            phoneInput.value = item.phone || '';
            
            if (item.teacherId && state.teachers[item.teacherId]) {
                phoneInput.value = state.teachers[item.teacherId].phone || state.teachers[item.teacherId].name || item.phone || '';
            }

            durationInput.value = item.duration || 60;
            const sc = getSubjectColor(item.subject);
            colorInput.value = sc.border;
            document.getElementById('modalTitle').textContent = '📝 Редактировать занятие';
        } else {
            editIdInput.value = '';
            subjectInput.value = '';
            teacherSelect.value = '';
            phoneInput.value = '';
            durationInput.value = 60;
            colorInput.value = '#0984e3';
            editIdInput.dataset.newDay = day;
            editIdInput.dataset.newHour = hour;
            document.getElementById('modalTitle').textContent = '➕ Добавить занятие';
        }
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        scheduleForm.reset();
    }

    document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
    
    // Закрытие модалок по клику вне контента
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => { 
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });

    scheduleForm?.addEventListener('submit', e => {
        e.preventDefault();
        const id = editIdInput.value;
        const phone = phoneInput.value.trim();
        const subject = subjectInput.value;
        let tId = teacherSelect.value;

        // Если учитель не выбран, но введен телефон/контакт — создаем нового
        if (!tId && phone) {
            tId = 't_' + Date.now();
            state.teachers[tId] = {
                id: tId,
                name: phone,
                phone: phone,
                subjects: subject,
                status: 'active'
            };
        }

        const data = {
            subject: subject,
            teacherId: tId,
            phone: phone, // для обратной совместимости или если учитель удален
            duration: parseInt(durationInput.value) || 60
        };

        const schedule = getCurrentSchedule();
        if (id) {
            const item = schedule.find(i => i.id === id);
            if (item) Object.assign(item, data);
        } else {
            schedule.push({
                id: Date.now().toString(),
                day: parseInt(editIdInput.dataset.newDay),
                hour: parseInt(editIdInput.dataset.newHour),
                ...data
            });
        }
        
        saveState();
        renderGrid();
        closeModal();
    });

    // === Режимы и вкладки ===
    modeToggle.checked = state.editMode;
    document.body.classList.toggle('view-mode', !state.editMode);
    modeLabel.textContent = state.editMode ? 'Редактирование' : 'Просмотр';
    if (state.currentVersion === 'draft') {
        draftTabBtn.classList.add('active');
        activeTabBtn.classList.remove('active');
    }

    modeToggle.addEventListener('change', () => {
        state.editMode = modeToggle.checked;
        modeLabel.textContent = state.editMode ? 'Редактирование' : 'Просмотр';
        document.body.classList.toggle('view-mode', !state.editMode);
        saveState();
        renderGrid();
    });

    activeTabBtn.addEventListener('click', () => {
        state.currentVersion = 'active';
        activeTabBtn.classList.add('active');
        draftTabBtn.classList.remove('active');
        saveState();
        renderGrid();
    });

    draftTabBtn.addEventListener('click', () => {
        state.currentVersion = 'draft';
        draftTabBtn.classList.add('active');
        activeTabBtn.classList.remove('active');
        saveState();
        renderGrid();
    });


    // ==========================================
    // ПРОДВИНУТАЯ СИСТЕМА ПРЕПОДАВАТЕЛЕЙ
    // ==========================================
    
    const teachersModal = document.getElementById('teachersModal');
    const teacherEditModal = document.getElementById('teacherEditModal');
    const teacherForm = document.getElementById('teacherForm');
    const teacherSortBy = document.getElementById('teacherSortBy');

    document.getElementById('manageTeachersBtn')?.addEventListener('click', () => {
        renderTeachersList();
        teachersModal.classList.add('active');
    });

    document.getElementById('closeTeachersBtn')?.addEventListener('click', () => {
        teachersModal.classList.remove('active');
    });

    document.getElementById('addTeacherBtn')?.addEventListener('click', () => {
        openTeacherModal(null);
    });

    teacherSortBy?.addEventListener('change', renderTeachersList);

    function renderTeachersList() {
        const list = document.getElementById('teachersList');
        if (!list) return;
        list.innerHTML = '';

        let teachersArr = Object.values(state.teachers);
        const sortVal = teacherSortBy?.value || 'name';

        teachersArr.sort((a, b) => {
            if (sortVal === 'price') return (b.pricePerLesson || 0) - (a.pricePerLesson || 0);
            if (sortVal === 'status') {
                const w = { 'active': 3, 'temporary': 2, 'inactive': 1 };
                return w[b.status || 'inactive'] - w[a.status || 'inactive'];
            }
            if (sortVal === 'subject') return (a.subjects || '').localeCompare(b.subjects || '');
            return (a.name || '').localeCompare(b.name || '');
        });

        // Группировка
        let lastGroup = null;

        teachersArr.forEach(t => {
            // Заголовок группы
            let currentGroup = null;
            if (sortVal === 'subject') currentGroup = t.subjects || 'Без предмета';
            if (sortVal === 'status') {
                if (t.status === 'active') currentGroup = '✅ Активные';
                else if (t.status === 'temporary') currentGroup = '⏸ Временно недоступны';
                else currentGroup = '❌ Неактивные';
            }

            if (currentGroup && currentGroup !== lastGroup) {
                const divider = document.createElement('div');
                divider.className = 'teacher-group-header';
                divider.textContent = currentGroup;
                list.appendChild(divider);
                lastGroup = currentGroup;
            }

            const pData = t.platform ? PLATFORM_ICONS[t.platform] : null;
            const priceHtml = t.pricePerLesson ? `<span class="teacher-price">${t.pricePerLesson} ₽ / занятие</span>` : '';

            const div = document.createElement('div');
            div.className = `teacher-card ${t.status !== 'active' ? 'teacher-inactive' : ''}`;
            div.innerHTML = `
                <div class="tc-header">
                    <div class="tc-name">${t.name || t.phone || 'Без имени'}</div>
                    <span class="status-badge status-${t.status || 'active'}">${t.status === 'active' ? 'Активен' : t.status === 'temporary' ? 'Временно' : 'Неактивен'}</span>
                </div>
                <div class="tc-body">
                    <p>📞 ${t.phone || '—'}</p>
                    <p>📧 ${t.email || '—'}</p>
                    <p>✈️ ${t.telegram || '—'}</p>
                    <p>🌐 Платформа: ${pData ? pData.icon + ' ' + pData.name : '—'}</p>
                    <p>💳 Банк: ${getBankName(t.bank)}</p>
                    <p>📚 Предметы: ${t.subjects || '—'}</p>
                    ${priceHtml}
                </div>
                <div class="tc-footer">
                    <button class="primary-btn sm-btn edit-t-btn" data-id="${t.id}">📝 Изменить</button>
                    ${t.telegram ? `<a href="https://t.me/${t.telegram.replace('@','')}" target="_blank" class="secondary-btn sm-btn tg-btn">Написать</a>` : ''}
                </div>
            `;

            div.querySelector('.edit-t-btn').addEventListener('click', () => {
                openTeacherModal(t);
            });

            list.appendChild(div);
        });
    }

    function getBankName(val) {
        const banks = {
            'sber': 'Сбербанк', 'alfa': 'Альфа-Банк', 'vtb': 'ВТБ', 
            'tinkoff': 'Тинькофф', 'raiffeisen': 'Райффайзен', 
            'foreign': 'Зарубежный', 'other': 'Другой'
        };
        return banks[val] || '—';
    }

    function openTeacherModal(t) {
        if (t) {
            document.getElementById('teacherEditTitle').textContent = '📋 Карточка преподавателя';
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
            document.getElementById('teacherPrice').value = t.pricePerLesson || '';
            
            document.getElementById('teacherSubjects').value = t.subjects || '';
            document.getElementById('teacherStatus').value = t.status || 'active';
            document.getElementById('teacherWorkedBefore').checked = !!t.workedBefore;
            
            document.getElementById('deleteTeacherBtn').style.display = 'inline-block';
        } else {
            document.getElementById('teacherEditTitle').textContent = '➕ Добавить преподавателя';
            teacherForm.reset();
            document.getElementById('editTeacherId').value = '';
            document.getElementById('teacherStatus').value = 'active';
            document.getElementById('deleteTeacherBtn').style.display = 'none';
        }
        teacherEditModal.classList.add('active');
    }

    teacherForm?.addEventListener('submit', e => {
        e.preventDefault();
        
        let tId = document.getElementById('editTeacherId').value;
        if (!tId) {
            tId = 't_' + Date.now();
        }

        state.teachers[tId] = {
            id: tId,
            name: document.getElementById('teacherName').value.trim(),
            phone: document.getElementById('teacherPhone').value.trim(),
            email: document.getElementById('teacherEmail').value.trim(),
            telegram: document.getElementById('teacherTelegram').value.trim(),
            platform: document.getElementById('teacherPlatform').value,
            platformLink: document.getElementById('teacherPlatformLink').value.trim(),
            bank: document.getElementById('teacherBank').value,
            cardNumber: document.getElementById('teacherCard').value.trim(),
            cardType: document.getElementById('teacherCardType').value,
            pricePerLesson: parseInt(document.getElementById('teacherPrice').value) || 0,
            subjects: document.getElementById('teacherSubjects').value.trim(),
            status: document.getElementById('teacherStatus').value,
            workedBefore: document.getElementById('teacherWorkedBefore').checked
        };
        
        // Фоллбэк имени для сетки
        if (!state.teachers[tId].name && state.teachers[tId].phone) {
            state.teachers[tId].name = state.teachers[tId].phone;
        }

        saveState();
        renderTeachersList();
        renderGrid(); // Обновить имена в расписании
        teacherEditModal.classList.remove('active');
    });

    document.getElementById('deleteTeacherBtn')?.addEventListener('click', () => {
        const tId = document.getElementById('editTeacherId').value;
        if (tId && confirm('Удалить карточку преподавателя? Значение в расписании останется как текст.')) {
            delete state.teachers[tId];
            saveState();
            renderTeachersList();
            renderGrid();
            teacherEditModal.classList.remove('active');
        }
    });

    document.getElementById('cancelTeacherEdit')?.addEventListener('click', () => {
        teacherEditModal.classList.remove('active');
    });

    document.getElementById('logSleepBtn')?.addEventListener('click', () => {
        const sleep = prompt('Время отхода ко сну (ЧЧ:ММ):');
        const wake = prompt('Время пробуждения (ЧЧ:ММ):');
        if (sleep && wake) {
            state.sleepLogs.push({ date: new Date().toLocaleDateString(), sleep, wake });
            saveState();
            alert('Журнал обновлен!');
        }
    });

    // Инициализация
    renderGrid();
    renderStats();
});
