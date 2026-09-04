import json, re

with open(r'C:\Users\Shresth\.gemini\antigravity-ide\brain\91d7a134-6abb-4cca-bf15-ba4a0f878323\.system_generated\steps\161\content.md', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

# Look for planted anomalies array or data objects
pos = txt.find("CC Road Overlap (Varanasi)")
if pos != -1:
    snippet = txt[max(0, pos - 1500): min(len(txt), pos + 3000)]
    with open('planted_cases_snippet.txt', 'w', encoding='utf-8') as out:
        out.write(snippet)
    print("Found planted cases snippet!")
else:
    print("Not found")
