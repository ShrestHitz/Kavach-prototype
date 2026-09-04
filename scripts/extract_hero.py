import sys, re

with open(r'C:\Users\Shresth\.gemini\antigravity-ide\brain\91d7a134-6abb-4cca-bf15-ba4a0f878323\.system_generated\steps\161\content.md', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

# Find component containing "Shielding Funds"
pos = txt.find("Shielding")
if pos != -1:
    snippet = txt[max(0, pos - 500): min(len(txt), pos + 2500)]
    with open('hero_snippet.txt', 'w', encoding='utf-8') as out:
        out.write(snippet)
    print("Found hero snippet!")
else:
    print("Not found")
