// ===================== TEACHERS MODULE =====================

function renderTeachers() {
    let ht = `
        <div class="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(i => {
                let active = state.teachersView === i;
                return `<button onclick="state.teachersView=${i}; render();" class="px-5 py-2.5 rounded-2xl text-[14px] font-black shadow-sm transition-all whitespace-nowrap ${active ? 'bg-indigo-500 text-white' : 'bg-white text-slate-500 border border-slate-200'}">${i}</button>`;
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
    if (state.teachersView === 6) return viewTeachers6_TimeGrid();
    if (state.teachersView === 7) return viewTeachers7_CardsAlt();
    if (state.teachersView === 8) return viewTeachers8_DenseTable();
    if (state.teachersView === 9) return viewTeachers9_TimelineTags();
    if (state.teachersView === 10) return viewTeachers10_Directory();
    if (state.teachersView === 11) return viewTeachers11_PriceMatrix();
    if (state.teachersView === 12) return viewTeachers12_UniKanban();
    if (state.teachersView === 13) return viewTeachers13_UniVertBar();
    if (state.teachersView === 14) return viewTeachers14_UniSolidTags();
    if (state.teachersView === 15) return viewTeachers15_UniBorderBottom();
    if (state.teachersView === 16) return viewTeachers16_UniMinimalist();
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

// --- V7: Cards Alt (Modern gradient cards) ---
function viewTeachers7_CardsAlt() {
    let ht = `<div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">`;
    state.teachers.forEach(t => {
        if(t.id === 't0') return;
        const subjName = t.name.split(' (')[0];
        let color = getSubjectColor(subjName);
        let nameOnly = t.name.replace(subjName+' ', '').trim() || t.name;
        
        ht += `<div class="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-3xl p-5 shadow-sm hover:-translate-y-1 transition-transform relative overflow-hidden group">
            <div class="absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-10 transition-transform group-hover:scale-150" style="background:${color}"></div>
            <div class="flex items-center gap-4 mb-4 relative z-10">
                <div class="w-12 h-12 rounded-2xl flex justify-center items-center text-white font-black text-xl shadow-md rotate-3" style="background:${color}">
                    ${nameOnly.charAt(0)}
                </div>
                <div>
                    <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">${subjName}</div>
                    <div class="font-bold text-slate-800 text-lg leading-tight -mt-0.5">${nameOnly}</div>
                </div>
            </div>
            <div class="space-y-2 relative z-10">
                <div class="flex items-center justify-between text-sm bg-white border border-slate-100 px-3 py-2 rounded-xl">
                    <span class="text-slate-400 font-bold">${ICONS.phone.replace('width="16"', 'width="14"').replace('height="16"', 'height="14"')}</span>
                    <span class="font-bold text-slate-600">${t.phone || '-'}</span>
                </div>
                <div class="flex items-center justify-between text-sm bg-white border border-slate-100 px-3 py-2 rounded-xl">
                    <span class="text-slate-400 font-bold">${ICONS.video.replace('width="16"', 'width="14"').replace('height="16"', 'height="14"')}</span>
                    <span class="font-bold text-slate-600">${t.platform || '-'}</span>
                </div>
                <div class="flex items-center justify-between text-sm bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-xl mt-4">
                    <span class="text-indigo-400 font-bold uppercase text-[10px] tracking-wide">Ставка</span>
                    <span class="font-black text-indigo-700 font-mono">${t.cost} ₸</span>
                </div>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V8: Dense Table ---
function viewTeachers8_DenseTable() {
    let ht = `<div class="max-w-5xl mx-auto overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
        <table class="w-full text-left text-xs text-slate-600">
            <thead class="bg-slate-100/50 text-[10px] uppercase font-black tracking-widest text-slate-400">
                <tr>
                    <th class="py-2 px-4 border-b border-slate-200">ID</th>
                    <th class="py-2 px-4 border-b border-slate-200">Предмет</th>
                    <th class="py-2 px-4 border-b border-slate-200">ФИО</th>
                    <th class="py-2 px-4 border-b border-slate-200">Телефон</th>
                    <th class="py-2 px-4 border-b border-slate-200">Платформа</th>
                    <th class="py-2 px-4 border-b border-slate-200 text-right">Ставка</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-semibold cursor-pointer">`;
    state.teachers.forEach(t => {
        if(t.id === 't0') return;
        const subjName = t.name.split(' (')[0];
        let nameOnly = t.name.replace(subjName+' ', '').trim() || t.name;
        let color = getSubjectColor(subjName);
        
        ht += `<tr class="hover:bg-indigo-50 hover:text-indigo-900 transition-colors">
            <td class="py-2.5 px-4 font-mono text-slate-400">${t.id}</td>
            <td class="py-2.5 px-4">
                <span class="inline-block w-2 h-2 rounded-full mr-1" style="background:${color}"></span>
                ${subjName}
            </td>
            <td class="py-2.5 px-4 text-slate-800 font-bold">${nameOnly}</td>
            <td class="py-2.5 px-4">${t.phone || '-'}</td>
            <td class="py-2.5 px-4">${t.platform || '-'}</td>
            <td class="py-2.5 px-4 text-right font-mono">${t.cost}</td>
        </tr>`;
    });
    ht += `</tbody></table></div>`;
    return ht;
}

// --- V9: Timeline tags (Visual distribution approximation) ---
function viewTeachers9_TimelineTags() {
    let ht = `<div class="max-w-4xl mx-auto space-y-4">`;
    const groups = getTeachersGroupedBySubject();
    Object.keys(groups).forEach(subjName => {
        let color = getSubjectColor(subjName);
        ht += `<div class="flex flex-col md:flex-row bg-white rounded-full p-2 pr-6 items-center gap-4 shadow-sm border border-slate-100">
            <div class="px-6 py-2 rounded-full text-white font-black text-sm uppercase tracking-wide shrink-0 shadow-inner" style="background:${color}">
                ${subjName}
            </div>
            <div class="flex flex-wrap gap-2 py-1">`;
            
        groups[subjName].forEach(t => {
            let nameOnly = t.name.replace(subjName+' ', '').trim() || t.name;
            ht += `<div class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors shadow-sm border border-slate-200 flex items-center gap-2">
                ${nameOnly}
                <span class="text-[9px] font-black text-slate-400 px-1.5 py-0.5 rounded-full bg-white">${t.cost}</span>
            </div>`;
        });
            
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V10: Directory (A-Z style lists) ---
function viewTeachers10_Directory() {
    // Group all by first letter of their name (excluding subject part)
    let bGroups = {};
    state.teachers.forEach(t => {
        if(t.id === 't0') return;
        const subjName = t.name.split(' (')[0];
        let nameOnly = t.name.replace(subjName+' ', '').trim() || t.name;
        let letter = (nameOnly.charAt(0) || '?').toUpperCase();
        if(/[A-ZА-Я]/.test(letter) === false) letter = '#';
        if(!bGroups[letter]) bGroups[letter] = [];
        bGroups[letter].push({...t, nameOnly, subjName});
    });
    
    let letters = Object.keys(bGroups).sort();
    let ht = `<div class="max-w-6xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">`;
    letters.forEach(l => {
        ht += `<div class="break-inside-avoid bg-white rounded-3xl p-6 border border-slate-200">
            <div class="text-4xl font-black text-slate-200 border-b-2 border-slate-100 pb-2 mb-4">${l}</div>
            <div class="space-y-4">`;
            
        bGroups[l].sort((a,b)=>a.nameOnly.localeCompare(b.nameOnly)).forEach(t => {
            let color = getSubjectColor(t.subjName);
            ht += `<div class="group cursor-pointer">
                <div class="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">${t.nameOnly}</div>
                <div class="flex items-center gap-2 mt-1">
                    <span class="w-1.5 h-1.5 rounded-full" style="background:${color}"></span>
                    <span class="text-xs font-bold text-slate-400">${t.subjName}</span>
                    <span class="text-slate-300 px-1">•</span>
                    <span class="text-xs font-mono text-slate-500">${t.phone || 'Нет тел.'}</span>
                </div>
            </div>`;
        });
            
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V11: Price Matrix (grouped by cost ranges) ---
function viewTeachers11_PriceMatrix() {
    let ranges = {
        'До 1500 ₸/ч': [],
        '1500 - 3000 ₸/ч': [],
        'Свыше 3000 ₸/ч': []
    };
    
    state.teachers.forEach(t => {
        if(t.id === 't0') return;
        let c = t.cost;
        if(c < 1500) ranges['До 1500 ₸/ч'].push(t);
        else if (c <= 3000) ranges['1500 - 3000 ₸/ч'].push(t);
        else ranges['Свыше 3000 ₸/ч'].push(t);
    });
    
    let ht = `<div class="max-w-5xl mx-auto flex flex-col md:flex-row gap-4">`;
    Object.keys(ranges).forEach(rName => {
        ht += `<div class="flex-1 bg-white border-2 border-slate-100 rounded-3xl p-5 hover:border-emerald-200 transition-colors">
            <h3 class="font-black text-center text-slate-400 uppercase tracking-widest text-xs mb-4">${rName}</h3>
            <div class="space-y-2">`;
            
        if(ranges[rName].length===0) ht += `<div class="text-center text-sm italic text-slate-300 py-4">Нет преподавателей</div>`;
        
        ranges[rName].sort((a,b)=>a.cost-b.cost).forEach(t => {
            let subjName = t.name.split(' (')[0];
            let nameOnly = t.name.replace(subjName+' ', '').trim() || t.name;
            let color = getSubjectColor(subjName);
            ht += `<div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div class="flex items-center gap-3">
                    <div class="w-2 h-8 rounded-full" style="background:${color}"></div>
                    <div>
                        <div class="text-sm font-bold text-slate-700">${nameOnly}</div>
                        <div class="text-[10px] uppercase font-black text-slate-400">${subjName}</div>
                    </div>
                </div>
                <div class="font-mono font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 text-xs">${t.cost}</div>
            </div>`;
        });
            
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

// --- V6: Matrix Time/Day (Based on User Screenshot Request) ---
function viewTeachers6_TimeGrid() {
    let ht = `<div class="max-w-7xl mx-auto space-y-12">`;
    
    // Group logic: Subject -> Time -> Items
    let groups = {}; 
    
    DAYS.forEach(d => {
        if(!state.schedule[d]) return;
        Object.keys(state.schedule[d]).forEach(t => {
            state.schedule[d][t].forEach(item => {
                let subjP = state.subjects.find(s=>s.id === item.subjectId);
                let subjName = subjP ? subjP.name : 'Неизвестно';
                
                if(!groups[subjName]) groups[subjName] = {};
                if(!groups[subjName][t]) groups[subjName][t] = [];
                
                groups[subjName][t].push({...item, day: d});
            });
        });
    });

    if (Object.keys(groups).length === 0) {
        return `<div class="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">Расписание не заполнено для построения сетки по времени.</div>`;
    }

    Object.keys(groups).forEach(subjName => {
        let subjColor = getSubjectColor(subjName);
        let subjTimes = Object.keys(groups[subjName]).sort();
        
        // Subject header + days axis
        ht += `<div>
            <div class="flex flex-col sm:flex-row justify-between sm:items-end border-b-2 pb-2 mb-6" style="border-color:${subjColor}">
                <h3 class="font-black text-2xl text-slate-800 flex items-center gap-2">
                    <div class="w-4 h-4 rounded-full shadow-sm" style="background:${subjColor}"></div>
                    ${subjName}
                </h3>
                <div class="text-sm font-bold text-slate-400 mt-2 sm:mt-0 uppercase tracking-widest">${subjTimes.length > 0 ? Object.values(groups[subjName]).flat().length : 0} ПРЕПОДАВАТЕЛЕЙ</div>
            </div>
            
            <div class="space-y-6">`;
            
        subjTimes.forEach((time, index) => {
            let items = groups[subjName][time];
            items.sort((a,b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day));
            
            ht += `<div class="flex flex-col sm:flex-row gap-6 items-start relative pb-6 ${index < subjTimes.length-1 ? 'border-b-4 border-red-600' : ''}">
                <div class="w-24 shrink-0 font-black text-4xl text-red-600 tracking-tighter mt-1" style="line-height: 0.8;">
                    ${time.replace(':', '.')}
                </div>
                
                <div class="flex-1 flex flex-wrap gap-4">`;
                
            items.forEach(it => {
                let tInfo = state.teachers.find(x => x.id === it.teacherId);
                if(!tInfo) return;
                let dayD = it.day; // e.g. "Пн"
                let nameO = tInfo.name.split(' (')[0] || tInfo.name;
                
                ht += `<div class="bg-white rounded-xl p-3 w-[260px] shadow-sm flex flex-col justify-between relative overflow-hidden group" style="box-shadow: 0 4px 0 0 ${subjColor}; border: 1px solid #e2e8f0; border-top: none;">
                    
                    <div class="absolute top-0 w-full h-1 left-0" style="background:${subjColor}"></div>
                    <div class="absolute -top-4 -right-4 w-12 h-12 rounded-full opacity-10 font-black text-4xl group-hover:scale-110 transition-transform flex items-center justify-center" style="background:${subjColor}; color:white">${dayD}</div>

                    <div class="flex justify-between items-start mb-3 mt-1 relative z-10">
                        <div class="font-bold text-slate-800 flex flex-col">
                            <span class="text-[15px] leading-tight">${nameO}</span>
                            <span class="text-[11px] font-black uppercase text-slate-400 tracking-wider">${dayD}</span>
                        </div>
                        <div class="text-[10px] font-black uppercase text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">${tInfo.id}</div>
                    </div>
                    
                    <div class="flex items-center gap-2 mb-3 text-[13px] font-bold text-emerald-600 relative z-10">
                        <div class="w-5 h-5 rounded flex items-center justify-center bg-emerald-50">${ICONS.phone.replace('width="16"', 'width="12"').replace('height="16"', 'height="12"')}</div>
                        ${tInfo.phone || '-'}
                    </div>
                    
                    <div class="flex justify-between items-end text-xs font-bold relative z-10 pt-2 border-t border-slate-100">
                        <div class="flex items-center gap-1.5 text-slate-500">
                            <div class="w-5 h-5 rounded flex items-center justify-center bg-blue-50 text-blue-500">${ICONS.video.replace('width="16"', 'width="12"').replace('height="16"', 'height="12"')}</div>
                            ${tInfo.platform || '-'}
                        </div>
                        <div class="text-slate-700 bg-slate-50 px-2 py-1 rounded-md">${tInfo.cost} ₸/ч</div>
                    </div>
                    
                </div>`;
            });
            
            ht += `</div></div>`;
        });
        
        ht += `</div></div>`;
    });

    ht += `</div>`;
    return ht;
}


// ================ UNIFIED DESIGN TEACHERS VIEWS (V12-V16) ================
function viewTeachers12_UniKanban() {
    let ht = `<div class="max-w-6xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">`;
    state.teachers.forEach(t => {
        ht += `<div class="break-inside-avoid bg-white border border-slate-100 rounded-[20px] shadow-sm p-4 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-center mb-3">
                <span class="px-2 py-0.5 rounded text-[10px] uppercase font-black text-indigo-600 bg-indigo-50">${t.subject}</span>
                <span class="text-slate-400 text-xs font-bold leading-none bg-slate-50 px-2.5 py-1 rounded-md tracking-widest">${t.rate}₽</span>
            </div>
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xl shrink-0 border border-slate-200">${t.avatar}</div>
                <div>
                    <div class="text-slate-800 font-bold text-[15px] leading-tight">${t.name}</div>
                    <div class="text-[11px] font-mono text-slate-400">${t.phone}</div>
                </div>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

function viewTeachers13_UniVertBar() {
    let ht = `<div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">`;
    state.teachers.forEach((t, i) => {
        let cols = ['bg-rose-400', 'bg-amber-400', 'bg-emerald-400', 'bg-cyan-400', 'bg-indigo-400', 'bg-violet-400'];
        let col = cols[i % cols.length];
        ht += `<div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex gap-4 items-center hover:-translate-y-0.5 transition-transform">
            <div class="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-2xl shrink-0">${t.avatar}</div>
            <div class="w-1.5 h-10 rounded-full shrink-0 ${col}"></div>
            <div class="flex-1 min-w-0">
                <div class="text-slate-800 font-black tracking-wide text-sm truncate">${t.name}</div>
                <div class="text-slate-400 text-[11px] font-semibold mt-1 truncate">${t.subject} • ${t.rate}₽/ч</div>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

function viewTeachers14_UniSolidTags() {
    let ht = `<div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">`;
    state.teachers.forEach((t, i) => {
        let cols = ['bg-rose-500', 'bg-amber-500', 'bg-emerald-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-violet-500'];
        let bgCol = cols[i % cols.length];
        
        ht += `<div class="bg-white border border-slate-100 rounded-[24px] shadow-sm p-5 flex flex-col hover:border-indigo-200 transition-colors h-full">
            <div class="flex justify-between items-start mb-5">
                <span class="px-2 py-1 text-white rounded-md text-[9px] uppercase font-black tracking-widest leading-none shadow-sm ${bgCol}">${t.subject}</span>
                <span class="font-black text-slate-500 bg-slate-50 px-3 py-1 rounded-lg text-xs font-mono border border-slate-100">${t.rate}₽</span>
            </div>
            <div class="text-slate-800 font-bold mb-4 flex-1 text-[16px] leading-tight flex items-center gap-2">
                ${t.avatar} ${t.name}
            </div>
            <div class="flex justify-between items-center text-[10px] text-slate-400 font-bold pt-3 border-t border-slate-50 font-mono text-right">
                <span>${t.phone}</span>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

function viewTeachers15_UniBorderBottom() {
    let ht = `<div class="max-w-4xl mx-auto space-y-3">`;
    state.teachers.forEach((t, i) => {
        let cols = ['border-b-rose-400', 'border-b-amber-400', 'border-b-emerald-400', 'border-b-cyan-400', 'border-b-indigo-400', 'border-b-violet-400'];
        let bBottomCol = cols[i % cols.length];
        
        ht += `<div class="bg-white border text-sm border-slate-100 shadow-sm rounded-2xl p-4 border-b-4 flex flex-col sm:flex-row justify-between sm:items-center hover:bg-slate-50 transition-colors cursor-pointer ${bBottomCol}">
            <div class="flex items-center gap-3 mb-2 sm:mb-0">
                <div class="text-lg bg-slate-50 rounded-full w-8 h-8 flex items-center justify-center">${t.avatar}</div>
                <div class="font-black text-slate-800 text-[15px] pr-2 leading-tight">${t.name}</div>
            </div>
            <div class="flex items-center justify-between sm:w-auto w-full gap-4">
                <div class="text-[10px] uppercase font-bold text-slate-400 tracking-widest">${t.subject}</div>
                <div class="font-black text-slate-500 text-sm font-mono shrink-0 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">${t.rate}₽</div>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

function viewTeachers16_UniMinimalist() {
    let ht = `<div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">`;
    state.teachers.forEach((t, i) => {
        let cols = ['bg-rose-500', 'bg-amber-400', 'bg-emerald-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-violet-500'];
        let bgCol = cols[i % cols.length];
        
        ht += `<div class="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-md hover:border-slate-300 transition-all cursor-pointer">
            <div class="p-5 flex justify-between items-center bg-gradient-to-br from-white to-slate-50/50 gap-4">
                 <div class="text-[15px] font-black text-slate-800 flex-1 leading-tight flex items-center gap-2">${t.avatar} ${t.name}</div>
                 <div class="px-2 py-1 bg-slate-800 text-white rounded-lg text-[10px] font-black shadow-sm shrink-0 uppercase tracking-widest">${t.rate}₽</div>
            </div>
            <div class="bg-slate-50/80 px-5 py-3 border-t border-slate-100 flex gap-4 text-[10px] font-bold text-slate-500 justify-between items-center">
                <span class="flex items-center gap-2 font-black uppercase tracking-widest"><div class="w-2 h-2 rounded-full ${bgCol}"></div>${t.subject}</span>
                <span class="bg-white px-2 py-1 rounded shadow-sm border border-slate-100 tracking-wider text-slate-500 font-mono">${t.phone}</span>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}