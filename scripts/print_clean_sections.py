import sys

with open('extracted_sections.txt', 'r', encoding='utf-8') as f:
    lines = [l.strip() for l in f if not 'planted_type' in l and not ',_.' in l and not ',children:' in l]

for l in lines[:120]:
    sys.stdout.buffer.write((l + '\n').encode('utf-8'))
