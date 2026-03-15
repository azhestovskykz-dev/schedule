import os

# 1. schedule.js
with open('schedule.js', 'w', encoding='utf-8') as f:
    f.write('''// ===================== SCHEDULE MODULE =====================
function renderSchedule() {
    let ht = `
        <div class="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            ${['today', 'week', 'week2', 'month'].map(t => {
                let label = t === 'today' ? 'Сегодня' : t === 'week' ? 'Неделя' : t === 'week2' ? '2 недели' : 'Месяц';
                let active = state.scheduleTab === t;
                return \`<button onclick="state.scheduleTab='${t}'; state.scheduleView=1; render();" class="px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all ${active ? 'bg-emerald-500 text-white' : 'bg-white text-slate-500 border border-slate-200'}">${label}</button>\`;
            }).join('')}
        </div>
        <div class="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            ${renderViewOptions()}
        </div>
        <div id="schedule-content">
            ${renderScheduleContent()}
        </div>
    `;
    return ht;
}

function renderViewOptions() {
    let count = state.scheduleTab === 'today' ? 3 : state.scheduleTab === 'week' ? 8 : state.scheduleTab === 'week2' ? 5 : 3;
    let ht = '';
    for(let i=1; i<=count; i++) {
        let active = state.scheduleView === i;
        ht += \`<button onclick="state.scheduleView=${i}; render();" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${active ? 'bg-blue-500 text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200'}">Вариант ${i}</button>\`;
    }
    return ht;
}

function renderScheduleContent() {
    return \`<div class="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div class="font-bold text-lg text-slate-700 mb-2">Отображение: ${state.scheduleTab} - Вариант ${state.scheduleView}</div>
        В разработке... Данные загружены.<br>
        Всего занятий пн-вс: ${DAYS.map(d => Object.values(state.schedule[d]).flat().length).reduce((a,b)=>a+b,0)}
    </div>\`;
}
''')

# 2. tasks.js
with open('tasks.js', 'w', encoding='utf-8') as f:
    f.write('''// ===================== TASKS MODULE =====================
function renderTasks() {
    let ht = `
        <div class="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            ${[1,2,3,4,5].map(i => {
                let active = state.tasksView === i;
                return \`<button onclick="state.tasksView=${i}; render();" class="px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all whitespace-nowrap ${active ? 'bg-amber-500 text-white' : 'bg-white text-slate-500 border border-slate-200'}">Канбан В${i}</button>\`;
            }).join('')}
        </div>
        <div class="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div class="font-bold text-lg text-slate-700 mb-2">Доска задач - Вариант ${state.tasksView}</div>
            Всего задач: ${state.tasks.length}
        </div>
    `;
    return ht;
}
''')

# 3. analytics.js
with open('analytics.js', 'w', encoding='utf-8') as f:
    f.write('''// ===================== ANALYTICS MODULE =====================
function renderAnalytics() {
    let ht = `
        <div class="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            ${[1,2,3,4,5].map(i => {
                let active = state.analyticsView === i;
                return \`<button onclick="state.analyticsView=${i}; render();" class="px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all whitespace-nowrap ${active ? 'bg-purple-500 text-white' : 'bg-white text-slate-500 border border-slate-200'}">Аналитика В${i}</button>\`;
            }).join('')}
        </div>
        <div class="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div class="font-bold text-lg text-slate-700 mb-2">Аналитика - Вариант ${state.analyticsView}</div>
            В разработке (Круговые диаграммы, гистограммы)
        </div>
    `;
    return ht;
}
''')

# 4. finance.js
with open('finance.js', 'w', encoding='utf-8') as f:
    f.write('''// ===================== FINANCE MODULE =====================
function renderFinance() {
    return `<div class="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div class="font-bold text-lg text-slate-700 mb-2">Учет Финансов</div>
        В разработке (Абонементы, баланс, расходы) <br>
        Всего записей: ${state.finances.length}
    </div>`;
}
''')

# 5. subjects.js
with open('subjects.js', 'w', encoding='utf-8') as f:
    f.write('''// ===================== SUBJECTS MODULE =====================
function renderSubjects() {
    return `<div class="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div class="font-bold text-lg text-slate-700 mb-2">Предметы</div>
        Всего предметов: ${state.subjects.length}
    </div>`;
}
''')

# 6. teachers.js
with open('teachers.js', 'w', encoding='utf-8') as f:
    f.write('''// ===================== TEACHERS MODULE =====================
function renderTeachers() {
    return `<div class="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div class="font-bold text-lg text-slate-700 mb-2">Преподаватели</div>
        Всего преподавателей: ${state.teachers.length}
    </div>`;
}
''')

# 7. Rewrite app.js (Router)
with open('app.js', 'w', encoding='utf-8') as f:
    f.write('''// ===================== ROUTER & APP CORE =====================
function render() {
    updateNavStyles();
    const area = document.getElementById('content-area');
    
    switch(state.section) {
        case 'schedule': area.innerHTML = renderSchedule(); break;
        case 'tasks': area.innerHTML = renderTasks(); break;
        case 'analytics': area.innerHTML = renderAnalytics(); break;
        case 'finance': area.innerHTML = renderFinance(); break;
        case 'subjects': area.innerHTML = renderSubjects(); break;
        case 'teachers': area.innerHTML = renderTeachers(); break;
        default: area.innerHTML = '<div class="p-8 text-center">404</div>';
    }
}

function updateNavStyles() {
    const sections = ['schedule','tasks','analytics','finance','subjects','teachers'];
    sections.forEach(s => {
        const btn = document.getElementById(`nav-${s}`);
        if(btn) {
            if(state.section === s) {
                btn.className = 'nav-btn active-nav bg-indigo-600 text-white font-bold shadow-md';
            } else {
                btn.className = 'nav-btn bg-white text-slate-500 hover:bg-slate-50 border border-slate-200 font-bold';
            }
        }
    });
}

window.setSection = (sec) => {
    state.section = sec;
    render();
}

window.onload = () => {
    if(typeof loadData === 'function') loadData();
    render();
};
''')

# 8. Rewrite index.html
with open('index.html', 'w', encoding='utf-8') as f:
    f.write('''<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Расписание PRO</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- GFonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
    <style>
        .nav-btn {
            padding: 10px 18px;
            border-radius: 12px;
            text-align: center;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 100px;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
</head>
<body class="bg-[#f8fafc] text-[#1e293b] min-h-screen relative font-sans antialiased overflow-x-hidden">

<div id="app" class="w-full min-h-screen relative pb-20 ios-bottom">
    
    <!-- TOP NAVIGATION (LEVEL 1) -->
    <div class="sticky top-0 bg-[#f8fafc]/95 backdrop-blur-md z-50 border-b border-slate-200 pt-3 pb-3">
        <nav class="flex overflow-x-auto whitespace-nowrap scrollbar-hide px-3 gap-2 max-w-7xl mx-auto">
            <button id="nav-schedule" onclick="setSection('schedule')" class="nav-btn">Расписание</button>
            <button id="nav-tasks" onclick="setSection('tasks')" class="nav-btn">Задачи</button>
            <button id="nav-analytics" onclick="setSection('analytics')" class="nav-btn">Аналитика</button>
            <button id="nav-finance" onclick="setSection('finance')" class="nav-btn">Финансы</button>
            <button id="nav-subjects" onclick="setSection('subjects')" class="nav-btn">Предметы</button>
            <button id="nav-teachers" onclick="setSection('teachers')" class="nav-btn">Преподаватели</button>
        </nav>
    </div>

    <!-- MAIN CONTENT AREA -->
    <div id="content-area" class="pt-4 px-3 max-w-7xl mx-auto">
        <!-- JS renders active section here -->
    </div>

</div>

<!-- MODULAR SCRIPTS -->
<script src="data.js"></script>
<script src="schedule.js"></script>
<script src="tasks.js"></script>
<script src="analytics.js"></script>
<script src="finance.js"></script>
<script src="subjects.js"></script>
<script src="teachers.js"></script>
<script src="app.js"></script>

</body>
</html>
''')

print("All module files generated successfully.")
