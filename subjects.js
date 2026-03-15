// ===================== SUBJECTS MODULE =====================
function renderSubjects() {
    let ht = `
        <div class="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            ${[1, 2, 3, 4, 5].map(i => {
                let active = state.subjectsView === i;
                let labels = ['1: Сетка', '2: Канбан-доска', '3: Компактный список', '4: Таблица', '5: Цветные блоки'];
                return `<button onclick="state.subjectsView=${i}; render();" class="px-5 py-2.5 rounded-2xl text-[14px] font-black shadow-sm transition-all whitespace-nowrap ${active ? 'bg-indigo-500 text-white' : 'bg-white text-slate-500 border border-slate-200'}">${labels[i-1]}</button>`;
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
