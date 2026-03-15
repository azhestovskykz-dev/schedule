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
    let count = state.scheduleTab === 'today' ? 18 : state.scheduleTab === 'week' ? 23 : state.scheduleTab === 'week2' ? 5 : 5;
    
    let ht = '';
    for(let i=1; i<=count; i++) {
        let active = state.scheduleView === i;
        let label = String(i);
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
        return renderWeek2View();
    } else if (state.scheduleTab === 'month') {
        return renderMonthView();
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
        } else if (state.scheduleView === 9) {
            // View 9: Vertical Time ruler
            ht += `<div class="relative max-w-sm mx-auto pl-12 border-l-4 border-slate-100 space-y-8">`;
            dayItems.forEach(it => {
                const s = state.subjects.find(x=>x.id===it.subjectId);
                ht += `<div class="relative">
                    <div class="absolute -left-[56px] top-1 rounded-full px-2 py-0.5 text-xs text-white font-black" style="background:${s?.color||'#ccc'}">${it.time}</div>
                    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-1">
                        <div class="font-bold text-lg text-slate-800">${s?.name}</div>
                        <div class="text-xs text-slate-500 mt-1">${it.duration} минут</div>
                    </div>
                </div>`;
            });
            ht += `</div>`;
        } else if (state.scheduleView === 10) {
            // View 10: Horizontal Ticket cards
            ht += `<div class="flex flex-col gap-3">`;
            dayItems.forEach(it => {
                const s = state.subjects.find(x=>x.id===it.subjectId);
                ht += `<div class="flex bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group cursor-pointer hover:border-slate-300">
                    <div class="w-1.5 shrink-0" style="background:${s?.color||'#ccc'}"></div>
                    <div class="w-16 bg-slate-50 flex items-center justify-center font-black text-slate-400 text-sm border-r border-slate-100 border-dashed">${it.time}</div>
                    <div class="p-3 flex-1 flex justify-between items-center bg-gradient-to-r from-white to-slate-50/50">
                        <div class="font-bold text-slate-700">${s?.name}</div>
                        <div class="font-mono text-xs text-slate-400 bg-white px-2 py-1 border border-slate-100 rounded-md">${it.duration}м</div>
                    </div>
                </div>`;
            });
            ht += `</div>`;
        } else if (state.scheduleView === 11) {
            // View 11: Progress blocks setup
            ht += `<div class="space-y-4 max-w-sm mx-auto">`;
            dayItems.forEach(it => {
                const s = state.subjects.find(x=>x.id===it.subjectId);
                ht += `<div class="bg-slate-50 rounded-2xl p-4 border border-slate-200 group hover:bg-white transition-colors">
                    <div class="flex justify-between items-end mb-2">
                        <div class="font-black text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">${s?.name}</div>
                        <div class="font-black text-slate-400 font-mono">${it.time}</div>
                    </div>
                    <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div class="h-full rounded-full w-full opacity-60 group-hover:opacity-100" style="background:${s?.color||'#ccc'}"></div>
                    </div>
                </div>`;
            });
            ht += `</div>`;
        } else if (state.scheduleView === 12) {
            // View 12: Grid 2 Columns List
            ht += `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">`;
            dayItems.forEach(it => {
                const s = state.subjects.find(x=>x.id===it.subjectId);
                ht += `<div class="bg-white border-2 border-slate-100 p-4 rounded-3xl flex gap-4 items-center hover:border-indigo-300 transition-colors">
                    <div class="w-12 h-12 shrink-0 rounded-2xl shadow-inner text-white font-black flex items-center justify-center text-xs" style="background:${s?.color||'#ccc'}">
                        ${it.time}
                    </div>
                    <div class="flex-1">
                        <div class="font-black text-slate-700 leading-tight">${s?.name}</div>
                        <div class="text-xs text-slate-400 mt-0.5">${it.duration}м</div>
                    </div>
                </div>`;
            });
            ht += `</div>`;
        } else if (state.scheduleView === 13) {
            // View 13: Dark Neon style
            ht += `<div class="bg-slate-900 rounded-3xl p-6 text-white max-w-md mx-auto shadow-xl space-y-3">`;
            dayItems.forEach(it => {
                const s = state.subjects.find(x=>x.id===it.subjectId);
                ht += `<div class="flex justify-between items-center group">
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style="background:${s?.color||'#ccc'}; box-shadow: 0 0 10px ${s?.color||'#ccc'}"></div>
                        <span class="font-mono text-slate-400 group-hover:text-amber-300 transition-colors text-sm">${it.time}</span>
                    </div>
                    <div class="font-bold text-slate-200 tracking-wide text-sm">${s?.name}</div>
                </div>`;
            });
            ht += `</div>`;
        } else if (state.scheduleView === 14) {
            ht += `<div class="max-w-2xl mx-auto space-y-4">`;
            dayItems.forEach(it => {
                const subj = state.subjects.find(s=>s.id===it.subjectId);
                ht += `<div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 mb-3 hover:shadow-md transition-shadow">
                    <div class="flex justify-between items-center mb-3">
                        <span class="px-2 py-0.5 rounded text-[10px] uppercase font-black text-white" style="background:${subj?.color||'#ccc'}">${subj?.name.slice(0,12)}</span>
                        <span class="text-slate-400 text-xs font-bold leading-none bg-slate-50 px-2 py-1 rounded-md">${day}</span>
                    </div>
                    <div class="text-slate-800 font-bold text-sm leading-tight">${subj?.name}</div>
                    <div class="text-slate-400 text-[11px] font-bold mt-2 flex items-center gap-3">
                        <span class="flex items-center gap-1 font-mono bg-slate-50 px-1.5 py-0.5 rounded">⏰ ${it.time}</span>
                        <span class="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded">⏳ ${it.duration}м</span>
                    </div>
                </div>`;
            });
            ht += `</div>`;
        } else if (state.scheduleView === 15) {
            ht += `<div class="max-w-2xl mx-auto space-y-3">`;
            dayItems.forEach(it => {
                const subj = state.subjects.find(s=>s.id===it.subjectId);
                ht += `<div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex gap-4 items-center hover:-translate-y-0.5 transition-transform">
                    <div class="font-black text-xl text-slate-800 w-14 text-center shrink-0 tracking-tighter">${it.time}</div>
                    <div class="w-1.5 h-12 rounded-full shrink-0" style="background-color: ${subj?.color||'#ccc'};"></div>
                    <div class="flex-1 min-w-0">
                        <div class="text-slate-800 font-black uppercase tracking-wide text-[13px] truncate">${subj?.name}</div>
                        <div class="text-slate-400 text-[11px] font-semibold mt-1 truncate">${subj?.name} (${it.duration} мин)</div>
                    </div>
                </div>`;
            });
            ht += `</div>`;
        } else if (state.scheduleView === 16) {
            ht += `<div class="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">`;
            dayItems.forEach(it => {
                const subj = state.subjects.find(s=>s.id===it.subjectId);
                ht += `<div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex flex-col hover:border-indigo-200 transition-colors">
                    <div class="flex justify-between items-start mb-6">
                        <span class="px-2 py-1 text-white rounded-md text-[10px] uppercase font-black tracking-widest leading-none shadow-sm" style="background:${subj?.color||'#ccc'}">${subj?.name.slice(0,10)}</span>
                        <span class="font-black text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg text-sm font-mono border border-slate-100">${it.time}</span>
                    </div>
                    <div class="text-slate-800 font-black mb-4 flex-1 text-lg leading-tight">${subj?.name}</div>
                    <div class="flex justify-between items-center text-[11px] text-slate-400 font-bold pt-3 border-t border-slate-50">
                        <span>${it.duration} мин.</span>
                        <span class="bg-slate-50 px-2 py-0.5 rounded text-slate-500 uppercase">Урок</span>
                    </div>
                </div>`;
            });
            ht += `</div>`;
        } else if (state.scheduleView === 17) {
            ht += `<div class="max-w-2xl mx-auto space-y-2">`;
            dayItems.forEach(it => {
                const subj = state.subjects.find(s=>s.id===it.subjectId);
                ht += `<div class="bg-white border text-sm border-slate-100 shadow-sm rounded-2xl p-4 border-b-4 flex justify-between items-center hover:bg-slate-50 transition-colors cursor-pointer" style="border-bottom-color: ${subj?.color||'#ccc'};">
                    <div class="font-black text-slate-800 text-[15px] truncate pr-4">${subj?.name}</div>
                    <div class="font-black text-slate-400 text-lg font-mono shrink-0">${it.time}</div>
                </div>`;
            });
            ht += `</div>`;
        } else if (state.scheduleView === 18) {
            ht += `<div class="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">`;
            dayItems.forEach(it => {
                const subj = state.subjects.find(s=>s.id===it.subjectId);
                ht += `<div class="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-md hover:border-slate-300 transition-all cursor-pointer">
                    <div class="p-5 flex justify-between items-center bg-gradient-to-r from-white to-slate-50/80">
                         <div class="text-[17px] font-black text-slate-800 truncate pr-2">${subj?.name}</div>
                         <div class="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-black shadow-sm shrink-0 font-mono tracking-tight">${it.time}</div>
                    </div>
                    <div class="bg-slate-50/50 px-5 py-3 border-t border-slate-100 flex gap-4 text-[11px] font-bold text-slate-500 justify-between items-center">
                        <span class="flex items-center gap-2 uppercase tracking-widest"><div class="w-2 h-2 rounded-full" style="background:${subj?.color||'#ccc'}"></div>${day}</span>
                        <span class="bg-white px-2 py-1 rounded shadow-sm border border-slate-100">${it.duration} мин</span>
                    </div>
                </div>`;
            });
            ht += `</div>`;
        }
    }
    ht += `</div>`;
    return ht;
}

// ================ 2 WEEK VIEW ================
function renderWeek2View() {
    // Show 2 consecutive weeks side by side reusing buildKanbanCard
    let ht = `<div class="space-y-8">`;
    ['Неделя 1', 'Неделя 2'].forEach((weekLabel, weekIdx) => {
        ht += `<div>
            <h3 class="font-black text-xl text-slate-700 mb-4 px-2">${weekLabel}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">`;
        DAYS.forEach(day => {
            ht += `<div class="bg-slate-50 rounded-2xl p-2 border border-slate-100">
                <div class="text-center font-black text-sm text-slate-600 mb-2 uppercase">${day}</div>
                <div class="space-y-2">`;
            let items = [];
            TIMES.forEach(t => { (state.schedule[day][t] || []).forEach(it => items.push({time: t, ...it})); });
            if (items.length === 0) ht += `<div class="text-slate-400 text-xs italic text-center py-2">Выходной</div>`;
            items.forEach(it => {
                const s = state.subjects.find(x=>x.id===it.subjectId);
                ht += `<div class="bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                    <div class="flex justify-between items-center mb-1">
                        <span class="px-1.5 py-0.5 rounded text-[8px] uppercase font-black text-white" style="background:${s?.color||'#ccc'}">${s?.name.slice(0,6)}</span>
                        <span class="text-[10px] font-bold text-slate-400">${it.time}</span>
                    </div>
                    <div class="text-[10px] font-bold text-slate-500">${it.duration}м</div>
                </div>`;
            });
            ht += `</div></div>`;
        });
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// ================ WEEK VIEWS ================
function renderWeekView() {
    if (state.scheduleView === 1) return viewWeek1_Kanban();
    if (state.scheduleView === 2) return viewWeek2_KanbanEdit();
    if (state.scheduleView === 3) return viewWeek3_CompactGrid();
    if (state.scheduleView === 4) return viewWeek4_Timeline();
    if (state.scheduleView === 5) return viewWeek5_CompactTable();
    if (state.scheduleView === 6) return viewWeek6_Masonry();
    if (state.scheduleView === 7) return viewWeek7_AgendaList();
    if (state.scheduleView === 8) return viewWeek8_AgendaGrid();
    if (state.scheduleView === 9) return viewWeek9_CompactKanban();
    if (state.scheduleView === 10) return viewWeek10_Dashboard();
    if (state.scheduleView === 11) return viewWeek11_TimeBlocks();
    if (state.scheduleView === 12) return viewWeek12_Dots();
    if (state.scheduleView === 13) return viewWeek13_NanoHeatmap();
    if (state.scheduleView === 14) return viewWeek14_ColumnsSplit();
    if (state.scheduleView === 15) return viewWeek15_BlocksGrid();
    if (state.scheduleView === 16) return viewWeek16_Accordion();
    if (state.scheduleView === 17) return viewWeek17_UniKanban();
    if (state.scheduleView === 18) return viewWeek18_UniVertBar();
    if (state.scheduleView === 19) return viewWeek19_UniSolidTags();
    if (state.scheduleView === 20) return viewWeek20_UniBorderBottom();
    if (state.scheduleView === 21) return viewWeek21_UniMinimalist();
    if (state.scheduleView === 22) return viewWeek22_KanbanFull();
    if (state.scheduleView === 23) return viewWeek23_NewCards();
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

function buildKanbanCardEdit(item, day) {
    const subj = state.subjects.find(s=>s.id===item.subjectId);
    const teacher = state.teachers.find(t=>t.id===item.teacherId);
    if(!subj) return '';

    let numbers = '';
    if (teacher && teacher.phone) {
        numbers = teacher.phone.slice(-5);
    } else if (teacher && teacher.name) {
        let m = teacher.name.match(/\((.*?)\)/);
        if (m) numbers = m[1];
    }
    if (!numbers) numbers = '00-00';

    let isZoom = teacher && teacher.platform && teacher.platform.toLowerCase() === 'zoom';
    let platformName = isZoom ? 'Zoom' : 'Telegram';
    let platColor = isZoom ? 'text-blue-500' : 'text-sky-500';
    let platBg = isZoom ? 'bg-blue-50' : 'bg-sky-50';
    let platHover = isZoom ? 'hover:bg-blue-100' : 'hover:bg-sky-100';
    
    let iconSvg = isZoom 
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;

    return `<div class="bg-white p-3 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start mb-3">
            <span class="px-2.5 py-1 text-[10px] font-black uppercase rounded-xl text-white mt-1 shadow-sm" style="background:${subj.color}">${subj.name}</span>
            <div class="flex flex-col items-end gap-1">
                <span class="text-sm font-black text-slate-800">${numbers}</span>
                <span class="text-[10px] font-bold text-slate-400">${item.duration} мин.</span>
            </div>
        </div>
        
        <button onclick="alert('Открытие ${platformName}')" class="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs ${platColor} ${platBg} ${platHover} transition-colors">
            ${iconSvg}
            <span>${platformName}</span>
        </button>
    </div>`;
}

// --- V2: Kanban Edit (Copy of V1 with modifications) ---
function viewWeek2_KanbanEdit() {
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
        items.forEach(it => ht += buildKanbanCardEdit(it, day));
        
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V3: Compact 7-Day Grid (modified copy of V2) ---
function buildKanbanCardCompact(item, day) {
    const subj = state.subjects.find(s=>s.id===item.subjectId);
    const teacher = state.teachers.find(t=>t.id===item.teacherId);
    if(!subj) return '';

    let numbers = '';
    if (teacher && teacher.phone) {
        numbers = teacher.phone.slice(-5);
    } else if (teacher && teacher.name) {
        let m = teacher.name.match(/\((.*?)\)/);
        if (m) numbers = m[1];
    }
    if (!numbers) numbers = '00-00';

    let isZoom = teacher && teacher.platform && teacher.platform.toLowerCase() === 'zoom';
    let platformName = isZoom ? 'Zoom' : 'Telegram';
    let platColor = isZoom ? 'text-blue-500' : 'text-sky-500';
    let platBg = isZoom ? 'bg-blue-50' : 'bg-sky-50';
    let platHover = isZoom ? 'hover:bg-blue-100' : 'hover:bg-sky-100';
    
    let iconSvg = isZoom 
        ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`
        : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;

    return `<div class="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex justify-between items-center mb-1.5">
            <span class="px-2 py-0.5 text-[9px] font-black uppercase rounded-lg text-white shadow-sm" style="background:${subj.color}">${subj.name.slice(0,8)}</span>
            <span class="text-sm font-black text-slate-800">${numbers}</span>
        </div>
        <div class="text-center font-black text-sm text-slate-500 mb-1.5">${item.duration} \u043c\u0438\u043d.</div>
        <button onclick="alert('\u041e\u0442\u043a\u0440\u044b\u0442\u0438\u0435 ${platformName}')" class="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-bold text-[11px] ${platColor} ${platBg} ${platHover} transition-colors">
            ${iconSvg}
            <span>${platformName}</span>
        </button>
    </div>`;
}

function viewWeek3_CompactGrid() {
    let ht = `<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 pb-4">`;
    DAYS.forEach(day => {
        ht += `<div class="bg-slate-50 rounded-2xl p-2 border border-slate-100">
            <div class="text-center font-black text-sm text-slate-600 mb-2 uppercase tracking-widest">${day}</div>
            <div class="space-y-2">`;
        
        let items = [];
        TIMES.forEach(t => {
            (state.schedule[day][t] || []).forEach(it => items.push({time: t, ...it}));
        });
        
        if (items.length === 0) ht += `<div class="text-slate-400 text-xs italic text-center py-3">\u0412\u044b\u0445\u043e\u0434\u043d\u043e\u0439</div>`;
        items.forEach(it => ht += buildKanbanCardCompact(it, day));
        
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V23: Old NewCards (formerly V3) ---
function viewWeek23_NewCards() {
    let ht = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 pb-6">`;
    DAYS.forEach(day => {
        ht += `<div class="bg-slate-50 rounded-2xl p-2 border border-slate-100">
            <div class="text-center font-black text-sm text-slate-500 mb-2 uppercase tracking-widest">${day}</div>
            <div class="space-y-2">`;
        let items = [];
        TIMES.forEach(t => { (state.schedule[day][t] || []).forEach(it => items.push({time: t, ...it})); });
        items.forEach(it => {
            const s = state.subjects.find(x=>x.id===it.subjectId);
            ht += `<div class="bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                <div class="flex justify-between items-center mb-1">
                    <span class="px-1.5 py-0.5 rounded text-[8px] uppercase font-black text-white" style="background:${s?.color||'#ccc'}">${s?.name.slice(0,6)}</span>
                    <span class="text-[10px] font-bold text-slate-400">${it.time}</span>
                </div>
                <div class="text-[10px] font-bold text-slate-500">${it.duration}\u043c</div>
            </div>`;
        });
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V22: Absolute Grid (formerly V2) ---
function viewWeek22_KanbanFull() {
    let ht = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 pb-6">`;
    DAYS.forEach(day => {
        ht += `<div class="bg-slate-50 rounded-3xl p-3 border border-slate-200 shadow-inner flex flex-col h-full">
            <div class="text-center font-black text-lg text-slate-700 mb-4 uppercase tracking-widest border-b border-slate-200 pb-2 mx-2">${day}</div>
            <div class="space-y-3 flex-1">`;
        let items = [];
        TIMES.forEach(t => {
            (state.schedule[day][t] || []).forEach(it => items.push({time: t, ...it}));
        });
        if (items.length === 0) ht += `<div class="text-slate-400 text-sm italic text-center py-4 bg-white/50 rounded-2xl mx-1 border border-slate-100 border-dashed">Выходной</div>`;
        items.forEach(it => ht += buildKanbanCard(it, it.time, day));
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V3: New Cards ---
function viewWeek3_NewCards() {
    let ht = `<div class="max-w-7xl mx-auto flex flex-wrap lg:flex-nowrap gap-4 pb-6">`;
    DAYS.forEach(day => {
        let items = [];
        TIMES.forEach(t => (state.schedule[day][t] || []).forEach(it => items.push({time:t,...it})));
        ht += `<div class="flex-1 min-w-[150px] bg-slate-50/50 p-2 rounded-2xl border border-slate-100 flex flex-col h-full">
            <h3 class="font-black text-slate-700 text-center mb-4 mt-2 tracking-widest uppercase bg-white py-2 mx-1 rounded-xl shadow-sm border border-slate-100">${day}</h3>
            <div class="space-y-3 px-1 flex-1">`;
        if (items.length===0) ht += `<div class="text-center text-slate-400 italic text-sm mt-4">Выходной</div>`;
        items.forEach(it => {
            const s = state.subjects.find(x=>x.id===it.subjectId);
            ht += `<div class="bg-white rounded-xl p-3 shadow-sm border border-slate-100 hover:border-indigo-300 transition-colors">
                <div class="flex justify-between items-start mb-2">
                    <span class="w-8 h-8 rounded bg-slate-50 flex items-center justify-center font-bold text-xs text-slate-500 border border-slate-100">${it.time.split(':')[0]}</span>
                    <span class="w-2 h-2 rounded-full" style="background:${s?.color}"></span>
                </div>
                <div class="font-black text-slate-800 text-[13px] leading-tight mb-1">${s?.name}</div>
                <div class="text-[10px] font-semibold text-slate-400">${it.duration} минут</div>
            </div>`;
        });
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
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

// --- V6: Masonry ---
function viewWeek6_Masonry() {
    let ht = `<div class="max-w-7xl mx-auto columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-7 gap-4 space-y-4">`;
    DAYS.forEach(day => {
        let items = [];
        TIMES.forEach(t => (state.schedule[day][t] || []).forEach(it => items.push({time:t,...it})));
        if (items.length===0) return;
        ht += `<div class="break-inside-avoid bg-white p-4 rounded-3xl border border-slate-200 shadow-sm border-t-4" style="border-top-color: #6366f1">
            <h3 class="font-black text-2xl text-slate-800 tracking-tighter mb-4">${day}</h3>
            <div class="space-y-4">`;
        items.forEach((it, idx) => {
            const s = state.subjects.find(x=>x.id===it.subjectId);
            ht += `<div>
                <div class="flex items-center gap-2 mb-1">
                    <span class="font-mono font-bold text-indigo-500 text-sm">${it.time}</span>
                    <span class="flex-1 border-b border-dashed border-slate-200"></span>
                </div>
                <div class="font-black text-slate-700 text-sm bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">${s?.name}</div>
            </div>`;
        });
        ht += `</div></div>`;
    });
    ht += `</div>`;
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



// --- V8: Agenda Grid ---
function viewWeek8_AgendaGrid() {
    let ht = `<div class="max-w-7xl mx-auto flex flex-wrap lg:flex-nowrap gap-4">`;
    DAYS.filter(d=>d!=='Вне').forEach(day => {
        let items = [];
        TIMES.forEach(t => { (state.schedule[day][t] || []).forEach(it => items.push({time: t, ...it})); });
        
        ht += `<div class="flex-1 min-w-[150px]">
            <h3 class="font-black text-xl text-slate-800 border-b-2 border-slate-800 pb-2 mb-4 uppercase text-center">${day}</h3>
            <div class="space-y-3 pl-1 border-l-4 border-slate-100">`;
        if (items.length === 0) ht += `<div class="text-slate-400 italic text-sm py-4">Нет занятий</div>`;
        items.forEach(it => {
            const s = state.subjects.find(x=>x.id===it.subjectId);
            ht += `<div class="bg-white p-3 rounded-xl shadow-sm border border-slate-100 ml-2 relative">
                <div class="absolute -left-3 top-4 w-2 h-2 rounded-full" style="background:${s?.color}"></div>
                <div class="font-black text-slate-800 text-[13px] leading-tight mb-1">${s?.name}</div>
                <div class="flex items-center justify-between mt-2 text-[10px] font-bold text-slate-500">
                    <span class="bg-slate-50 px-1.5 py-0.5 rounded font-mono">${it.time}</span>
                    <span>${it.duration}м</span>
                </div>
            </div>`;
        });
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V9: Compact Kanban ---
function viewWeek9_CompactKanban() {
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

// --- V10: Dashboard ---
function viewWeek10_Dashboard() {
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

// --- V11: Time Blocks ---
function viewWeek11_TimeBlocks() {
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


// --- V12: Dots ---
function viewWeek12_Dots() {
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



// --- V13: Nano Heatmap ---
function viewWeek13_NanoHeatmap() {
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


// --- V14: Columns Split ---
function viewWeek14_ColumnsSplit() {
    let ht = `<div class="max-w-7xl mx-auto flex flex-wrap lg:flex-nowrap gap-4">`;
    DAYS.filter(d=>d!=='Вне').forEach(day => {
        let items = [];
        TIMES.forEach(t => (state.schedule[day][t] || []).forEach(it => items.push({time:t,...it})));
        
        ht += `<div class="flex-1 min-w-[200px] bg-slate-50 border-t-4 border-slate-300 pt-3 pb-6 px-3">
            <h3 class="font-black text-2xl text-slate-800 text-center mb-4">${day}</h3>
            <div class="space-y-3">`;
        if(items.length===0) ht += `<div class="text-center text-slate-400 italic text-sm mt-4">Выходной</div>`;
        items.forEach(it => {
            const s = state.subjects.find(x=>x.id===it.subjectId);
            ht += `<div class="bg-white p-3 border-l-4 shadow-sm hover:scale-105 transition-transform cursor-pointer" style="border-left-color:${s?.color}">
                <div class="flex justify-between items-center mb-1">
                    <span class="font-bold text-slate-700 leading-tight">${s?.name}</span>
                    <span class="text-xs font-black text-slate-400">${it.time}</span>
                </div>
                <div class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">${it.duration} минут</div>
            </div>`;
        });
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}


// --- V15: Blocks Grid ---
function viewWeek15_BlocksGrid() {
    let ht = `<div class="max-w-6xl mx-auto grid grid-cols-1 gap-2 p-2">`;
    DAYS.filter(d=>d!=='Вне').forEach(day => {
        let items = [];
        TIMES.forEach(t => (state.schedule[day][t] || []).forEach(it => items.push({time:t,...it})));
        if (items.length===0) return;
        
        ht += `<div class="flex items-stretch bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
            <div class="w-16 bg-slate-800 text-white flex items-center justify-center font-black text-xl">${day}</div>
            <div class="flex-1 flex overflow-x-auto gap-0.5 p-0.5 bg-slate-100">`;
        items.forEach(it => {
            const s = state.subjects.find(x=>x.id===it.subjectId);
            ht += `<div class="flex-none w-32 p-2 flex flex-col justify-center text-white" style="background:${s?.color}">
                <div class="text-[10px] uppercase font-black opacity-75">${it.time}</div>
                <div class="font-bold text-xs truncate leading-tight">${s?.name}</div>
            </div>`;
        });
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V16: Accordion List ---
function viewWeek16_Accordion() {
    let ht = `<div class="max-w-2xl mx-auto space-y-3">`;
    DAYS.filter(d=>d!=='Вне').forEach(day => {
        let items = [];
        TIMES.forEach(t => (state.schedule[day][t] || []).forEach(it => items.push({time:t,...it})));
        
        let minCount = 0; items.forEach(x=>minCount+=x.duration);
        let count = items.length;
        
        ht += `<details class="bg-white border text-sm border-slate-200 rounded-2xl overflow-hidden shadow-sm group" ${count>0?'open':''}>
            <summary class="p-4 font-black flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors list-none outline-none marker:hidden">
                <div class="text-xl text-slate-800">${day}</div>
                <div class="flex gap-3 text-xs font-semibold text-slate-400 items-center">
                    <span>${count} занятий</span>
                    <span class="bg-slate-100 px-2 py-1 rounded-lg">${(minCount/60).toFixed(1)} ч.</span>
                    <svg class="group-open:rotate-180 transition-transform w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
            </summary>
            
            <div class="p-4 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-2 mt-2">`;
        if (count===0) ht += `<div class="text-slate-400 italic">Свободный день</div>`;
        items.forEach(it => {
            const s = state.subjects.find(x=>x.id===it.subjectId);
            const t = state.teachers.find(x=>x.id===it.teacherId);
            ht += `<div class="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                <div class="font-mono font-bold text-slate-500 w-12">${it.time}</div>
                <div class="w-1 h-8 rounded-full" style="background:${s?.color}"></div>
                <div class="flex-1">
                    <div class="font-bold text-slate-700">${s?.name}</div>
                    <div class="text-[10px] text-slate-400 font-semibold uppercase">${t?.name}</div>
                </div>
            </div>`;
        });
        ht += `</div></details>`;
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


// ================ UNIFIED DESIGN WEEK VIEWS (V24-V28) ================
function viewWeek17_UniKanban() {
    let ht = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 pb-6">`;
    DAYS.forEach(day => {
        ht += `<div class="bg-slate-50 rounded-[28px] p-3 border border-slate-100">
            <div class="text-center font-black text-sm text-slate-500 mb-3 uppercase tracking-widest px-2">${day}</div>
            <div class="space-y-3">`;
        let items = [];
        TIMES.forEach(t => { (state.schedule[day][t] || []).forEach(it => items.push({time: t, ...it})); });
        items.forEach(it => {
            const subj = state.subjects.find(s=>s.id===it.subjectId);
            ht += `<div class="bg-white border border-slate-100 rounded-[20px] shadow-sm p-3 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-center mb-2">
                    <span class="px-2 py-0.5 rounded text-[9px] uppercase font-black text-white" style="background:${subj?.color||'#ccc'}">${subj?.name.slice(0,10)}</span>
                    <span class="text-slate-400 text-[10px] font-bold leading-none bg-slate-50 px-1.5 py-1 rounded-md">${it.time}</span>
                </div>
                <div class="text-slate-800 font-bold text-[13px] leading-tight mb-2">${subj?.name}</div>
                <div class="text-slate-400 text-[10px] font-semibold border-t border-slate-50 pt-2 flex justify-between">
                    <span>${it.duration}м</span>
                    <span class="uppercase">Урок</span>
                </div>
            </div>`;
        });
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

function viewWeek18_UniVertBar() {
    let ht = `<div class="max-w-6xl mx-auto space-y-6">`;
    DAYS.filter(d=>d!=='Вне').forEach(day => {
        let items = [];
        TIMES.forEach(t => { (state.schedule[day][t] || []).forEach(it => items.push({time: t, ...it})); });
        if(items.length===0) return;
        
        ht += `<div><h3 class="font-black text-xl text-slate-800 mb-4 px-2">${day}</h3><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">`;
        items.forEach(it => {
            const subj = state.subjects.find(s=>s.id===it.subjectId);
            ht += `<div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-3 flex gap-4 items-center hover:-translate-y-0.5 transition-transform">
                <div class="font-black text-lg text-slate-700 w-12 text-center shrink-0 tracking-tighter">${it.time}</div>
                <div class="w-1.5 h-10 rounded-full shrink-0" style="background-color: ${subj?.color||'#ccc'};"></div>
                <div class="flex-1 min-w-0">
                    <div class="text-slate-800 font-black uppercase tracking-wider text-[11px] truncate">${subj?.name}</div>
                    <div class="text-slate-400 text-[10px] font-semibold mt-1 truncate">${subj?.name} (${it.duration}м)</div>
                </div>
            </div>`;
        });
        ht += `</div></div>`;
    });
    return ht + `</div>`;
}

function viewWeek19_UniSolidTags() {
    let ht = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">`;
    DAYS.forEach(day => {
        let items = [];
        TIMES.forEach(t => { (state.schedule[day][t] || []).forEach(it => items.push({time: t, ...it})); });
        ht += `<div class="bg-slate-50 rounded-3xl p-4 border border-slate-100"><div class="font-black text-slate-800 text-lg mb-4 text-center">${day}</div><div class="space-y-4">`;
        items.forEach(it => {
            const subj = state.subjects.find(s=>s.id===it.subjectId);
            ht += `<div class="bg-white border border-slate-100 rounded-[20px] shadow-sm p-4 flex flex-col hover:border-indigo-200 transition-colors">
                <div class="flex justify-between items-start mb-3">
                    <span class="px-2 py-1 text-white rounded text-[9px] uppercase font-black tracking-widest leading-none shadow-sm" style="background:${subj?.color||'#ccc'}">${subj?.name.slice(0,8)}</span>
                    <span class="font-black text-slate-600 bg-slate-50 px-2 py-0.5 rounded textxs font-mono border border-slate-100">${it.time}</span>
                </div>
                <div class="text-slate-800 font-bold mb-3 flex-1 text-sm leading-tight">${subj?.name}</div>
                <div class="flex justify-between items-center text-[10px] text-slate-400 font-bold pt-2 border-t border-slate-50">
                    <span class="bg-slate-50 px-1.5 py-0.5 rounded">${it.duration}м</span>
                    <span class="uppercase">Офлайн</span>
                </div>
            </div>`;
        });
        ht += `</div></div>`;
    });
    return ht + `</div>`;
}

function viewWeek20_UniBorderBottom() {
    let ht = `<div class="max-w-5xl mx-auto space-y-6">`;
    DAYS.filter(d=>d!=='Вне').forEach(day => {
        let items = [];
        TIMES.forEach(t => { (state.schedule[day][t] || []).forEach(it => items.push({time: t, ...it})); });
        if(items.length===0) return;
        ht += `<div><h3 class="font-black text-lg text-slate-500 uppercase tracking-widest mb-3 px-2 border-b-2 border-slate-100 pb-2">${day}</h3><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">`;
        items.forEach(it => {
            const subj = state.subjects.find(s=>s.id===it.subjectId);
            ht += `<div class="bg-white border text-sm border-slate-100 shadow-sm rounded-[16px] p-4 border-b-4 flex flex-col hover:bg-slate-50 transition-colors cursor-pointer" style="border-bottom-color: ${subj?.color||'#ccc'};">
                <div class="flex justify-between items-start mb-2">
                    <div class="font-black text-slate-800 text-[14px] truncate pr-2 leading-tight">${subj?.name}</div>
                    <div class="font-black text-slate-400 text-sm font-mono shrink-0 bg-slate-50 px-1 rounded">${it.time}</div>
                </div>
                <div class="text-[10px] uppercase font-bold text-slate-400">${it.duration} минут</div>
            </div>`;
        });
        ht += `</div></div>`;
    });
    return ht + `</div>`;
}

function viewWeek21_UniMinimalist() {
    let ht = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">`;
    DAYS.forEach(day => {
        let items = [];
        TIMES.forEach(t => { (state.schedule[day][t] || []).forEach(it => items.push({time: t, ...it})); });
        ht += `<div class=""><div class="font-black text-slate-700 bg-slate-100 rounded-xl px-4 py-2 mb-3 text-center uppercase tracking-widest">${day}</div><div class="space-y-3">`;
        items.forEach(it => {
            const subj = state.subjects.find(s=>s.id===it.subjectId);
            ht += `<div class="bg-white rounded-[20px] shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-md transition-all">
                <div class="p-4 flex flex-col bg-gradient-to-br from-white to-slate-50/50">
                     <div class="flex justify-between items-center mb-2">
                         <div class="px-2 py-1 bg-slate-800 text-white rounded-lg text-[10px] font-black shadow-sm shrink-0 uppercase tracking-widest">${it.time}</div>
                         <div class="w-2 h-2 rounded-full" style="background:${subj?.color||'#ccc'}"></div>
                     </div>
                     <div class="text-[13px] font-black text-slate-800 leading-tight mb-2">${subj?.name}</div>
                </div>
                <div class="bg-slate-50/80 px-4 py-2 border-t border-slate-100 text-[10px] font-bold text-slate-500">
                    ${it.duration} мин
                </div>
            </div>`;
        });
        ht += `</div></div>`;
    });
    return ht + `</div>`;
}


// ================ MONTH VIEWS ================
function renderMonthView() {
    let ht = `<div class="max-w-7xl mx-auto">`;
    if(state.scheduleView === 1) ht += viewMonth_Unified(1);
    else if(state.scheduleView === 2) ht += viewMonth_Unified(2);
    else if(state.scheduleView === 3) ht += viewMonth_Unified(3);
    else if(state.scheduleView === 4) ht += viewMonth_Unified(4);
    else if(state.scheduleView === 5) ht += viewMonth_Unified(5);
    ht += `</div>`;
    return ht;
}

function viewMonth_Unified(styleMode) {
    // Generate a mock 30-day calendar
    let ht = `<div class="grid grid-cols-7 gap-4">`;
    
    // Headers
    DAYS.forEach(d => {
        ht += `<div class="text-center font-black text-slate-400 uppercase tracking-widest text-sm pb-2 border-b-2 border-slate-100">${d}</div>`;
    });
    
    // Days
    for(let i=1; i<=28; i++) {
        let dayName = DAYS[(i-1)%7];
        let items = [];
        TIMES.forEach(t => { (state.schedule[dayName][t] || []).forEach(it => items.push({time: t, ...it})); });
        
        ht += `<div class="min-h-[140px] bg-white rounded-3xl border border-slate-100 p-2 shadow-sm flex flex-col hover:border-indigo-300 transition-colors">
            <div class="text-right font-black text-slate-300 text-xl mb-2 px-2">${i}</div>
            <div class="space-y-1.5 flex-1">`;
            
        items.slice(0,3).forEach(it => {
            const subj = state.subjects.find(s=>s.id===it.subjectId);
            
            if(styleMode === 1) {
                // Style 1 Kanban micro
                ht += `<div class="bg-slate-50 rounded p-1.5 border border-slate-100">
                    <div class="flex justify-between items-center mb-0.5"><div class="w-1.5 h-1.5 rounded-full" style="background:${subj?.color}"></div><div class="text-[8px] font-mono text-slate-400">${it.time}</div></div>
                    <div class="text-[9px] font-bold text-slate-700 truncate leading-tight">${subj?.name}</div>
                </div>`;
            } else if(styleMode === 2) {
                // Style 2 Vert Bar micro
                ht += `<div class="flex items-center gap-1">
                    <div class="w-1 h-3 rounded-full shrink-0" style="background:${subj?.color}"></div>
                    <div class="text-[8px] font-bold text-slate-400 w-6">${it.time}</div>
                    <div class="text-[9px] font-black text-slate-700 truncate">${subj?.name}</div>
                </div>`;
            } else if(styleMode === 3) {
                // Style 3 Solid tag micro
                ht += `<div class="text-[8px] font-bold text-white px-1.5 py-0.5 rounded truncate" style="background:${subj?.color}">${it.time} ${subj?.name}</div>`;
            } else if(styleMode === 4) {
                // Style 4 Border bottom micro
                ht += `<div class="border-b-2 bg-slate-50 px-1 py-0.5 flex justify-between rounded-sm" style="border-bottom-color:${subj?.color}">
                    <span class="text-[8px] font-black text-slate-600 truncate mr-1">${subj?.name}</span>
                    <span class="text-[8px] font-bold text-slate-400 shrink-0">${it.time}</span>
                </div>`;
            } else if(styleMode === 5) {
                // Style 5 Dots minimalist
                ht += `<div class="flex gap-1 items-center px-1"><div class="w-1.5 h-1.5 rounded-full" style="background:${subj?.color}"></div><span class="text-[9px] font-semibold text-slate-600 truncate">${subj?.name}</span></div>`;
            }
        });
        
        if(items.length > 3) ht += `<div class="text-[8px] font-black text-slate-400 text-center mt-1">+${items.length-3}</div>`;
        
        ht += `</div></div>`;
    }
    ht += `</div>`;
    return ht;
}
