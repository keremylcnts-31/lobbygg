import os
import re

dir_path = "."
# regex to find href="/..." or src="/..." or window.location.href = "/..."
patterns = [
    re.compile(r'href=["\']/[^/][^"\']*["\']'),
    re.compile(r'src=["\']/[^/][^"\']*["\']'),
    re.compile(r'location\.href\s*=\s*["\']/[^/][^"\']*["\']'),
    re.compile(r'location\.replace\s*\(\s*["\']/[^/][^"\']*["\']\s*\)')
]

for file in os.listdir(dir_path):
    if file.endswith(".html"):
        path = os.path.join(dir_path, file)
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        
        matches = []
        for line_num, line in enumerate(content.splitlines(), 1):
            for pat in patterns:
                m = pat.search(line)
                if m:
                    matches.append((line_num, line.strip(), m.group(0)))
                    break
        
        if matches:
            print(f"\n--- {file} ({len(matches)} absolute paths) ---")
            for num, text, match in matches:
                print(f"  Line {num}: {text} (Matched: {match})")
