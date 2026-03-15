// ===================== FINANCE MODULE =====================

function renderFinance() {
    let ht = `
        <div class="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            ${[1,2,3,4,5,6].map(i => {
                let active = (state.financeView || 1) === i;
                return `<button onclick="state.financeView=${i}; render();" class="px-5 py-2.5 rounded-2xl text-[14px] font-black shadow-sm transition-all whitespace-nowrap ${active ? 'bg-indigo-500 text-white' : 'bg-white text-slate-500 border border-slate-200'}">${i}</button>`;
            }).join('')}
        </div>
        <div class="mb-6 flex justify-between items-center max-w-7xl mx-auto mt-2">
            <h2 class="text-2xl font-black text-slate-800">Финансы</h2>
            <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl text-[15px] font-black shadow-sm transition-all flex items-center gap-2">
                ${ICONS.plus}
                Добавить
            </button>
        </div>
        <div id="finance-content">
            ${renderFinanceContent()}
        </div>
    `;
    return ht;
}

function renderFinanceContent() {
    let view = state.financeView || 1;
    if (view === 1) return viewFinance1_Table();
    if (view === 2) return viewFinance2_CategorySummary();
    if (view === 3) return viewFinance3_Monthly();
    if (view === 4) return viewFinance4_Kanban();
    if (view === 5) return viewFinance5_Grid();
    if (view === 6) return viewFinance6_Micro();
    return '';
}

// --- V1: Table (original) ---
function viewFinance1_Table() {
    let ht = `<div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-x-auto max-w-5xl mx-auto">
        <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr><th class="p-4">Категория</th><th class="p-4">Детали / Абонемент</th><th class="p-4">Месяц</th><th class="p-4 text-right">Сумма</th></tr>
            </thead>
            <tbody class="divide-y divide-slate-100">`;
            
    state.finances.forEach(f => {
        ht += `<tr class="hover:bg-slate-50 transition-colors">
            <td class="p-4"><span class="bg-slate-100 text-slate-600 px-2 py-1 flex items-center gap-2 rounded-lg font-bold w-max">${f.category}</span></td>
            <td class="p-4 font-bold text-slate-700">${f.subcategory}</td>
            <td class="p-4 text-slate-500">${f.month}</td>
            <td class="p-4 font-black ${f.type === 'income' ? 'text-emerald-600' : 'text-rose-600'} text-right">${f.type === 'income' ? '+' : '-'}${fmtNum(f.amount)}</td>
        </tr>`;
    });
    ht += `</tbody></table></div>`;
    return ht;
}

// --- V2: Category Summary ---
function viewFinance2_CategorySummary() {
    let cats = {};
    let totalExp = 0;
    state.finances.filter(f=>f.type==='expense').forEach(f => {
        if(!cats[f.category]) cats[f.category] = { amount: 0, items: [] };
        cats[f.category].amount += f.amount;
        cats[f.category].items.push(f.subcategory);
        totalExp += f.amount;
    });

    let ht = `<div class="max-w-4xl mx-auto space-y-4">`;
    Object.keys(cats).sort((a,b)=>cats[b].amount-cats[a].amount).forEach(cat => {
        let percent = (cats[cat].amount / (totalExp||1)) * 100;
        ht += `<div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div class="flex justify-between items-end mb-3">
                <div class="font-black text-xl text-slate-700">${cat}</div>
                <div class="font-black text-2xl text-rose-500">${fmtNum(cats[cat].amount)} <span class="text-sm text-slate-400">(${percent.toFixed(1)}%)</span></div>
            </div>
            <div class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">`;
        cats[cat].items.forEach(item => {
            ht += `<span class="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-600">${item}</span>`;
        });
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V3: Monthly Dynamics ---
function viewFinance3_Monthly() {
    let months = {};
    state.finances.forEach(f => {
        if(!months[f.month]) months[f.month] = { income: 0, expense: 0 };
        if(f.type === 'income') months[f.month].income += f.amount;
        if(f.type === 'expense') months[f.month].expense += f.amount;
    });

    let ht = `<div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">`;
    Object.keys(months).forEach(m => {
        let inc = months[m].income;
        let exp = months[m].expense;
        let bal = inc - exp;
        ht += `<div class="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm hover:border-indigo-300 transition-colors">
            <h3 class="font-black text-2xl text-slate-800 mb-6 border-b border-slate-100 pb-2">${m}</h3>
            <div class="space-y-4">
                <div class="flex justify-between items-center text-sm font-bold">
                    <span class="text-slate-500">Доходы</span>
                    <span class="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">+${fmtNum(inc)}</span>
                </div>
                <div class="flex justify-between items-center text-sm font-bold">
                    <span class="text-slate-500">Расходы</span>
                    <span class="text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">-${fmtNum(exp)}</span>
                </div>
                <div class="flex justify-between items-center text-sm font-black pt-4 border-t border-slate-100">
                    <span class="text-slate-700">Итого</span>
                    <span class="${bal >= 0 ? 'text-emerald-500' : 'text-rose-500'}">${bal >= 0 ? '+' : ''}${fmtNum(bal)}</span>
                </div>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V4: Kanban Expenses ---
function viewFinance4_Kanban() {
    const expenses = state.finances.filter(f=>f.type==='expense');
    const cols = {
        'Мелкие (до 5к)': expenses.filter(f=>f.amount <= 5000),
        'Средние (5к - 20к)': expenses.filter(f=>f.amount > 5000 && f.amount <= 20000),
        'Крупные (> 20к)': expenses.filter(f=>f.amount > 20000)
    };

    let ht = `<div class="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide items-start">`;
    Object.keys(cols).forEach(col => {
        let total = cols[col].reduce((sum, f) => sum + f.amount, 0);
        ht += `<div class="flex-none w-[320px] snap-center bg-slate-50 rounded-3xl p-4 border border-slate-200">
            <div class="font-black text-[15px] mb-4 text-slate-700 border-b border-slate-200 pb-2">
                ${col} <div class="text-rose-500 mt-1">${fmtNum(total)}</div>
            </div>
            <div class="space-y-3">`;
            
        cols[col].forEach(f => {
            ht += `<div class="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-bold text-slate-400 uppercase bg-slate-50 px-1.5 py-0.5 rounded">${f.category}</span>
                    <span class="font-black text-rose-500">${fmtNum(f.amount)}</span>
                </div>
                <div class="font-bold text-slate-700 text-sm leading-tight">${f.subcategory}</div>
            </div>`;
        });
        
        ht += `</div></div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V5: Grid Compact ---
function viewFinance5_Grid() {
    let ht = `<div class="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">`;
    state.finances.forEach(f => {
        let isInc = f.type === 'income';
        let color = isInc ? 'emerald' : 'rose';
        ht += `<div class="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-32 relative overflow-hidden">
            <div class="absolute top-0 w-full h-1 left-0 bg-${color}-500"></div>
            <div>
                <div class="text-[10px] font-black uppercase text-slate-400 mb-1">${f.category}</div>
                <div class="font-bold text-slate-800 text-[13px] leading-tight line-clamp-2">${f.subcategory}</div>
            </div>
            <div class="mt-auto flex justify-between items-end">
                <span class="text-[10px] font-bold text-slate-400">${f.month}</span>
                <span class="font-black text-[15px] text-${color}-600">${isInc?'+':'-'}${f.amount}</span>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}

// --- V6: Micro List ---
function viewFinance6_Micro() {
    let ht = `<div class="max-w-4xl mx-auto bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden p-2">`;
    state.finances.forEach(f => {
        let isInc = f.type === 'income';
        ht += `<div class="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full flex items-center justify-center font-black ${isInc ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}">
                    ${isInc ? '+' : '-'}
                </div>
                <div class="font-bold text-slate-800 text-sm">
                    ${f.subcategory} <span class="text-xs text-slate-400 font-semibold ml-2 hidden sm:inline-block">${f.category}</span>
                </div>
            </div>
            <div class="flex flex-col items-end">
                <div class="font-black text-sm ${isInc ? 'text-emerald-600' : 'text-slate-800'}">${fmtNum(f.amount)}</div>
                <div class="text-[10px] uppercase font-bold text-slate-400">${f.month}</div>
            </div>
        </div>`;
    });
    ht += `</div>`;
    return ht;
}
