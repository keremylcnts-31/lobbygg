import glob
import os

print("CWD:", os.getcwd())
files = glob.glob('*.html')
print("HTML Files found:", files)

for fn in files:
    try:
        with open(fn, 'r', encoding='utf-8') as f:
            content = f.read()
        if 'getSession' in content or 'getUser' in content or 'auth' in content:
            print(f'=== {fn} ===')
            lines = content.splitlines()
            for idx, line in enumerate(lines):
                if 'getSession' in line or 'getUser' in line or 'auth' in line:
                    print(f'{idx+1}: {line.strip()}')
    except Exception as e:
        print(f"Error reading {fn}: {e}")
