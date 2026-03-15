// ===================== FINANCE MODULE =====================
function renderFinance() {
    let ht = `
        <div class="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button class="px-5 py-2.5 rounded-2xl text-[14px] font-black shadow-sm transition-all whitespace-nowrap bg-indigo-500 text-white">Все транзакции</button>
        </div>
        <div class="space-y-4 max-w-4xl mx-auto">
            <div class="flex justify-between items-end pb-3 border-b border-slate-200">
                <h2 class="text-2xl font-black text-slate-800">Финансовый журнал</h2>
                <button class="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Добавить
                </button>
            </div>
            
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <table class="w-full text-left text-sm whitespace-nowrap">
                    <thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <tr>
                            <th class="p-4">Категория</th>
                            <th class="p-4">Детали / Абонемент</th>
                            <th class="p-4">Месяц</th>
                            <th class="p-4 text-right">Сумма</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">`;
                    
    state.finances.forEach(f => {
        ht += `<tr class="hover:bg-slate-50 transition-colors">
            <td class="p-4">
                <span class="bg-slate-100 text-slate-600 px-2 py-1 flex items-center gap-2 rounded-lg font-bold w-max">
                    ${f.category}
                </span>
            </td>
            <td class="p-4 font-bold text-slate-700">${f.subcategory}</td>
            <td class="p-4 text-slate-500">${f.month}</td>
            <td class="p-4 font-black ${f.type === 'income' ? 'text-emerald-600' : 'text-rose-600'} text-right">
                ${f.type === 'income' ? '+' : '-'}${fmtNum(f.amount)}
            </td>
        </tr>`;
    });
                    
    ht += `         </tbody>
                </table>
            </div>
        </div>
    `;
    return ht;
}
