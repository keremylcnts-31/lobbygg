import os
import re

dir_path = "."
pattern = re.compile(r'(const\s+(db|sb)\s*=\s*supabase\.createClient\([^)]*\))', re.IGNORECASE)

for file in os.listdir(dir_path):
    if file.endswith(".html"):
        path = os.path.join(dir_path, file)
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        
        matches = pattern.findall(content)
        if matches:
            print(f"File {file} defines Supabase client: {matches}")
        else:
            print(f"File {file} does NOT define Supabase client or matches pattern.")
