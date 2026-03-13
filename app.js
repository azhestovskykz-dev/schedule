document.addEventListener('DOMContentLoaded', () => {
    // Состояние приложения
    let state = {
        teachers: JSON.parse(localStorage.getItem('teachers')) || [],
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
        
        // Примерный расчет отдыха (упрощенно)
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

    function addScheduleItem(day, hour) {
        const subject = prompt('Название предмета:');
        if (!subject) return;
        
        const phone = prompt('Телефон или Имя преподавателя:');
        const duration = prompt('Длительность в минутах:', '60');
        
        const colors = ['#084e3', '#6c5ce7', '#00cec9', '#fab1a0', '#ffeaa7'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const newItem = {
            id: Date.now(),
            day,
            hour,
            subject,
            phone,
            duration: parseInt(duration) || 60,
            color: randomColor
        };

        state.schedule.push(newItem);
        saveState();
        renderGrid();
    }

    manageTeachersBtn.addEventListener('click', () => {
        alert('Список учителей (по телефонам):\n' + 
            (state.schedule.map(s => s.phone).filter((v, i, a) => v && a.indexOf(v) === i).join('\n') || 'Пока нет учителей'));
    });

    logSleepBtn.addEventListener('click', () => {
        const sleep = prompt('Во сколько ребенок лег спать? (например, 22:00)');
        const wake = prompt('Во сколько ребенок проснулся? (например, 07:00)');
        if (sleep && wake) {
            state.sleepLogs.push({ date: new Date().toLocaleDateString(), sleep, wake });
            saveState();
            alert('Данные о сне сохранены!');
        }
    });

    renderGrid();
    renderStats();
});
