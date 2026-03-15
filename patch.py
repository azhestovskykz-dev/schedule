import subprocess

app_js = open('app.js', 'r', encoding='utf-8').read()

# get missing from git
out = subprocess.check_output(['git', 'show', 'bbdddf7b5ed36da7ee4d57bd7dc4d8faf3413e0f:app.js']).decode('utf-8')
missing_renderTodayTabs = out[out.find('function renderTodayTabs'):out.find('function renderWeekKanban')]
missing_renderWeekKanban = out[out.find('function renderWeekKanban'):out.find('function renderWeek2Kanban')]

# find where it should go in app.js
insert_point = app_js.find('function renderWeek2Kanban')

if insert_point != -1 and missing_renderTodayTabs and missing_renderWeekKanban:
    new_app = app_js[:insert_point] + missing_renderTodayTabs + missing_renderWeekKanban + app_js[insert_point:]
    
    # Also I need to check renderAnalytics
    
    with open('app.js', 'w', encoding='utf-8') as f:
        f.write(new_app)
    print("RESTORED MISSING UI TABS")
else:
    print("COULD NOT FIND INJECTION POINT")
