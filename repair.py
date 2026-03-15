import os
import re

def fix_app_js():
    try:
        with open('app.js', 'r', encoding='utf-8') as f:
            content = f.read()

        # 1. Add "Вне" to DAYS array
        content = re.sub(
            r"const DAYS = \['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'\];",
            "const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс', 'Вне'];",
            content
        )

        # 2. Add an "Unscheduled 00:00" to TIMES array if it's not there just to be safe, 
        # or we just let it handle standard TIMES.
        # Actually better: wrap the parsing in a safer try-catch that guarantees no crashes.
        
        load_data_match = re.search(r"function loadData\(\) \{.*?\n\}", content, flags=re.DOTALL)
        if not load_data_match:
            print("loadData not found!")

        safe_load_data = """function loadData() {
    try {
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
            
            // Strictly sanitize day to ensure it matches DAYS exactly
            let day = parts[0].replace(/[^А-Яа-яA-Za-z]/g, '').trim();
            if(!DAYS.includes(day)) { day = 'Вне'; } // Fallback to unscheduled
            
            if(!state.schedule[day]) state.schedule[day] = {};

            parts[1].split(', ').forEach(r => {
                let m = r.match(/(\\d{2}):(\\d{2})\\s*(.+?)\\((.*?)\\)(\\d+)/);
                if(m) {
                    let h = m[1];
                    let min = m[2];
                    let time = `${h}:${min}`;
                    let name = m[3].trim();
                    let phone = m[4].trim();
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
                } else if(r.trim().length > 0) {
                    // Item didn't match strict format, put it in fallback unscheduled
                    if(!state.schedule['Вне']['08:00']) state.schedule['Вне']['08:00'] = [];
                    state.schedule['Вне']['08:00'].push({
                        id: 'b' + bid++,
                        subjectId: state.subjects[0].id,
                        teacherId: 't0',
                        variant: '1',
                        duration: 60,
                        isPaid: false,
                        comment: r.trim() // Save raw text
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
    } catch(e) {
        console.error("FATAL ERROR IN LOADDATA:", e);
        alert("Ошибка загрузки данных: " + e.message);
    }
}"""
        
        # Replace loadData
        content = re.sub(r"function loadData\(\) \{.*?\n(?!    )\}", safe_load_data, content, flags=re.DOTALL)

        # Ensure we write it back
        with open('app.js', 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("Success repairing app.js")
    
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_app_js()
