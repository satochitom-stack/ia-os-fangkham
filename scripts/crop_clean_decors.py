from PIL import Image

orig = Image.open('public/pigs/theme_pasture_with_buildings.jpg')
W, H = orig.size
print(f"Original image size: {W}x{H}")

# Calculate proportional boxes on 1376x768
# Red Barn & Silo:
# in 1024: x around 760..950, y around 50..335
# Proportional: x ~ 1020..1290, y ~ 60..400
barn_box = (1030, 60, 1290, 410)
barn = orig.crop(barn_box)
barn.save('public/pigs/decor_pasture_barn_clean_raw.png')

# Apple tree:
apple_box = (910, 80, 1050, 320)
apple = orig.crop(apple_box)
apple.save('public/pigs/decor_pasture_apple_tree_clean_raw.png')

# Street lamp:
lamp_box = (185, 430, 240, 640)
lamp = orig.crop(lamp_box)
lamp.save('public/pigs/decor_pasture_lamp_clean_raw.png')

# Crates (left road):
crates_box = (220, 560, 315, 680)
crates = orig.crop(crates_box)
crates.save('public/pigs/decor_pasture_crates_clean_raw.png')

# Flower bed (front fence):
flower_box = (560, 530, 690, 640)
flower = orig.crop(flower_box)
flower.save('public/pigs/decor_pasture_flowerbed_clean_raw.png')

# Mailbox:
mailbox_box = (740, 550, 795, 650)
mailbox = orig.crop(mailbox_box)
mailbox.save('public/pigs/decor_pasture_mailbox_clean_raw.png')

# Water trough:
trough_box = (1110, 400, 1205, 470)
trough = orig.crop(trough_box)
trough.save('public/pigs/decor_pasture_trough_clean_raw.png')

print("All clean raw crops saved successfully from pristine 1376x768 image!")
