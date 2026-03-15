import re

# Read app.js
with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all duplicate function definitions and remove the SECOND occurrence
# We need to find the second renderTodayTabs and second renderWeekKanban blocks

def remove_second_function(content, func_name):
    """Remove the second occurrence of a function definition"""
    pattern = r'function\s+' + func_name + r'\s*\('
    matches = list(re.finditer(pattern, content))
    
    if len(matches) < 2:
        print(f"  {func_name}: only {len(matches)} occurrence(s), skipping")
        return content
    
    # We want to remove the SECOND occurrence
    second_start = matches[1].start()
    
    # Find the end of this function by counting braces
    brace_count = 0
    func_end = second_start
    started = False
    for i in range(second_start, len(content)):
        if content[i] == '{':
            brace_count += 1
            started = True
        elif content[i] == '}':
            brace_count -= 1
            if started and brace_count == 0:
                func_end = i + 1
                break
    
    # Also eat trailing whitespace/newlines
    while func_end < len(content) and content[func_end] in '\r\n\t ':
        func_end += 1
    
    removed_text = content[second_start:func_end]
    print(f"  {func_name}: removing second occurrence ({len(removed_text)} chars, lines ~{content[:second_start].count(chr(10))+1}-{content[:func_end].count(chr(10))+1})")
    
    content = content[:second_start] + content[func_end:]
    return content

print("Removing duplicate function definitions...")
content = remove_second_function(content, 'renderTodayTabs')
content = remove_second_function(content, 'renderWeekKanban')

# Verify no more duplicates
for fn in ['renderTodayTabs', 'renderWeekKanban', 'renderWeek2Kanban', 'renderWeek3Kanban', 
           'render', 'loadData', 'buildGridView', 'renderAnalytics', 'renderSettings']:
    count = len(re.findall(r'function\s+' + fn + r'\s*\(', content))
    status = "OK" if count == 1 else f"WARNING: {count} definitions!"
    print(f"  function {fn}: {status}")

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("\nDone! File cleaned.")
