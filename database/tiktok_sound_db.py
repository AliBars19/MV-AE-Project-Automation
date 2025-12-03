import requests
import os
import yaml
import json
from TikTokApi import TikTokApi

config_file = "database/config.yaml"

#load config file and check all keys
if not os.path.exists(config_file):
    raise FileNotFoundError(f"Your config file has been moved or deleted")

with open(config_file,'r') as f:
    cfg = yaml.safe_load(f)

db_path = cfg.get("db_path", "videodb.json")

required_keys = ['channels', 'db_path', 'genres']
missing = [key for key in required_keys if key not in cfg ]

if missing:
    raise KeyError("Missing key")

if os.path.exists(db_path):
    with open(db_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
else:
    data = []

def get_user_videos(username):
    with TikTokApi() as api:
        user = api.user(username=username)
        videos = user.videos(count=1000)  # Large number to get all videos

        links = []
        for video in videos:
            info = video.info()
            links.append(f"https://www.tiktok.com/@{username}/video/{info['id']}")
        return links
    

def get_tiktok_metadata(url):
    oembed_url = "https://www.tiktok.com/oembed?url=" + url
    r = requests.get(oembed_url)
    r.raise_for_status()
    return r.json()

allchannels = []
all_links = []

for url in cfg["channels"]:
    links = get_user_videos(url)
    all_links.extend(links)

print(all_links)
#video_url = "https://www.tiktok.com/@macbookvisuals/video/7534624105014758678"
#meta = get_tiktok_metadata(video_url)

#use spotify api to sort into DB
