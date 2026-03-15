// ===================== TEACHERS MODULE =====================

function renderTeachers() {
    let ht = `
        <div class="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            ${[1, 2, 3, 4, 5].map(i => {
                let active = state.teachersView === i;
                let labels = ['1: Текущий вид (Сетка)', '2: Канбан по предметам', '3: Компакт списками', '4: Таблица', '5: Группами'];
                return `<button onclick="state.teachersView=${i}; render();" class="px-5 py-2.5 rounded-2xl text-[14px] font-black shadow-sm transition-all whitespace-nowrap ${active ? 'bg-indigo-500 text-white' : 'bg-white text-slate-500 border border-slate-200'}">${labels[i-1]}</button>`;
            }).join('')}
        </div>
        <div class="mb-6 flex justify-between items-center max-w-7xl mx-auto mt-2">
            <h2 class="text-2xl font-black text-slate-800">Преподаватели</h2>
            <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl text-[15px] font-black shadow-sm transition-all flex items-center gap-2">
                ${ICONS.plus}
                Добавить
            </button>
        </div>
        <div id="teachers-content">
            ${renderTeachersContent()}
        </div>
    `;
    return ht;
}

function renderTeachersContent() {
    if (state.teachersView === 1) return viewTeachers1_Grid();
    if (state.teachersView === 2) return viewTeachers2_Kanban();
    if (state.teachersView === 3) return viewTeachers3_CompactKanban();
    if (state.teachersView === 4) return viewTeachers4_Table();
    if (state.teachersView === 5) return viewTeachers5_List();
    return '';
}

// Helper to get grouped teachers
function getTeachersGroupedBySubject() {
    const groups = {};
    state.teachers.forEach(t => {
        if(t.id === 't0') return;
        const subjName = t.name.split(' (')[0];
        if(!groups[subjName]) groups[subjName] = [];
        groups[subjName].push(t);
    });
    return groups;
}

// --- V1: Current Grid ---
function viewTeachers1_Grid() {
    let ht = `<div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">`;
    state.teachers.forEach(t => {
        if(t.id === 't0') return;
        ht += buildTeacherCard(t);
    });
    ht += `</div>`;
    return ht;
}

// --- V2: Kanban by Subjects ---
function viewTeachers2_Kanban() {
    const groups = getTeachersGroupedBySubject();
    let ht = `<div class="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide items-start">`;
    
    Object.keys(groups).forEach(subjName => {
        const tList = groups[subjName];
        let color = getSubjectColor(subjName);
        
        ht += `<div class="flex-none w-[320px] snap-center bg-slate-50 rounded-3xl p-4 border border-slate-200">
            <div class="font-black text-lg mb-4 flex justify-between items-center" style="color: ${color}">
                <span>${subjName}</span>
                <span class="bg-white px-2 py-0.5 rounded-lg text-sm text-slate-400 shadow-sm">${tList.length}</span>
            </div>
            <div class="space-y-3">`;
            
        tList.forEach(t => ht += buildTeacherCardCompact(t));
        
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V3: Compact Kanban (2 rows style) ---
function viewTeachers3_CompactKanban() {
    const groups = getTeachersGroupedBySubject();
    
    let ht = `<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">`;
    Object.keys(groups).forEach(subjName => {
        const tList = groups[subjName];
        let color = getSubjectColor(subjName);
        
        ht += `<div class="bg-white rounded-md overflow-hidden flex flex-col shadow-sm border" style="border-color: ${color}">
            <div class="p-1 px-2 flex justify-between items-center text-white" style="background-color: ${color}">
                <div class="font-bold text-[14px] leading-none tracking-tight">${subjName}</div>
                <div class="font-black text-[13px] flex items-center gap-1 bg-white/20 px-1.5 py-0.5 rounded-sm">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    ${tList.length}
                </div>
            </div>
            <div class="p-1 space-y-[2px] bg-slate-50 flex-1">`;
        tList.forEach((t, i) => {
            let n = t.name.replace(subjName+' ', '');
            ht += `<div class="flex items-center gap-2 p-1.5 bg-white rounded-sm hover:bg-slate-50 cursor-pointer group">
                <span class="font-black text-[11px] text-slate-800 w-3 text-right group-hover:text-indigo-600">${i+1}</span>
                <span class="font-semibold text-[13px] text-slate-700 truncate flex-1 group-hover:text-indigo-600 transition-colors">${n}</span>
            </div>`;
        });
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V4: Table ---
function viewTeachers4_Table() {
    let ht = `<div class="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
        <table class="w-full text-left text-sm">
            <thead>
                <tr class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <th class="p-4">Предмет</th>
                    <th class="p-4">Имя / Контакт</th>
                    <th class="p-4">Платформа</th>
                    <th class="p-4 text-right">Ставка</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">`;
            
    const groups = getTeachersGroupedBySubject();
    Object.keys(groups).forEach(subjName => {
        let color = getSubjectColor(subjName);
        groups[subjName].forEach((t, i) => {
            let rowSpan = i === 0 ? `rowspan="${groups[subjName].length}"` : '';
            let subjCell = i === 0 ? `<td ${rowSpan} class="p-4 border-r border-slate-100 align-top">
                <div class="inline-block px-3 py-1 rounded-lg text-white font-black text-xs uppercase" style="background-color: ${color}">${subjName}</div>
            </td>` : '';
            
            ht += `<tr class="hover:bg-slate-50 transition-colors">
                ${subjCell}
                <td class="p-4">
                    <div class="font-bold text-slate-800">${t.name.split(' (')[0] === subjName ? t.name.replace(subjName+' ', '') : t.name}</div>
                    <div class="text-xs text-slate-500 mt-0.5">${t.phone || 'Нет телефона'}</div>
                </td>
                <td class="p-4 font-semibold text-slate-600">${t.platform || 'Лично'}</td>
                <td class="p-4 text-right font-bold text-slate-700 font-mono">${t.cost} ₸</td>
            </tr>`;
        });
    });
            
    ht += `</tbody></table></div>`;
    return ht;
}

// --- V5: Grouped List ---
function viewTeachers5_List() {
    const groups = getTeachersGroupedBySubject();
    let ht = `<div class="max-w-5xl mx-auto space-y-6">`;
    Object.keys(groups).forEach(subjName => {
        const tList = groups[subjName];
        let color = getSubjectColor(subjName);
        ht += `<div>
            <div class="flex items-center gap-3 mb-4 border-b-2 pb-2" style="border-color: ${color}">
                <div class="w-4 h-4 rounded-full" style="background-color: ${color}"></div>
                <h3 class="font-black text-xl text-slate-800">${subjName}</h3>
                <span class="text-sm font-bold text-slate-400 ml-auto">${tList.length} преподавателей</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-slate-100">`;
        tList.forEach(t => ht += buildTeacherCardCompact(t));
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// ===================== HELPER COMPONENTS =====================

function buildTeacherCard(t) {
    const subjName = t.name.split(' (')[0];
    let color = getSubjectColor(subjName);
    
    return `<div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col h-full bg-gradient-to-b from-white to-slate-50/50 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1" style="background-color: ${color}"></div>
        <div class="flex gap-4 items-center mb-5">
            <div class="w-14 h-14 rounded-full flex justify-center items-center font-black text-2xl text-white shadow-inner" style="background-color: ${color}">
                ${t.name.charAt(0).toUpperCase()}
            </div>
            <div>
                <div class="font-black text-xl text-slate-800 leading-tight">${subjName}</div>
                <div class="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">${t.id}</div>
            </div>
        </div>
        
        <div class="space-y-3 flex-1">
            <div class="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100">
                <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                    ${ICONS.phone}
                </div>
                <div class="font-bold text-slate-700 text-sm">${t.phone || 'Не указан'}</div>
            </div>
            
            <div class="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100">
                <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                    ${ICONS.video}
                </div>
                <div class="font-bold text-slate-700 text-sm">${t.platform || 'Лично'}</div>
            </div>
        </div>
        
        <div class="mt-5 pt-4 border-t border-slate-200/60 flex justify-between items-center">
            <div class="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">${t.cost} ₸ / час</div>
            
            <div class="flex gap-2">
                <button class="w-9 h-9 bg-white text-indigo-600 rounded-xl flex items-center justify-center border border-slate-200 hover:bg-slate-50 transition-colors">
                    ${ICONS.edit}
                </button>
                <button class="w-9 h-9 bg-white text-rose-500 rounded-xl flex items-center justify-center border border-slate-200 hover:bg-slate-50 transition-colors">
                    ${ICONS.trash}
                </button>
            </div>
        </div>
    </div>`;
}

function buildTeacherCardCompact(t) {
    const subjName = t.name.split(' (')[0];
    const nameOnly = t.name.replace(subjName+' ', '').trim() || t.name;
    let color = getSubjectColor(subjName);
    
    return `<div class="bg-white p-3 rounded-xl shadow-sm border border-slate-100 hover:border-slate-300 transition-colors group cursor-pointer border-l-4" style="border-left-color: ${color}">
        <div class="flex justify-between items-start mb-2">
            <div class="font-bold text-slate-700 text-[14px] leading-snug group-hover:text-indigo-600 transition-colors">${nameOnly}</div>
            <div class="text-[9px] font-black text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full uppercase">${t.id}</div>
        </div>
        <div class="flex flex-col gap-1.5">
            <div class="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <div class="w-4 h-4 rounded grid place-items-center bg-emerald-50 text-emerald-500">${ICONS.phone.replace('width="16" height="16"', 'width="10" height="10"')}</div>
                ${t.phone || '-'}
            </div>
            <div class="flex justify-between items-end">
                <div class="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    <div class="w-4 h-4 rounded grid place-items-center bg-blue-50 text-blue-500">${ICONS.video.replace('width="16" height="16"', 'width="10" height="10"')}</div>
                    ${t.platform || '-'}
                </div>
                <div class="text-[10px] font-black tracking-wide text-slate-500 bg-slate-100/50 px-2 py-1">${t.cost} ₸/ч</div>
            </div>
        </div>
    </div>`;
}
