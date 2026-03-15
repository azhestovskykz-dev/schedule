// ===================== SCHOOLS MODULE =====================

function renderSchools() {
    let ht = `
        <div class="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            ${[1, 2, 3, 4, 5].map(i => {
                let active = state.schoolsView === i;
                let labels = ['1: Карточки', '2: Канбан', '3: Таблица', '4: Список', '5: Панели'];
                return `<button onclick="state.schoolsView=${i}; render();" class="px-5 py-2.5 rounded-2xl text-[14px] font-black shadow-sm transition-all whitespace-nowrap ${active ? 'bg-cyan-500 text-white' : 'bg-white text-slate-500 border border-slate-200'}">${labels[i-1]}</button>`;
            }).join('')}
        </div>
        <div class="mb-6 flex justify-between items-center max-w-7xl mx-auto mt-2">
            <h2 class="text-2xl font-black text-slate-800">Школы</h2>
            <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl text-[15px] font-black shadow-sm transition-all flex items-center gap-2">
                ${ICONS.plus}
                Добавить
            </button>
        </div>
        <div id="schools-content">
            ${renderSchoolsContent()}
        </div>
    `;
    return ht;
}

function renderSchoolsContent() {
    if (state.schoolsView === 1) return viewSchools1_Cards();
    if (state.schoolsView === 2) return viewSchools2_Kanban();
    if (state.schoolsView === 3) return viewSchools3_Table();
    if (state.schoolsView === 4) return viewSchools4_List();
    if (state.schoolsView === 5) return viewSchools5_Panels();
    return '';
}

// --- V1: Cards ---
function viewSchools1_Cards() {
    let ht = `<div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">`;
    (state.schools || []).forEach(sc => {
        ht += `<div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-4">
                <div class="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center font-black text-xl">${sc.name.charAt(0)}</div>
                <div class="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-lg">${sc.status}</div>
            </div>
            <h3 class="font-black text-xl text-slate-800 mb-1">${sc.name}</h3>
            <div class="text-sm font-bold text-slate-400 mb-4">${sc.id}</div>
            
            <div class="space-y-2 mb-6">
                <div class="flex items-center gap-3 text-sm font-semibold text-slate-600 group cursor-pointer hover:text-indigo-600">
                    <div class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50">${ICONS.phone.replace('width="16"', 'width="14"')}</div>
                    ${sc.phone}
                </div>
                <div class="flex items-center gap-3 text-sm text-slate-600">
                    <div class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">${ICONS.menu.replace('width="16"', 'width="14"')}</div>
                    <span class="font-semibold">${sc.curator}</span>
                </div>
            </div>
            
            <div class="p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-500 flex items-center gap-2">
                🏠 ${sc.address}
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V2: Kanban ---
function viewSchools2_Kanban() {
    const columns = { 'Активно': [], 'В планах': [], 'В архиве': [] };
    (state.schools || []).forEach(sc => {
        if(columns[sc.status]) columns[sc.status].push(sc);
        else columns['В планах'].push(sc);
    });
    
    let ht = `<div class="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide items-start">`;
    Object.keys(columns).forEach(col => {
        ht += `<div class="flex-none w-[320px] snap-center bg-slate-50 rounded-3xl p-4 border border-slate-200">
            <div class="font-black text-lg text-slate-700 mb-4 flex justify-between items-center">
                ${col} <span class="bg-white px-2 py-0.5 rounded-lg text-sm text-slate-400 shadow-sm">${columns[col].length}</span>
            </div>
            <div class="space-y-3">`;
        columns[col].forEach(sc => {
            ht += `<div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-cyan-300 transition-colors cursor-pointer group">
                <div class="font-bold text-slate-800 text-[15px] mb-1 group-hover:text-cyan-600">${sc.name}</div>
                <div class="text-xs font-semibold text-slate-500 mb-2">${sc.curator}</div>
                <div class="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 text-[11px] font-black tracking-wide text-slate-400">
                    <span>${sc.id}</span>
                </div>
            </div>`;
        });
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V3: Table ---
function viewSchools3_Table() {
    let ht = `<div class="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
        <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                    <th class="p-4">Название</th>
                    <th class="p-4">Адрес</th>
                    <th class="p-4">Куратор / Телефон</th>
                    <th class="p-4 text-center">Статус</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">`;
    (state.schools || []).forEach(sc => {
        ht += `<tr class="hover:bg-slate-50 transition-colors">
            <td class="p-4">
                <div class="font-bold text-slate-800 text-[15px]">${sc.name}</div>
                <div class="text-xs font-mono text-slate-400">${sc.id}</div>
            </td>
            <td class="p-4 font-semibold text-slate-600">${sc.address}</td>
            <td class="p-4">
                <div class="font-bold text-slate-700">${sc.curator}</div>
                <div class="text-xs text-slate-500 mt-0.5">${sc.phone}</div>
            </td>
            <td class="p-4 text-center">
                <span class="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-black rounded-lg uppercase tracking-wider">${sc.status}</span>
            </td>
        </tr>`;
    });
    ht += `</tbody></table></div>`;
    return ht;
}

// --- V4: Compact List ---
function viewSchools4_List() {
    let ht = `<div class="max-w-4xl mx-auto space-y-2">`;
    (state.schools || []).forEach((sc, i) => {
        ht += `<div class="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 hover:border-slate-300 transition-colors flex items-center gap-4">
            <div class="font-black text-slate-300 w-6 text-right">${i+1}</div>
            <div class="flex-1 flex justify-between items-center">
                <div>
                    <span class="font-bold text-slate-800 text-lg mr-3">${sc.name}</span>
                    <span class="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg uppercase">${sc.id}</span>
                </div>
                <div class="flex items-center gap-6">
                    <div class="text-sm font-semibold text-slate-500 hidden md:block">👤 ${sc.curator}</div>
                    <div class="text-sm font-semibold text-slate-500 hidden sm:block">📞 ${sc.phone}</div>
                    <span class="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-black rounded-md w-20 text-center uppercase">${sc.status}</span>
                </div>
            </div>
            <button class="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 flex items-center justify-center transition-colors">
                ${ICONS.edit.replace('width="16"', 'width="14"')}
            </button>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V5: Info Panels ---
function viewSchools5_Panels() {
    let ht = `<div class="max-w-5xl mx-auto space-y-6">`;
    (state.schools || []).forEach(sc => {
        ht += `<div class="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col md:flex-row">
            <div class="bg-cyan-50 p-6 md:w-64 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-slate-200">
                <div class="w-16 h-16 bg-white text-cyan-600 rounded-2xl flex items-center justify-center font-black text-3xl mb-4 shadow-sm">${sc.name.charAt(0)}</div>
                <h3 class="font-black text-xl text-slate-800 mb-1">${sc.name}</h3>
                <div class="text-xs font-black text-cyan-600/60 uppercase tracking-widest">${sc.status}</div>
            </div>
            <div class="p-6 flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Куратор</div>
                    <div class="font-bold text-slate-800 text-[15px]">${sc.curator}</div>
                </div>
                <div>
                    <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Телефон</div>
                    <div class="font-bold text-slate-800 text-[15px]">${sc.phone}</div>
                </div>
                <div class="sm:col-span-2">
                    <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Адрес</div>
                    <div class="font-bold text-slate-800 text-[15px]">${sc.address}</div>
                </div>
                <div class="sm:col-span-2 pt-4 border-t border-slate-100 flex gap-2">
                    <button class="px-4 py-2 bg-slate-50 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-100">Задачи школы (0)</button>
                    <button class="px-4 py-2 bg-slate-50 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-100">Преподаватели</button>
                </div>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}
