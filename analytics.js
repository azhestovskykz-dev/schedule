// ===================== ANALYTICS MODULE =====================

function renderAnalytics() {
    let ht = `
        <div class="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            ${[1,2,3,4,5,6,7,8].map(i => {
                let active = state.analyticsView === i;
                return `<button onclick="state.analyticsView=${i}; render();" class="px-5 py-2.5 rounded-2xl text-[14px] font-black shadow-sm transition-all whitespace-nowrap ${active ? 'bg-purple-500 text-white' : 'bg-white text-slate-500 border border-slate-200'}">${i}</button>`;
            }).join('')}
        </div>
        <div id="analytics-content">
            ${renderAnalyticsContent()}
        </div>
    `;
    return ht;
}

function renderAnalyticsContent() {
    if (state.analyticsView === 1) return viewAnalytics1_PieSubjects();
    if (state.analyticsView === 2) return viewAnalytics2_BarDays();
    if (state.analyticsView === 3) return viewAnalytics3_Teachers();
    if (state.analyticsView === 4) return viewAnalytics4_Finance();
    if (state.analyticsView === 5) return viewAnalytics5_Summary();
    if (state.analyticsView === 6) return viewAnalytics6_DayWorkloadGrid();
    if (state.analyticsView === 7) return viewAnalytics7_ExpensesByCategory();
    if (state.analyticsView === 8) return viewAnalytics8_TasksProgress();
    return '';
}

// Helper to get total minutes per subject
function getSubjectStats() {
    let stats = {};
    let totalMins = 0;
    
    DAYS.forEach(day => {
        Object.values(state.schedule[day] || {}).forEach(arr => {
            arr.forEach(it => {
                if(!stats[it.subjectId]) stats[it.subjectId] = 0;
                stats[it.subjectId] += it.duration;
                totalMins += it.duration;
            });
        });
    });
    
    return { stats, totalMins };
}

// --- V1: Pie Chart (Subjects) ---
function viewAnalytics1_PieSubjects() {
    const { stats, totalMins } = getSubjectStats();
    
    if (totalMins === 0) return `<div class="p-8 text-center text-slate-400">Нет данных для аналитики</div>`;
    
    let conicParts = [];
    let currentDegree = 0;
    let legendHt = '';
    
    // Convert to array and sort
    let sortedKeys = Object.keys(stats).sort((a,b)=>stats[b]-stats[a]);
    
    sortedKeys.forEach((key, idx) => {
        const subj = state.subjects.find(s=>s.id===key);
        const mins = stats[key];
        const percent = (mins / totalMins) * 100;
        const degrees = (percent / 100) * 360;
        
        const color = subj ? subj.color : '#ccc';
        conicParts.push(`${color} ${currentDegree}deg ${currentDegree + degrees}deg`);
        currentDegree += degrees;
        
        legendHt += `<div class="flex items-center gap-3">
            <div class="w-4 h-4 rounded-full" style="background-color: ${color}"></div>
            <div class="flex-1 font-bold text-slate-700">${subj?.name || 'Предмет'}</div>
            <div class="font-black text-slate-400">${percent.toFixed(1)}% (${Math.round(mins/60)} ч)</div>
        </div>`;
    });
    
    const gradient = `conic-gradient(${conicParts.join(', ')})`;
    
    return `<div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto flex flex-col md:flex-row gap-8 items-center">
        <div class="relative w-48 h-48 rounded-full shadow-inner flex-shrink-0" style="background: ${gradient}">
            <div class="absolute inset-4 bg-white rounded-full shadow flex flex-col items-center justify-center">
                <span class="text-xs font-bold text-slate-400 uppercase">Всего</span>
                <span class="text-2xl font-black text-slate-800">${Math.round(totalMins/60)} ч</span>
            </div>
        </div>
        <div class="w-full space-y-3">
            <div class="font-black text-lg text-slate-800 border-b border-slate-100 pb-2 mb-4">Распределение по предметам</div>
            ${legendHt}
        </div>
    </div>`;
}

// --- V2: Bar Chart (Days) ---
function viewAnalytics2_BarDays() {
    let maxMins = Number.MIN_VALUE;
    let daysStats = {};
    
    DAYS.filter(d=>d!=='Вне').forEach(day => {
        let mins = 0;
        Object.values(state.schedule[day] || {}).forEach(arr => {
            arr.forEach(it => mins += it.duration);
        });
        daysStats[day] = mins;
        if(mins > maxMins) maxMins = mins;
    });
    
    if(maxMins === 0) maxMins = 1; // prevent div by zero
    
    let ht = `<div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
        <div class="font-black text-lg text-slate-800 mb-6 border-b border-slate-100 pb-2">Загруженность по дням недели (часы)</div>
        <div class="flex items-end justify-between h-56 gap-2 sm:gap-4 pt-4">`;
        
    DAYS.filter(d=>d!=='Вне').forEach(day => {
        const mins = daysStats[day];
        const height = (mins / maxMins) * 100;
        const color = mins > 240 ? 'bg-rose-400' : mins > 120 ? 'bg-amber-400' : 'bg-blue-400';
        
        ht += `<div class="flex-1 flex flex-col items-center gap-2 group">
            <div class="font-black text-slate-400 text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity">${(mins/60).toFixed(1)}ч</div>
            <div class="w-full ${color} rounded-t-xl transition-all duration-500 hover:brightness-110" style="height: ${height}%"></div>
            <div class="font-black text-slate-600 text-sm sm:text-base uppercase">${day}</div>
        </div>`;
    });
        
    ht += `</div></div>`;
    return ht;
}

// --- V3: Teachers Stats ---
function viewAnalytics3_Teachers() {
    // Collect teacher stats
    let tStats = {};
    let totalMins = 0;
    
    DAYS.forEach(day => {
        Object.values(state.schedule[day] || {}).forEach(arr => {
            arr.forEach(it => {
                if(it.teacherId === 't0') return; // ignore No Teacher
                if(!tStats[it.teacherId]) tStats[it.teacherId] = { mins: 0, count: 0 };
                tStats[it.teacherId].mins += it.duration;
                tStats[it.teacherId].count += 1;
                totalMins += it.duration;
            });
        });
    });
    
    let ht = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`;
    Object.keys(tStats).forEach(tid => {
        const tInfo = state.teachers.find(t=>t.id===tid);
        const st = tStats[tid];
        if(!tInfo) return;
        
        ht += `<div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div class="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex justify-center items-center font-black text-xl mb-4">
                ${tInfo.name.charAt(0).toUpperCase()}
            </div>
            <div class="font-black text-lg text-slate-800 mb-1">${tInfo.name}</div>
            <div class="text-sm font-bold text-slate-400 mb-4">${tInfo.phone ? tInfo.phone : 'Без телефона'}</div>
            
            <div class="space-y-2 border-t border-slate-100 pt-3">
                <div class="flex justify-between items-center text-sm font-bold">
                    <span class="text-slate-500">Занятий:</span>
                    <span class="text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg">${st.count}</span>
                </div>
                <div class="flex justify-between items-center text-sm font-bold">
                    <span class="text-slate-500">Минут:</span>
                    <span class="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">${st.mins}</span>
                </div>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V4: Financial Overview ---
function viewAnalytics4_Finance() {
    let income = 0;
    let expenses = 0;
    
    state.finances.forEach(f => {
        if(f.type === 'expense') expenses += f.amount;
        if(f.type === 'income') income += f.amount;
    });
    
    const balance = income - expenses;
    
    return `<div class="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <div class="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex justify-center items-center mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div class="text-slate-500 font-bold uppercase text-xs tracking-wider mb-1">Доходы</div>
            <div class="font-black text-2xl text-emerald-600">${fmtNum(income)}</div>
        </div>
        
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <div class="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex justify-center items-center mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div class="text-slate-500 font-bold uppercase text-xs tracking-wider mb-1">Расходы</div>
            <div class="font-black text-2xl text-rose-600">${fmtNum(expenses)}</div>
        </div>
        
        <div class="bg-slate-800 p-6 rounded-3xl shadow-lg flex flex-col items-center justify-center text-center">
            <div class="w-12 h-12 bg-slate-700 text-white rounded-full flex justify-center items-center mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            </div>
            <div class="text-slate-400 font-bold uppercase text-xs tracking-wider mb-1">Баланс</div>
            <div class="font-black text-2xl ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}">${fmtNum(balance)}</div>
        </div>
    </div>`;
}

// --- V5: Summary Dashboard ---
function viewAnalytics5_Summary() {
    const { totalMins } = getSubjectStats();
    const totalTeachers = state.teachers.length;
    const totalTasks = state.tasks.filter(t=>t.status!=='done').length;
    
    return `<div class="max-w-4xl mx-auto space-y-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                <div class="text-4xl font-black text-slate-800 mb-1">${(totalMins/60).toFixed(0)}</div>
                <div class="text-xs font-bold text-slate-400 uppercase">Часов учебы</div>
            </div>
            <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                <div class="text-4xl font-black text-blue-500 mb-1">${totalTeachers}</div>
                <div class="text-xs font-bold text-slate-400 uppercase">Преподавателей</div>
            </div>
            <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                <div class="text-4xl font-black text-amber-500 mb-1">${totalTasks}</div>
                <div class="text-xs font-bold text-slate-400 uppercase">Активных задач</div>
            </div>
            <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                <div class="text-4xl font-black text-emerald-500 mb-1">${state.finances.length}</div>
                <div class="text-xs font-bold text-slate-400 uppercase">Транзакций</div>
            </div>
        </div>
    </div>`;
}

// --- V6: Day Workload Grid (Heatmap style) ---
function viewAnalytics6_DayWorkloadGrid() {
    let ht = `<div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm max-w-4xl mx-auto">
        <div class="font-black text-lg text-slate-800 mb-6 border-b border-slate-100 pb-2">Матрица загруженности (минуты)</div>
        <div class="overflow-x-auto"><table class="w-full text-center text-sm">
            <thead>
                <tr><th class="p-2 border-b border-r text-left text-slate-400 font-bold uppercase text-xs">Предмет</th>`;
    
    const activeDays = DAYS.filter(d=>d!=='Вне');
    activeDays.forEach(d => ht += `<th class="p-2 border-b font-black text-slate-600">${d}</th>`);
    ht += `</tr></thead><tbody class="divide-y divide-slate-100">`;
    
    let subjStats = {}; // {subjId: {day: mins}}
    
    activeDays.forEach(day => {
        Object.values(state.schedule[day] || {}).forEach(arr => {
            arr.forEach(it => {
                if(!subjStats[it.subjectId]) subjStats[it.subjectId] = {};
                if(!subjStats[it.subjectId][day]) subjStats[it.subjectId][day] = 0;
                subjStats[it.subjectId][day] += it.duration;
            });
        });
    });
    
    Object.keys(subjStats).forEach(sId => {
        const subj = state.subjects.find(s=>s.id===sId);
        if(!subj) return;
        ht += `<tr><td class="p-2 border-r text-left truncate max-w-[150px] font-bold text-slate-700">
                <span class="inline-block w-2 h-2 rounded-full mr-1" style="background:${subj.color}"></span>${subj.name}
            </td>`;
        activeDays.forEach(d => {
            let mins = subjStats[sId][d] || 0;
            let bg = mins === 0 ? 'bg-transparent text-slate-300' : 'bg-purple-50 text-purple-700 font-bold';
            if(mins > 120) bg = 'bg-purple-200 text-purple-900 font-black';
            ht += `<td class="p-2"><div class="mx-auto rounded-lg px-1 py-2 w-12 ${bg}">${mins>0 ? mins : '-'}</div></td>`;
        });
        ht += `</tr>`;
    });
    
    ht += `</tbody></table></div></div>`;
    return ht;
}

// --- V7: Expenses by Category ---
function viewAnalytics7_ExpensesByCategory() {
    let cats = {};
    let total = 0;
    state.finances.filter(f=>f.type==='expense').forEach(f => {
        if(!cats[f.category]) cats[f.category] = 0;
        cats[f.category] += f.amount;
        total += f.amount;
    });

    let ht = `<div class="max-w-2xl mx-auto space-y-4">
        <div class="flex justify-between items-end mb-2">
            <h3 class="font-black text-xl text-slate-800">Структура расходов</h3>
            <div class="font-black text-2xl text-rose-500">${fmtNum(total)}</div>
        </div>`;
        
    const colors = ['bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500', 'bg-purple-500'];
    let cIdx = 0;
    
    Object.keys(cats).sort((a,b)=>cats[b]-cats[a]).forEach(cat => {
        let percent = (cats[cat] / (total||1)) * 100;
        ht += `<div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div class="flex justify-between items-center mb-2">
                <div class="font-bold text-slate-700">${cat}</div>
                <div class="font-black text-slate-800">${fmtNum(cats[cat])} <span class="text-xs text-slate-400 ml-2">${percent.toFixed(1)}%</span></div>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div class="${colors[cIdx%colors.length]} h-2 rounded-full" style="width: ${percent}%"></div>
            </div>
        </div>`;
        cIdx++;
    });
    
    ht += `</div>`;
    return ht;
}

// --- V8: Tasks Progress ---
function viewAnalytics8_TasksProgress() {
    let tot = state.tasks.length || 1;
    let done = state.tasks.filter(t=>t.status==='done').length;
    let inprog = state.tasks.filter(t=>t.status==='inprogress').length;
    let todo = state.tasks.filter(t=>t.status==='todo').length;
    
    let ht = `<div class="max-w-3xl mx-auto bg-slate-800 text-white p-8 rounded-3xl shadow-xl border border-slate-700">
        <div class="text-center mb-8">
            <div class="font-black text-6xl text-emerald-400 mb-2">${Math.round((done/tot)*100)}%</div>
            <div class="text-sm font-bold text-slate-400 uppercase tracking-widest">Общий прогресс задач</div>
        </div>
        
        <div class="flex h-4 rounded-full overflow-hidden bg-slate-900 mb-8">
            <div class="bg-emerald-500" style="width: ${(done/tot)*100}%"></div>
            <div class="bg-blue-500" style="width: ${(inprog/tot)*100}%"></div>
            <div class="bg-slate-600" style="width: ${(todo/tot)*100}%"></div>
        </div>
        
        <div class="grid grid-cols-3 text-center gap-4">
            <div>
                <div class="font-black text-2xl text-emerald-400">${done}</div>
                <div class="text-xs font-bold text-slate-400">ГОТОВО</div>
            </div>
            <div>
                <div class="font-black text-2xl text-blue-400">${inprog}</div>
                <div class="text-xs font-bold text-slate-400">В ПРОЦЕССЕ</div>
            </div>
            <div>
                <div class="font-black text-2xl text-slate-300">${todo}</div>
                <div class="text-xs font-bold text-slate-400">ОЖИДАЮТ</div>
            </div>
        </div>
    </div>`;
    return ht;
}
