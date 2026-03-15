// ===================== STATE =====================
const state = {
    tab: 'today',      // 'today', 'week', 'analytics', 'settings'
    subTab: 'schedule',// 'schedule', 'plan', 'fact'
    schedule: {},      // original format: {day: {hour: [...]}}
    teachers: [],
    subjects: [],
    activeWeekDay: 'Пн', // legacy or for scrolling
    isDraft: false
};

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const TIMES = [
    "08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00",
    "16:00","17:00","18:00","19:00","20:00","21:00","22:00"
];

// Settings from previous implementation
const DEFAULT_SUBJECTS = ['Математика','Русский язык','Английский','Казахский','Литература'];

// ===================== ICONS =====================
const ICONS = {
    plus: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    clock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    phone: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    video: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
    trash: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
    edit: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>`,
    comment: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
};

// ===================== UTILS =====================
const getTodayName = () => {
    const d = new Date().getDay();
    return DAYS[d === 0 ? 6 : d - 1] || 'Пн';
};

const getSubjectColor = (subjName) => {
    const s = state.subjects.find(x => x.name === subjName);
    return s ? s.color : '#3b82f6';
};

function hexToRgba(hex, alpha) {
    if (!hex) return `rgba(59, 130, 246, ${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const fmtNum = n => n ? n.toLocaleString('ru-RU').replace(/\u00A0/g,' ')+' ₸' : '0 ₸';

// ===================== INIT & DATA LOAD =====================
window.onload = () => {
    loadData();
    state.activeWeekDay = getTodayName();
};

function loadData() {
    // Attempt local storage load
    const saved = localStorage.getItem('scheduleData');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            Object.assign(state, data); // load subjects, teachers, schedule
        } catch(e) { console.error('Error loading local data'); }
    } else {
        // Mock default data
        state.subjects = DEFAULT_SUBJECTS.map((name, i) => ({
            id: 's'+i, name, color: ['#ef4444','#f59e0b','#10b981','#3b82f6','#8b5cf6'][i%5]
        }));
        state.teachers = [
            {id:'t1', name:'Иванова Анна', cost: 5000, phone:'+77001234567', platform:'Zoom', link:'https://zoom.us/j/123456'},
            {id:'t2', name:'Петров Иван', cost: 4000, phone:'+77009876543', platform:'Google Meet', link:''}
        ];
        
        const today = getTodayName();
        state.schedule[today] = {
            "10:00": [{ id:'b1', subjectId:'s0', teacherId:'t1', variant:'1', duration:60, isPaid: false }],
            "15:00": [{ id:'b2', subjectId:'s2', teacherId:'t2', variant:'1', duration:90, isPaid: true, comment: 'Подготовиться к тесту' }]
        };
    }
    
    // Ensure all days/times mapped
    DAYS.forEach(d => {
        if(!state.schedule[d]) state.schedule[d] = {};
        TIMES.forEach(t => { if(!state.schedule[d][t]) state.schedule[d][t] = []; });
    });

    render();
}

function saveData() {
    const toSave = { 
        schedule: state.schedule, 
        teachers: state.teachers, 
        subjects: state.subjects 
    };
    localStorage.setItem('scheduleData', JSON.stringify(toSave));
    render();
}

// ===================== NAVIGATION =====================
window.setMainTab = (tab) => {
    state.tab = tab;
    render();
};

window.setSubTab = (subTab) => {
    state.subTab = subTab;
    render();
};


// ===================== RENDER CORE =====================
function render() {
    updateNavUI();
    const area = document.getElementById('content-area');
    
    if (state.tab === 'today') {
        area.innerHTML = renderTodayTabs();
    } else if (state.tab === 'week') {
        area.innerHTML = renderWeekKanban();
    } else if (state.tab === 'analytics') {
        area.innerHTML = renderAnalytics();
    } else if (state.tab === 'settings') {
        area.innerHTML = renderSettings();
    }
}

function updateNavUI() {
    // Update Top Nav
    ['today', 'week', 'analytics', 'settings'].forEach(t => {
        const btn = document.getElementById(`main-tab-${t}`);
        if(btn) {
            btn.className = `nav-btn t-${t}-${state.tab === t ? 'active' : 'inactive'} font-bold`;
        }
    });

    // Sub Nav Visibility
    const subNav = document.getElementById('sub-nav-today');
    if(state.tab === 'today') {
        subNav.classList.remove('hidden');
        ['schedule','plan','fact'].forEach(st => {
            const sb = document.getElementById(`sub-tab-${st}`);
            if(sb) {
                sb.className = `flex-1 py-1 px-2 text-center text-sm font-bold rounded-[10px] transition-all ` + 
                               (state.subTab === st ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 bg-transparent');
            }
        });
    } else {
        subNav.classList.add('hidden');
    }
}


// ===================== VIEWS =====================

function renderTodayTabs() {
    let html = `<div class="pb-10 space-y-4 pt-1">`;
    const today = getTodayName();

    if (state.subTab === 'schedule') {
        html += `<div class="font-black italic text-slate-400 uppercase ml-1">Расписание на ${today}</div>`;
        
        let hasLessons = false;
        TIMES.forEach(time => {
            const items = state.schedule[today][time] || [];
            if(items.length > 0) {
                hasLessons = true;
                items.forEach(item => {
                    html += buildKanbanCard(item, time, today);
                });
            }
        });
        
        if (!hasLessons) {
            html += `<div class="text-center p-8 bg-white rounded-3xl border border-slate-100 text-slate-400 font-bold">На сегодня занятий нет</div>`;
        }
    } 
    else if (state.subTab === 'plan') {
         html += `<div class="font-black italic text-slate-400 uppercase ml-1">К оплате (План)</div>`;
         // Выводим все неоплаченные занятия
         let totalPlan = 0;
         DAYS.forEach(day => {
            TIMES.forEach(time => {
                const items = state.schedule[day][time] || [];
                items.forEach(it => {
                    if(!it.isPaid) {
                        const tInfo = state.teachers.find(t=>t.id===it.teacherId);
                        const cost = tInfo ? tInfo.cost : 0;
                        totalPlan += cost;
                        html += buildPaymentRow(it, time, day, tInfo, cost, false);
                    }
                });
            });
         });
         if(totalPlan === 0) html += `<div class="text-center p-8 text-slate-400 font-bold">Все оплачено</div>`;
         
         // Итого снизу
         html += `<div class="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 flex justify-between items-center text-lg z-40">
                    <span class="font-black text-slate-400 italic">ИТОГО ПЛАН:</span>
                    <span class="font-black text-rose-500 italic">${fmtNum(totalPlan)}</span>
                  </div>`;
    }
    else if (state.subTab === 'fact') {
         html += `<div class="font-black italic text-slate-400 uppercase ml-1">Оплачено (Факт)</div>`;
         let totalFact = 0;
         DAYS.forEach(day => {
            TIMES.forEach(time => {
                const items = state.schedule[day][time] || [];
                items.forEach(it => {
                    if(it.isPaid) {
                        const tInfo = state.teachers.find(t=>t.id===it.teacherId);
                        const cost = tInfo ? tInfo.cost : 0;
                        totalFact += cost;
                        html += buildPaymentRow(it, time, day, tInfo, cost, true);
                    }
                });
            });
         });
         if(totalFact === 0) html += `<div class="text-center p-8 text-slate-400 font-bold">Пока оплат нет</div>`;
         
         // Итого снизу
         html += `<div class="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 flex justify-between items-center text-lg z-40">
                    <span class="font-black text-slate-400 italic">ИТОГО ФАКТ:</span>
                    <span class="font-black text-emerald-600 italic">${fmtNum(totalFact)}</span>
                  </div>`;
    }

    html += `</div>`;
    return html;
}

function renderWeekKanban() {
    let html = `
    <div class="kanban-container">
        ${DAYS.map(day => {
            let colHtml = `<div class="kanban-column bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 h-[80vh] overflow-y-auto">
                              <div class="sticky top-0 bg-white/95 backdrop-blur-sm z-10 pb-3 mb-2 border-b border-slate-100 flex items-center gap-2">
                                <div class="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                <span class="font-black text-lg text-slate-800">${day}</span>
                              </div>
                              <div class="space-y-3">
            `;
            
            let count = 0;
            TIMES.forEach(time => {
                const items = state.schedule[day][time] || [];
                items.forEach(it => {
                    count++;
                    colHtml += buildKanbanCard(it, time, day, true); // true = compact mode for week grid
                });
            });
            if(count === 0) colHtml += `<div class="text-sm text-center text-slate-400 mt-4">Пусто</div>`;
            
            colHtml += `</div></div>`;
            return colHtml;
        }).join('')}
    </div>`;
    
    return html;
}

function renderAnalytics() {
    // Collect stats
    let totalLessons = 0;
    let totalCost = 0;
    let subjStats = {}; // {subjId: count}
    
    DAYS.forEach(d => TIMES.forEach(t => {
        (state.schedule[d][t]||[]).forEach(it => {
            totalLessons++;
            const cost = state.teachers.find(x=>x.id===it.teacherId)?.cost || 0;
            totalCost += cost;
            subjStats[it.subjectId] = (subjStats[it.subjectId]||0) + 1;
        });
    }));

    let html = `
    <div class="pb-20 space-y-4">
        <div class="bg-indigo-600 text-white p-6 rounded-[2rem] shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <div class="text-indigo-100 font-bold mb-1 uppercase text-sm">Всего занятий</div>
            <div class="text-4xl font-black mb-4">${totalLessons} <span class="text-lg font-medium opacity-70">шт.</span></div>
            
            <div class="text-indigo-100 font-bold mb-1 uppercase text-sm">Общий бюджет (План+Факт)</div>
            <div class="text-3xl font-black">${fmtNum(totalCost)}</div>
        </div>
        
        <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <div class="font-black text-slate-800 mb-4 text-lg">По предметам</div>
            <div class="space-y-4">
    `;
    
    const sortedSubjs = Object.entries(subjStats).sort((a,b)=>b[1]-a[1]);
    sortedSubjs.forEach(([sId, count]) => {
        const sInfo = state.subjects.find(x=>x.id===sId);
        if(!sInfo) return;
        const perc = Math.round((count / totalLessons) * 100);
        html += `
            <div>
                <div class="flex justify-between text-sm font-bold text-slate-600 mb-1.5">
                    <span>${sInfo.name}</span>
                    <span>${count} шт. (${perc}%)</span>
                </div>
                <div class="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full rounded-full" style="width: ${perc}%; background-color: ${sInfo.color}"></div>
                </div>
            </div>
        `;
    });
    
    if(totalLessons === 0) html += `<div class="text-slate-400 text-center text-sm">Нет данных для аналитики</div>`;
    
    html += `</div></div></div>`;
    return html;
}

function renderSettings() {
    return `<div class="text-center p-8 bg-white rounded-3xl border border-slate-100 text-slate-400 font-bold mt-4">Настройки скоро появятся</div>`;
}

// ===================== COMPONENTS =====================

function buildKanbanCard(item, time, day, compact = false) {
    const sInfo = state.subjects.find(s => s.id === item.subjectId);
    const tInfo = state.teachers.find(t => t.id === item.teacherId);
    if(!sInfo || !tInfo) return '';

    const color = sInfo.color;
    const bgOpacity = hexToRgba(color, 0.1);
    
    // Actions context menu open handler
    const params = `openActionModal('${day}','${time}','${item.id}')`;

    return `
    <div class="relative bg-white p-4 rounded-2xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-3 active:scale-[0.98] transition-all cursor-pointer" onclick="${params}">
        <div class="flex items-center gap-2 mb-2">
            <span class="px-2.5 py-1 text-[11px] font-black uppercase rounded-lg" style="background:${bgOpacity}; color:${color}">
                ${sInfo.name}
            </span>
            <span class="ml-auto text-sm font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg flex items-center gap-1.5">
                <span class="text-slate-400">${ICONS.clock}</span> ${time}
            </span>
        </div>
        
        <div class="font-bold text-[15px] text-slate-700 leading-snug mb-2 line-clamp-2 pr-6">
            ${tInfo.name}
        </div>
        
        ${item.comment ? `
            <div class="text-xs bg-amber-50 text-amber-600 p-2 rounded-xl mb-3 flex items-start gap-1.5 italic">
                <div class="mt-0.5">${ICONS.comment}</div>
                <span class="line-clamp-2">${item.comment}</span>
            </div>
        ` : ''}
        
        <div class="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>${item.duration} мин.</span>
            <div class="flex gap-2.5">
                ${tInfo.platform ? `<span class="flex items-center gap-1 text-blue-500">${ICONS.video} ${tInfo.platform}</span>` : ''}
                ${tInfo.phone ? `<span class="flex items-center gap-1 text-emerald-500">${ICONS.phone} Виз.</span>` : ''}
            </div>
        </div>
    </div>
    `;
}

function buildPaymentRow(item, time, day, tInfo, cost, isFact) {
    const sInfo = state.subjects.find(s=>s.id === item.subjectId);
    const params = `openActionModal('${day}','${time}','${item.id}')`;
    const leadColor = isFact ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600';
    const sumColor = isFact ? 'text-emerald-600' : 'text-rose-600';

    return `
    <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-3 flex justify-between items-center active:scale-[0.98] transition-all cursor-pointer" onclick="${params}">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 ${leadColor} rounded-xl flex items-center justify-center font-black text-sm">
                ${day}
            </div>
            <div>
                <div class="text-[10px] font-black uppercase text-slate-400 mb-0.5">${sInfo?.name || 'Предмет'} • ${time}</div>
                <div class="font-bold text-slate-800 text-sm">${tInfo?.name || 'Преподаватель'}</div>
            </div>
        </div>
        <div class="font-black ${sumColor} text-[15px] italic">
            ${fmtNum(cost)}
        </div>
    </div>
    `;
}


// ===================== ACTION MODAL =====================
let currentActionContext = null;

window.openActionModal = (day, time, itemId) => {
    currentActionContext = { day, time, itemId };
    const it = state.schedule[day][time].find(x => x.id === itemId);
    const tInfo = state.teachers.find(t=>t.id===it.teacherId);
    
    document.getElementById('modal-title').innerText = "Управление занятием";
    
    let btns = ``;
    
    // Toggle Pay status
    if (!it.isPaid) {
        btns += `<button onclick="togglePayStatus(true)" class="w-full py-4 px-6 rounded-2xl border-2 border-emerald-500 text-emerald-600 font-bold flex items-center justify-center gap-2 active:bg-emerald-50">Отметить оплаченным</button>`;
    } else {
        btns += `<button onclick="togglePayStatus(false)" class="w-full py-4 px-6 rounded-2xl border-2 border-slate-300 text-slate-600 font-bold flex items-center justify-center gap-2 active:bg-slate-50">Убрать отметку оплаты</button>`;
    }

    if (tInfo && tInfo.phone) {
        btns += `<a href="tel:${tInfo.phone}" class="w-full py-4 px-6 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold flex items-center justify-center gap-2 active:bg-slate-50">${ICONS.phone} Позвонить</a>`;
    }

    document.getElementById('modal-buttons').innerHTML = btns;
    document.getElementById('action-modal').classList.remove('hidden');
    document.getElementById('action-modal').classList.add('flex');
};

window.closeModal = (id) => {
    document.getElementById(id).classList.add('hidden');
    document.getElementById(id).classList.remove('flex');
    currentActionContext = null;
};

window.togglePayStatus = (status) => {
    if(!currentActionContext) return;
    const { day, time, itemId } = currentActionContext;
    const it = state.schedule[day][time].find(x => x.id === itemId);
    if(it) {
        it.isPaid = status;
        saveData();
    }
    closeModal('action-modal');
};
