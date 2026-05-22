import os
import re
import sys

# Set standard output encoding to utf-8 if possible, or just ignore errors.
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

dir_path = "."
patterns = [
    re.compile(r"document\.createElement\(['\"]button['\"]\)"),
    re.compile(r"<button", re.IGNORECASE),
    re.compile(r"classList\.add\(['\"][^'\"]*btn[^'\"]*['\"]\)"),
    re.compile(r"class=['\"][^'\"]*btn[^'\"]*['\"]")
]

for file in os.listdir(dir_path):
    if file.endswith(".html"):
        path = os.path.join(dir_path, file)
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        
        matches = []
        for line_num, line in enumerate(content.splitlines(), 1):
            for pat in patterns:
                if pat.search(line):
                    matches.append((line_num, line.strip()))
                    break
        
        if matches:
            print(f"\n=== {file} ({len(matches)} matches) ===")
            for num, text in matches[:25]:
                print(f"  Line {num}: {text[:100]}")
            if len(matches) > 25:
                print("  ...")
