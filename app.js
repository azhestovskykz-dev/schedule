// ===================== ROUTER & APP CORE =====================
function render() {
    updateNavStyles();
    const area = document.getElementById('content-area');
    
    switch(state.section) {
        case 'schedule': area.innerHTML = renderSchedule(); break;
        case 'tasks': area.innerHTML = renderTasks(); break;
        case 'analytics': area.innerHTML = renderAnalytics(); break;
        case 'finance': area.innerHTML = renderFinance(); break;
        case 'subjects': area.innerHTML = renderSubjects(); break;
        case 'teachers': area.innerHTML = renderTeachers(); break;
        default: area.innerHTML = '<div class="p-8 text-center">404</div>';
    }
}

function updateNavStyles() {
    const sections = ['schedule','tasks','analytics','finance','subjects','teachers'];
    sections.forEach(s => {
        const btn = document.getElementById(`nav-${s}`);
        if(btn) {
            if(state.section === s) {
                btn.className = 'nav-btn active-nav bg-indigo-600 text-white font-bold shadow-md';
            } else {
                btn.className = 'nav-btn bg-white text-slate-500 hover:bg-slate-50 border border-slate-200 font-bold';
            }
        }
    });
}

window.setSection = (sec) => {
    state.section = sec;
    render();
}

window.onload = () => {
    if(typeof loadData === 'function') loadData();
    render();
};
