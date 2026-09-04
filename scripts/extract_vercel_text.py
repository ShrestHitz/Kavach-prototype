import re

with open(r'C:\Users\Shresth\.gemini\antigravity-ide\brain\91d7a134-6abb-4cca-bf15-ba4a0f878323\.system_generated\steps\161\content.md', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

keywords = ['Shielding', 'Varanasi', 'Explore Network', 'Detection Radar', 'Audit Dossier', 'Launch AI', 'Fund Journey', 'FOUR LAYERS', 'Z-Score', 'Live Audit Command Console', 'Verification Lab', 'Planted', '18 Planted Cases', 'Four Layers of Protection']
found = set()
for match in re.findall(r'"([^"\\]{8,100})"', txt):
    if any(k.lower() in match.lower() for k in keywords):
        found.add(match)

with open('extracted_sections.txt', 'w', encoding='utf-8') as out:
    for item in sorted(found):
        out.write(item + '\n')

print(f"Extracted {len(found)} strings to extracted_sections.txt")
