// ===================== SCHEDULE MODULE =====================

function renderSchedule() {
    let ht = `
        <div class="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            ${['today', 'week', 'week2', 'month'].map(t => {
                let label = t === 'today' ? 'Сегодня' : t === 'week' ? 'Неделя' : t === 'week2' ? '2 недели' : 'Месяц';
                let active = state.scheduleTab === t;
                return `<button onclick="state.scheduleTab='${t}'; state.scheduleView=1; render();" class="px-5 py-2.5 rounded-2xl text-[15px] font-black shadow-sm transition-all whitespace-nowrap ${active ? 'bg-emerald-500 text-white' : 'bg-white text-slate-500 border border-slate-200'}">${label}</button>`;
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
    let count = state.scheduleTab === 'today' ? 8 : state.scheduleTab === 'week' ? 18 : state.scheduleTab === 'week2' ? 5 : 3;
    
    let ht = '';
    for(let i=1; i<=count; i++) {
        let active = state.scheduleView === i;
        let label = state.scheduleTab === 'week' ? String(i) : `Вид ${i}`;
        ht += `<button onclick="state.scheduleView=${i}; render();" class="px-3 py-1.5 rounded-xl text-[14px] font-black transition-all ${active ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200'}">${label}</button>`;
    }
    return ht;
}

function renderScheduleContent() {
    if (state.scheduleTab === 'today') {
        return renderTodayView();
    } else if (state.scheduleTab === 'week') {
        return renderWeekView();
    } else if (state.scheduleTab === 'week2') {
        return `<div class="p-8 text-center bg-white rounded-2xl border text-slate-400">2 недели - Вариант ${state.scheduleView} (в разработке)</div>`;
    } else if (state.scheduleTab === 'month') {
        return `<div class="p-8 text-center bg-white rounded-2xl border text-slate-400">Месяц - Вариант ${state.scheduleView} (в разработке)</div>`;
    }
}

// ================ TODAY VIEWS ================
function renderTodayView() {
    const day = getTodayName();
    const dayItems = [];
    
    // gather items sorted by time
    Object.keys(state.schedule[day] || {}).forEach(time => {
        state.schedule[day][time].forEach(it => {
            dayItems.push({time, ...it});
        });
    });
    dayItems.sort((a,b) => a.time.localeCompare(b.time));

    let ht = `<div class="max-w-xl mx-auto space-y-4">`;
    ht += `<div class="text-xl font-black text-slate-800 mb-4 px-2">Сегодня: ${day}</div>`;
    
    if (dayItems.length === 0) {
        ht += `<div class="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">На сегодня занятий нет.</div>`;
    } else {
        if (state.scheduleView === 1) {
            dayItems.forEach(it => ht += buildKanbanCard(it, it.time, day));
        } else if (state.scheduleView === 2) {
            dayItems.forEach(it => ht += buildListRow(it, day));
        } else if (state.scheduleView === 3) {
            ht += `<div class="relative pl-6 border-l-2 border-slate-200 space-y-6">`;
            dayItems.forEach(it => ht += buildTimelineNode(it, day));
            ht += `</div>`;
        } else if (state.scheduleView === 4) {
            // View 4: Compact Color Blocks
            ht += `<div class="flex flex-wrap gap-3">`;
            dayItems.forEach(it => {
                const s = state.subjects.find(x=>x.id===it.subjectId);
                ht += `<div class="flex-1 min-w-[140px] p-3 rounded-2xl text-white shadow-sm flex flex-col justify-between transition-transform hover:-translate-y-1" style="background:${s?.color||'#ccc'}">
                    <div class="font-black text-xl mb-2">${it.time}</div>
                    <div class="font-bold text-sm leading-tight">${s?.name}</div>
                    <div class="text-[10px] uppercase font-black opacity-75 mt-2">${it.duration} мин</div>
                </div>`;
            });
            ht += `</div>`;
        } else if (state.scheduleView === 5) {
            // View 5: Minimalist Table
            ht += `<div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table class="w-full text-left text-sm">
                    <tbody class="divide-y divide-slate-100">`;
            dayItems.forEach(it => {
                const s = state.subjects.find(x=>x.id===it.subjectId);
                ht += `<tr class="hover:bg-slate-50 transition-colors">
                    <td class="p-3 w-20 font-mono font-bold text-slate-400 border-r border-slate-100">${it.time}</td>
                    <td class="p-3 font-bold text-slate-700">
                        <span class="inline-block w-2 h-2 rounded-full mr-2" style="background:${s?.color}"></span>${s?.name}
                    </td>
                    <td class="p-3 w-16 text-right text-xs font-bold text-slate-400">${it.duration}м</td>
                </tr>`;
            });
            ht += `</tbody></table></div>`;
        } else if (state.scheduleView === 6) {
            // View 6: Hierarchical List
            let subjectsMap = {};
            dayItems.forEach(it => {
                if(!subjectsMap[it.subjectId]) subjectsMap[it.subjectId] = [];
                subjectsMap[it.subjectId].push(it);
            });
            Object.keys(subjectsMap).forEach(subjId => {
                const s = state.subjects.find(x=>x.id===subjId);
                ht += `<div class="mb-4">
                    <h4 class="font-black text-slate-700 uppercase tracking-wide text-xs mb-2 flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full" style="background:${s?.color||'#ccc'}"></div>${s?.name||'Неизвестно'}
                    </h4>
                    <div class="space-y-2 pl-4 border-l-2 border-slate-100">`;
                subjectsMap[subjId].forEach(it => {
                    const t = state.teachers.find(x=>x.id===it.teacherId);
                    ht += `<div class="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                        <span class="font-mono font-bold text-slate-600">${it.time}</span>
                        <span class="text-xs text-slate-500 font-semibold">${t?.name||'без преподавателя'}</span>
                    </div>`;
                });
                ht += `</div></div>`;
            });
        } else if (state.scheduleView === 7) {
            // View 7: Mini Cards Grid
            ht += `<div class="grid grid-cols-2 md:grid-cols-3 gap-3">`;
            dayItems.forEach(it => {
                const s = state.subjects.find(x=>x.id===it.subjectId);
                ht += `<div class="bg-white rounded-2xl border-2 p-3 shadow-sm flex flex-col justify-center items-center text-center cursor-pointer hover:bg-slate-50" style="border-color:${s?.color||'#eee'}">
                    <div class="font-black text-2xl text-slate-800 mb-1">${it.time}</div>
                    <div class="text-xs font-bold text-slate-500 uppercase">${s?.name.slice(0,10)}</div>
                </div>`;
            });
            ht += `</div>`;
        } else if (state.scheduleView === 8) {
            // View 8: Agenda Large Typography
            ht += `<div class="space-y-6">`;
            dayItems.forEach(it => {
                const s = state.subjects.find(x=>x.id===it.subjectId);
                ht += `<div class="flex items-baseline gap-4">
                    <div class="font-black text-3xl md:text-5xl text-slate-300 w-24 md:w-32 text-right">${it.time}</div>
                    <div class="flex-1">
                        <div class="font-black text-xl md:text-2xl text-slate-800" style="color:${s?.color||'#333'}">${s?.name}</div>
                        <div class="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">${it.duration} минут</div>
                    </div>
                </div>`;
            });
            ht += `</div>`;
        }
    }
    ht += `</div>`;
    return ht;
}

// ================ WEEK VIEWS ================
function renderWeekView() {
    if (state.scheduleView === 1) return viewWeek1_Kanban();
    if (state.scheduleView === 2) return viewWeek2_AbsoluteGrid();
    if (state.scheduleView === 3) return viewWeek3_RoundedGrid();
    if (state.scheduleView === 4) return viewWeek4_Timeline();
    if (state.scheduleView === 5) return viewWeek5_CompactTable();
    if (state.scheduleView === 6) return viewWeek6_Heatmap();
    if (state.scheduleView === 7) return viewWeek7_AgendaList();
    if (state.scheduleView === 8) return viewWeek8_CardsMosaic();
    if (state.scheduleView === 9) return viewWeek9_MicroTable();
    if (state.scheduleView === 10) return viewWeek10_CompactKanban();
    if (state.scheduleView === 11) return viewWeek11_Dashboard();
    if (state.scheduleView === 12) return viewWeek12_Grid2x3();
    if (state.scheduleView === 13) return viewWeek13_TimeBlocks();
    if (state.scheduleView === 14) return viewWeek14_Strips();
    if (state.scheduleView === 15) return viewWeek15_Dots();
    if (state.scheduleView === 16) return viewWeek16_MinimalList();
    if (state.scheduleView === 17) return viewWeek17_DenseTimeline();
    if (state.scheduleView === 18) return viewWeek18_NanoHeatmap();
    return '';
}

// --- V1: Kanban Scroll ---
function viewWeek1_Kanban() {
    let ht = `<div class="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 scrollbar-hide" style="-webkit-overflow-scrolling: touch;">`;
    DAYS.forEach(day => {
        ht += `<div class="flex-none w-[85%] md:w-[300px] snap-center bg-slate-50 rounded-3xl p-3 border border-slate-200">
            <div class="text-center font-black text-lg text-slate-700 mb-4 uppercase tracking-widest">${day}</div>
            <div class="space-y-3">`;
        
        let items = [];
        TIMES.forEach(t => {
            (state.schedule[day][t] || []).forEach(it => items.push({time: t, ...it}));
        });
        
        if (items.length === 0) ht += `<div class="text-slate-400 text-sm italic text-center py-4">Выходной</div>`;
        items.forEach(it => ht += buildKanbanCard(it, it.time, day));
        
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V2: Absolute Grid ---
function viewWeek2_AbsoluteGrid() {
    return `<div class="p-8 text-center text-slate-500 bg-white rounded-2xl border">Grid V2 Абсолютное позиционирование</div>`;
}

// --- V3: Rounded Grid ---
function viewWeek3_RoundedGrid() {
    return `<div class="p-8 text-center text-slate-500 bg-white rounded-2xl border">Grid V3 Скругленные карты</div>`;
}

// --- V4: Horizontal Timeline ---
function viewWeek4_Timeline() {
    let ht = `<div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <div class="min-w-[1000px] p-4">
            <!-- Headers -->
            <div class="flex ml-20 mb-2 border-b border-slate-100 pb-2">
                ${TIMES.map(t => `<div class="flex-1 text-center text-xs font-bold text-slate-400">${t}</div>`).join('')}
            </div>
            <!-- Rows -->
            <div class="space-y-4">`;
    
    DAYS.forEach(day => {
        if(day === 'Вне') return;
        ht += `<div class="relative flex h-14 items-center bg-slate-50 rounded-xl">
                <div class="w-20 pl-4 font-black text-slate-700 uppercase">${day}</div>
                <div class="flex-1 flex relative h-full">`;
        
        const hourWidth = 100 / TIMES.length; 
        let items = [];
        TIMES.forEach(t => {
            (state.schedule[day][t] || []).forEach(it => items.push({time: t, ...it}));
        });

        items.forEach(it => {
            let hourIdx = TIMES.indexOf(it.time);
            if(hourIdx===-1) return;
            let left = hourIdx * hourWidth;
            let width = (it.duration / 60) * hourWidth;
            
            const subj = state.subjects.find(s=>s.id===it.subjectId);
            ht += `<div class="absolute h-10 top-2 rounded-lg shadow-sm overflow-hidden text-white px-2 py-1 text-[10px] sm:text-xs font-bold truncate leading-tight transition-transform hover:scale-105" 
                        style="left:${left}%; width:${width}%; background-color:${subj?subj.color:'#3b82f6'};" title="${subj?.name} (${it.duration}м)">
                        ${subj?.name}
                   </div>`;
        });
        
        ht += `</div></div>`;
    });
            
    ht += `</div></div></div>`;
    return ht;
}

// --- V5: Compact Table ---
function viewWeek5_CompactTable() {
    let ht = `<div class="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
        <table class="w-full text-left text-sm whitespace-nowrap">
            <thead>
                <tr class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <th class="p-3 w-16 text-center border-r border-slate-200">Время</th>
                    ${DAYS.filter(d=>d!=='Вне').map(d => `<th class="p-3 text-center border-r border-slate-100 uppercase">${d}</th>`).join('')}
                </tr>
            </thead>
            <tbody>`;
            
    TIMES.forEach(time => {
        ht += `<tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
            <td class="p-3 font-black text-slate-400 text-center border-r border-slate-200 bg-slate-50/50">${time}</td>`;
        
        DAYS.filter(d=>d!=='Вне').map(day => {
            const items = state.schedule[day][time] || [];
            if (items.length === 0) {
                ht += `<td class="p-3 border-r border-slate-100 text-center"></td>`;
            } else {
                ht += `<td class="p-2 border-r border-slate-100 align-top">`;
                items.forEach(it => {
                    const subj = state.subjects.find(s=>s.id===it.subjectId);
                    ht += `<div class="text-[11px] font-bold p-1.5 rounded-md mb-1 truncate text-white" style="background:${subj?subj.color:'#ccc'}">
                        ${subj?.name}<br><span class="opacity-80 font-normal">${it.duration}м</span>
                    </div>`;
                });
                ht += `</td>`;
            }
        });
        ht += `</tr>`;
    });
        
    ht += `</tbody></table></div>`;
    return ht;
}

// --- V6: Heatmap ---
function viewWeek6_Heatmap() {
    let ht = `<div class="p-6 bg-white rounded-2xl border shadow-sm flex flex-col items-center">
        <div class="grid grid-cols-7 gap-6 mt-4">`;
        
    DAYS.filter(d=>d!=='Вне').forEach(day => {
        let totalMins = 0;
        TIMES.forEach(t => {
            (state.schedule[day][t] || []).forEach(it => totalMins += it.duration);
        });
        
        // Color scale: low = slate-100, medium = yellow-400, high = rose-500
        let bg = 'bg-slate-100';
        let text = 'text-slate-400';
        if (totalMins > 0) {
            if (totalMins <= 120) { bg = 'bg-blue-300'; text='text-white'; }
            else if (totalMins <= 240) { bg = 'bg-amber-400'; text='text-white'; }
            else { bg = 'bg-rose-500'; text='text-white'; }
        }
        
        ht += `<div class="flex flex-col items-center gap-2">
            <div class="font-black text-slate-400 uppercase text-sm">${day}</div>
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${bg} ${text}">
                ${totalMins > 0 ? (totalMins/60).toFixed(1) + 'ч' : '0'}
            </div>
        </div>`;
    });
    
    ht += `</div>
        <div class="mt-8 text-sm text-slate-400">Тепловая карта загруженности дней (в часах)</div>
    </div>`;
    return ht;
}

// --- V7: Agenda List ---
function viewWeek7_AgendaList() {
    let ht = `<div class="max-w-xl mx-auto space-y-6">`;
    DAYS.filter(d=>d!=='Вне').forEach(day => {
        let items = [];
        TIMES.forEach(t => { (state.schedule[day][t] || []).forEach(it => items.push({time: t, ...it})); });
        
        if (items.length > 0) {
            ht += `<div>
                <h3 class="font-black text-xl text-slate-800 border-b-2 border-slate-800 pb-2 mb-4 uppercase">${day}</h3>
                <div class="space-y-3 pl-2 border-l-4 border-slate-200">`;
            items.forEach(it => ht += buildListRow(it, day));
            ht += `</div></div>`;
        }
    });
    ht += `</div>`;
    return ht;
}

// --- V9: Micro Table ---
function viewWeek9_MicroTable() {
    let ht = `<div class="max-w-4xl mx-auto bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table class="w-full text-center text-[10px] sm:text-xs">
            <thead class="bg-slate-50 border-b border-slate-200">
                <tr><th class="p-1 font-bold text-slate-400 w-10">⏳</th>
                ${DAYS.filter(d=>d!=='Вне').map(d=>`<th class="p-1 font-black text-slate-600 border-l border-slate-100 uppercase tracking-tighter">${d.slice(0,2)}</th>`).join('')}
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">`;
    TIMES.forEach(time => {
        ht += `<tr class="hover:bg-slate-50"><td class="p-1 font-mono text-slate-400 border-r border-slate-100">${time}</td>`;
        DAYS.filter(d=>d!=='Вне').forEach(day => {
            const items = state.schedule[day][time] || [];
            if(items.length===0) { ht += `<td class="border-l border-slate-50"></td>`; return; }
            ht += `<td class="p-0 border-l border-slate-100 align-top">`;
            items.forEach(it => {
                const s = state.subjects.find(s=>s.id===it.subjectId);
                ht += `<div class="m-px p-1 text-[9px] font-bold text-white leading-none rounded-sm truncate" style="background:${s?.color||'#ccc'}">${s?.name.slice(0,3)}</div>`;
            });
            ht += `</td>`;
        });
        ht += `</tr>`;
    });
    ht += `</tbody></table></div>`;
    return ht;
}

// --- V10: Compact Kanban ---
function viewWeek10_CompactKanban() {
    let ht = `<div class="max-w-5xl mx-auto flex gap-2 overflow-x-auto pb-2 scrollbar-hide">`;
    DAYS.filter(d=>d!=='Вне').forEach(day => {
        ht += `<div class="flex-1 min-w-[120px] bg-slate-50 rounded-xl p-2 border border-slate-200 flex flex-col h-[70vh] overflow-y-auto">
            <div class="text-center font-black text-sm text-slate-700 uppercase mb-2 sticky top-0 bg-slate-50 z-10 pb-1 border-b border-slate-200">${day}</div>
            <div class="space-y-1.5 flex-1">`;
        let hasItems = false;
        TIMES.forEach(time => {
            (state.schedule[day][time] || []).forEach(it => {
                hasItems = true;
                const s = state.subjects.find(x=>x.id===it.subjectId);
                ht += `<div class="bg-white p-1.5 rounded-lg border border-slate-100 shadow-sm border-l-2" style="border-left-color:${s?.color||'#ccc'}">
                    <div class="text-[9px] font-black text-slate-400">${time}</div>
                    <div class="text-[11px] font-bold text-slate-800 leading-tight truncate">${s?.name}</div>
                </div>`;
            });
        });
        if(!hasItems) ht += `<div class="text-[10px] text-center text-slate-400 mt-4">Пусто</div>`;
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V11: Dashboard ---
function viewWeek11_Dashboard() {
    let ht = `<div class="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-6 gap-3">`;
    DAYS.filter(d=>d!=='Вне').forEach((day, i) => {
        let itemsCount = 0; let totalMins = 0;
        TIMES.forEach(t => (state.schedule[day][t] || []).forEach(it => { itemsCount++; totalMins += it.duration; }));
        
        let color = itemsCount > 0 ? 'bg-white' : 'bg-slate-50 opacity-50';
        let border = itemsCount > 0 ? 'border-indigo-100' : 'border-slate-200';
        ht += `<div class="${color} p-4 rounded-2xl border ${border} shadow-sm flex flex-col justify-between h-32 hover:scale-105 transition-transform">
            <div class="flex justify-between items-start">
                <span class="font-black text-lg text-slate-700 uppercase">${day}</span>
                <span class="text-xs font-bold text-white bg-indigo-500 px-2 rounded-full">${itemsCount}</span>
            </div>
            <div>
                <div class="text-xs text-slate-500 font-semibold mb-1">Занятость</div>
                <div class="w-full bg-slate-100 rounded-full h-1.5"><div class="bg-indigo-500 h-1.5 rounded-full" style="width: ${Math.min(totalMins/480*100, 100)}%"></div></div>
                <div class="text-[10px] font-bold text-slate-400 mt-1 text-right">${totalMins} мин</div>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V12: Grid 2x3 ---
function viewWeek12_Grid2x3() {
    let ht = `<div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">`;
    DAYS.filter(d=>d!=='Вне').forEach(day => {
        ht += `<div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 h-64 flex flex-col">
            <h3 class="font-black text-slate-800 text-base uppercase border-b-2 border-slate-100 pb-2 mb-3">${day}</h3>
            <div class="flex-1 overflow-y-auto pr-2 space-y-2">`;
        let hasItems = false;
        TIMES.forEach(time => {
            (state.schedule[day][time] || []).forEach(it => {
                hasItems = true;
                const s = state.subjects.find(x=>x.id===it.subjectId);
                ht += `<div class="flex items-center gap-2 text-xs">
                    <div class="font-mono font-bold text-slate-400 w-10">${time}</div>
                    <div class="w-1.5 h-1.5 rounded-full" style="background:${s?.color}"></div>
                    <div class="font-bold text-slate-700 truncate">${s?.name}</div>
                </div>`;
            });
        });
        if(!hasItems) ht += `<div class="text-slate-400 text-xs text-center mt-6">Свободный день</div>`;
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V13: Time Blocks ---
function viewWeek13_TimeBlocks() {
    let ht = `<div class="max-w-4xl mx-auto space-y-2">`;
    DAYS.filter(d=>d!=='Вне').forEach(day => {
        ht += `<div class="flex bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm h-12">
            <div class="w-16 bg-slate-50 font-black text-slate-700 flex items-center justify-center border-r border-slate-200 uppercase text-xs">${day}</div>
            <div class="flex-1 flex p-1 gap-1">`;
        TIMES.forEach(time => {
            (state.schedule[day][time] || []).forEach(it => {
                const s = state.subjects.find(x=>x.id===it.subjectId);
                ht += `<div class="h-full rounded-md flex-1 min-w-[20px] max-w-[150px] flex items-center justify-center text-[10px] font-bold text-white truncate px-1 transition-transform hover:scale-[1.02]" style="background:${s?.color||'#ccc'}">${s?.name.slice(0,3)}</div>`;
            });
        });
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V14: Strips ---
function viewWeek14_Strips() {
    let ht = `<div class="max-w-5xl mx-auto space-y-1">`;
    DAYS.filter(d=>d!=='Вне').forEach(day => {
        let items = [];
        TIMES.forEach(t => (state.schedule[day][t] || []).forEach(it => items.push({time:t,...it})));
        if (items.length === 0) return;
        
        ht += `<div class="flex items-center text-xs bg-white rounded-lg border border-slate-100 p-1.5 shadow-sm hover:bg-slate-50">
            <div class="font-black text-slate-400 w-8 uppercase">${day.slice(0,2)}</div>
            <div class="flex-1 flex flex-wrap gap-2">`;
        items.forEach(it => {
            const s = state.subjects.find(x=>x.id===it.subjectId);
            ht += `<span class="flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full"><span class="w-2 h-2 rounded-full" style="background:${s?.color}"></span>${it.time} ${s?.name}</span>`;
        });
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V15: Dots ---
function viewWeek15_Dots() {
    let ht = `<div class="max-w-3xl mx-auto bg-white p-6 justify-center flex gap-6 rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">`;
    DAYS.filter(d=>d!=='Вне').forEach(day => {
        ht += `<div class="flex flex-col items-center gap-3">
            <div class="font-black text-slate-800 uppercase text-xs pb-2 border-b-2 border-slate-100 w-full text-center">${day}</div>
            <div class="flex flex-col gap-1.5">`;
        let hasItems=false;
        TIMES.forEach(time => {
            (state.schedule[day][time] || []).forEach(it => {
                hasItems=true;
                const s = state.subjects.find(x=>x.id===it.subjectId);
                ht += `<div class="w-6 h-6 rounded-full shadow-inner flex items-center justify-center text-white text-[9px] font-bold hover:scale-125 transition-transform cursor-pointer" style="background:${s?.color}" title="${time} ${s?.name}">${s?.name.charAt(0)}</div>`;
            });
        });
        if(!hasItems) ht += `<div class="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-300 text-[10px]">-</div>`;
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V16: Minimal List ---
function viewWeek16_MinimalList() {
    let ht = `<div class="max-w-2xl mx-auto space-y-4">`;
    DAYS.filter(d=>d!=='Вне').forEach(day => {
        let items = [];
        TIMES.forEach(t => (state.schedule[day][t] || []).forEach(it => items.push({time:t,...it})));
        if(items.length===0) return;
        ht += `<div class="flex gap-4 items-start">
            <div class="font-black text-slate-300 text-xl tracking-tighter uppercase w-10 text-right uppercase">${day.slice(0,3)}</div>
            <div class="flex-1 space-y-1 border-l-2 border-slate-100 pl-4 py-1">`;
        items.forEach(it => {
            const s = state.subjects.find(x=>x.id===it.subjectId);
            ht += `<div class="text-sm">
                <span class="font-mono text-slate-400 font-bold mr-2">${it.time}</span>
                <span class="font-bold text-slate-700" style="color:${s?.color}">${s?.name}</span>
            </div>`;
        });
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V17: Dense Timeline ---
function viewWeek17_DenseTimeline() {
    let ht = `<div class="max-w-5xl mx-auto bg-slate-800 rounded-3xl p-6 text-white shadow-xl overflow-x-auto">
        <div class="flex ml-12 mb-2 text-[10px] font-bold text-slate-500 border-b border-slate-700 pb-2">
            ${TIMES.map(t=>`<div class="flex-1 text-center">${t}</div>`).join('')}
        </div>`;
    DAYS.filter(d=>d!=='Вне').forEach(day => {
        ht += `<div class="flex items-center h-8 mb-1 hover:bg-slate-700 rounded-lg">
            <div class="w-12 text-xs font-black text-slate-400 uppercase tracking-widest">${day.slice(0,2)}</div>
            <div class="flex-1 flex relative h-full">`;
        const hourWidth = 100/TIMES.length;
        TIMES.forEach(t => {
            (state.schedule[day][t] || []).forEach(it => {
                let hIdx = TIMES.indexOf(t); if(hIdx===-1)return;
                const s = state.subjects.find(x=>x.id===it.subjectId);
                ht += `<div class="absolute h-6 top-1 rounded text-[9px] font-bold px-1 overflow-hidden transition-all hover:z-10 hover:h-8 hover:top-0 shadow-lg" 
                     style="left:${hIdx*hourWidth}%; width:${(it.duration/60)*hourWidth}%; background-color:${s?.color};">${s?.name}</div>`;
            });
        });
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V18: Nano Heatmap ---
function viewWeek18_NanoHeatmap() {
    let ht = `<div class="max-w-md mx-auto bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <div class="grid grid-cols-7 border-b border-slate-100 pb-2 mb-2">
            ${DAYS.filter(d=>d!=='Вне').map(d=>`<div class="text-center font-bold text-[10px] text-slate-400 uppercase">${d.slice(0,2)}</div>`).join('')}
        </div>
        <div class="grid grid-cols-7 gap-1">`;
    TIMES.forEach(time => {
        DAYS.filter(d=>d!=='Вне').forEach(day => {
            const items = state.schedule[day][time] || [];
            let color = 'bg-slate-50';
            if(items.length > 0) {
                const s = state.subjects.find(x=>x.id===items[0].subjectId);
                color = s ? `bg-[${s.color}]` : 'bg-indigo-500'; // fallback
                // Quick hack for custom hex values in TW: use inline style
                ht += `<div class="aspect-square rounded shadow-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer" style="background-color:${s?.color||'#6366f1'}" title="${time} ${day}: ${items.length} занятий"></div>`;
            } else {
                ht += `<div class="aspect-square rounded ${color} border border-slate-100"></div>`;
            }
        });
    });
    ht += `</div></div>`;
    return ht;
}


// ===================== HELPER COMPONENTS =====================

function buildKanbanCard(item, time, day) {
    const subj = state.subjects.find(s=>s.id===item.subjectId);
    const teacher = state.teachers.find(t=>t.id===item.teacherId);
    if(!subj) return '';
    
    return `<div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
        <div class="flex justify-between items-center mb-2">
            <span class="px-2.5 py-1 text-[10px] font-black uppercase rounded-lg text-white" style="background:${subj.color}">${subj.name}</span>
            <span class="text-sm font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">${time}</span>
        </div>
        <div class="font-bold text-[15px] text-slate-700 leading-snug">${teacher ? teacher.name : 'Нет преподавателя'}</div>
        <div class="mt-3 pt-3 border-t border-slate-50 flex justify-between text-xs font-bold text-slate-400">
            <span>${item.duration} мин.</span>
            <span>${teacher && teacher.platform ? teacher.platform : ''}</span>
        </div>
    </div>`;
}

function buildListRow(item, day) {
    const subj = state.subjects.find(s=>s.id===item.subjectId);
    const teacher = state.teachers.find(t=>t.id===item.teacherId);
    
    return `<div class="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm transition-transform hover:scale-[1.01]">
        <div class="font-black text-lg text-slate-800 w-14 text-center">${item.time}</div>
        <div class="w-1.5 h-10 rounded-full" style="background-color: ${subj?.color || '#ccc'}"></div>
        <div class="flex-1">
            <div class="font-bold text-sm text-slate-800 uppercase">${subj?.name}</div>
            <div class="text-xs text-slate-500">${teacher?.name} • ${item.duration} мин</div>
        </div>
    </div>`;
}

function buildTimelineNode(item, day) {
    const subj = state.subjects.find(s=>s.id===item.subjectId);
    
    return `<div class="relative">
        <div class="absolute -left-[31px] bg-white border-4 border-slate-100 w-4 h-4 rounded-full" style="border-color: ${subj?.color}"></div>
        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm ml-2">
            <div class="font-black text-lg" style="color: ${subj?.color}">${item.time} ${subj?.name}</div>
            <div class="text-slate-500 mt-1 text-sm">Длительность: ${item.duration} мин.</div>
        </div>
    </div>`;
}

// Include hexToRgba helper here if not in global scope
function hexToRgba(hex, alpha) {
    if (!hex) return `rgba(59, 130, 246, ${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
