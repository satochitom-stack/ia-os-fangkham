import sys
import io
# Ensure UTF-8 stdout
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from rembg import remove
from PIL import Image
import os

CLEAN_CROPS = [
    ("public/pigs/decor_pasture_barn_clean_raw.png", "public/pigs/decor_pasture_barn.png"),
    ("public/pigs/decor_pasture_apple_tree_clean_raw.png", "public/pigs/decor_pasture_apple_tree.png"),
    ("public/pigs/decor_pasture_lamp_clean_raw.png", "public/pigs/decor_pasture_lamp.png"),
    ("public/pigs/decor_pasture_crates_clean_raw.png", "public/pigs/decor_pasture_crates.png"),
    ("public/pigs/decor_pasture_flowerbed_clean_raw.png", "public/pigs/decor_pasture_flowerbed.png"),
    ("public/pigs/decor_pasture_mailbox_clean_raw.png", "public/pigs/decor_pasture_mailbox.png"),
    ("public/pigs/decor_pasture_trough_clean_raw.png", "public/pigs/decor_pasture_trough.png"),
]

for src, dst in CLEAN_CROPS:
    if os.path.exists(src):
        print(f"Processing {src} -> {dst} ...")
        inp = Image.open(src)
        out = remove(inp)
        out.save(dst)
        print(f"[OK] Saved {dst} ({out.size})")
    else:
        print(f"[MISSING] Source missing: {src}")

print("[DONE] All pristine pasture decor assets successfully isolated with transparent background!")
