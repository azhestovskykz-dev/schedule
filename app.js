document.addEventListener('DOMContentLoaded', () => {
    // Состояние приложения
    let state = {
        teachers: JSON.parse(localStorage.getItem('teachers')) || {}, // { phone: color }
        schedule: JSON.parse(localStorage.getItem('schedule')) || [],
        sleepLogs: JSON.parse(localStorage.getItem('sleepLogs')) || []
    };

    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 07:00 - 20:00

    const grid = document.getElementById('scheduleGrid');
    const manageTeachersBtn = document.getElementById('manageTeachersBtn');
    const logSleepBtn = document.getElementById('logSleepBtn');

    function saveState() {
        localStorage.setItem('teachers', JSON.stringify(state.teachers));
        localStorage.setItem('schedule', JSON.stringify(state.schedule));
        localStorage.setItem('sleepLogs', JSON.stringify(state.sleepLogs));
        renderStats();
    }

    function renderStats() {
        const studyMinutes = state.schedule.reduce((acc, item) => acc + (parseInt(item.duration) || 0), 0);
        document.getElementById('studyTime').textContent = `Учеба: ${Math.round(studyMinutes / 60 * 10) / 10} ч`;
        
        const totalDayMinutes = 14 * 60; // 07:00 - 21:00
        const restMinutes = totalDayMinutes - studyMinutes;
        document.getElementById('restTime').textContent = `Отдых: ${Math.round(restMinutes / 60 * 10) / 10} ч`;
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
                
                const items = state.schedule.filter(i => i.day == dayIndex && i.hour == hour);
                items.forEach(item => {
                    const block = document.createElement('div');
                    block.className = 'schedule-block';
                    block.style.borderLeftColor = item.color || '#0984e3';
                    block.innerHTML = `
                        <div class="block-actions">
                            <span class="delete-btn" title="Удалить">×</span>
                        </div>
                        <div class="block-phone">${item.phone || 'Нет тел.'}</div>
                        <div class="block-subject">${item.subject || 'Занятие'}</div>
                        <div class="block-duration">${item.duration} мин</div>
                    `;
                    
                    // Клик по блоку: Редактирование
                    block.addEventListener('click', (e) => {
                        e.stopPropagation();
                        editScheduleItem(item.id);
                    });

                    // Удаление
                    block.querySelector('.delete-btn').addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (confirm('Удалить это занятие?')) {
                            state.schedule = state.schedule.filter(i => i.id !== item.id);
                            saveState();
                            renderGrid();
                        }
                    });

                    cell.appendChild(block);
                });

                cell.addEventListener('click', (e) => {
                    if (e.target === cell) addScheduleItem(dayIndex, hour);
                });
                grid.appendChild(cell);
            });
        });
    }

    function getTeacherColor(phone) {
        if (!phone) return '#0984e3';
        if (state.teachers[phone]) return state.teachers[phone];
        
        const colors = ['#0984e3', '#6c5ce7', '#00cec9', '#fab1a0', '#ffeaa7', '#fdcb6e', '#e17055'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        state.teachers[phone] = color;
        return color;
    }

    function addScheduleItem(day, hour) {
        const subject = prompt('Название предмета:');
        if (!subject) return;
        const phone = prompt('Телефон преподавателя:');
        const duration = prompt('Длительность (мин):', '60');
        
        const color = getTeacherColor(phone);
        
        const newItem = {
            id: Date.now().toString(),
            day,
            hour,
            subject,
            phone,
            duration: parseInt(duration) || 60,
            color
        };

        state.schedule.push(newItem);
        saveState();
        renderGrid();
    }

    function editScheduleItem(id) {
        const item = state.schedule.find(i => i.id === id);
        if (!item) return;

        const newSubject = prompt('Новое название предмета:', item.subject);
        if (newSubject === null) return;
        
        const newPhone = prompt('Новый телефон:', item.phone);
        const newDuration = prompt('Новая длительность (мин):', item.duration);
        
        item.subject = newSubject;
        item.phone = newPhone;
        item.duration = parseInt(newDuration) || 60;
        item.color = getTeacherColor(newPhone);

        saveState();
        renderGrid();
    }

    manageTeachersBtn.addEventListener('click', () => {
        const list = Object.entries(state.teachers).map(([p, c]) => `${p}`).join('\n');
        alert('Список учителей в базе:\n' + (list || 'Пусто'));
    });

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
