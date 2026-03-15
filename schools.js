// ===================== SCHOOLS MODULE =====================

function renderSchools() {
    let ht = `
        <div class="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(i => {
                let active = state.schoolsView === i;
                return `<button onclick="state.schoolsView=${i}; render();" class="px-5 py-2.5 rounded-2xl text-[14px] font-black shadow-sm transition-all whitespace-nowrap ${active ? 'bg-cyan-500 text-white' : 'bg-white text-slate-500 border border-slate-200'}">${i}</button>`;
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
    if (state.schoolsView === 6) return viewSchools6_MiniGrid();
    if (state.schoolsView === 7) return viewSchools7_DenseTable();
    if (state.schoolsView === 8) return viewSchools8_StatusTimeline();
    if (state.schoolsView === 9) return viewSchools9_CompactList();
    if (state.schoolsView === 10) return viewSchools10_MapMarkers();
    if (state.schoolsView === 11) return viewSchools11_Badges();
    if (state.schoolsView === 12) return viewSchools12_DistrictGrid();
    if (state.schoolsView === 13) return viewSchools13_DirectoryTable();
    if (state.schoolsView === 14) return viewSchools14_UniKanban();
    if (state.schoolsView === 15) return viewSchools15_UniVertBar();
    if (state.schoolsView === 16) return viewSchools16_UniSolidTags();
    if (state.schoolsView === 17) return viewSchools17_UniBorderBottom();
    if (state.schoolsView === 18) return viewSchools18_UniMinimalist();
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
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V6: Mini Grid (Detail dense) ---
function viewSchools6_MiniGrid() {
    let ht = `<div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">`;
    (state.schools || []).forEach(sc => {
        let stCol = sc.status === 'active' ? 'text-emerald-500' : (sc.status === 'planned' ? 'text-blue-500' : 'text-slate-400');
        ht += `<div class="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm hover:border-cyan-300 transition-colors flex flex-col justify-between h-[140px]">
            <div>
                <div class="flex justify-between items-start mb-1">
                    <div class="font-black text-slate-800 text-[13px] leading-tight line-clamp-2">${sc.name}</div>
                    <div class="w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${stCol.replace('text','bg')}"></div>
                </div>
                <div class="text-[10px] font-bold text-slate-400 mb-2 uppercase">${sc.type || 'Школа'}</div>
            </div>
            
            <div class="mt-auto">
                <div class="text-[10px] font-bold text-slate-500 flex items-center gap-1 mb-1 truncate">
                    <span class="w-4 h-4 rounded bg-slate-50 flex items-center justify-center">👤</span> ${sc.curator}
                </div>
                <div class="text-[10px] font-bold text-slate-500 flex items-center gap-1 truncate">
                    <span class="w-4 h-4 rounded bg-slate-50 flex items-center justify-center text-emerald-500">📞</span> ${sc.phone}
                </div>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V7: Dense Table ---
function viewSchools7_DenseTable() {
    let ht = `<div class="bg-white border text-sm border-slate-200 rounded-xl overflow-x-auto shadow-sm max-w-7xl mx-auto">
        <table class="w-full text-left">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-black tracking-wider">
                <tr><th class="p-2 pl-4">ID</th><th class="p-2">Название школы</th><th class="p-2">Тип</th><th class="p-2">Куратор</th><th class="p-2">Контакты</th><th class="p-2">Статус</th></tr>
            </thead>
            <tbody class="divide-y divide-slate-100">`;
            
    // Sort by status then name
    let sorted = [...(state.schools||[])].sort((a,b) => a.status.localeCompare(b.status) || a.name.localeCompare(b.name));
    
    sorted.forEach(sc => {
        let stCol = sc.status === 'active' ? 'bg-emerald-50 text-emerald-600' : (sc.status === 'planned' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500');
        ht += `<tr class="hover:bg-slate-50/50 transition-colors">
            <td class="p-2 pl-4 text-xs font-mono font-bold text-slate-400">${sc.id}</td>
            <td class="p-2 text-[13px] font-bold text-slate-700">${sc.name}</td>
            <td class="p-2 text-xs font-bold text-slate-500">${sc.type || '-'}</td>
            <td class="p-2 text-xs font-semibold text-slate-600">${sc.curator}</td>
            <td class="p-2 text-xs font-mono text-slate-500">${sc.phone}</td>
            <td class="p-2"><span class="px-2 py-0.5 rounded text-[10px] font-black uppercase ${stCol}">${sc.status}</span></td>
        </tr>`;
    });
    ht += `</tbody></table></div>`;
    return ht;
}

// --- V9: Compact List ---
function viewSchools9_CompactList() {
    let ht = `<div class="max-w-4xl mx-auto space-y-1">`;
    (state.schools || []).forEach((sc, i) => {
        let bCol = sc.status === 'active' ? 'border-l-emerald-400' : (sc.status === 'planned' ? 'border-l-blue-400' : 'border-l-slate-300');
        ht += `<div class="flex items-center justify-between p-2 hover:bg-slate-50 border-b border-slate-100 cursor-pointer group bg-white border-l-4 ${bCol}">
            <div class="flex items-center gap-3">
                <span class="text-[10px] text-slate-400 font-mono w-4 text-right">${i+1}</span>
                <span class="font-bold text-slate-700 text-sm group-hover:text-cyan-600 transition-colors">${sc.name}</span>
            </div>
            <div class="flex items-center gap-4 text-xs">
                <span class="text-slate-500 hidden sm:inline-block">${sc.curator}</span>
                <span class="font-mono text-slate-400">${sc.phone}</span>
                <span class="text-[9px] uppercase font-black bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 w-16 text-center">${sc.status}</span>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V10: Map Markers (Abstract Visual) ---
function viewSchools10_MapMarkers() {
    let ht = `<div class="max-w-6xl mx-auto flex flex-wrap justify-center gap-6 p-10 relative">
        <div class="absolute inset-0 opacity-5 pointer-events-none" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 20px 20px;"></div>`;
        
    (state.schools || []).forEach((sc, i) => {
        let cCol = sc.status === 'active' ? 'bg-emerald-500 text-white' : (sc.status === 'planned' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-600');
        let mt = (i % 3 === 1) ? 'mt-8' : (i % 3 === 2) ? 'mt-4' : 'mt-0'; // staggered look
        ht += `<div class="flex flex-col items-center group cursor-pointer ${mt} relative z-10 hover:z-20 w-24">
            <div class="w-10 h-10 ${cCol} rounded-full flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform mb-2 border-2 border-white relative">
                ${sc.name.charAt(0)}
                <div class="absolute -bottom-1.5 w-1 h-2 bg-current rotate-45 transform origin-top left-1/2 -ml-0.5"></div>
            </div>
            <div class="text-[10px] font-bold text-center leading-tight bg-white/90 backdrop-blur px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity absolute top-14 w-32 left-1/2 -translate-x-1/2 pointer-events-none border border-slate-100 text-slate-700">
                ${sc.name}<br><span class="text-[8px] uppercase text-slate-400">${sc.address.split(',')[0]}</span>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V11: Badges Cloud ---
function viewSchools11_Badges() {
    let ht = `<div class="max-w-5xl mx-auto flex flex-wrap gap-2 justify-center">`;
    (state.schools || []).forEach(sc => {
        let scCol = sc.status === 'active' ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' : 
                   (sc.status === 'planned' ? 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100' : 
                   'text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100');
                   
        ht += `<div class="px-4 py-2 rounded-full border text-sm font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-2 ${scCol}">
            <span>${sc.name}</span>
            <span class="w-4 h-4 rounded-full bg-white/50 text-[10px] flex items-center justify-center text-current opacity-70">${sc.id.replace('sch','')}</span>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V12: District Grid ---
function viewSchools12_DistrictGrid() {
    // extract district from address or mock it based on id
    const distData = {};
    (state.schools || []).forEach(sc => {
        let dist = sc.address.split(',')[0]; // Simple extraction assuming first part is district/city
        if(dist.length > 15 || !dist.includes('АО')) {
            // mock if address format doesn't match expected district
            dist = ['ЮЗАО', 'ЮАО', 'ВАО', 'ЗАО'][parseInt(sc.id.replace(/\D/g, '') || 0) % 4];
        }
        if(!distData[dist]) distData[dist] = [];
        distData[dist].push(sc);
    });
    
    let ht = `<div class="max-w-7xl mx-auto columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">`;
    Object.keys(distData).sort().forEach(dist => {
        ht += `<div class="break-inside-avoid bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <h3 class="font-black text-xl text-slate-800 border-b-2 border-slate-100 pb-2 mb-4 flex justify-between items-end">
                ${dist}
                <span class="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase tracking-widest">${distData[dist].length} школ</span>
            </h3>
            <div class="space-y-3">`;
        distData[dist].sort((a,b)=>a.name.localeCompare(b.name)).forEach(sc => {
            let stDot = sc.status==='active'?'bg-emerald-400':sc.status==='planned'?'bg-blue-400':'bg-slate-300';
            ht += `<div class="flex justify-between items-start group cursor-pointer">
                <div class="flex gap-2">
                    <div class="w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${stDot}"></div>
                    <div>
                        <div class="font-bold text-sm text-slate-700 group-hover:text-cyan-600 transition-colors">${sc.name}</div>
                        <div class="text-[10px] font-semibold text-slate-400">${sc.curator} • ${sc.phone}</div>
                    </div>
                </div>
            </div>`;
        });
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V13: Directory Table (A-Z) ---
function viewSchools13_DirectoryTable() {
    let groups = {};
    (state.schools || []).forEach(sc => {
        let char = sc.name.charAt(0).toUpperCase();
        if(!/[А-ЯA-Z]/.test(char)) char = '#';
        if(!groups[char]) groups[char] = [];
        groups[char].push(sc);
    });
    let letters = Object.keys(groups).sort();
    
    let ht = `<div class="max-w-5xl mx-auto space-y-8">`;
    letters.forEach(l => {
        ht += `<div>
            <div class="flex items-center gap-4 mb-4">
                <div class="w-10 h-10 rounded-xl bg-slate-800 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-md transform -rotate-3">${l}</div>
                <div class="h-0.5 bg-slate-200 flex-1"></div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">`;
            
        groups[l].sort((a,b)=>a.name.localeCompare(b.name)).forEach(sc => {
            ht += `<div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between h-full group">
                <div>
                    <div class="flex justify-between items-start mb-1">
                        <div class="font-bold text-[14px] text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">${sc.name}</div>
                    </div>
                    <div class="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">${sc.status}</div>
                </div>
                <div class="text-xs font-semibold text-slate-500 pt-3 border-t border-slate-50 mt-auto">
                    ${sc.address}
                </div>
            </div>`;
        });
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}


// ================ UNIFIED DESIGN SCHOOLS VIEWS (V14-V18) ================
function viewSchools14_UniKanban() {
    let ht = `<div class="max-w-6xl mx-auto columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">`;
    (state.schools||[]).forEach(sc => {
        let scCol = sc.status === 'active' ? 'bg-emerald-500' : sc.status === 'planned' ? 'bg-blue-500' : 'bg-slate-400';
        ht += `<div class="break-inside-avoid bg-white border border-slate-100 rounded-[20px] shadow-sm p-4 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-center mb-3">
                <span class="px-2 py-0.5 rounded text-[9px] uppercase font-black text-white" style="background:${scCol}">${sc.status}</span>
                <span class="text-slate-400 text-[10px] font-bold leading-none bg-slate-50 px-2 py-1 rounded-md tracking-widest font-mono">${sc.id}</span>
            </div>
            <div class="text-slate-800 font-bold text-[14px] leading-tight mb-3">${sc.name}</div>
            <div class="text-[10px] font-semibold text-slate-400 border-t border-slate-50 pt-2 truncate mb-1">👤 ${sc.curator}</div>
            <div class="text-[10px] font-semibold text-slate-400 truncate">📍 ${sc.address.split(',')[0]}</div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

function viewSchools15_UniVertBar() {
    let ht = `<div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">`;
    (state.schools||[]).forEach(sc => {
        let scCol = sc.status === 'active' ? 'bg-emerald-500' : sc.status === 'planned' ? 'bg-blue-500' : 'bg-slate-400';
        ht += `<div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex gap-4 items-center hover:-translate-y-0.5 transition-transform">
            <div class="w-1.5 h-12 rounded-full shrink-0 ${scCol}"></div>
            <div class="flex-1 min-w-0">
                <div class="text-slate-800 font-black tracking-wide text-[13px] truncate">${sc.name}</div>
                <div class="text-slate-400 text-[11px] font-semibold mt-1 truncate">${sc.type || 'Школа'} • ${sc.address.split(',')[0]}</div>
            </div>
            <div class="font-black text-[10px] uppercase text-slate-400 w-16 text-center shrink-0 tracking-widest bg-slate-50 py-1.5 rounded flex flex-col items-center">
                <span>${sc.curator.split(' ')[0]}</span>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

function viewSchools16_UniSolidTags() {
    let ht = `<div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">`;
    (state.schools||[]).forEach(sc => {
        let scBg = sc.status === 'active' ? 'bg-emerald-500' : sc.status === 'planned' ? 'bg-blue-500' : 'bg-slate-500';
        ht += `<div class="bg-white border border-slate-100 rounded-[24px] shadow-sm p-5 flex flex-col hover:border-indigo-200 transition-colors h-full">
            <div class="flex justify-between items-start mb-5">
                <span class="px-2 py-1 text-white rounded-md text-[9px] uppercase font-black tracking-widest leading-none shadow-sm ${scBg}">${sc.status}</span>
                <span class="font-black text-slate-500 bg-slate-50 px-3 py-1 rounded-lg text-xs font-mono border border-slate-100">${sc.id}</span>
            </div>
            <div class="text-slate-800 font-bold mb-4 flex-1 text-[15px] leading-tight">
                ${sc.name}
            </div>
            <div class="flex justify-between items-center text-[10px] text-slate-400 font-bold pt-3 border-t border-slate-50 tracking-wide">
                <span>📞 ${sc.phone}</span>
                <span class="uppercase">${sc.address.split(',')[0]}</span>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

function viewSchools17_UniBorderBottom() {
    let ht = `<div class="max-w-5xl mx-auto space-y-3">`;
    (state.schools||[]).forEach(sc => {
        let scB = sc.status === 'active' ? 'border-b-emerald-400' : sc.status === 'planned' ? 'border-b-blue-400' : 'border-b-slate-400';
        ht += `<div class="bg-white border text-sm border-slate-100 shadow-sm rounded-[16px] p-4 border-b-4 flex flex-col sm:flex-row justify-between sm:items-center hover:bg-slate-50 transition-colors cursor-pointer ${scB}">
            <div class="font-black text-slate-800 text-[14px] pr-2 leading-tight mb-2 sm:mb-0 max-w-sm truncate">${sc.name}</div>
            <div class="flex items-center justify-between sm:w-auto w-full gap-4">
                <div class="text-[10px] uppercase font-bold text-slate-400 tracking-widest truncate sm:w-32 text-right pr-4">${sc.curator}</div>
                <div class="font-black text-slate-500 text-sm font-mono shrink-0 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">${sc.id}</div>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

function viewSchools18_UniMinimalist() {
    let ht = `<div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">`;
    (state.schools||[]).forEach(sc => {
        let scDot = sc.status === 'active' ? 'bg-emerald-500' : sc.status === 'planned' ? 'bg-blue-500' : 'bg-slate-400';
        ht += `<div class="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-md hover:border-slate-300 transition-all cursor-pointer">
            <div class="p-4 flex justify-between items-center bg-gradient-to-br from-white to-slate-50/50 gap-4">
                 <div class="text-[13px] font-black text-slate-800 flex-1 leading-tight line-clamp-2">${sc.name}</div>
                 <div class="px-2 py-1 bg-slate-800 text-white rounded text-[9px] font-black shadow-sm shrink-0 uppercase tracking-widest font-mono">${sc.id}</div>
            </div>
            <div class="bg-slate-50/80 px-4 py-2 border-t border-slate-100 flex gap-4 text-[10px] font-bold text-slate-500 justify-between items-center">
                <span class="flex items-center gap-1.5 font-black uppercase tracking-widest"><div class="w-2 h-2 rounded-full ${scDot}"></div>${sc.status}</span>
                <span class="bg-white px-2 py-1 rounded shadow-sm border border-slate-100 tracking-wider text-slate-500 line-clamp-1 truncate w-24 text-right">${sc.address.split(',')[0]}</span>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}