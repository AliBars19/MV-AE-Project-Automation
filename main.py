from pytube import YouTube # for audio extraction
import yt_dlp

import requests # for image extraction
from PIL import Image
from io import BytesIO






mp3URL = str(input("Enter Audio URL"))
imgurl = str(input("Enter Image URL"))

#------------------------------------------- EXTRACTING AUDIO
#'''
ydl_opts = {
    'format': 'mp3/bestaudio/best',
    'postprocessors': [{  # Extract audio using ffmpeg
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
    }]
}

with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    error_code = ydl.download(mp3URL)
#'''
#---------------------------------------- EXTRACTING PNG
#'''
if __name__ == '__main__':
    
    response = requests.get(imgurl)
    print(response)
    if response.status_code == 200:
        img = Image.open(BytesIO(response.content))
        img.save('C:/Users/aliba/Downloads/MacbookVisuals/MV-AE-Project-Automation/image.png')
    else:
        print("BAD IMAGE LINK")
#'''
#--------------------------------------- EXTRACTING COLORS FROM PNG
