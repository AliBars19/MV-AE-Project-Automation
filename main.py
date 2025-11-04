import requests
import os
import subprocess 
import pytube 
from pytube import YouTube

import json
import yt_dlp

URLS = 'https://youtu.be/95_ccujUKKc?si=1pWhV94UD2CkZUST'

ydl_opts = {
    'format': 'm4a/bestaudio/best',
    # ℹ️ See help(yt_dlp.postprocessor) for a list of available Postprocessors and their arguments
    'postprocessors': [{  # Extract audio using ffmpeg
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'm4a',
    }]
}

with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    error_code = ydl.download(URLS)