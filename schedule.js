// ===================== SCHEDULE MODULE =====================

function renderSchedule() {
    let ht = `
        <div class="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            ${['today', 'week', 'week2', 'month'].map(t => {
                let label = t === 'today' ? 'Сегодня' : t === 'week' ? 'Неделя' : t === 'week2' ? '2 недели' : 'Месяц';
                let active = state.scheduleTab === t;
                return \`<button onclick="state.scheduleTab='${t}'; state.scheduleView=1; render();" class="px-5 py-2.5 rounded-2xl text-[15px] font-black shadow-sm transition-all whitespace-nowrap ${active ? 'bg-emerald-500 text-white' : 'bg-white text-slate-500 border border-slate-200'}">\${label}</button>\`;
            }).join('')}
        </div>
        <div class="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            \${renderViewOptions()}
        </div>
        <div id="schedule-content">
            \${renderScheduleContent()}
        </div>
    `;
    return ht;
}

function renderViewOptions() {
    let count = state.scheduleTab === 'today' ? 3 : state.scheduleTab === 'week' ? 8 : state.scheduleTab === 'week2' ? 5 : 3;
    
    const weekLabels = [
        "1: Канбан скролл", "2: Сетка абсолют", "3: Сетка скругления", 
        "4: Горизонт. Timeline", "5: Компакт. Таблица", "6: Тепловая Карта", 
        "7: Agenda Список", "8: Мозаика Карточек"
    ];
    
    let ht = '';
    for(let i=1; i<=count; i++) {
        let active = state.scheduleView === i;
        let label = state.scheduleTab === 'week' ? weekLabels[i-1] : `Вариант ${i}`;
        ht += \`<button onclick="state.scheduleView=${i}; render();" class="px-3.5 py-1.5 rounded-xl text-[13px] font-bold transition-all whitespace-nowrap ${active ? 'bg-blue-500 text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200'}">\${label}</button>\`;
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
            // View 1: Standard Cards
            dayItems.forEach(it => ht += buildKanbanCard(it, it.time, day));
        } else if (state.scheduleView === 2) {
            // View 2: Compact List
            dayItems.forEach(it => ht += buildListRow(it, day));
        } else if (state.scheduleView === 3) {
            // View 3: Vertical Timeline
            ht += `<div class="relative pl-6 border-l-2 border-slate-200 space-y-6">`;
            dayItems.forEach(it => ht += buildTimelineNode(it, day));
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
    return '';
}

// --- V1: Kanban Scroll ---
function viewWeek1_Kanban() {
    let ht = `<div class="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 scrollbar-hide" style="-webkit-overflow-scrolling: touch;">`;
    DAYS.forEach(day => {
        ht += `<div class="flex-none w-[85%] md:w-[300px] snap-center bg-slate-50 rounded-3xl p-3 border border-slate-200">
            <div class="text-center font-black text-lg text-slate-700 mb-4 uppercase tracking-widest">\${day}</div>
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
                \${TIMES.map(t => \`<div class="flex-1 text-center text-xs font-bold text-slate-400">\${t}</div>\`).join('')}
            </div>
            <!-- Rows -->
            <div class="space-y-4">`;
    
    DAYS.forEach(day => {
        if(day === 'Вне') return;
        ht += `<div class="relative flex h-14 items-center bg-slate-50 rounded-xl">
                <div class="w-20 pl-4 font-black text-slate-700 uppercase">\${day}</div>
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
                        style="left:\${left}%; width:\${width}%; background-color:\${subj?subj.color:'#3b82f6'};" title="\${subj?.name} (\${it.duration}м)">
                        \${subj?.name}
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
                    \${DAYS.filter(d=>d!=='Вне').map(d => \`<th class="p-3 text-center border-r border-slate-100 uppercase">\${d}</th>\`).join('')}
                </tr>
            </thead>
            <tbody>`;
            
    TIMES.forEach(time => {
        ht += `<tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
            <td class="p-3 font-black text-slate-400 text-center border-r border-slate-200 bg-slate-50/50">\${time}</td>`;
        
        DAYS.filter(d=>d!=='Вне').map(day => {
            const items = state.schedule[day][time] || [];
            if (items.length === 0) {
                ht += `<td class="p-3 border-r border-slate-100 text-center"></td>`;
            } else {
                ht += `<td class="p-2 border-r border-slate-100 align-top">`;
                items.forEach(it => {
                    const subj = state.subjects.find(s=>s.id===it.subjectId);
                    ht += `<div class="text-[11px] font-bold p-1.5 rounded-md mb-1 truncate text-white" style="background:\${subj?subj.color:'#ccc'}">
                        \${subj?.name}<br><span class="opacity-80 font-normal">\${it.duration}м</span>
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
            <div class="font-black text-slate-400 uppercase text-sm">\${day}</div>
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner \${bg} \${text}">
                \${totalMins > 0 ? (totalMins/60).toFixed(1) + 'ч' : '0'}
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
                <h3 class="font-black text-xl text-slate-800 border-b-2 border-slate-800 pb-2 mb-4 uppercase">\${day}</h3>
                <div class="space-y-3 pl-2 border-l-4 border-slate-200">`;
            items.forEach(it => ht += buildListRow(it, day));
            ht += `</div></div>`;
        }
    });
    ht += `</div>`;
    return ht;
}

// --- V8: Cards Mosaic ---
function viewWeek8_CardsMosaic() {
    let ht = `<div class="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">`;
    
    DAYS.forEach(day => {
        let items = [];
        TIMES.forEach(t => { (state.schedule[day][t] || []).forEach(it => items.push({time: t, ...it})); });
        
        items.forEach(it => {
            const subj = state.subjects.find(s=>s.id===it.subjectId);
            const teacher = state.teachers.find(t=>t.id===it.teacherId);
            
            // Randomly vary heights based on duration to simulate masonry
            const hClass = it.duration > 60 ? 'min-h-[140px]' : 'min-h-[100px]';
            
            ht += `<div class="break-inside-avoid relative overflow-hidden rounded-3xl p-5 shadow-sm border border-slate-100 \${hClass} flex flex-col" style="background-color: \${hexToRgba(subj?.color, 0.05)}">
                <div class="absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-20" style="background-color: \${subj?.color}"></div>
                <div class="flex items-center gap-2 mb-auto">
                    <span class="font-black text-2xl" style="color: \${subj?.color}">\${it.time}</span>
                    <span class="text-xs font-bold px-2 py-1 rounded-full text-slate-500 bg-white shadow-sm">\${day}</span>
                </div>
                <div class="mt-4">
                    <div class="font-black text-lg text-slate-800 leading-tight">\${subj?.name}</div>
                    <div class="text-sm font-semibold text-slate-500 mt-1">\${teacher?.name} (\${it.duration}м)</div>
                </div>
            </div>`;
        });
    });
    ht += `</div>`;
    return ht;
}


// ===================== HELPER COMPONENTS =====================

function buildKanbanCard(item, time, day) {
    const subj = state.subjects.find(s=>s.id===item.subjectId);
    const teacher = state.teachers.find(t=>t.id===item.teacherId);
    if(!subj) return '';
    
    return `<div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
        <div class="flex justify-between items-center mb-2">
            <span class="px-2.5 py-1 text-[10px] font-black uppercase rounded-lg text-white" style="background:\${subj.color}">\${subj.name}</span>
            <span class="text-sm font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">\${time}</span>
        </div>
        <div class="font-bold text-[15px] text-slate-700 leading-snug">\${teacher ? teacher.name : 'Нет преподавателя'}</div>
        <div class="mt-3 pt-3 border-t border-slate-50 flex justify-between text-xs font-bold text-slate-400">
            <span>\${item.duration} мин.</span>
            <span>\${teacher && teacher.platform ? teacher.platform : ''}</span>
        </div>
    </div>`;
}

function buildListRow(item, day) {
    const subj = state.subjects.find(s=>s.id===item.subjectId);
    const teacher = state.teachers.find(t=>t.id===item.teacherId);
    
    return `<div class="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm transition-transform hover:scale-[1.01]">
        <div class="font-black text-lg text-slate-800 w-14 text-center">\${item.time}</div>
        <div class="w-1.5 h-10 rounded-full" style="background-color: \${subj?.color || '#ccc'}"></div>
        <div class="flex-1">
            <div class="font-bold text-sm text-slate-800 uppercase">\${subj?.name}</div>
            <div class="text-xs text-slate-500">\${teacher?.name} • \${item.duration} мин</div>
        </div>
    </div>`;
}

function buildTimelineNode(item, day) {
    const subj = state.subjects.find(s=>s.id===item.subjectId);
    
    return `<div class="relative">
        <div class="absolute -left-[31px] bg-white border-4 border-slate-100 w-4 h-4 rounded-full" style="border-color: \${subj?.color}"></div>
        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm ml-2">
            <div class="font-black text-lg" style="color: \${subj?.color}">\${item.time} \${subj?.name}</div>
            <div class="text-slate-500 mt-1 text-sm">Длительность: \${item.duration} мин.</div>
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
