document.addEventListener('DOMContentLoaded', () => {
    // Состояние приложения
    let state = {
        teachers: JSON.parse(localStorage.getItem('teachers')) || [],
        schedule: JSON.parse(localStorage.getItem('schedule')) || [],
        sleepLogs: JSON.parse(localStorage.getItem('sleepLogs')) || []
    };

    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 07:00 - 20:00

    // Инициализация UI
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
        const studyTime = state.schedule.reduce((acc, item) => acc + (parseInt(item.duration) || 0), 0);
        document.getElementById('studyTime').textContent = `Учеба: ${Math.round(studyTime / 60 * 10) / 10} ч`;
        
        // Логика расчета отдыха будет доработана позже
        document.getElementById('restTime').textContent = `Отдых: ... ч`;
    }

    function renderGrid() {
        grid.innerHTML = '';
        
        // Создаем заголовок с днями недели
        grid.style.gridTemplateColumns = `60px repeat(${days.length}, 1fr)`;
        
        // Пустой угол
        const corner = document.createElement('div');
        corner.className = 'grid-header';
        grid.appendChild(corner);

        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'grid-header day-name';
            dayHeader.textContent = day;
            grid.appendChild(dayHeader);
        });

        // Генерируем строки по часам
        hours.forEach(hour => {
            const timeLabel = document.createElement('div');
            timeLabel.className = 'time-label';
            timeLabel.textContent = `${hour}:00`;
            grid.appendChild(timeLabel);

            days.forEach((day, dayIndex) => {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.day = dayIndex;
                cell.dataset.hour = hour;
                
                // Рендерим занятия в этой ячейке
                const items = state.schedule.filter(i => i.day == dayIndex && i.hour == hour);
                items.forEach(item => {
                    const block = document.createElement('div');
                    block.className = 'schedule-block';
                    block.style.backgroundColor = item.color || '#white';
                    block.innerHTML = `
                        <div class="block-phone">${item.phone || ''}</div>
                        <div class="block-subject">${item.subject || ''}</div>
                        <div class="block-duration">${item.duration} мин</div>
                    `;
                    cell.appendChild(block);
                });

                cell.addEventListener('click', () => addScheduleItem(dayIndex, hour));
                grid.appendChild(cell);
            });
        });
    }

    function addScheduleItem(day, hour) {
        const subject = prompt('Предмет:');
        if (!subject) return;
        
        const phone = prompt('Телефон преподавателя:');
        const duration = prompt('Длительность (мин):', '60');
        
        const newItem = {
            id: Date.now(),
            day,
            hour,
            subject,
            phone,
            duration: parseInt(duration),
            color: '#e3f2fd'
        };

        state.schedule.push(newItem);
        saveState();
        renderGrid();
    }

    manageTeachersBtn.addEventListener('click', () => {
        alert('Управление учителями: скоро здесь будет список телефонов.');
    });

    logSleepBtn.addEventListener('click', () => {
        alert('Журнал сна: ребенок сможет отмечать время отдыха.');
    });

    renderGrid();
    renderStats();
});
