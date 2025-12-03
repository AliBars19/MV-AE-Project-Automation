import requests
import os
import yaml
import json
import time
from playwright.sync_api import sync_playwright

# ---------------- CONFIG LOAD ----------------
config_file = "database/config.yaml"

if not os.path.exists(config_file):
    raise FileNotFoundError("Your config file has been moved or deleted")

with open(config_file, "r") as f:
    cfg = yaml.safe_load(f)

db_path = cfg.get("db_path", "videodb.json")

required_keys = ['channels', 'db_path', 'genres']
missing = [key for key in required_keys if key not in cfg]
if missing:
    raise KeyError(f"Missing keys in config: {missing}")

# Load DB
if os.path.exists(db_path):
    with open(db_path, "r", encoding="utf-8") as f:
        data = json.load(f)
else:
    data = []


def extract_username(url):

    url = url.strip()

    if "tiktok.com" in url:
        # split at @ and take last part
        return url.split("@")[-1].replace("/", "")
    if url.startswith("@"):
        return url[1:]
    return url


def get_user_videos(username, headless=False):
    print(f"  Opening TikTok profile for @{username}...")

    profile_url = f"https://www.tiktok.com/@{username}"

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=headless,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--disable-infobars",
                "--no-sandbox",
                "--disable-gpu",
                "--start-maximized"
            ]
        )

        context = browser.new_context(
            viewport={"width": 1600, "height": 900},
            locale="en-US",
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/122.0.0.0 Safari/537.36"
            )
        )

        page = context.new_page()

        page.goto(profile_url, timeout=60000)
        page.wait_for_timeout(4000)

        if "verify" in page.url:
            print("Captcha triggered — run with headless=False and move mouse once.")
            browser.close()
            return []

        print("  Scrolling profile to load all videos...")

        links = set()
        unchanged_loops = 0
        last_count = 0

        while True:
            for _ in range(8):
                delta = 200 + int(os.urandom(1)[0] / 255 * 300)
                page.mouse.wheel(0, delta)
                page.wait_for_timeout(150 + int(os.urandom(1)[0] / 255 * 200))

            new_links = page.eval_on_selector_all(
                "a[href*='/video/']",
                "els => els.map(e => e.href.split('?')[0])"
            )

            for link in new_links:
                if "/video/" in link:
                    links.add(link)

            if len(links) > last_count:
                last_count = len(links)
                unchanged_loops = 0
            else:
                unchanged_loops += 1

            if unchanged_loops >= 12:
                break

            page.evaluate("window.scrollBy(0, document.body.scrollHeight * 0.2);")
            page.wait_for_timeout(1200)

        browser.close()

    print(f"  ✔ Collected {len(links)} video URLs")
    return list(links)


all_links = []

for chan_url in cfg["channels"]:
    username = extract_username(chan_url)
    print(f"\nScraping videos from @{username}...")

    vids = get_user_videos(username)
    all_links.extend(vids)

print("\nFINAL VIDEO LIST:")
print(all_links)

# Next Steps:
# - You can now run metadata extraction
# - Genre detection
# - Save to DB
