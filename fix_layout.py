import os
import re

directory = r"d:\Tech\protfolio\resources\js\Pages\Admin"

for filename in os.listdir(directory):
    if not filename.endswith(".jsx"): continue
    path = os.path.join(directory, filename)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find component name
    comp_match = re.search(r"export default function\s+([A-Za-z0-9_]+)", content)
    if not comp_match: continue
    comp_name = comp_match.group(1)

    # Find AdminLayout title
    layout_match = re.search(r'<AdminLayout(?:\s+title="([^"]+)")?>', content)
    if not layout_match: continue
    
    title = layout_match.group(1)
    
    # Replace the opening <AdminLayout ...> with <>
    content = content.replace(layout_match.group(0), '<>')
    # Replace the closing </AdminLayout> with </>
    content = re.sub(r'</AdminLayout>', '</>', content)

    # Append the layout definition
    if title:
        layout_def = f"\n{comp_name}.layout = page => <AdminLayout title=\"{title}\">{{page}}</AdminLayout>;\n"
    else:
        layout_def = f"\n{comp_name}.layout = page => <AdminLayout>{{page}}</AdminLayout>;\n"

    if layout_def not in content:
        content += layout_def

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
