import sys

filename = "resources/js/Pages/Dashboard.jsx"
with open(filename, "r") as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "{/* MODAL EDIT DATA TRANSAKSI (Sleek Overlay) */}" in line:
        start_idx = i
        break

if start_idx != -1:
    # the end is the first </div> that matches indent of the editingTx block.
    # but we saw it ends exactly at line 2608.
    for i in range(start_idx, len(lines)):
        if lines[i].strip() == ")}":
            # line 2608 is `                            )}`
            # wait, there's `)}` at the end of the modal.
            if lines[i].startswith("                            )}"):
                end_idx = i
                break

if start_idx != -1 and end_idx != -1:
    modal_lines = lines[start_idx:end_idx+1]
    
    # remove them from original position
    new_lines = lines[:start_idx] + lines[end_idx+1:]
    
    # find where to inject them at the bottom
    # before {/* MODAL TOP UP */}
    inject_idx = -1
    for i, line in enumerate(new_lines):
        if "{/* MODAL TOP UP */}" in line:
            inject_idx = i
            break
            
    if inject_idx != -1:
        new_lines = new_lines[:inject_idx] + modal_lines + new_lines[inject_idx:]
    else:
        print("Could not find MODAL TOP UP")
        sys.exit(1)
        
    with open(filename, "w") as f:
        f.writelines(new_lines)
    print("Modal moved successfully")
else:
    print(f"Could not find start/end: {start_idx}, {end_idx}")

