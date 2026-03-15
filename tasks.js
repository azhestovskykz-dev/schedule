// ===================== TASKS MODULE =====================

function renderTasks() {
    let ht = `
        <div class="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            ${[1,2,3,4,5,6,7,8,9,10].map(i => {
                let active = state.tasksView === i;
                let labels = [
                    '1: Стандарт Канбан', '2: По приоритету', '3: По дням недели', '4: Карточки-списки', '5: Хронология',
                    '6: Плотная таблица', '7: Матрица Эйзенхауэра', '8: Календарь-Сетка', '9: Прогресс статусов', '10: Сквозной список'
                ];
                return `<button onclick="state.tasksView=${i}; render();" class="px-5 py-2.5 rounded-2xl text-[14px] font-black shadow-sm transition-all whitespace-nowrap ${active ? 'bg-amber-500 text-white' : 'bg-white text-slate-500 border border-slate-200'}">${labels[i-1]}</button>`;
            }).join('')}
        </div>
        <div id="tasks-content">
            ${renderTasksContent()}
        </div>
    `;
    return ht;
}

function renderTasksContent() {
    if (state.tasksView === 1) return viewTasks1_Status();
    if (state.tasksView === 2) return viewTasks2_Priority();
    if (state.tasksView === 3) return viewTasks3_Days();
    if (state.tasksView === 4) return viewTasks4_Compact();
    if (state.tasksView === 5) return viewTasks5_Timeline();
    if (state.tasksView === 6) return viewTasks6_DenseTable();
    if (state.tasksView === 7) return viewTasks7_Eisenhower();
    if (state.tasksView === 8) return viewTasks8_CalendarMicro();
    if (state.tasksView === 9) return viewTasks9_StatKanban();
    if (state.tasksView === 10) return viewTasks10_DetailedList();
    return '';
}

// --- V1: Status Kanban ---
function viewTasks1_Status() {
    const cols = [
        {id: 'todo', name: 'К выполнению', color: 'bg-slate-100', text: 'text-slate-600'},
        {id: 'inprogress', name: 'В процессе', color: 'bg-blue-50', text: 'text-blue-600'},
        {id: 'done', name: 'Готово', color: 'bg-emerald-50', text: 'text-emerald-600'}
    ];
    
    let ht = `<div class="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide">`;
    cols.forEach(col => {
        ht += `<div class="flex-none w-[85%] md:w-[320px] snap-center ${col.color} rounded-3xl p-4 border border-slate-200">
            <div class="font-black text-lg ${col.text} mb-4 flex justify-between items-center">
                <span>${col.name}</span>
                <span class="bg-white px-2 py-0.5 rounded-lg text-sm">${state.tasks.filter(t=>t.status===col.id).length}</span>
            </div>
            <div class="space-y-3">`;
            
        state.tasks.filter(t => t.status === col.id).forEach(task => ht += buildTaskCard(task));
        
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V2: Priority Kanban ---
function viewTasks2_Priority() {
    const cols = [
        {id: 'high', name: 'Высокий', border: 'border-t-rose-500'},
        {id: 'medium', name: 'Средний', border: 'border-t-amber-500'},
        {id: 'low', name: 'Низкий', border: 'border-t-blue-500'}
    ];
    
    let ht = `<div class="grid grid-cols-1 md:grid-cols-3 gap-6">`;
    cols.forEach(col => {
        ht += `<div class="bg-white rounded-3xl p-4 border border-slate-200 border-t-4 ${col.border} shadow-sm">
            <div class="font-black text-lg text-slate-700 mb-4">${col.name} приоритет</div>
            <div class="space-y-3">`;
        state.tasks.filter(t => t.priority === col.id).forEach(task => ht += buildTaskCard(task));
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V3: Days Kanban ---
function viewTasks3_Days() {
    let ht = `<div class="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">`;
    DAYS.forEach(day => {
        const dTasks = state.tasks.filter(t => t.day === day);
        ht += `<div class="flex-none w-[280px] bg-slate-50/50 rounded-2xl p-3 border border-slate-100">
            <div class="font-bold text-slate-500 uppercase text-center mb-3">${day}</div>
            <div class="space-y-2">`;
        if (dTasks.length === 0) ht += `<div class="text-xs text-center text-slate-300 italic">Нет задач</div>`;
        dTasks.forEach(task => ht += buildTaskCard(task, true));
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V4: Compact List ---
function viewTasks4_Compact() {
    let ht = `<div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <ul class="divide-y divide-slate-100">`;
    state.tasks.forEach(task => {
        const statColor = task.status==='done' ? 'text-emerald-500' : task.status==='inprogress' ? 'text-blue-500' : 'text-slate-400';
        ht += `<li class="p-4 hover:bg-slate-50 flex items-center justify-between gap-4 transition-colors">
            <div class="flex items-center gap-3">
                <div class="${statColor}">${task.status==='done' ? '✓' : '○'}</div>
                <div class="font-bold text-slate-700 ${task.status==='done' ? 'line-through opacity-50' : ''}">${task.title}</div>
            </div>
            <div class="flex gap-2 text-xs font-bold">
                <span class="bg-slate-100 text-slate-500 px-2 py-1 rounded-md">${task.day}</span>
                <span class="${task.priority==='high'?'text-rose-500 bg-rose-50':'text-slate-500 bg-slate-50'} px-2 py-1 rounded-md">${task.priority === 'high' ? 'Высокий' : 'Обычный'}</span>
            </div>
        </li>`;
    });
    ht += `</ul></div>`;
    return ht;
}

// --- V5: Timeline/Agenda ---
function viewTasks5_Timeline() {
    let ht = `<div class="max-w-2xl mx-auto space-y-6">`;
    DAYS.forEach(day => {
        const dTasks = state.tasks.filter(t => t.day === day);
        if (dTasks.length === 0) return;
        ht += `<div>
            <div class="flex items-center gap-4 mb-3">
                <div class="font-black text-xl text-slate-800 uppercase">${day}</div>
                <div class="h-px bg-slate-200 flex-1"></div>
            </div>
            <div class="pl-4 border-l-2 border-slate-100 space-y-3">`;
        dTasks.forEach(task => ht += buildTaskCard(task));
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

function buildTaskCard(task, compact=false) {
    const pDict = { high: 'bg-rose-100 text-rose-600', medium: 'bg-amber-100 text-amber-600', low: 'bg-blue-100 text-blue-600' };
    const pLabel = { high: 'Высокий', medium: 'Средний', low: 'Низкий' };
    
    return `<div class="bg-white p-3 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]">
        <div class="flex justify-between items-start mb-2">
            <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded flex items-center ${pDict[task.priority]}">${pLabel[task.priority]}</span>
            <span class="text-xs font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">${task.day}</span>
        </div>
        <div class="font-bold text-slate-700 text-sm leading-snug ${task.status==='done'?'line-through opacity-50':''}">${task.title}</div>
    </div>`;
}

// --- V6: Dense Table ---
function viewTasks6_DenseTable() {
    let ht = `<div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase">
                <tr><th class="p-3">Статус</th><th class="p-3">Задача</th><th class="p-3">День</th><th class="p-3">Приоритет</th></tr>
            </thead>
            <tbody class="divide-y divide-slate-100">`;
    const sDict = { todo: '⏳ Ждет', inprogress: '🔄 В работе', done: '✅ Готово' };
    const sCol = { todo: 'text-slate-500', inprogress: 'text-blue-500', done: 'text-emerald-500' };
    const pCol = { high: 'text-rose-500', medium: 'text-amber-500', low: 'text-blue-500' };
    state.tasks.forEach(t => {
        ht += `<tr class="hover:bg-slate-50 transition-colors">
            <td class="p-3 text-xs font-bold ${sCol[t.status]}">${sDict[t.status]}</td>
            <td class="p-3 font-semibold text-slate-800 ${t.status==='done'?'line-through opacity-50':''}">${t.title}</td>
            <td class="p-3 font-mono text-xs text-slate-500">${t.day}</td>
            <td class="p-3 text-xs font-black ${pCol[t.priority]} uppercase">${t.priority}</td>
        </tr>`;
    });
    ht += `</tbody></table></div>`;
    return ht;
}

// --- V7: Eisenhower Matrix ---
function viewTasks7_Eisenhower() {
    // Mock logic for Matrix: 
    // Important+Urgent (High Priority + Today/Tomorrow)
    // Important+Not Urgent (High/Medium Priority)
    // Not Important+Urgent (Low Priority, near days)
    // Not Important+Not Urgent (Low priority)
    // For demo: group just by priority vs status
    const highTodo = state.tasks.filter(t=>t.priority==='high' && t.status!=='done');
    const medTodo = state.tasks.filter(t=>t.priority==='medium' && t.status!=='done');
    const lowTodo = state.tasks.filter(t=>t.priority==='low' && t.status!=='done');
    const doneTasks = state.tasks.filter(t=>t.status==='done');
    
    let ht = `<div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">`;
    const quadrants = [
        {title: 'Срочно и Важно', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', tasks: highTodo},
        {title: 'Не срочно, но Важно', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', tasks: medTodo},
        {title: 'Срочно, но Не важно', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', tasks: lowTodo},
        {title: 'Готово (Архив)', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', tasks: doneTasks}
    ];
    
    quadrants.forEach(q => {
        ht += `<div class="${q.bg} border ${q.border} rounded-3xl p-5 shadow-sm min-h-[250px] flex flex-col">
            <h3 class="font-black text-lg ${q.text} mb-4">${q.title}</h3>
            <div class="space-y-2 flex-1 overflow-y-auto pr-2">`;
        if(q.tasks.length===0) ht += `<div class="text-sm opacity-50 italic">Пусто</div>`;
        q.tasks.forEach(task => {
            ht += `<div class="bg-white/80 p-2.5 rounded-xl text-sm font-semibold text-slate-700 shadow-sm border border-white/50 backdrop-blur-sm flex justify-between">
                <span>${task.title}</span><span class="text-xs opacity-50 font-bold">${task.day}</span>
            </div>`;
        });
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V8: Calendar Micro ---
function viewTasks8_CalendarMicro() {
    let ht = `<div class="max-w-6xl mx-auto flex flex-wrap justify-center gap-3">`;
    DAYS.forEach(day => {
        const dTasks = state.tasks.filter(t => t.day === day);
        ht += `<div class="w-36 bg-white rounded-2xl border border-slate-200 p-3 shadow-sm hover:shadow-md transition-shadow">
            <div class="text-center font-black text-slate-400 uppercase text-xs mb-3 border-b border-slate-100 pb-2">${day}</div>
            <div class="space-y-1.5 min-h-[80px]">`;
        dTasks.forEach(t => {
            let color = t.status==='done' ? 'bg-emerald-100 text-emerald-700' : t.priority==='high' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700';
            ht += `<div class="${color} text-[10px] font-bold p-1.5 rounded-md leading-tight truncate cursor-pointer hover:whitespace-normal" title="${t.title}">${t.title}</div>`;
        });
        if(dTasks.length===0) ht += `<div class="text-center text-[10px] text-slate-300">-</div>`;
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V9: Stat Kanban ---
function viewTasks9_StatKanban() {
    let ht = `<div class="max-w-4xl mx-auto space-y-6">`;
    const stats = [
        {name: 'К выполнению', id: 'todo', color: 'bg-slate-400'},
        {name: 'В процессе', id: 'inprogress', color: 'bg-blue-500'},
        {name: 'Завершено', id: 'done', color: 'bg-emerald-500'}
    ];
    
    stats.forEach(s => {
        const tList = state.tasks.filter(t=>t.status===s.id);
        const percent = Math.round((tList.length / (state.tasks.length||1)) * 100);
        ht += `<div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div class="flex justify-between items-end mb-3">
                <div class="font-black text-xl text-slate-700">${s.name}</div>
                <div class="font-bold text-3xl" style="color:${s.color.replace('bg-','text-')}">${tList.length} <span class="text-sm text-slate-400">(${percent}%)</span></div>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden"><div class="${s.color} h-3 rounded-full" style="width: ${percent}%"></div></div>
            <div class="flex flex-wrap gap-2">`;
        tList.forEach(t => ht += `<span class="bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-600 px-3 py-1.5 rounded-xl shadow-sm">${t.title}</span>`);
        if(tList.length===0) ht += `<span class="text-slate-400 text-sm italic">Нет задач в этой категории</span>`;
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V10: Detailed List ---
function viewTasks10_DetailedList() {
    let ht = `<div class="max-w-5xl mx-auto space-y-3">`;
    state.tasks.forEach(t => {
        let sc = t.status==='done'?'bg-emerald-50 border-emerald-200':'bg-white border-slate-200';
        let pc = t.priority==='high'?'text-rose-500':'text-slate-400';
        ht += `<div class="${sc} border rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-indigo-300 transition-colors">
            <div class="flex items-start gap-4 flex-1">
                <div class="mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${t.status==='done'?'border-emerald-500 bg-emerald-500 text-white':'border-slate-300'}">
                    ${t.status==='done'?'✓':''}
                </div>
                <div>
                    <h3 class="font-bold text-lg text-slate-800 ${t.status==='done'?'line-through opacity-60':''}">${t.title}</h3>
                    <div class="text-sm text-slate-500 mt-1">Детальное описание задачи (placeholder). Необходимо выполнить до конца дня.</div>
                </div>
            </div>
            <div class="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 w-full sm:w-auto">
                <div class="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-black rounded-lg uppercase">${t.day}</div>
                <div class="text-xs font-bold ${pc} uppercase flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-current"></span> ${t.priority}</div>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}
