import os
import re

dir_path = "."
button_style_pattern = re.compile(r'\.(btn|mc-btn|pw-toggle|load-more-btn|feed-tab-btn|tab-btn|back-btn|sidebar-new-btn)\s*\{[^}]*\}', re.IGNORECASE)

for file in os.listdir(dir_path):
    if file.endswith(".html"):
        path = os.path.join(dir_path, file)
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        
        matches = button_style_pattern.findall(content)
        if matches:
            print(f"File {file} defines local button styles for: {set(matches)}")
