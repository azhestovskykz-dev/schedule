const fs = require('fs');

const RAW_SCHEDULE = \`
Пн: 08:00 Английский(968 439-84-36)60, 09:00 Скорочтение(966 077-10-48)60, 10:00 Калиграфия(909 170-90-76)40, 11:00 Математика(900 236-99-90)60, 12:00 Логопедия(906 296-91-25)45, 13:00 Обед()60, 14:00 Русский(916 147-38-00)60, 15:00 Речь(937 311-75-02)60, 16:00 Айкидо()180, 19:00 Английский(913 431-88-86)60
Вт: 08:00 Английский(952 530-54-54)60, 09:00 Логопедия(902 327-20-54)45, 10:00 Калиграфия(905 862-09-36)40, 11:00 Английский(989 282-26-29)60, 12:00 Логопедия(928 863-68-88)40, 13:00 Обед()60, 14:00 Логопедия(965 187-25-73)45, 15:00 Речь(926 217-37-29)60, 16:00 Баскетбол()180
Ср: 09:00 Логопедия(911 237-90-72)45, 10:00 Логопедия(918 174-21-16)60, 11:00 Английский(960 946-92-71)60, 12:00 Логопедия(904 026-07-26)50, 13:00 Обед()60, 14:00 Логопедия(903 290-97-66)30, 15:00 Логопедия(910 748-62-20)45, 16:00 Логопедия(920 605-77-33)45
Чт: 09:00 Английский(902 007-99-72)60, 10:00 Логопедия(983 304-32-41)45, 11:00 Логопедия(926 030-28-34)45, 12:00 Математика(966 077-10-48)60, 13:00 Обед()60, 14:00 Логопедия(916 330-51-77)40, 15:00 Логопедия(964 909-79-87)40, 16:00 Баскетбол()180
Пт: 09:00 Логопедия(375 25 912 0406)60, 10:00 Дефектолог(906 075-89-66)60, 11:00 Логопедия(983 106-56-53)45, 12:00 Логопедия(919 675-64-55)45, 13:00 Обед()60, 14:00 Логопедия(908 027-50-33)30, 15:00 Логопедия(915 000-92-55)45, 16:00 Волейбол()180
Сб: 08:00 Логопедия(912 626-43-30)30, 09:00 Айкидо()120, 13:00 Логопедия(903 255-39-30)60, 14:00 Логопедия(927 055-09-18)60, 15:00 Русский(951 608-63-70)60, 16:00 Шахматы()120, 19:00 Речь(909 096-12-31)60
Вс: 09:00 Английский(926 085-18-18)60, 10:00 Логопедия(952 267-40-32)60, 11:00 Математика(908 107-59-23)60, 12:00 Логопедия(900 352-24-43)60, 13:00 Обед()60, 14:00 Английский(925 250-75-05)60, 15:00 Математика(964 858-33-61)60, 17:00 Барабаны()180
\`;

function main() {
    let content = fs.readFileSync('app.js', 'utf8');

    // 1. Replace TIMES
    content = content.replace(
        /const TIMES = \[[\s\S]*?\];/,
        \`const TIMES = [
    "07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00",
    "16:00","17:00","18:00","19:00","20:00"
];\`
    );

    // 2. Replace subjects
    content = content.replace(
        /const DEFAULT_SUBJECTS = \[.*?\];/,
        \`const RAW_SCHEDULE = \\\`\${RAW_SCHEDULE}\\\`;

const FIXED_SUBJECTS = [
    {id:'s0', name:'Математика', color:'#f97316'},
    {id:'s1', name:'Русский', color:'#94a3b8'},
    {id:'s2', name:'Английский', color:'#eab308'},
    {id:'s3', name:'Скорочтение', color:'#06b6d4'},
    {id:'s4', name:'Логопедия', color:'#84cc16'},
    {id:'s5', name:'Калиграфия', color:'#a855f7'},
    {id:'s6', name:'Речь', color:'#22c55e'},
    {id:'s7', name:'Айкидо', color:'#0ea5e9'},
    {id:'s8', name:'Баскетбол', color:'#ef4444'},
    {id:'s9', name:'Волейбол', color:'#ef4444'},
    {id:'s10', name:'Шахматы', color:'#0ea5e9'},
    {id:'s11', name:'Барабаны', color:'#ef4444'},
    {id:'s12', name:'Дефектолог', color:'#a855f7'},
    {id:'s13', name:'Обед', color:'#3b82f6'}
];\`
    );

    // 3. Replace loadData
    const loadStart = content.indexOf('function loadData() {');
    const saveStart = content.indexOf('function saveData() {');

    const newLoadData = \`function loadData() {
    state.subjects = FIXED_SUBJECTS;
    state.schedule = {};
    DAYS.forEach(d => { state.schedule[d] = {}; });
    
    let tMap = {};
    let tIdx = 1;
    state.teachers = [{id:'t0', name:'Без телефона', phone:'', platform:'', cost:0}];
    
    let bid = 1;
    RAW_SCHEDULE.split('\\n').filter(x=>x.trim()).forEach(l => {
        let parts = l.split(': ');
        if(parts.length < 2) return;
        let day = parts[0].trim();
        parts[1].split(', ').forEach(r => {
            let m = r.match(/(\\d{2}):(\\d{2}) (.+?)\\((.*?)\\)(\\d+)/);
            if(m) {
                let h = m[1];
                let min = m[2];
                let time = \\\`\${h}:\${min}\\\`;
                let name = m[3];
                let phone = m[4];
                let dur = parseInt(m[5]);
                
                let sInfo = state.subjects.find(s=>s.name === name) || state.subjects[0];
                let tid = 't0';
                if (phone) {
                    if (!tMap[phone]) {
                        tMap[phone] = 't' + tIdx++;
                        state.teachers.push({ id: tMap[phone], name: 'Ученик', phone: phone, platform: Math.random()>0.5?'Telegram':'Zoom', cost: 2500 });
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

\`;
    content = content.substring(0, loadStart) + newLoadData + content.substring(saveStart);

    // 4. Implement drag and drop core functions + replace kanbans
    const dndFunctions = \`
// ===================== DRAG AND DROP =====================
let draggedItemId = null;
let draggedSourceDay = null;
let draggedSourceTime = null;

window.handleDragStart = (e, id, day, time) => {
    draggedItemId = id;
    draggedSourceDay = day;
    draggedSourceTime = time;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    setTimeout(() => {
        e.target.style.opacity = '0.4';
    }, 0);
};

window.handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    draggedItemId = null;
};

window.handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
};

window.handleDrop = (e, targetDay, targetTime) => {
    e.preventDefault();
    if(!draggedItemId || !targetDay || !targetTime) return;
    
    // Check if dropping on the exact same spot
    if (draggedSourceDay === targetDay && draggedSourceTime === targetTime) return;

    // Find the item
    const sourceArr = state.schedule[draggedSourceDay][draggedSourceTime];
    const itemIdx = sourceArr.findIndex(it => it.id === draggedItemId);
    const item = sourceArr[itemIdx];

    // Remove from source
    sourceArr.splice(itemIdx, 1);

    // Add to target
    if(!state.schedule[targetDay][targetTime]) state.schedule[targetDay][targetTime] = [];
    state.schedule[targetDay][targetTime].push(item);
    
    render();
};

\`;

    const kanbanStart = content.indexOf('function renderWeek2Kanban() {');
    const kanbanEnd = content.indexOf('function renderAnalytics() {');

    const newKanbans = \`// Function generating the absolute calendar grid wrapper with DND
function buildGridView(cardRendererCb, dayHeaderCb) {
    const ROW_H = 120; // 120px per hour
    
    let html = \\\`
    <div class="kanban-container flex w-full relative h-[calc(100vh-140px)] overflow-y-auto overflow-x-auto bg-slate-50" style="scroll-snap-type: none; gap: 0;">
        <div class="sticky left-0 bg-slate-50/95 backdrop-blur-sm z-30 flex flex-col shrink-0 border-r border-slate-200" style="width: 50px;">
            <div class="sticky top-0 h-[60px] bg-slate-50 z-40 border-b border-slate-200"></div>
            \${TIMES.map(t => \\\`<div class="text-[12px] font-bold text-slate-400 text-right pr-1 relative -top-3" style="height: \${ROW_H}px">\${t}</div>\\\`).join('')}
        </div>
        <div class="flex flex-none min-w-[max-content] md:w-full">
            \${DAYS.map((day, dIdx) => {
                let itemsHtml = '';
                TIMES.forEach(time => {
                    (state.schedule[day][time] || []).forEach(it => {
                        const sInfo = state.subjects.find(s => s.id === it.subjectId) || state.subjects[0];
                        const tInfo = state.teachers.find(t => t.id === it.teacherId);
                        
                        let [h, m] = time.split(':').map(Number);
                        let topPx = (h - 7) * ROW_H + (m / 60) * ROW_H;
                        let heightPx = (it.duration / 60) * ROW_H - 2; // -2 for margin
                        
                        itemsHtml += cardRendererCb(it, sInfo, tInfo, day, time, topPx, heightPx);
                    });
                });
                
                return \\\`
                <div class="relative border-r border-slate-200 flex-none md:flex-1 bg-white" style="width: 280px; min-width: 240px;">
                    <div class="sticky top-0 bg-white z-20 h-[60px] border-b border-slate-200 flex flex-col justify-end px-2 pb-2">
                        \${dayHeaderCb(day, dIdx)}
                    </div>
                    <div class="relative w-full" style="height: \${14 * ROW_H}px">
                        \${TIMES.map((t, idx) => \\\`<div class="absolute w-full border-b border-slate-100" 
                            style="top: \${idx * ROW_H}px; height: \${ROW_H}px"
                            ondragover="handleDragOver(event)"
                            ondrop="handleDrop(event, '\${day}', '\${t}')"
                            ></div>\\\`).join('')}
                        \${itemsHtml}
                    </div>
                </div>\\\`;
            }).join('')}
        </div>
    </div>\\\`;
    return html;
}

function renderWeek2Kanban() {
    const DAY_COLORS = ['#d946ef', '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];

    return buildGridView((it, sInfo, tInfo, day, time, topPx, heightPx) => {
        const color = sInfo.color;
        const params = \\\`openActionModal('\${day}','\${time}','\${it.id}')\\\`;
        return \\\`
        <div class="absolute inset-x-0 p-1.5 cursor-pointer flex justify-between items-start border-l-[3px] overflow-hidden border-b border-b-slate-100 bg-white/95 hover:bg-slate-50 transition-colors z-10" 
             style="top: \${topPx}px; height: \${heightPx}px; border-left-color: \${color};" 
             draggable="true" ondragstart="handleDragStart(event, '\${it.id}', '\${day}', '\${time}')" ondragend="handleDragEnd(event)"
             onclick="\${params}">
            <div class="flex flex-col gap-0.5">
                <span class="font-bold text-[13px] whitespace-normal leading-tight" style="color: \${color}">\${sInfo.name}</span>
                <span class="text-[12px] text-slate-800 leading-tight">\${tInfo ? tInfo.name : ''}</span>
            </div>
            <div class="flex flex-col items-end gap-1 shrink-0 ml-1">
               <span class="text-[10px] bg-slate-100 text-slate-600 px-1 font-mono rounded overflow-hidden truncate max-w-[40px]">\${time}</span>
            </div>
        </div>\\\`;
    }, (day, dIdx) => {
        const hColor = DAY_COLORS[dIdx % DAY_COLORS.length];
        const count = Object.values(state.schedule[day]).flat().length;
        return \\\`
        <div class="w-full text-white p-1.5 px-3 font-medium flex justify-between items-center text-[14px] rounded-t-lg shadow-sm" style="background-color: \${hColor};">
            <span>\${day}</span>
            <span>▼ \${count}</span>
        </div>\\\`;
    });
}

function renderWeek3Kanban() {
    return buildGridView((it, sInfo, tInfo, day, time, topPx, heightPx) => {
        const color = sInfo.color;
        const params = \\\`openActionModal('\${day}','\${time}','\${it.id}')\\\`;
        let phoneBase = '', phoneLast4 = '';
        if (tInfo && tInfo.phone) {
            const m = tInfo.phone.match(/(.*?)(\\d{2}[-\\s]?\\d{2})$/);
            if(m) { phoneBase = m[1].trim(); phoneLast4 = m[2]; } else { phoneBase = tInfo.phone; }
        }
        return \\\`
        <div class="absolute inset-x-1 cursor-pointer shadow-sm active:scale-[0.98] transition-transform rounded-xl overflow-hidden flex flex-col z-10" 
             style="top: \${topPx}px; height: \${heightPx}px; background-color: \${color};"
             draggable="true" ondragstart="handleDragStart(event, '\${it.id}', '\${day}', '\${time}')" ondragend="handleDragEnd(event)" 
             onclick="\${params}">
            <div class="flex justify-between items-center px-1 py-1 text-white shrink-0">
                <span class="font-black text-[13px] uppercase tracking-wide truncate drop-shadow-md">\${sInfo.name}</span>
                <span class="text-[10px] font-bold opacity-90 drop-shadow-md">\${time}</span>
            </div>
            <div class="bg-white mx-1 mb-1 p-1 flex flex-col justify-center gap-0.5 rounded-lg border-2 border-transparent flex-1 overflow-hidden pointer-events-none" style="min-height: 0;">
                \${tInfo && tInfo.phone ? \\\`
                <div class="flex items-baseline whitespace-nowrap overflow-hidden text-slate-800 tracking-tight leading-none pt-0.5 pointer-events-none">
                    <span class="text-[11px] font-bold mr-0.5 opacity-80 pointer-events-none">\${phoneBase}</span>
                    <span class="text-[16px] font-black drop-shadow-sm pointer-events-none" style="color: \${color}">\${phoneLast4}</span>
                </div>\\\` : \\\`<div class="text-[12px] text-slate-500 font-bold pointer-events-none">\${tInfo ? tInfo.name : ''}</div>\\\`}
                
                <div class="flex justify-start gap-1 text-[9px] font-bold pt-0.5 pointer-events-none">
                    \${tInfo && (tInfo.platform === 'Telegram' || !tInfo.platform) ? \\\`
                    <span class="text-sky-500 flex items-center pointer-events-none">\${ICONS.comment} ТГ</span>\\\` : ''}
                    \${tInfo && tInfo.platform === 'Zoom' ? \\\`
                    <span class="text-blue-600 flex items-center pointer-events-none">\${ICONS.video} ZM</span>\\\` : ''}
                </div>
            </div>
        </div>\\\`;
    }, (day, dIdx) => {
        const count = Object.values(state.schedule[day]).flat().length;
        return \\\`
        <div class="w-full flex justify-between items-end border-b-[3px] border-slate-900 pb-0.5 px-0.5">
            <span class="font-black text-[18px] text-slate-900 capitalize tracking-tight" style="font-family: 'Comic Sans MS', cursive, sans-serif;">\${day}</span>
            <span class="font-black text-[22px] text-slate-900 leading-none">\${count > 0 ? count : ''}</span>
        </div>\\\`;
    });
}
\`;

    content = content.substring(0, kanbanStart) + dndFunctions + newKanbans + content.substring(kanbanEnd);

    fs.writeFileSync('app.js', content, 'utf8');
    console.log("Successfully migrated app.js with NodeJS!");
}

main();
