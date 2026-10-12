from PIL import Image
import os

REF_IMG_PATH = "C:/Users/satoc/.gemini/antigravity/brain/6cd996e4-14cf-43af-a1ce-c7f227b8a562/.user_uploaded/media_1791812977049_92669ab7.jpg"
OUT_DIR = "C:/Users/satoc/.gemini/antigravity/scratch/ia-os-fangkham/public/pigs"

img = Image.open(REF_IMG_PATH).convert("RGBA")
W, H = img.size
print(f"Loaded image {W}x{H}")

# Coordinates: (left, upper, right, lower)
ITEMS = {
    "decor_pasture_barn_raw.png": (760, 50, 955, 335),
    "decor_pasture_apple_tree_raw.png": (660, 80, 770, 270),
    "decor_pasture_lamp_raw.png": (138, 380, 175, 550),
    "decor_pasture_crates_raw.png": (160, 495, 230, 585),
    "decor_pasture_flowerbed_raw.png": (415, 465, 508, 545),
    "decor_pasture_mailbox_raw.png": (548, 480, 588, 565),
    "decor_pasture_trough_raw.png": (820, 350, 888, 405),
}

for name, box in ITEMS.items():
    cropped = img.crop(box)
    dst = os.path.join(OUT_DIR, name)
    cropped.save(dst)
    print(f"Saved {name}: {cropped.size}")
