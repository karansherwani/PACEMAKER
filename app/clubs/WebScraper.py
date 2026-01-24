from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException
import json

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
    
    description_text=None
    img_url=None
    club_url=None
    name = el.get_attribute("aria-label")

    unregistered = False
    try:
        badge_text = el.find_element(By.CSS_SELECTOR, "span.badge.badge-warning").text.strip()
        if badge_text == "Group Not Registered Yet":
            unregistered = True
    except NoSuchElementException:
        pass

    if unregistered!=True:
        try:
            club_url = el.find_element(By.CSS_SELECTOR, "a[target='_blank']").get_attribute("href").strip()
        except NoSuchElementException:
            club_url=None
        try:
            description_text=el.find_element(By.CSS_SELECTOR,"p.h5.media-heading.grey-element").text
        except NoSuchElementException:
            pass
        try:
            img_url = el.find_element(By.CSS_SELECTOR, "img.media-object.media-object--bordered").get_attribute("src")
        except NoSuchElementException:
            pass
        
        if name:
            clubs.append({"name":name.strip(),
                          "Description":description_text,
                          "Image":img_url,
                          "Url":club_url})

driver.quit()

with open("clubs.json","w",encoding="utf-8") as file:
    json.dump(clubs,file,indent=4,ensure_ascii=False)
