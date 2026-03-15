// ===================== SUBJECTS MODULE =====================
function renderSubjects() {
    let ht = `
        <div class="mb-6 flex justify-between items-center max-w-4xl mx-auto">
            <h2 class="text-2xl font-black text-slate-800">Управление предметами</h2>
            <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl text-[15px] font-black shadow-sm transition-all flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Новый предмет
            </button>
        </div>
        
        <div class="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">`;
        
    state.subjects.forEach(subj => {
        ht += `
        <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-all group cursor-pointer relative overflow-hidden">
            <div class="w-12 h-12 rounded-2xl mb-4 shadow-inner" style="background-color: ${subj.color}"></div>
            <div class="font-black text-lg text-slate-800 leading-tight">${subj.name}</div>
            <div class="text-xs font-bold text-slate-400 mt-1 uppercase">ID: ${subj.id}</div>
            
            <div class="absolute inset-0 bg-slate-900/5 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button class="w-10 h-10 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                </button>
                <button class="w-10 h-10 bg-white text-rose-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
            </div>
        </div>
        `;
    });
        
    ht += `</div>`;
    return ht;
}
