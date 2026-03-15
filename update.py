import os
import sys

def main():
    try:
        with open('app.js', 'r', encoding='utf-8') as f:
            content = f.read()
            
        start_idx = content.find('function renderWeek2Kanban() {')
        end_idx = content.find('function renderAnalytics() {')
        
        if start_idx == -1 or end_idx == -1:
            print("Could not find start or end markers.")
            sys.exit(1)
            
        replacement = """// Function generating the absolute calendar grid wrapper with DND
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
                        const sInfo = state.subjects.find(s => s.id === it.subjectId) || state.subjects[0];
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
                        ${TIMES.map((t, idx) => `<div class="absolute w-full border-b border-slate-100 drop-zone flex items-center justify-center opacity-0 hover:opacity-100 hover:bg-sky-50 transition-all font-mono text-slate-300 text-sm" 
                            style="top: ${idx * ROW_H}px; height: ${ROW_H}px; z-index: 1;"
                            ondragover="handleDragOver(event)"
                            ondrop="handleDrop(event, '${day}', '${t}')"
                            >+</div>`).join('')}
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
        const color = sInfo.color;
        const params = `openActionModal('${day}','${time}','${it.id}')`;
        return `
        <div class="absolute inset-x-0 p-1.5 cursor-pointer flex justify-between items-start border-l-[3px] overflow-hidden border-b border-b-slate-100 bg-white/95 hover:bg-slate-50 transition-all z-10 hover:z-20 shadow-sm" 
             style="top: ${topPx}px; height: ${heightPx}px; border-left-color: ${color};" 
             draggable="true" ondragstart="handleDragStart(event, '${it.id}', '${day}', '${time}')" ondragend="handleDragEnd(event)"
             onclick="${params}">
            <div class="flex flex-col gap-0.5">
                <span class="font-bold text-[13px] whitespace-normal leading-tight drop-shadow-sm truncate" style="color: ${color}">${sInfo.name}</span>
                <span class="text-[12px] text-slate-800 leading-tight truncate">${tInfo ? tInfo.name : ''}</span>
            </div>
            <div class="flex flex-col items-end gap-1 shrink-0 ml-1">
               <span class="text-[10px] bg-slate-100 text-slate-600 px-1 font-mono rounded overflow-hidden truncate max-w-[40px]">${time}</span>
            </div>
        </div>`;
    }, (day, dIdx) => {
        const hColor = DAY_COLORS[dIdx % DAY_COLORS.length];
        const count = Object.values(state.schedule[day]).flat().length;
        return `
        <div class="w-full text-white p-1.5 px-3 font-medium flex justify-between items-center text-[14px] rounded-t-lg shadow-sm" style="background-color: ${hColor};">
            <span>${day}</span>
            <span>▼ ${count}</span>
        </div>`;
    });
}

function renderWeek3Kanban() {
    return buildGridView((it, sInfo, tInfo, day, time, topPx, heightPx) => {
        const color = sInfo.color;
        const params = `openActionModal('${day}','${time}','${it.id}')`;
        let phoneBase = '', phoneLast4 = '';
        if (tInfo && tInfo.phone) {
            const m = tInfo.phone.match(/(.*?)(\\d{2}[-\\s]?\\d{2})$/);
            if(m) { phoneBase = m[1].trim(); phoneLast4 = m[2]; } else { phoneBase = tInfo.phone; }
        }
        return `
        <div class="absolute inset-x-1 cursor-pointer shadow-sm active:scale-[0.98] transition-transform rounded-xl overflow-hidden flex flex-col z-10 hover:z-20 ring-1 ring-black/5" 
             style="top: ${topPx}px; height: ${heightPx}px; background-color: ${color};"
             draggable="true" ondragstart="handleDragStart(event, '${it.id}', '${day}', '${time}')" ondragend="handleDragEnd(event)" 
             onclick="${params}">
            <div class="flex justify-between items-center px-1 py-1 text-white shrink-0">
                <span class="font-black text-[13px] uppercase tracking-wide truncate drop-shadow-md">${sInfo.name}</span>
                <span class="text-[10px] font-bold opacity-90 drop-shadow-md">${time}</span>
            </div>
            <div class="bg-white mx-1 mb-1 p-1 flex flex-col justify-center gap-0.5 rounded-lg border-2 border-transparent flex-1 overflow-hidden pointer-events-none" style="min-height: 0;">
                ${tInfo && tInfo.phone ? `
                <div class="flex items-baseline whitespace-nowrap overflow-hidden text-slate-800 tracking-tight leading-none pt-0.5 pointer-events-none">
                    <span class="text-[11px] font-bold mr-0.5 opacity-80 pointer-events-none">${phoneBase}</span>
                    <span class="text-[16px] font-black drop-shadow-sm pointer-events-none" style="color: ${color}">${phoneLast4}</span>
                </div>` : `<div class="text-[12px] text-slate-500 font-bold pointer-events-none">${tInfo ? tInfo.name : ''}</div>`}
                
                <div class="flex justify-start gap-1 text-[9px] font-bold pt-0.5 pointer-events-none">
                    ${tInfo && (tInfo.platform === 'Telegram' || !tInfo.platform) ? `
                    <span class="text-sky-500 flex items-center pointer-events-none" style="margin-right: 2px;">${ICONS.comment} ТГ</span>` : ''}
                    ${tInfo && tInfo.platform === 'Zoom' ? `
                    <span class="text-blue-600 flex items-center pointer-events-none">${ICONS.video} ZM</span>` : ''}
                </div>
            </div>
        </div>`;
    }, (day, dIdx) => {
        const count = Object.values(state.schedule[day]).flat().length;
        return `
        <div class="w-full flex justify-between items-end border-b-[3px] border-slate-900 pb-0.5 px-0.5">
            <span class="font-black text-[18px] text-slate-900 capitalize tracking-tight" style="font-family: 'Comic Sans MS', cursive, sans-serif;">${day}</span>
            <span class="font-black text-[22px] text-slate-900 leading-none">${count > 0 ? count : ''}</span>
        </div>`;
    });
}

"""
        new_content = content[:start_idx] + replacement + content[end_idx:]
        
        with open('app.js', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Success")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
