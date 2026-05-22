import os
import re

dir_path = "."
pattern = re.compile(r'(\.from\([^)]+\)[^;]*)', re.IGNORECASE)

for file in os.listdir(dir_path):
    if file.endswith(".html"):
        path = os.path.join(dir_path, file)
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        
        matches = pattern.findall(content)
        if matches:
            print(f"\n--- {file} ---")
            for match in matches[:30]:
                cleaned = re.sub(r'\s+', ' ', match.strip())
                print(f"  {cleaned[:150]}")
