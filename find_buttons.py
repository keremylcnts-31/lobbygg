import os
import re

dir_path = "."
button_pattern = re.compile(r'<button[^>]*>', re.IGNORECASE)

for file in os.listdir(dir_path):
    if file.endswith(".html"):
        path = os.path.join(dir_path, file)
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        
        buttons = button_pattern.findall(content)
        if buttons:
            print(f"\n--- {file} ({len(buttons)} button tags) ---")
            for btn in buttons[:15]:
                print("  ", btn.strip())
            if len(buttons) > 15:
                print("  ...")
