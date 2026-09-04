with open(r'C:\Users\Shresth\.gemini\antigravity-ide\brain\91d7a134-6abb-4cca-bf15-ba4a0f878323\.system_generated\steps\161\content.md', 'r', encoding='utf-8', errors='ignore') as f:
    s = f.read()

import re
matches = [m.start() for m in re.finditer(r'id:\s*["\']team["\']', s)]
if not matches:
    matches = [m.start() for m in re.finditer(r'team', s, re.I)]

print('Matches found:', len(matches))
for m in matches[:5]:
    print('Match at:', m)
    open(f'team_snippet_{m}.txt', 'w', encoding='utf-8').write(s[m-100:m+2500])
