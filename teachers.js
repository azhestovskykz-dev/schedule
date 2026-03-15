// ===================== TEACHERS MODULE =====================
function renderTeachers() {
    let ht = `
        <div class="mb-6 flex justify-between items-center max-w-5xl mx-auto">
            <h2 class="text-2xl font-black text-slate-800">Преподаватели</h2>
            <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl text-[15px] font-black shadow-sm transition-all flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Добавить
            </button>
        </div>
        
        <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">`;
        
    state.teachers.forEach(t => {
        if(t.id === 't0') return; // Skip "No Teacher"
        
        ht += `
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col h-full bg-gradient-to-b from-white to-slate-50/50">
            <div class="flex gap-4 items-center mb-5">
                <div class="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex justify-center items-center font-black text-2xl shadow-inner">
                    ${t.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <div class="font-black text-xl text-slate-800 leading-tight">${t.name.split(' (')[0]}</div>
                    <div class="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">${t.id}</div>
                </div>
            </div>
            
            <div class="space-y-3 flex-1">
                <div class="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100">
                    <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </div>
                    <div class="font-bold text-slate-700 text-sm">${t.phone || 'Не указан'}</div>
                </div>
                
                <div class="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100">
                    <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                    </div>
                    <div class="font-bold text-slate-700 text-sm">${t.platform || 'Лично'}</div>
                </div>
            </div>
            
            <div class="mt-5 pt-4 border-t border-slate-200/60 flex justify-between items-center">
                <div class="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">${t.cost} ₸ / час</div>
                
                <div class="flex gap-2">
                    <button class="w-9 h-9 bg-white text-indigo-600 rounded-xl flex items-center justify-center border border-slate-200 hover:bg-slate-50 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                    </button>
                    <button class="w-9 h-9 bg-white text-rose-500 rounded-xl flex items-center justify-center border border-slate-200 hover:bg-slate-50 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                </div>
            </div>
        </div>
        `;
    });
        
    ht += `</div>`;
    return ht;
}
