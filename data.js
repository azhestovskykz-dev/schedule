// ===================== DATA.JS — Все данные и состояние =====================

const state = {
    section: 'schedule',   // 'schedule','tasks','analytics','finance','subjects','teachers'
    scheduleTab: 'today',  // 'today','week','twoweeks','month'
    scheduleView: 1,       // 1-8 variant number
    tasksView: 1,          // 1-5 kanban variant
    analyticsView: 1,      // 1-5 analytics variant
    teachersView: 1,       // 1-5 teachers variant
    subjectsView: 1,       // 1-5 subjects variant
    schoolsView: 1,        // 1-5 schools variant
    subTab: 'schedule',    // for today: 'schedule','plan','fact'
    schedule: {},
    teachers: [],
    subjects: [],
    schools: [],
    tasks: [],
    finances: [],
    activeWeekDay: 'Пн',
    isDraft: false
};

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const TIMES = [
    "07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00",
    "16:00","17:00","18:00","19:00","20:00"
];

const RAW_SCHEDULE = `
Пн: 08:00 Английский(968 439-84-36)60, 09:00 Скорочтение(966 077-10-48)60, 10:00 Калиграфия(909 170-90-76)40, 11:00 Математика(900 236-99-90)60, 12:00 Логопедия(906 296-91-25)45, 13:00 Обед()60, 14:00 Русский(916 147-38-00)60, 15:00 Речь(937 311-75-02)60, 16:00 Айкидо()180, 19:00 Английский(913 431-88-86)60
Вт: 08:00 Английский(952 530-54-54)60, 09:00 Логопедия(902 327-20-54)45, 10:00 Калиграфия(905 862-09-36)40, 11:00 Английский(989 282-26-29)60, 12:00 Логопедия(928 863-68-88)40, 13:00 Обед()60, 14:00 Логопедия(965 187-25-73)45, 15:00 Речь(926 217-37-29)60, 16:00 Баскетбол()180
Ср: 09:00 Логопедия(911 237-90-72)45, 10:00 Логопедия(918 174-21-16)60, 11:00 Английский(960 946-92-71)60, 12:00 Логопедия(904 026-07-26)50, 13:00 Обед()60, 14:00 Логопедия(903 290-97-66)30, 15:00 Логопедия(910 748-62-20)45, 16:00 Логопедия(920 605-77-33)45
Чт: 09:00 Английский(902 007-99-72)60, 10:00 Логопедия(983 304-32-41)45, 11:00 Логопедия(926 030-28-34)45, 12:00 Математика(966 077-10-48)60, 13:00 Обед()60, 14:00 Логопедия(916 330-51-77)40, 15:00 Логопедия(964 909-79-87)40, 16:00 Баскетбол()180
Пт: 09:00 Логопедия(375 25 912 0406)60, 10:00 Дефектолог(906 075-89-66)60, 11:00 Логопедия(983 106-56-53)45, 12:00 Логопедия(919 675-64-55)45, 13:00 Обед()60, 14:00 Логопедия(908 027-50-33)30, 15:00 Логопедия(915 000-92-55)45, 16:00 Волейбол()180
Сб: 08:00 Логопедия(912 626-43-30)30, 09:00 Айкидо()120, 13:00 Логопедия(903 255-39-30)60, 14:00 Логопедия(927 055-09-18)60, 15:00 Русский(951 608-63-70)60, 16:00 Шахматы()120, 19:00 Речь(909 096-12-31)60
Вс: 09:00 Английский(926 085-18-18)60, 10:00 Логопедия(952 267-40-32)60, 11:00 Математика(908 107-59-23)60, 12:00 Логопедия(900 352-24-43)60, 13:00 Обед()60, 14:00 Английский(925 250-75-05)60, 15:00 Математика(964 858-33-61)60, 17:00 Барабаны()180
`;

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
];

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

// ===================== DATA LOADER =====================
function loadData() {
    try {
        state.subjects = FIXED_SUBJECTS;
        state.schedule = {};
        DAYS.forEach(d => { state.schedule[d] = {}; });
        
        let tMap = {};
        let tIdx = 1;
        state.teachers = [{id:'t0', name:'Без телефона', phone:'', platform:'', cost:0}];
        
        let bid = 1;
        RAW_SCHEDULE.split('\n').filter(x=>x.trim()).forEach(l => {
            let parts = l.split(': ');
            if(parts.length < 2) return;
            let day = parts[0].replace(/[^А-Яа-яA-Za-z]/g, '').trim();
            if(!DAYS.includes(day)) return;
            
            if(!state.schedule[day]) state.schedule[day] = {};

            parts[1].split(', ').forEach(r => {
                let m = r.match(/(\d{2}):(\d{2})\s*(.+?)\((.*?)\)(\d+)/);
                if(m) {
                    let time = `${m[1]}:${m[2]}`;
                    let name = m[3].trim();
                    let phone = m[4].trim();
                    let dur = parseInt(m[5]);
                    
                    let sInfo = state.subjects.find(s=>s.name === name) || state.subjects[0];
                    let tid = 't0';
                    if (phone) {
                        if (!tMap[phone]) {
                            tMap[phone] = 't' + tIdx++;
                            state.teachers.push({ id: tMap[phone], name: name + ' (' + phone.slice(-5) + ')', phone: phone, platform: Math.random()>0.5?'Telegram':'Zoom', cost: 2500 });
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

        // Mock tasks
        state.tasks = [
            {id:'task1', title:'Сделать домашку по математике', status:'todo', priority:'high', day:'Пн'},
            {id:'task2', title:'Прочитать 10 страниц', status:'todo', priority:'medium', day:'Вт'},
            {id:'task3', title:'Выучить 20 слов английских', status:'inprogress', priority:'high', day:'Ср'},
            {id:'task4', title:'Нарисовать рисунок', status:'done', priority:'low', day:'Чт'},
            {id:'task5', title:'Сделать упражнения логопеда', status:'todo', priority:'high', day:'Пт'},
            {id:'task6', title:'Написать сочинение', status:'inprogress', priority:'medium', day:'Сб'},
            {id:'task7', title:'Повторить таблицу умножения', status:'done', priority:'high', day:'Вс'},
            {id:'task8', title:'Подготовить портфолио', status:'todo', priority:'low', day:'Пн'},
        ];

        // Mock finances
        state.finances = [
            {id:'f1', category:'Образование', subcategory:'Репетиторы', amount:45000, month:'Март', type:'expense'},
            {id:'f2', category:'Спорт', subcategory:'Абонемент Айкидо', amount:8000, month:'Март', type:'expense'},
            {id:'f3', category:'Спорт', subcategory:'Абонемент Баскетбол', amount:6000, month:'Март', type:'expense'},
            {id:'f4', category:'Питание', subcategory:'Обеды', amount:12000, month:'Март', type:'expense'},
            {id:'f5', category:'Транспорт', subcategory:'Такси до занятий', amount:5000, month:'Март', type:'expense'},
        ];

        // Mock 50 Top Moscow Schools (ЮЗАО, ЮАО, ЗАО, ВАО)
        state.schools = [
            // ЮЗАО
            {id: 'sch1', name: 'Лицей «Вторая школа»', status: 'active', curator: 'Васильева Т.М.', phone: '+7 (495) 137-55-88', address: 'г. Москва, ул. Фотиевой, 18 (ЮЗАО)', type: 'Бесплатная'},
            {id: 'sch2', name: 'Академическая гимназия № 1534', status: 'planned', curator: 'Смирнова Е.В.', phone: '+7 (495) 123-44-55', address: 'г. Москва, ул. Кедрова, 11 (ЮЗАО)', type: 'Бесплатная'},
            {id: 'sch3', name: 'Гимназия № 1514', status: 'active', curator: 'Семенов И.Г.', phone: '+7 (495) 789-01-23', address: 'г. Москва, ул. Крупской, 12 (ЮЗАО)', type: 'Бесплатная'},
            {id: 'sch4', name: 'Гимназия № 1507', status: 'archived', curator: 'Петров В.В.', phone: '+7 (495) 336-77-88', address: 'г. Москва, Профсоюзная ул., 140 (ЮЗАО)', type: 'Бесплатная'},
            {id: 'sch5', name: 'Школа № 2086', status: 'active', curator: 'Морозова И.П.', phone: '+7 (495) 939-00-11', address: 'г. Москва, Университетский пр-т, 4 (ЮЗАО)', type: 'Бесплатная'},
            {id: 'sch6', name: 'Школа «Наукоград»', status: 'active', curator: 'Иванов А.А.', phone: '+7 (495) 111-22-33', address: 'г. Москва, Ломоносовский пр-т, 27 (ЮЗАО)', type: 'Платная'},
            {id: 'sch7', name: 'Школа № 1265', status: 'planned', curator: 'Лебедев В.Н.', phone: '+7 (495) 222-33-44', address: 'г. Москва, ул. Фотиевой, 14 (ЮЗАО)', type: 'Бесплатная'},
            {id: 'sch8', name: 'Школа № 1101', status: 'active', curator: 'Ковалева С.В.', phone: '+7 (495) 444-55-66', address: 'г. Москва, ул. Теплый Стан, 15 (ЮЗАО)', type: 'Бесплатная'},
            {id: 'sch9', name: 'Частная школа «Взмах» (ЮЗАО)', status: 'planned', curator: 'Соколова А.И.', phone: '+7 (495) 555-66-77', address: 'г. Москва, ул. Архитектора Власова (ЮЗАО)', type: 'Платная'},
            {id: 'sch10', name: 'Школа № 1535 (Ломоносовский)', status: 'active', curator: 'Макарова О.П.', phone: '+7 (495) 890-12-34', address: 'г. Москва, ул. Усачева, 50 (ЮЗАО)', type: 'Бесплатная'},
            {id: 'sch11', name: 'Школа № 109', status: 'archived', curator: 'Зайцева Е.А.', phone: '+7 (495) 438-11-22', address: 'г. Москва, Ленинский пр-т, 109 (ЮЗАО)', type: 'Бесплатная'},
            {id: 'sch12', name: 'Газпром школа', status: 'active', curator: 'Николаев А.Б.', phone: '+7 (495) 719-00-00', address: 'г. Москва, ул. Наметкина, 11 (ЮЗАО)', type: 'Платная'},
            {id: 'sch13', name: 'Школа № 199', status: 'planned', curator: 'Волков К.А.', phone: '+7 (495) 124-33-22', address: 'г. Москва, ул. Дмитрия Ульянова, 15 (ЮЗАО)', type: 'Бесплатная'},
            
            // ЮАО
            {id: 'sch14', name: 'Бауманская инженерная школа № 1580', status: 'active', curator: 'Алексеев П.П.', phone: '+7 (495) 316-00-22', address: 'г. Москва, Балаклавский пр-т, 6 (ЮАО)', type: 'Бесплатная'},
            {id: 'sch15', name: 'Предуниверситарий МИФИ', status: 'active', curator: 'Григорьева Н.С.', phone: '+7 (495) 788-56-99', address: 'г. Москва, Пролетарский пр-т, 8 (ЮАО)', type: 'Бесплатная'},
            {id: 'sch16', name: 'Школа № 548 "Царицыно"', status: 'active', curator: 'Сидоров Н.А.', phone: '+7 (495) 393-22-11', address: 'г. Москва, ул. Домодедовская, 35 (ЮАО)', type: 'Бесплатная'},
            {id: 'sch17', name: 'Школа № 1158', status: 'planned', curator: 'Новикова Т.Д.', phone: '+7 (495) 386-33-22', address: 'г. Москва, Чертановская ул., 32 (ЮАО)', type: 'Бесплатная'},
            {id: 'sch18', name: 'Школа № 1553 имени В.И. Вернадского', status: 'active', curator: 'Кузнецов Д.Р.', phone: '+7 (495) 111-44-55', address: 'г. Москва, ул. Люсиновская, 72 (ЮАО)', type: 'Бесплатная'},
            {id: 'sch19', name: 'Школа № 1569 "Созвездие"', status: 'archived', curator: 'Егоров С.М.', phone: '+7 (495) 399-55-66', address: 'г. Москва, ул. Мусы Джалиля, 28 (ЮАО)', type: 'Бесплатная'},
            {id: 'sch20', name: 'Школа № 1862', status: 'active', curator: 'Смирнова Е.В.', phone: '+7 (495) 314-11-88', address: 'г. Москва, Симферопольский б-р, 23 (ЮАО)', type: 'Бесплатная'},
            {id: 'sch21', name: 'Школа № 1375', status: 'planned', curator: 'Иванов А.А.', phone: '+7 (495) 112-22-33', address: 'г. Москва, Нагатинская набережная, 24 (ЮАО)', type: 'Бесплатная'},
            {id: 'sch22', name: 'Учебный центр «Перспектива»', status: 'active', curator: 'Васильева Т.М.', phone: '+7 (495) 333-44-55', address: 'г. Москва, Каширское ш., 44 (ЮАО)', type: 'Платная'},
            {id: 'sch23', name: 'Частная школа «Наследник»', status: 'active', curator: 'Лебедев В.Н.', phone: '+7 (495) 555-88-99', address: 'г. Москва, Борисовские пруды, 11 (ЮАО)', type: 'Платная'},
            {id: 'sch24', name: 'Школа «САМСОН»', status: 'planned', curator: 'Петров В.В.', phone: '+7 (495) 777-11-22', address: 'г. Москва, Кленовый бульвар, 7 (ЮАО)', type: 'Платная'},
            {id: 'sch25', name: 'Гимназия "Эллада"', status: 'archived', curator: 'Морозова И.П.', phone: '+7 (495) 222-77-88', address: 'г. Москва, ул. Кошкина, 6 (ЮАО)', type: 'Платная'},
            {id: 'sch26', name: 'Школа № 978', status: 'active', curator: 'Николаев А.Б.', phone: '+7 (495) 111-99-00', address: 'г. Москва, проспект Андропова, 32 (ЮАО)', type: 'Бесплатная'},
            
            // ЗАО
            {id: 'sch27', name: 'Московская школа на Юго-Западе № 1543', status: 'active', curator: 'Соколова А.И.', phone: '+7 (495) 434-11-22', address: 'г. Москва, ул. 26 Бакинских Комиссаров, 3 (ЗАО)', type: 'Бесплатная'},
            {id: 'sch28', name: 'СУНЦ МГУ', status: 'active', curator: 'Ковалева С.В.', phone: '+7 (495) 445-66-77', address: 'г. Москва, Кременчугская ул., 11 (ЗАО)', type: 'Бесплатная'},
            {id: 'sch29', name: 'Университетская гимназия МГУ', status: 'planned', curator: 'Волков К.А.', phone: '+7 (495) 939-11-22', address: 'г. Москва, Ломоносовский пр-т, 27к7 (ЗАО)', type: 'Бесплатная'},
            {id: 'sch30', name: 'Школа «Мечтатели»', status: 'active', curator: 'Зайцева Е.А.', phone: '+7 (495) 333-55-77', address: 'г. Москва, Мосфильмовская ул., 88 (ЗАО)', type: 'Платная'},
            {id: 'sch31', name: 'Wunderpark International School', status: 'archived', curator: 'Алексеев П.П.', phone: '+7 (495) 888-22-33', address: 'г. Москва, проспект Вернадского (ЗАО)', type: 'Платная'},
            {id: 'sch32', name: 'One! International School (ЗАО)', status: 'planned', curator: 'Григорьева Н.С.', phone: '+7 (495) 777-33-44', address: 'г. Москва, ул. Минская, 2 (ЗАО)', type: 'Платная'},
            {id: 'sch33', name: 'Гимназия "СОКРАТ"', status: 'active', curator: 'Макарова О.П.', phone: '+7 (495) 555-11-88', address: 'г. Москва, Кутузовский пр-т (ЗАО)', type: 'Платная'},
            {id: 'sch34', name: 'Гимназия № 1306', status: 'active', curator: 'Семенов И.Г.', phone: '+7 (495) 143-22-11', address: 'г. Москва, Мичуринский пр-т, 15 (ЗАО)', type: 'Бесплатная'},
            {id: 'sch35', name: 'Гимназия № 1541', status: 'planned', curator: 'Егоров С.М.', phone: '+7 (495) 433-55-66', address: 'г. Москва, ул. Проспект Вернадского, 65 (ЗАО)', type: 'Бесплатная'},
            {id: 'sch36', name: 'Гимназия № 1542', status: 'active', curator: 'Сидоров Н.А.', phone: '+7 (495) 412-33-44', address: 'г. Москва, Солнцевский пр-т, 12 (ЗАО)', type: 'Бесплатная'},
            {id: 'sch37', name: 'Гимназия № 1567', status: 'archived', curator: 'Новикова Т.Д.', phone: '+7 (495) 249-11-22', address: 'г. Москва, Кутузовский проезд, 10 (ЗАО)', type: 'Бесплатная'},
            {id: 'sch38', name: 'Школа № 1586', status: 'active', curator: 'Кузнецов Д.Р.', phone: '+7 (495) 143-66-77', address: 'г. Москва, ул. Раменки, 15 (ЗАО)', type: 'Бесплатная'},
            {id: 'sch39', name: 'Школа № 1498', status: 'planned', curator: 'Иванов А.А.', phone: '+7 (495) 932-11-88', address: 'г. Москва, Мичуринский пр-т, 23 (ЗАО)', type: 'Бесплатная'},
            {id: 'sch40', name: 'Интеллектуал', status: 'active', curator: 'Васильева Т.М.', phone: '+7 (495) 345-67-89', address: 'г. Москва, Кременчугская ул., 13 (ЗАО)', type: 'Бесплатная'},
            
            // ВАО
            {id: 'sch41', name: 'Школа № 1502 «Энергия»', status: 'active', curator: 'Лебедев В.Н.', phone: '+7 (495) 307-11-22', address: 'г. Москва, ул. Девятая Рота, 14 (ВАО)', type: 'Бесплатная'},
            {id: 'sch42', name: 'Школа № 444', status: 'active', curator: 'Петров В.В.', phone: '+7 (495) 465-33-44', address: 'г. Москва, Нижняя Первомайская ул., 14 (ВАО)', type: 'Бесплатная'},
            {id: 'sch43', name: 'Школа № 2036', status: 'planned', curator: 'Морозова И.П.', phone: '+7 (495) 700-11-55', address: 'г. Москва, ул. Татьяны Макаровой, 2 (ВАО)', type: 'Бесплатная'},
            {id: 'sch44', name: 'Школа № 2033', status: 'active', curator: 'Соколова А.И.', phone: '+7 (495) 461-22-33', address: 'г. Москва, Щелковское ш., 26 (ВАО)', type: 'Бесплатная'},
            {id: 'sch45', name: 'Школа «АртСтарт» МАСИ', status: 'archived', curator: 'Николаев А.Б.', phone: '+7 (495) 222-11-99', address: 'г. Москва, Волгоградский пр-т (ВАО / ЮВАО)', type: 'Платная'},
            {id: 'sch46', name: 'Вешняковская лингвистическая гимназия № 1389', status: 'active', curator: 'Волков К.А.', phone: '+7 (495) 374-11-22', address: 'г. Москва, ул. Молдагуловой, 13 (ВАО)', type: 'Бесплатная'},
            {id: 'sch47', name: 'Гимназия № 1290', status: 'planned', curator: 'Зайцева Е.А.', phone: '+7 (495) 465-66-77', address: 'г. Москва, Измайловский б-р, 41 (ВАО)', type: 'Бесплатная'},
            {id: 'sch48', name: 'Гимназия № 1508 (Измайловская)', status: 'active', curator: 'Алексеев П.П.', phone: '+7 (495) 465-22-11', address: 'г. Москва, Первомайская ул., 65 (ВАО)', type: 'Бесплатная'},
            {id: 'sch49', name: 'Гимназия № 1530 "Школа Ломоносова"', status: 'active', curator: 'Григорьева Н.С.', phone: '+7 (495) 268-33-44', address: 'г. Москва, ул. Стромынка, 11 (ВАО)', type: 'Бесплатная'},
            {id: 'sch50', name: 'Гимназия № 1798 "Феникс"', status: 'planned', curator: 'Макарова О.П.', phone: '+7 (495) 301-55-66', address: 'г. Москва, Зеленый пр-т, 75 (ВАО)', type: 'Бесплатная'}
        ];

    } catch(e) {
        console.error("FATAL ERROR IN LOADDATA:", e);
        alert("Ошибка загрузки данных: " + e.message);
    }
}
