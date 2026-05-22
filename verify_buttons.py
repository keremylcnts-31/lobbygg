import os
import re

workspace = r"C:\Users\Casper\.gemini\antigravity\scratch\lobbygg"
html_files = [f for f in os.listdir(workspace) if f.endswith('.html')]

for fname in html_files:
    if fname == "verify_buttons.py":
        continue
    path = os.path.join(workspace, fname)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all button elements
    buttons = re.findall(r'<button[^>]*>', content)
    print(f"File: {fname}")
    for btn in buttons[:10]:
        print(f"  {btn.strip()}")
    if len(buttons) > 10:
        print(f"  ... and {len(buttons) - 10} more")
