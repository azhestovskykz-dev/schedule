// ===================== TASKS MODULE =====================

function renderTasks() {
    let ht = `
        <div class="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(i => {
                let active = state.tasksView === i;
                return `<button onclick="state.tasksView=${i}; render();" class="px-5 py-2.5 rounded-2xl text-[14px] font-black shadow-sm transition-all whitespace-nowrap ${active ? 'bg-amber-500 text-white' : 'bg-white text-slate-500 border border-slate-200'}">${i}</button>`;
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
    if (state.tasksView === 11) return viewTasks11_BoardCards();
    if (state.tasksView === 12) return viewTasks12_Hexagons();
    if (state.tasksView === 13) return viewTasks13_MinimalList();
    if (state.tasksView === 14) return viewTasks14_CircleProgress();
    if (state.tasksView === 15) return viewTasks15_Grid3D();
    if (state.tasksView === 16) return viewTasks16_UniKanban();
    if (state.tasksView === 17) return viewTasks17_UniVertBar();
    if (state.tasksView === 18) return viewTasks18_UniSolidTags();
    if (state.tasksView === 19) return viewTasks19_UniBorderBottom();
    if (state.tasksView === 20) return viewTasks20_UniMinimalist();
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

// --- V11: Board Cards (Pinterest style) ---
function viewTasks11_BoardCards() {
    let ht = `<div class="max-w-6xl mx-auto columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">`;
    state.tasks.forEach(task => {
        let sc = task.status==='done'?'bg-emerald-50 border-emerald-200':'bg-white border-slate-200';
        let ph = task.priority === 'high' ? 'text-rose-600 bg-rose-50' : task.priority === 'medium' ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50';
        let titleH = task.title.length > 30 ? 'text-xl' : 'text-2xl';
        
        ht += `<div class="break-inside-avoid ${sc} border rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1">
            <div class="flex justify-between items-start mb-4">
                <span class="text-[10px] font-black uppercase px-2 py-1 rounded-lg ${ph}">${task.priority}</span>
                <span class="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">${task.day}</span>
            </div>
            <h3 class="font-black ${titleH} text-slate-800 leading-tight mb-4 ${task.status==='done'?'line-through opacity-50':''}">${task.title}</h3>
            
            <div class="flex justify-between items-center border-t border-slate-100 pt-3 mt-auto">
                <div class="flex -space-x-2">
                    <div class="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>
                    <div class="w-6 h-6 rounded-full bg-slate-300 border-2 border-white"></div>
                </div>
                <div class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V12: Hexagons Outline ---
function viewTasks12_Hexagons() {
    let ht = `<div class="max-w-5xl mx-auto flex flex-wrap justify-center gap-4">`;
    state.tasks.forEach(task => {
        let bColor = task.status==='done'?'border-emerald-400':'border-slate-300';
        if(task.status!=='done' && task.priority==='high') bColor = 'border-rose-400';
        
        ht += `<div class="relative w-44 h-48 flex items-center justify-center">
            <svg class="absolute inset-0 w-full h-full text-transparent hover:text-slate-50 transition-colors drop-shadow-sm" viewBox="0 0 100 100">
                <polygon points="50,2 96,25 96,75 50,98 4,75 4,25" fill="currentColor" stroke="currentColor" stroke-width="2" class="${bColor.replace('border-','stroke-')}"/>
            </svg>
            <div class="relative z-10 p-4 text-center flex flex-col items-center justify-center h-full w-full">
                <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">${task.day}</div>
                <div class="font-bold text-sm text-slate-800 leading-tight line-clamp-3 ${task.status==='done'?'line-through opacity-50':''}">${task.title}</div>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V13: Minimal List ---
function viewTasks13_MinimalList() {
    let ht = `<div class="max-w-3xl mx-auto space-y-1">`;
    state.tasks.forEach(task => {
        let c = task.status==='done'?'text-emerald-500':'text-slate-300';
        ht += `<div class="flex items-center gap-4 p-2 hover:bg-slate-50 cursor-pointer group rounded-lg">
            <div class="${c} group-hover:text-indigo-500 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4" class="${task.status==='done'?'':'hidden'}"/></svg>
            </div>
            <div class="font-medium text-slate-700 flex-1 ${task.status==='done'?'line-through opacity-50':''}">${task.title}</div>
            <div class="text-xs font-mono text-slate-400 w-16 text-right">${task.day}</div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V14: Circle Progress Cards ---
function viewTasks14_CircleProgress() {
    let ht = `<div class="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">`;
    state.tasks.forEach(task => {
        let pct = task.status==='done' ? 100 : task.status==='inprogress' ? 50 : 0;
        let c = task.status==='done' ? '#10b981' : task.status==='inprogress' ? '#3b82f6' : '#cbd5e1';
        
        ht += `<div class="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col items-center text-center shadow-sm hover:border-indigo-300 transition-colors cursor-pointer group">
            <div class="relative w-16 h-16 mb-3">
                <svg class="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" class="stroke-slate-100" stroke-width="3"></circle>
                    <circle cx="18" cy="18" r="16" fill="none" stroke="${c}" stroke-width="3" stroke-dasharray="100 100" stroke-dashoffset="${100-pct}" class="transition-all duration-1000"></circle>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center font-black text-[10px] text-slate-600">${pct}%</div>
            </div>
            <div class="font-bold text-sm text-slate-700 leading-tight mb-2 flex-1 group-hover:text-indigo-600 transition-colors">${task.title}</div>
            <div class="text-[9px] font-black uppercase text-slate-400 tracking-widest">${task.day}</div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V15: Grid 3D ---
function viewTasks15_Grid3D() {
    let ht = `<div class="max-w-6xl mx-auto flex flex-wrap gap-6 justify-center p-8">`;
    state.tasks.forEach((task, i) => {
        let d = i%2===0 ? 'translate-y-2' : '-translate-y-2';
        let bg = task.status==='done'?'bg-emerald-500 text-white':'bg-white text-slate-800';
        let bdr = task.status==='done'?'border-emerald-600':'border-slate-300';
        
        ht += `<div class="${bg} w-48 h-48 rounded-2xl p-5 flex flex-col justify-between shadow-[8px_8px_0px_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,0.1)] hover:translate-x-1 hover:translate-y-1 transition-all border-2 ${bdr} ${d} cursor-pointer group">
            <div class="flex justify-between items-start">
                <div class="font-black text-2xl opacity-20">#${i+1}</div>
                <div class="text-xs font-bold uppercase tracking-widest opacity-60">${task.day}</div>
            </div>
            <div class="font-bold text-lg leading-tight ${task.status==='done'?'line-through opacity-80':''}">${task.title}</div>
            <div class="h-1 w-8 rounded-full bg-current opacity-30 group-hover:w-full transition-all duration-300"></div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}


// ================ UNIFIED DESIGN TASKS VIEWS (V16-V20) ================
function viewTasks16_UniKanban() {
    let ht = `<div class="max-w-6xl mx-auto columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">`;
    state.tasks.forEach(task => {
        let sc = task.status==='done'?'opacity-50 line-through grayscale':'';
        let ph = task.priority === 'high' ? 'text-rose-600 bg-rose-50' : task.priority === 'medium' ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50';
        
        ht += `<div class="break-inside-avoid bg-white border border-slate-100 rounded-[20px] shadow-sm p-5 hover:shadow-md transition-shadow ${sc}">
            <div class="flex justify-between items-center mb-4">
                <span class="px-2 py-0.5 rounded text-[9px] uppercase font-black ${ph}">${task.priority}</span>
                <span class="text-slate-400 text-[10px] font-bold leading-none bg-slate-50 px-2.5 py-1 rounded-md tracking-wider">${task.day}</span>
            </div>
            <div class="text-slate-800 font-bold text-[15px] leading-tight">${task.title}</div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

function viewTasks17_UniVertBar() {
    let ht = `<div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">`;
    state.tasks.forEach(task => {
        let sc = task.status==='done'?'opacity-50 line-through grayscale':'';
        let col = task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-amber-400' : 'bg-blue-500';
        
        ht += `<div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex gap-4 items-center hover:-translate-y-0.5 transition-transform ${sc}">
            <div class="font-black text-lg text-slate-700 w-10 text-center shrink-0 tracking-tighter">${task.day}</div>
            <div class="w-1 h-10 rounded-full shrink-0 ${col}"></div>
            <div class="flex-1 min-w-0">
                <div class="text-slate-800 font-black tracking-wide text-sm truncate">${task.title}</div>
                <div class="text-slate-400 text-[10px] font-bold mt-1 truncate uppercase">${task.priority} приоритет</div>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

function viewTasks18_UniSolidTags() {
    let ht = `<div class="max-w-6xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">`;
    state.tasks.forEach(task => {
        let sc = task.status==='done'?'opacity-50 line-through grayscale':'';
        let bgCol = task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500';
        
        ht += `<div class="break-inside-avoid bg-white border border-slate-100 rounded-[24px] shadow-sm p-5 flex flex-col hover:border-indigo-200 transition-colors h-full ${sc}">
            <div class="flex justify-between items-start mb-5">
                <span class="px-2 py-1 text-white rounded-md text-[9px] uppercase font-black tracking-widest leading-none shadow-sm ${bgCol}">${task.priority}</span>
                <span class="font-black text-slate-500 bg-slate-50 px-3 py-1 rounded-lg text-xs font-mono border border-slate-100">${task.day}</span>
            </div>
            <div class="text-slate-800 font-bold mb-5 flex-1 text-[16px] leading-tight">${task.title}</div>
            <div class="flex justify-between items-center text-[10px] text-slate-400 font-bold pt-3 border-t border-slate-50 uppercase tracking-widest">
                <span>${task.status}</span>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

function viewTasks19_UniBorderBottom() {
    let ht = `<div class="max-w-5xl mx-auto space-y-3">`;
    state.tasks.forEach(task => {
        let sc = task.status==='done'?'opacity-50 line-through grayscale':'';
        let bBottomCol = task.priority === 'high' ? 'border-b-rose-400' : task.priority === 'medium' ? 'border-b-amber-400' : 'border-b-blue-400';
        
        ht += `<div class="bg-white border text-sm border-slate-100 shadow-sm rounded-2xl p-4 border-b-4 flex flex-col sm:flex-row justify-between sm:items-center hover:bg-slate-50 transition-colors cursor-pointer ${bBottomCol} ${sc}">
            <div class="font-black text-slate-800 text-[15px] pr-4 leading-tight mb-3 sm:mb-0">${task.title}</div>
            <div class="flex items-center justify-between sm:w-auto w-full gap-4">
                <div class="text-[10px] uppercase font-black text-slate-400 tracking-wider">${task.priority}</div>
                <div class="font-black text-slate-400 text-sm font-mono shrink-0 bg-slate-50 px-2.5 py-1 rounded-lg">${task.day}</div>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

function viewTasks20_UniMinimalist() {
    let ht = `<div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">`;
    state.tasks.forEach(task => {
        let sc = task.status==='done'?'opacity-50 grayscale':'';
        let bgCol = task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-amber-400' : 'bg-blue-500';
        
        ht += `<div class="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-md hover:border-slate-300 transition-all cursor-pointer ${sc}">
            <div class="p-5 flex justify-between items-center bg-gradient-to-br from-white to-slate-50/50 gap-4">
                 <div class="text-[14px] font-black text-slate-800 flex-1 leading-tight ${task.status==='done'?'line-through':''}">${task.title}</div>
                 <div class="px-2 py-1 ${bgCol} text-white rounded-lg text-[9px] font-black shadow-sm shrink-0 uppercase tracking-widest">${task.priority}</div>
            </div>
            <div class="bg-slate-50/80 px-5 py-3 border-t border-slate-100 flex gap-4 text-[10px] font-bold text-slate-500 justify-between items-center">
                <span class="flex items-center gap-2 uppercase tracking-widest"><div class="w-2 h-2 rounded-full ${bgCol}"></div>${task.status==='done'?'Готово':'В работе'}</span>
                <span class="bg-white px-2.5 py-1.5 rounded shadow-sm border border-slate-100 tracking-wider text-slate-600">${task.day}</span>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}