// ===================== STATE =====================
const state = {
    tab: 'today',      // 'today', 'week', 'analytics', 'settings'
    subTab: 'schedule',// 'schedule', 'plan', 'fact'
    schedule: {},      // original format: {day: {hour: [...]}}
    teachers: [],
    subjects: [],
    activeWeekDay: 'РџРЅ', // legacy or for scrolling
    isDraft: false
};

const DAYS = ['РџРЅ', 'Р’С‚', 'РЎСЂ', 'Р§С‚', 'РџС‚', 'РЎР±', 'Р’СЃ'];
const TIMES = [
    "07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00",
    "16:00","17:00","18:00","19:00","20:00"
];

const RAW_SCHEDULE = `
РџРЅ: 08:00 РђРЅРіР»РёР№СЃРєРёР№(968 439-84-36)60, 09:00 РЎРєРѕСЂРѕС‡С‚РµРЅРёРµ(966 077-10-48)60, 10:00 РљР°Р»РёРіСЂР°С„РёСЏ(909 170-90-76)40, 11:00 РњР°С‚РµРјР°С‚РёРєР°(900 236-99-90)60, 12:00 Р›РѕРіРѕРїРµРґРёСЏ(906 296-91-25)45, 13:00 РћР±РµРґ()60, 14:00 Р СѓСЃСЃРєРёР№(916 147-38-00)60, 15:00 Р РµС‡СЊ(937 311-75-02)60, 16:00 РђР№РєРёРґРѕ()180, 19:00 РђРЅРіР»РёР№СЃРєРёР№(913 431-88-86)60
Р’С‚: 08:00 РђРЅРіР»РёР№СЃРєРёР№(952 530-54-54)60, 09:00 Р›РѕРіРѕРїРµРґРёСЏ(902 327-20-54)45, 10:00 РљР°Р»РёРіСЂР°С„РёСЏ(905 862-09-36)40, 11:00 РђРЅРіР»РёР№СЃРєРёР№(989 282-26-29)60, 12:00 Р›РѕРіРѕРїРµРґРёСЏ(928 863-68-88)40, 13:00 РћР±РµРґ()60, 14:00 Р›РѕРіРѕРїРµРґРёСЏ(965 187-25-73)45, 15:00 Р РµС‡СЊ(926 217-37-29)60, 16:00 Р‘Р°СЃРєРµС‚Р±РѕР»()180
РЎСЂ: 09:00 Р›РѕРіРѕРїРµРґРёСЏ(911 237-90-72)45, 10:00 Р›РѕРіРѕРїРµРґРёСЏ(918 174-21-16)60, 11:00 РђРЅРіР»РёР№СЃРєРёР№(960 946-92-71)60, 12:00 Р›РѕРіРѕРїРµРґРёСЏ(904 026-07-26)50, 13:00 РћР±РµРґ()60, 14:00 Р›РѕРіРѕРїРµРґРёСЏ(903 290-97-66)30, 15:00 Р›РѕРіРѕРїРµРґРёСЏ(910 748-62-20)45, 16:00 Р›РѕРіРѕРїРµРґРёСЏ(920 605-77-33)45
Р§С‚: 09:00 РђРЅРіР»РёР№СЃРєРёР№(902 007-99-72)60, 10:00 Р›РѕРіРѕРїРµРґРёСЏ(983 304-32-41)45, 11:00 Р›РѕРіРѕРїРµРґРёСЏ(926 030-28-34)45, 12:00 РњР°С‚РµРјР°С‚РёРєР°(966 077-10-48)60, 13:00 РћР±РµРґ()60, 14:00 Р›РѕРіРѕРїРµРґРёСЏ(916 330-51-77)40, 15:00 Р›РѕРіРѕРїРµРґРёСЏ(964 909-79-87)40, 16:00 Р‘Р°СЃРєРµС‚Р±РѕР»()180
РџС‚: 09:00 Р›РѕРіРѕРїРµРґРёСЏ(375 25 912 0406)60, 10:00 Р”РµС„РµРєС‚РѕР»РѕРі(906 075-89-66)60, 11:00 Р›РѕРіРѕРїРµРґРёСЏ(983 106-56-53)45, 12:00 Р›РѕРіРѕРїРµРґРёСЏ(919 675-64-55)45, 13:00 РћР±РµРґ()60, 14:00 Р›РѕРіРѕРїРµРґРёСЏ(908 027-50-33)30, 15:00 Р›РѕРіРѕРїРµРґРёСЏ(915 000-92-55)45, 16:00 Р’РѕР»РµР№Р±РѕР»()180
РЎР±: 08:00 Р›РѕРіРѕРїРµРґРёСЏ(912 626-43-30)30, 09:00 РђР№РєРёРґРѕ()120, 13:00 Р›РѕРіРѕРїРµРґРёСЏ(903 255-39-30)60, 14:00 Р›РѕРіРѕРїРµРґРёСЏ(927 055-09-18)60, 15:00 Р СѓСЃСЃРєРёР№(951 608-63-70)60, 16:00 РЁР°С…РјР°С‚С‹()120, 19:00 Р РµС‡СЊ(909 096-12-31)60
Р’СЃ: 09:00 РђРЅРіР»РёР№СЃРєРёР№(926 085-18-18)60, 10:00 Р›РѕРіРѕРїРµРґРёСЏ(952 267-40-32)60, 11:00 РњР°С‚РµРјР°С‚РёРєР°(908 107-59-23)60, 12:00 Р›РѕРіРѕРїРµРґРёСЏ(900 352-24-43)60, 13:00 РћР±РµРґ()60, 14:00 РђРЅРіР»РёР№СЃРєРёР№(925 250-75-05)60, 15:00 РњР°С‚РµРјР°С‚РёРєР°(964 858-33-61)60, 17:00 Р‘Р°СЂР°Р±Р°РЅС‹()180
`;

const FIXED_SUBJECTS = [
    {id:'s0', name:'РњР°С‚РµРјР°С‚РёРєР°', color:'#f97316'},
    {id:'s1', name:'Р СѓСЃСЃРєРёР№', color:'#94a3b8'},
    {id:'s2', name:'РђРЅРіР»РёР№СЃРєРёР№', color:'#eab308'},
    {id:'s3', name:'РЎРєРѕСЂРѕС‡С‚РµРЅРёРµ', color:'#06b6d4'},
    {id:'s4', name:'Р›РѕРіРѕРїРµРґРёСЏ', color:'#84cc16'},
    {id:'s5', name:'РљР°Р»РёРіСЂР°С„РёСЏ', color:'#a855f7'},
    {id:'s6', name:'Р РµС‡СЊ', color:'#22c55e'},
    {id:'s7', name:'РђР№РєРёРґРѕ', color:'#0ea5e9'},
    {id:'s8', name:'Р‘Р°СЃРєРµС‚Р±РѕР»', color:'#ef4444'},
    {id:'s9', name:'Р’РѕР»РµР№Р±РѕР»', color:'#ef4444'},
    {id:'s10', name:'РЁР°С…РјР°С‚С‹', color:'#0ea5e9'},
    {id:'s11', name:'Р‘Р°СЂР°Р±Р°РЅС‹', color:'#ef4444'},
    {id:'s12', name:'Р”РµС„РµРєС‚РѕР»РѕРі', color:'#a855f7'},
    {id:'s13', name:'РћР±РµРґ', color:'#3b82f6'}
];

// ===================== ICONS =====================
const ICONS = {
    plus: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    clock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    phone: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    video: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
    trash: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
    edit: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>`,
    comment: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
};

// ===================== UTILS =====================
const getTodayName = () => {
    const d = new Date().getDay();
    return DAYS[d === 0 ? 6 : d - 1] || 'РџРЅ';
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

const fmtNum = n => n ? n.toLocaleString('ru-RU').replace(/\u00A0/g,' ')+' в‚ё' : '0 в‚ё';

// ===================== INIT & DATA LOAD =====================
window.onload = () => {
    loadData();
    state.activeWeekDay = getTodayName();
};

function loadData() {
    state.subjects = FIXED_SUBJECTS;
    state.schedule = {};
    DAYS.forEach(d => { state.schedule[d] = {}; });
    
    let tMap = {};
    let tIdx = 1;
    state.teachers = [{id:'t0', name:'Р‘РµР· С‚РµР»РµС„РѕРЅР°', phone:'', platform:'', cost:0}];
    
    let bid = 1;
    RAW_SCHEDULE.split('\n').filter(x=>x.trim()).forEach(l => {
        let parts = l.split(': ');
        if(parts.length < 2) return;
        let day = parts[0].trim();
        parts[1].split(', ').forEach(r => {
            let m = r.match(/(\d{2}):(\d{2}) (.+?)\((.*?)\)(\d+)/);
            if(m) {
                let h = m[1];
                let min = m[2];
                let time = `${h}:${min}`;
                let name = m[3];
                let phone = m[4];
                let dur = parseInt(m[5]);
                
                let sInfo = state.subjects.find(s=>s.name === name) || state.subjects[0];
                let tid = 't0';
                if (phone) {
                    if (!tMap[phone]) {
                        tMap[phone] = 't' + tIdx++;
                        state.teachers.push({ id: tMap[phone], name: 'РЈС‡РµРЅРёРє', phone: phone, platform: Math.random()>0.5?'Telegram':'Zoom', cost: 2500 });
                    }
                    tid = tMap[phone];
                }
                if(!state.schedule[day][time]) state.schedule[day][time] = [];
                state.schedule[day][time].push({
                    id: 'b' + bid++,
                    subjectId: sInfo.id,
                    teacherId: tid,
                    variant: '1',
                    duration: dur,
                    isPaid: false
                });
            }
        });
    });

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
    } else if (state.tab === 'week2') {
        area.innerHTML = renderWeek2Kanban();
    } else if (state.tab === 'week3') {
        area.innerHTML = renderWeek3Kanban();
    } else if (state.tab === 'analytics') {
        area.innerHTML = renderAnalytics();
    } else if (state.tab === 'settings') {
        area.innerHTML = renderSettings();
    }
}

function updateNavUI() {
    // Update Top Nav
    ['today', 'week', 'week2', 'week3', 'analytics', 'settings'].forEach(t => {
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
    let html = `<div class="pb-10 space-y-4 pt-1 max-w-lg mx-auto">`;
    const today = getTodayName();

    if (state.subTab === 'schedule') {
        html += `<div class="font-black italic text-slate-400 uppercase ml-1">Р Р°СЃРїРёСЃР°РЅРёРµ РЅР° ${today}</div>`;
        
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
            html += `<div class="text-center p-8 bg-white rounded-3xl border border-slate-100 text-slate-400 font-bold">РќР° СЃРµРіРѕРґРЅСЏ Р·Р°РЅСЏС‚РёР№ РЅРµС‚</div>`;
        }
    } 
    else if (state.subTab === 'plan') {
         html += `<div class="font-black italic text-slate-400 uppercase ml-1">Рљ РѕРїР»Р°С‚Рµ (РџР»Р°РЅ)</div>`;
         // Р’С‹РІРѕРґРёРј РІСЃРµ РЅРµРѕРїР»Р°С‡РµРЅРЅС‹Рµ Р·Р°РЅСЏС‚РёСЏ
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
         if(totalPlan === 0) html += `<div class="text-center p-8 text-slate-400 font-bold">Р’СЃРµ РѕРїР»Р°С‡РµРЅРѕ</div>`;
         
         // РС‚РѕРіРѕ СЃРЅРёР·Сѓ
         html += `<div class="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 flex justify-between items-center text-lg z-40">
                    <span class="font-black text-slate-400 italic">РРўРћР“Рћ РџР›РђРќ:</span>
                    <span class="font-black text-rose-500 italic">${fmtNum(totalPlan)}</span>
                  </div>`;
    }
    else if (state.subTab === 'fact') {
         html += `<div class="font-black italic text-slate-400 uppercase ml-1">РћРїР»Р°С‡РµРЅРѕ (Р¤Р°РєС‚)</div>`;
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
         if(totalFact === 0) html += `<div class="text-center p-8 text-slate-400 font-bold">РџРѕРєР° РѕРїР»Р°С‚ РЅРµС‚</div>`;
         
         // РС‚РѕРіРѕ СЃРЅРёР·Сѓ
         html += `<div class="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 flex justify-between items-center text-lg z-40">
                    <span class="font-black text-slate-400 italic">РРўРћР“Рћ Р¤РђРљРў:</span>
                    <span class="font-black text-emerald-600 italic">${fmtNum(totalFact)}</span>
                  </div>`;
    }

    html += `</div>`;
    return html;
}

function renderWeekKanban() {
    let html = `
    <div class="kanban-container w-full px-2 lg:px-6 mx-auto">
        ${DAYS.map(day => {
            let colHtml = `<div class="kanban-column flex flex-col bg-white rounded-[1.5rem] lg:rounded-[2rem] p-3 lg:p-4 shadow-sm border border-slate-200 h-[calc(100vh-140px)] overflow-y-auto">
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
            if(count === 0) colHtml += `<div class="text-sm text-center text-slate-400 mt-4">РџСѓСЃС‚Рѕ</div>`;
            
            colHtml += `</div></div>`;
            return colHtml;
        }).join('')}
    </div>`;
    
    return html;
}


// Function generating the absolute calendar grid wrapper
function buildGridView(cardRendererCb, dayHeaderCb) {
    const ROW_H = 120; // 120px per hour
    
    let html = `
    <div class="kanban-container flex w-full relative h-[calc(100vh-140px)] overflow-y-auto overflow-x-auto bg-slate-50" style="scroll-snap-type: none; gap: 0;">
        <div class="sticky left-0 bg-slate-50/95 backdrop-blur-sm z-30 flex flex-col shrink-0 border-r border-slate-200" style="width: 50px;">
            <div class="sticky top-0 h-[60px] bg-slate-50 z-40 border-b border-slate-200"></div>
            ${TIMES.map(t => `<div class="text-[12px] font-bold text-slate-400 text-right pr-1 relative -top-3" style="height: ${ROW_H}px">${t}</div>`).join('')}
        </div>
        <div class="flex flex-none min-w-[max-content] md:w-full">
            ${DAYS.map((day, dIdx) => {
                let itemsHtml = '';
                TIMES.forEach(time => {
                    (state.schedule[day][time] || []).forEach(it => {
                        const sInfo = state.subjects.find(s => s.id === it.subjectId);
                        const tInfo = state.teachers.find(t => t.id === it.teacherId);
                        
                        let [h, m] = time.split(':').map(Number);
                        let topPx = (h - 7) * ROW_H + (m / 60) * ROW_H;
                        let heightPx = (it.duration / 60) * ROW_H - 2; // -2 for margin
                        
                        itemsHtml += cardRendererCb(it, sInfo, tInfo, day, time, topPx, heightPx);
                    });
                });
                
                return `
                <div class="relative border-r border-slate-200 flex-none md:flex-1 bg-white" style="width: 280px; min-width: 240px;">
                    <div class="sticky top-0 bg-white z-20 h-[60px] border-b border-slate-200 flex flex-col justify-end px-2 pb-2">
                        ${dayHeaderCb(day, dIdx)}
                    </div>
                    <div class="relative w-full" style="height: ${14 * ROW_H}px">
                        ${TIMES.map((t, idx) => `<div class="absolute w-full border-b border-slate-100" style="top: ${idx * ROW_H}px; height: ${ROW_H}px"></div>`).join('')}
                        ${itemsHtml}
                    </div>
                </div>`;
            }).join('')}
        </div>
    </div>`;
    return html;
}

function renderWeek2Kanban() {
    const DAY_COLORS = ['#d946ef', '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];

    return buildGridView((it, sInfo, tInfo, day, time, topPx, heightPx) => {
        const hColor = DAY_COLORS[DAYS.indexOf(day) % DAY_COLORS.length];
        const color = sInfo ? sInfo.color : '#000';
        const params = \`openActionModal('\${day}','\${time}','\${it.id}')\`;
        return \`
        <div class="absolute inset-x-0 p-1.5 cursor-pointer flex justify-between items-start border-l-[3px] overflow-hidden border-b border-b-slate-100 bg-white/95 hover:bg-slate-50 transition-colors" 
             style="top: \${topPx}px; height: \${heightPx}px; border-left-color: \${color};" onclick="\${params}">
            <div class="flex flex-col gap-0.5">
                <span class="font-bold text-[13px] whitespace-normal leading-tight" style="color: \${color}">\${sInfo ? sInfo.name : ''}</span>
                <span class="text-[12px] text-slate-800 leading-tight">\${tInfo ? tInfo.name : ''}</span>
            </div>
            <div class="flex flex-col items-end gap-1 shrink-0 ml-1">
               <span class="text-[10px] bg-slate-100 text-slate-600 px-1 font-mono rounded overflow-hidden truncate max-w-[40px]">\${time}</span>
            </div>
        </div>\`;
    }, (day, dIdx) => {
        const hColor = DAY_COLORS[dIdx % DAY_COLORS.length];
        const count = Object.values(state.schedule[day]).flat().length;
        return \`
        <div class="w-full text-white p-1.5 px-3 font-medium flex justify-between items-center text-[14px] rounded-t-lg shadow-sm" style="background-color: \${hColor};">
            <span>\${day}</span>
            <span>в–ј \${count}</span>
        </div>\`;
    });
}

function renderWeek3Kanban() {
    return buildGridView((it, sInfo, tInfo, day, time, topPx, heightPx) => {
        const color = sInfo ? sInfo.color : '#3b82f6';
        const params = \`openActionModal('\${day}','\${time}','\${it.id}')\`;
        let phoneBase = '', phoneLast4 = '';
        if (tInfo && tInfo.phone) {
            const m = tInfo.phone.match(/(.*?)(\\d{2}[-\\s]?\\d{2})$/);
            if(m) { phoneBase = m[1].trim(); phoneLast4 = m[2]; } else { phoneBase = tInfo.phone; }
        }
        return \`
        <div class="absolute inset-x-1 cursor-pointer shadow-sm active:scale-[0.98] transition-transform rounded-xl overflow-hidden flex flex-col" 
             style="top: \${topPx}px; height: \${heightPx}px; background-color: \${color};" onclick="\${params}">
            <div class="flex justify-between items-center px-1 py-1 text-white shrink-0">
                <span class="font-black text-[13px] uppercase tracking-wide truncate drop-shadow-md">\${sInfo ? sInfo.name : ''}</span>
                <span class="text-[10px] font-bold opacity-90 drop-shadow-md">\${time}</span>
            </div>
            <div class="bg-white mx-1 mb-1 p-1 flex flex-col justify-center gap-0.5 rounded-lg border-2 border-transparent flex-1 overflow-hidden" style="min-height: 0;">
                \${tInfo && tInfo.phone ? \`
                <div class="flex items-baseline whitespace-nowrap overflow-hidden text-slate-800 tracking-tight leading-none pt-0.5">
                    <span class="text-[11px] font-bold mr-0.5 opacity-80">\${phoneBase}</span>
                    <span class="text-[16px] font-black drop-shadow-sm" style="color: \${color}">\${phoneLast4}</span>
                </div>\` : \`<div class="text-[12px] text-slate-500 font-bold">\${tInfo ? tInfo.name : ''}</div>\`}
                
                <div class="flex justify-start gap-1 text-[9px] font-bold pt-0.5">
                    \${tInfo && (tInfo.platform === 'Telegram' || !tInfo.platform) ? \`
                    <span class="text-sky-500 flex items-center">\${ICONS.comment} РўР“</span>\` : ''}
                    \${tInfo && tInfo.platform === 'Zoom' ? \`
                    <span class="text-blue-600 flex items-center">\${ICONS.video} ZM</span>\` : ''}
                </div>
            </div>
        </div>\`;
    }, (day, dIdx) => {
        const count = Object.values(state.schedule[day]).flat().length;
        return \`
        <div class="w-full flex justify-between items-end border-b-[3px] border-slate-900 pb-0.5 px-0.5">
            <span class="font-black text-[18px] text-slate-900 capitalize tracking-tight" style="font-family: 'Comic Sans MS', cursive, sans-serif;">\${day}</span>
            <span class="font-black text-[22px] text-slate-900 leading-none">\${count > 0 ? count : ''}</span>
        </div>\`;
    });
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
    <div class="pb-20 space-y-4 max-w-lg mx-auto">
        <div class="bg-indigo-600 text-white p-6 rounded-[2rem] shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <div class="text-indigo-100 font-bold mb-1 uppercase text-sm">Р’СЃРµРіРѕ Р·Р°РЅСЏС‚РёР№</div>
            <div class="text-4xl font-black mb-4">${totalLessons} <span class="text-lg font-medium opacity-70">С€С‚.</span></div>
            
            <div class="text-indigo-100 font-bold mb-1 uppercase text-sm">РћР±С‰РёР№ Р±СЋРґР¶РµС‚ (РџР»Р°РЅ+Р¤Р°РєС‚)</div>
            <div class="text-3xl font-black">${fmtNum(totalCost)}</div>
        </div>
        
        <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <div class="font-black text-slate-800 mb-4 text-lg">РџРѕ РїСЂРµРґРјРµС‚Р°Рј</div>
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
                    <span>${count} С€С‚. (${perc}%)</span>
                </div>
                <div class="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full rounded-full" style="width: ${perc}%; background-color: ${sInfo.color}"></div>
                </div>
            </div>
        `;
    });
    
    if(totalLessons === 0) html += `<div class="text-slate-400 text-center text-sm">РќРµС‚ РґР°РЅРЅС‹С… РґР»СЏ Р°РЅР°Р»РёС‚РёРєРё</div>`;
    
    html += `</div></div></div>`;
    return html;
}

function renderSettings() {
    return `<div class="text-center p-8 bg-white rounded-3xl border border-slate-100 text-slate-400 font-bold mt-4">РќР°СЃС‚СЂРѕР№РєРё СЃРєРѕСЂРѕ РїРѕСЏРІСЏС‚СЃСЏ</div>`;
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
            <span>${item.duration} РјРёРЅ.</span>
            <div class="flex gap-2.5">
                ${tInfo.platform ? `<span class="flex items-center gap-1 text-blue-500">${ICONS.video} ${tInfo.platform}</span>` : ''}
                ${tInfo.phone ? `<span class="flex items-center gap-1 text-emerald-500">${ICONS.phone} Р’РёР·.</span>` : ''}
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
                <div class="text-[10px] font-black uppercase text-slate-400 mb-0.5">${sInfo?.name || 'РџСЂРµРґРјРµС‚'} вЂў ${time}</div>
                <div class="font-bold text-slate-800 text-sm">${tInfo?.name || 'РџСЂРµРїРѕРґР°РІР°С‚РµР»СЊ'}</div>
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
    
    document.getElementById('modal-title').innerText = "РЈРїСЂР°РІР»РµРЅРёРµ Р·Р°РЅСЏС‚РёРµРј";
    
    let btns = ``;
    
    // Toggle Pay status
    if (!it.isPaid) {
        btns += `<button onclick="togglePayStatus(true)" class="w-full py-4 px-6 rounded-2xl border-2 border-emerald-500 text-emerald-600 font-bold flex items-center justify-center gap-2 active:bg-emerald-50">РћС‚РјРµС‚РёС‚СЊ РѕРїР»Р°С‡РµРЅРЅС‹Рј</button>`;
    } else {
        btns += `<button onclick="togglePayStatus(false)" class="w-full py-4 px-6 rounded-2xl border-2 border-slate-300 text-slate-600 font-bold flex items-center justify-center gap-2 active:bg-slate-50">РЈР±СЂР°С‚СЊ РѕС‚РјРµС‚РєСѓ РѕРїР»Р°С‚С‹</button>`;
    }

    if (tInfo && tInfo.phone) {
        btns += `<a href="tel:${tInfo.phone}" class="w-full py-4 px-6 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold flex items-center justify-center gap-2 active:bg-slate-50">${ICONS.phone} РџРѕР·РІРѕРЅРёС‚СЊ</a>`;
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
