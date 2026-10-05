import os
import re

def insert_async_keyword(content):
    # This is a basic regex approach that finds functions with 'await' inside them and adds 'async'
    # It might require multiple passes if there are nested functions
    
    lines = content.split('\n')
    for i in range(len(lines)):
        line = lines[i]
        if 'await db.' in line:
            # We need to trace back to find the function declaration
            j = i
            while j >= 0:
                if re.search(r'\bfunction\s+\w+\s*\(', lines[j]) and 'async' not in lines[j]:
                    lines[j] = re.sub(r'\bfunction\b', 'async function', lines[j])
                    break
                if re.search(r'\(.*?\)\s*=>\s*\{', lines[j]) and 'async' not in lines[j]:
                    lines[j] = re.sub(r'(\(.*?\)\s*=>\s*\{)', r'async \1', lines[j])
                    break
                if re.search(r'\b\w+\s*\(.*?\)\s*\{', lines[j]) and 'async' not in lines[j] and 'if' not in lines[j] and 'for' not in lines[j] and 'while' not in lines[j]:
                    # This might be a class method or object method
                    lines[j] = 'async ' + lines[j]
                    break
                j -= 1
    return '\n'.join(lines)

def process_file(filepath):
    print(f"Processing {filepath}")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Make db.get and db.set awaitable
    content = re.sub(r'(?<!await\s)db\.get\(', 'await db.get(', content)
    content = re.sub(r'(?<!await\s)db\.set\(', 'await db.set(', content)
    
    # Add async keyword to functions
    content = insert_async_keyword(content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    import glob
    base_path = "c:/Users/hp/Desktop/Higa-Model-Bording/js"
    files = glob.glob(f"{base_path}/**/*.js", recursive=True)
    for f in files:
        if not f.endswith('db.js') and not f.endswith('auth.js'):
            process_file(f)
    
    # also process app.js if not included
    app_js = "c:/Users/hp/Desktop/Higa-Model-Bording/js/app.js"
    if app_js in files:
        process_file(app_js)
    
    auth_js = "c:/Users/hp/Desktop/Higa-Model-Bording/js/auth.js"
    process_file(auth_js)
