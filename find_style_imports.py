import os

dir_path = "."
for file in os.listdir(dir_path):
    if file.endswith(".html"):
        path = os.path.join(dir_path, file)
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        
        has_style = "style.css" in content
        print(f"File {file} imports style.css: {has_style}")
