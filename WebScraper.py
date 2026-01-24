from fastapi import FastAPI
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException
from fastapi.responses import JSONResponse
import json
import time
import os

app = FastAPI()

# Cache variables
CACHE_FILE = "clubs.json"
CACHE_DURATION = 60 * 60  # 1 hour
last_scrape_time = 0
cached_clubs = []

def scrape_clubs_selenium():
    """Run Selenium to scrape clubs and return list of dicts"""
    options = Options()
    options.add_argument("--headless=new")

    driver = webdriver.Chrome(options=options)
    driver.get("https://arizona.campusgroups.com/club_signup?view=all&group_type=9999")

    WebDriverWait(driver, 15).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, "li.list-group-item div[role='group']"))
    )

    clubs = []
    elements = driver.find_elements(By.CSS_SELECTOR, "li.list-group-item div[role='group']")
    for el in elements:
        description_text = None
        img_url = None
        club_url = None
        name = el.get_attribute("aria-label")

        # Skip unregistered groups
        try:
            badge_text = el.find_element(By.CSS_SELECTOR, "span.badge.badge-warning").text.strip()
            if badge_text == "Group Not Registered Yet":
                continue
        except NoSuchElementException:
            pass

        try:
            club_url = el.find_element(By.CSS_SELECTOR, "a[target='_blank']").get_attribute("href").strip()
        except NoSuchElementException:
            club_url = None

        try:
            description_text = el.find_element(By.CSS_SELECTOR, "p.h5.media-heading.grey-element").text
        except NoSuchElementException:
            description_text = None

        try:
            img_url = el.find_element(By.CSS_SELECTOR, "img.media-object.media-object--bordered").get_attribute("src")
        except NoSuchElementException:
            img_url = None

        if name:
            clubs.append({
                "name": name.strip(),
                "description": description_text or "No description available.",
                "url": club_url or "",
                "image": img_url or ""
            })

    driver.quit()

    # Save to JSON cache
    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(clubs, f, indent=4, ensure_ascii=False)

    return clubs

@app.get("/clubs")
def get_clubs():
    """Return cached clubs if recent, else scrape again"""
    global last_scrape_time, cached_clubs

    now = time.time()

    # Load cache from file if exists
    if os.path.exists(CACHE_FILE):
        if not cached_clubs:  # only load once into memory
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                cached_clubs = json.load(f)

    # Scrape if cache is old or empty
    if not cached_clubs or now - last_scrape_time > CACHE_DURATION:
        cached_clubs = scrape_clubs_selenium()
        last_scrape_time = now

    return JSONResponse(content=cached_clubs)
