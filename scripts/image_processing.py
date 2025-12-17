import requests
from PIL import Image
from io import BytesIO
import os
from colorthief import ColorThief


def image_download(job_folder, url):
    image_save_path = os.path.join(job_folder, "cover.png")

    response = requests.get(url)
    print(response)

    if response.status_code != 200:
        print("BAD IMAGE LINK")
        return None

    img = Image.open(BytesIO(response.content)).convert("RGB")

    TARGET = 700
    w, h = img.size

    scale = TARGET / min(w, h)
    new_w = int(w * scale)
    new_h = int(h * scale)

    img = img.resize((new_w, new_h), Image.LANCZOS)

    # Center-crop to 700x700
    left = (new_w - TARGET) // 2
    top = (new_h - TARGET) // 2
    right = left + TARGET
    bottom = top + TARGET

    img = img.crop((left, top, right, bottom))

    img.save(image_save_path, format="PNG", optimize=True)

    return image_save_path
   

#--------------------------------------- EXTRACTING COLORS FROM PNG

def image_extraction(job_folder):
    image_import_path = os.path.join(job_folder,'cover.png')

    extractionimg = ColorThief(image_import_path) # setup image for extraction

    palette = extractionimg.get_palette(color_count=2) # getting the 4 most dominant colours
    colorshex = []

    for r,g,b in palette: 
        hexvalue = '#' + format(r,'02x') + format(g,'02x') + format(b,'02x')# convert rgb values into hex
        colorshex.append(hexvalue)

    return colorshex