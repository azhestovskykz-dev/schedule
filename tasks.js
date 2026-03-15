// ===================== TASKS MODULE =====================

function renderTasks() {
    let ht = `
        <div class="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            ${[1,2,3,4,5].map(i => {
                let active = state.tasksView === i;
                let labels = ['1: Стандарт Канбан', '2: По приоритету', '3: По дням недели', '4: Карточки-списки', '5: Хронология'];
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
