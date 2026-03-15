// ===================== SUBJECTS MODULE =====================
function renderSubjects() {
    let ht = `
        <div class="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(i => {
                let active = state.subjectsView === i;
                return `<button onclick="state.subjectsView=${i}; render();" class="px-5 py-2.5 rounded-2xl text-[14px] font-black shadow-sm transition-all whitespace-nowrap ${active ? 'bg-indigo-500 text-white' : 'bg-white text-slate-500 border border-slate-200'}">${i}</button>`;
            }).join('')}
        </div>
        <div class="mb-6 flex justify-between items-center max-w-5xl mx-auto mt-2">
            <h2 class="text-2xl font-black text-slate-800">Предметы</h2>
            <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl text-[15px] font-black shadow-sm transition-all flex items-center gap-2">
                ${ICONS.plus}
                Новый предмет
            </button>
        </div>
        <div id="subjects-content">
            ${renderSubjectsContent()}
        </div>
    `;
    return ht;
}

function renderSubjectsContent() {
    if (state.subjectsView === 1) return viewSubjects1_Cards();
    if (state.subjectsView === 2) return viewSubjects2_Kanban();
    if (state.subjectsView === 3) return viewSubjects3_Compact();
    if (state.subjectsView === 4) return viewSubjects4_Table();
    if (state.subjectsView === 5) return viewSubjects5_Blocks();
    if (state.subjectsView === 6) return viewSubjects6_DetailedCards();
    if (state.subjectsView === 7) return viewSubjects7_Timeline();
    if (state.subjectsView === 8) return viewSubjects8_StatsGrid();
    if (state.subjectsView === 9) return viewSubjects9_MicroList();
    if (state.subjectsView === 10) return viewSubjects10_HexColors();
    if (state.subjectsView === 11) return viewSubjects11_Polaroid();
    if (state.subjectsView === 12) return viewSubjects12_WideRows();
    if (state.subjectsView === 13) return viewSubjects13_Neon();
    if (state.subjectsView === 14) return viewSubjects14_UniKanban();
    if (state.subjectsView === 15) return viewSubjects15_UniVertBar();
    if (state.subjectsView === 16) return viewSubjects16_UniSolidTags();
    if (state.subjectsView === 17) return viewSubjects17_UniBorderBottom();
    if (state.subjectsView === 18) return viewSubjects18_UniMinimalist();
    return '';
}

// Helper mock categories for kanban view grouping (simulating kanban boards for subjects)
function getSubjectCategories() {
    // Assign mock categories based on id for demonstration
    const cats = {
        'Активные': [],
        'В планах': [],
        'В архиве': []
    };
    state.subjects.forEach((s, i) => {
        if (i % 3 === 0) cats['Активные'].push(s);
        else if (i % 3 === 1) cats['В планах'].push(s);
        else cats['В архиве'].push(s);
    });
    return cats;
}

// --- V1: Cards ---
function viewSubjects1_Cards() {
    let ht = `<div class="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">`;
    state.subjects.forEach(subj => ht += buildSubjectCard(subj));
    ht += `</div>`;
    return ht;
}

// --- V2: Kanban ---
function viewSubjects2_Kanban() {
    const cats = getSubjectCategories();
    let ht = `<div class="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide items-start">`;
    
    Object.keys(cats).forEach((catName, idx) => {
        const list = cats[catName];
        let bg = ['bg-indigo-50', 'bg-amber-50', 'bg-slate-100'][idx];
        let text = ['text-indigo-600', 'text-amber-600', 'text-slate-500'][idx];
        
        ht += `<div class="flex-none w-[300px] snap-center ${bg} rounded-3xl p-4 border border-slate-200">
            <div class="font-black text-lg mb-4 flex justify-between items-center ${text}">
                <span>${catName}</span>
                <span class="bg-white px-2 py-0.5 rounded-lg text-sm shadow-sm">${list.length}</span>
            </div>
            <div class="space-y-3">`;
            
        list.forEach(subj => {
            ht += `<div class="bg-white p-3 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group flex items-center justify-between cursor-pointer">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full shadow-inner" style="background-color: ${subj.color}"></div>
                    <div class="font-bold text-slate-700 text-[15px]">${subj.name}</div>
                </div>
                <div class="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 transition-opacity">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="1"/></svg>
                </div>
            </div>`;
        });
        
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V3: Compact List ---
function viewSubjects3_Compact() {
    let ht = `<div class="max-w-4xl mx-auto space-y-2">`;
    state.subjects.forEach((subj, i) => {
        ht += `<div class="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 hover:border-slate-300 transition-colors flex items-center justify-between">
            <div class="flex items-center gap-4">
                <div class="font-black text-slate-300 w-6 text-right">${i+1}</div>
                <div class="w-3 h-8 rounded-full" style="background-color: ${subj.color}"></div>
                <div class="font-bold text-slate-800 text-lg">${subj.name}</div>
            </div>
            <div class="flex items-center gap-4">
                <div class="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg uppercase tracking-wider">${subj.id}</div>
                <button class="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-colors">
                    ${ICONS.edit.replace('width="16" height="16"', 'width="14" height="14"')}
                </button>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V4: Table ---
function viewSubjects4_Table() {
    let ht = `<div class="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm max-w-5xl mx-auto">
        <table class="w-full text-left text-sm">
            <thead>
                <tr class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <th class="p-4 w-12 text-center">Цвет</th>
                    <th class="p-4">Название предмета</th>
                    <th class="p-4">ID</th>
                    <th class="p-4">Преподавателей</th>
                    <th class="p-4 w-20 text-center">Действия</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">`;
            
    state.subjects.forEach(subj => {
        let tCount = state.teachers.filter(t => t.name.startsWith(subj.name)).length;
        ht += `<tr class="hover:bg-slate-50 transition-colors">
            <td class="p-4 text-center">
                <div class="w-6 h-6 rounded-md shadow-inner mx-auto" style="background-color: ${subj.color}"></div>
            </td>
            <td class="p-4 font-bold text-slate-800 text-[15px]">${subj.name}</td>
            <td class="p-4 font-mono text-slate-500 text-xs">${subj.id}</td>
            <td class="p-4 font-black ${tCount > 0 ? 'text-indigo-600' : 'text-slate-300'}">${tCount}</td>
            <td class="p-4 text-center flex justify-center mt-2">
                <button class="text-slate-400 hover:text-indigo-600 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                </button>
            </td>
        </tr>`;
    });
    ht += `</tbody></table></div>`;
    return ht;
}

// --- V5: Blocks ---
function viewSubjects5_Blocks() {
    let ht = `<div class="max-w-5xl mx-auto flex flex-wrap gap-4 justify-center">`;
    state.subjects.forEach(subj => {
        let bgStyle = `background: linear-gradient(135deg, ${subj.color} 0%, ${hexToRgba(subj.color, 0.7)} 100%)`;
        ht += `<div class="relative w-40 h-40 rounded-3xl p-4 flex flex-col items-center justify-center text-white shadow-lg shadow-black/5 hover:scale-105 transition-transform cursor-pointer overflow-hidden group" style="${bgStyle}">
            <div class="font-black text-lg text-center z-10 leading-tight drop-shadow-md">${subj.name}</div>
            <div class="absolute bottom-3 text-[10px] font-bold opacity-70 z-10 uppercase tracking-widest">${subj.id}</div>
            <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center backdrop-blur-sm transition-colors text-white">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                </button>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V6: Detailed Cards ---
function viewSubjects6_DetailedCards() {
    let ht = `<div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">`;
    state.subjects.forEach(subj => {
        let teachers = state.teachers.filter(t => t.name.startsWith(subj.name));
        let mins = 0;
        DAYS.forEach(d => {
            (state.schedule[d]||[]).forEach(it => {
                if(it.subjectId === subj.id) mins += it.duration;
            });
        });
        
        ht += `<div class="bg-white rounded-3xl p-6 border-2 border-slate-100 hover:border-indigo-300 transition-colors shadow-sm flex flex-col">
            <div class="flex justify-between items-start mb-4">
                <div class="w-14 h-14 shadow-inner rounded-2xl flex items-center justify-center text-white font-black text-2xl" style="background:${subj.color}">
                    ${subj.name.charAt(0)}
                </div>
                <div class="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 tracking-wider">${subj.id}</div>
            </div>
            <h3 class="font-black text-2xl text-slate-800 mb-1">${subj.name}</h3>
            <div class="text-sm font-semibold text-slate-500 mb-6 flex-1 flex flex-col justify-end">
                <div class="flex justify-between items-center py-2 border-b border-slate-50">
                    <span>Преподаватели</span>
                    <span class="font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded">${teachers.length}</span>
                </div>
                <div class="flex justify-between items-center py-2">
                    <span>Часов (неделя)</span>
                    <span class="font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">${(mins/60).toFixed(1)}</span>
                </div>
            </div>
            
            <button class="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-sm py-3 rounded-xl transition-colors">
                Управление предметом
            </button>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V7: Timeline Layout ---
function viewSubjects7_Timeline() {
    let ht = `<div class="max-w-3xl mx-auto space-y-6">`;
    state.subjects.forEach((subj, idx) => {
        const isLast = idx === state.subjects.length - 1;
        let teachers = state.teachers.filter(t => t.name.startsWith(subj.name)).length;
        
        ht += `<div class="flex gap-4 relative">
            ${!isLast ? `<div class="absolute left-6 top-14 bottom-[-1.5rem] w-1 border-l-2 border-slate-100 z-0"></div>` : ''}
            
            <div class="w-12 h-12 shrink-0 rounded-full flex items-center justify-center z-10 shadow-sm border-4 border-white" style="background:${subj.color}">
                <div class="w-4 h-4 bg-white rounded-full opacity-50"></div>
            </div>
            
            <div class="bg-white flex-1 p-5 rounded-3xl border border-slate-200 shadow-sm group hover:-translate-y-1 transition-transform mb-2">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-black text-xl text-slate-800 group-hover:text-indigo-600 transition-colors">${subj.name}</h3>
                    <span class="text-xs font-black text-slate-400 font-mono bg-slate-50 px-2 py-1">${subj.id}</span>
                </div>
                <div class="text-sm font-semibold text-slate-500 flex gap-4">
                    <span>${teachers} преподавателей</span>
                    <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full" style="background:${subj.color}"></span> Маркер цвета</span>
                </div>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V8: Stats Grid ---
function viewSubjects8_StatsGrid() {
    let ht = `<div class="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">`;
    state.subjects.forEach(subj => {
        let mins = 0;
        DAYS.forEach(d => {
            (state.schedule[d]||[]).forEach(it => {
                if(it.subjectId === subj.id) mins += it.duration;
            });
        });
        let hs = (mins/60).toFixed(1);
        
        ht += `<div class="bg-white p-4 rounded-3xl border-2 border-slate-100 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div class="absolute inset-x-0 bottom-0 h-1 bg-slate-200" style="background:${subj.color}"></div>
            <div class="w-12 h-12 rounded-2xl mb-3 shadow-inner text-white font-black text-xl flex items-center justify-center" style="background:${subj.color}">${subj.name.charAt(0)}</div>
            <div class="font-bold text-slate-700 text-sm leading-tight mb-3 px-2 h-10 line-clamp-2">${subj.name}</div>
            
            <div class="bg-slate-50 w-full p-2 rounded-xl">
                <div class="font-black text-[18px] text-slate-800">${hs}</div>
                <div class="text-[9px] font-black uppercase tracking-widest text-slate-400">Часов/нед</div>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V9: Micro List ---
function viewSubjects9_MicroList() {
    let ht = `<div class="max-w-2xl mx-auto flex flex-col gap-1.5">`;
    state.subjects.forEach((subj, i) => {
        ht += `<div class="flex items-center gap-3 py-2 px-3 hover:bg-slate-50 rounded-lg cursor-pointer group transition-colors">
            <div class="text-[10px] font-mono text-slate-300 w-4 text-right group-hover:text-indigo-400">${i+1}</div>
            <div class="w-1.5 h-4 rounded-full" style="background:${subj.color}"></div>
            <div class="font-bold text-slate-700 text-sm flex-1">${subj.name}</div>
            <div class="text-[9px] font-black uppercase text-slate-400 tracking-widest">${subj.id}</div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V10: Hex Colors Grid ---
function viewSubjects10_HexColors() {
    let ht = `<div class="max-w-4xl mx-auto flex flex-wrap justify-center gap-3">`;
    state.subjects.forEach(subj => {
        ht += `<div class="w-24 h-24 rounded-2xl p-2 flex flex-col items-center justify-center text-center shadow-sm cursor-pointer hover:scale-110 transition-transform relative group" style="background:${subj.color}">
            <div class="text-white font-black text-xs leading-tight drop-shadow-md z-10">${subj.name}</div>
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-colors"></div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V11: Polaroid Cards ---
function viewSubjects11_Polaroid() {
    let ht = `<div class="max-w-6xl mx-auto flex flex-wrap justify-center gap-6 p-4">`;
    state.subjects.forEach((subj, i) => {
        // slight random rotation
        let rot = (i%2===0 ? 1 : -1) * (1 + (i%3));
        ht += `<div class="bg-white p-3 pb-6 rounded-sm shadow-md hover:shadow-xl transition-all cursor-pointer border border-slate-100 w-40 transform hover:scale-105 hover:z-20" style="transform: rotate(${rot}deg)">
            <div class="w-full h-32 rounded-sm mb-3 shadow-inner flex items-center justify-center text-[40px] opacity-90" style="background:${subj.color}; color: white; text-shadow: 0 2px 5px rgba(0,0,0,0.2)">
                ${subj.name.charAt(0)}
            </div>
            <div class="font-black text-slate-800 text-center leading-tight font-mono text-sm uppercase tracking-tighter">${subj.name}</div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V12: Wide Rows ---
function viewSubjects12_WideRows() {
    let ht = `<div class="max-w-5xl mx-auto space-y-3">`;
    state.subjects.forEach(subj => {
        ht += `<div class="bg-white rounded-xl flex items-stretch border border-slate-200 overflow-hidden shadow-sm group hover:border-indigo-300 transition-colors">
            <div class="w-24 shrink-0 flex items-center justify-center font-black text-2xl text-white shadow-inner" style="background:${subj.color}">
                ${subj.name.charAt(0)}
            </div>
            <div class="flex-1 p-4 flex justify-between items-center">
                <div>
                    <div class="font-black text-xl text-slate-800">${subj.name}</div>
                    <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Идентификатор: ${subj.id}</div>
                </div>
                <button class="w-10 h-10 rounded-full bg-slate-50 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V13: Neon Badges ---
function viewSubjects13_Neon() {
    let ht = `<div class="bg-slate-900 rounded-3xl p-10 max-w-5xl mx-auto flex flex-wrap justify-center gap-5 shadow-2xl">`;
    state.subjects.forEach(subj => {
        ht += `<div class="px-5 py-2 rounded-full border-2 text-sm font-black uppercase tracking-widest cursor-pointer hover:bg-white/10 transition-colors" 
                style="color: ${subj.color}; border-color: ${subj.color}; box-shadow: 0 0 10px ${hexToRgba(subj.color, 0.5)}, inset 0 0 5px ${hexToRgba(subj.color, 0.3)}">
            ${subj.name}
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// ===================== HELPER COMPONENTS =====================
function buildSubjectCard(subj) {
    return `<div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all group cursor-pointer relative overflow-hidden flex flex-col items-center text-center">
        <div class="w-16 h-16 rounded-3xl mb-4 shadow-inner transform group-hover:-translate-y-1 transition-transform" style="background-color: ${subj.color}"></div>
        <div class="font-black text-[17px] text-slate-800 leading-tight">${subj.name}</div>
        <div class="text-[10px] font-bold text-slate-400 mt-2 uppercase bg-slate-50 px-2 py-0.5 rounded-full">${subj.id}</div>
        
        <div class="absolute inset-0 bg-slate-900/5 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button class="w-10 h-10 bg-white text-indigo-600 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
            </button>
            <button class="w-10 h-10 bg-white text-rose-500 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
        </div>
    </div>`;
}


// ================ UNIFIED DESIGN SUBJECTS VIEWS (V14-V18) ================
function viewSubjects14_UniKanban() {
    let ht = `<div class="max-w-6xl mx-auto columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">`;
    state.subjects.forEach(s => {
        ht += `<div class="break-inside-avoid bg-white border border-slate-100 rounded-[20px] shadow-sm p-4 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-center mb-3">
                <span class="px-2 py-0.5 rounded text-[10px] uppercase font-black text-white" style="background:${s.color}">${s.name.slice(0,10)}</span>
                <span class="text-slate-400 text-[10px] font-bold leading-none bg-slate-50 px-2.5 py-1 rounded-md tracking-widest font-mono">${s.id}</span>
            </div>
            <div class="text-slate-800 font-bold text-[15px] leading-tight mb-2">${s.name}</div>
            <div class="text-[11px] font-semibold text-slate-400 border-t border-slate-50 pt-2 line-clamp-2">${s.description || 'Описание отсутствует'}</div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

function viewSubjects15_UniVertBar() {
    let ht = `<div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">`;
    state.subjects.forEach(s => {
        ht += `<div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex gap-4 items-center hover:-translate-y-0.5 transition-transform">
            <div class="w-1.5 h-12 rounded-full shrink-0" style="background-color: ${s.color};"></div>
            <div class="flex-1 min-w-0">
                <div class="text-slate-800 font-black tracking-wide text-sm truncate">${s.name}</div>
                <div class="text-slate-400 text-[11px] font-semibold mt-1 truncate">${s.description || 'Нет данных'}</div>
            </div>
            <div class="font-black text-[10px] uppercase text-slate-300 w-12 text-center shrink-0 tracking-widest bg-slate-50 p-2 rounded-xl">${s.id}</div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

function viewSubjects16_UniSolidTags() {
    let ht = `<div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">`;
    state.subjects.forEach(s => {
        ht += `<div class="bg-white border border-slate-100 rounded-[24px] shadow-sm p-5 flex flex-col hover:border-indigo-200 transition-colors h-full">
            <div class="flex justify-between items-start mb-5">
                <span class="px-2 py-1 text-white rounded-md text-[9px] uppercase font-black tracking-widest leading-none shadow-sm" style="background:${s.color}">${s.name.slice(0,12)}</span>
                <span class="font-black text-slate-500 bg-slate-50 px-3 py-1 rounded-lg text-xs font-mono border border-slate-100">${s.id}</span>
            </div>
            <div class="text-slate-800 font-bold mb-4 flex-1 text-[16px] leading-tight flex items-center gap-2">
                ${s.name}
            </div>
            <div class="flex justify-between items-center text-[10px] text-slate-400 font-bold pt-3 border-t border-slate-50 uppercase tracking-widest">
                <span>Предмет</span>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

function viewSubjects17_UniBorderBottom() {
    let ht = `<div class="max-w-4xl mx-auto space-y-3">`;
    state.subjects.forEach(s => {
        ht += `<div class="bg-white border text-sm border-slate-100 shadow-sm rounded-2xl p-4 border-b-4 flex flex-col sm:flex-row justify-between sm:items-center hover:bg-slate-50 transition-colors cursor-pointer" style="border-bottom-color: ${s.color};">
            <div class="font-black text-slate-800 text-[15px] pr-2 leading-tight mb-2 sm:mb-0">${s.name}</div>
            <div class="flex items-center justify-between sm:w-auto w-full gap-4">
                <div class="text-[10px] uppercase font-bold text-slate-400 tracking-widest line-clamp-1 flex-1 sm:w-48 text-right pr-4">${s.description || 'Без описания'}</div>
                <div class="font-black text-slate-500 text-sm font-mono shrink-0 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">${s.id}</div>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

function viewSubjects18_UniMinimalist() {
    let ht = `<div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">`;
    state.subjects.forEach(s => {
        ht += `<div class="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-md hover:border-slate-300 transition-all cursor-pointer">
            <div class="p-5 flex justify-between items-center bg-gradient-to-br from-white to-slate-50/50 gap-4">
                 <div class="text-[15px] font-black text-slate-800 flex-1 leading-tight">${s.name}</div>
                 <div class="px-2 py-1 bg-slate-800 text-white rounded-lg text-[10px] font-black shadow-sm shrink-0 uppercase tracking-widest font-mono">${s.id}</div>
            </div>
            <div class="bg-slate-50/80 px-5 py-3 border-t border-slate-100 flex gap-4 text-[10px] font-bold text-slate-500 justify-between items-center">
                <span class="flex items-center gap-2 font-black uppercase tracking-widest"><div class="w-2 h-2 rounded-full" style="background:${s.color}"></div>Цвет</span>
                <span class="bg-white px-2 py-1 rounded shadow-sm border border-slate-100 tracking-wider text-slate-500 line-clamp-1 w-32 text-right">${s.description || 'Пусто'}</span>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}