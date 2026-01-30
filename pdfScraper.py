from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import requests
import os

def scrape_pdfs():
    options = Options()
    options.add_argument("--headless=new")

    driver = webdriver.Chrome(options=options)
    driver.get("https://engineering.arizona.edu/current/4-year-degree")

    WebDriverWait(driver, 15).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, "a[href$='.pdf']"))
    )

    pdf_links = []

    pdf_elements = driver.find_elements(By.CSS_SELECTOR, "a[href$='.pdf']")
    for el in pdf_elements:
        href = el.get_attribute("href")
        year_name=el.get_attribute("title").strip()
        if "2025-2026" in year_name:
            pdf_links.append(href)

    driver.quit()
    return pdf_links

def save_pdf(pdf_list):
    # Folder to save PDFs on Desktop
    desktop_path = os.path.expanduser("~/Desktop")  # This points to your Desktop
    save_folder = os.path.join(desktop_path, "pdfs_engineering")  # Folder on Desktop
    os.makedirs(save_folder, exist_ok=True)

    for url in pdf_list:
        filename = url.split("/")[-1] 
        filepath = os.path.join(save_folder, filename)
        
        # Download (bypass SSL warnings)
        response = requests.get(url, verify=False)
        if response.status_code == 200:
            with open(filepath, "wb") as f:
                f.write(response.content)
            print(f"Downloaded: {filename} to {save_folder}")
        else:
            print(f"Failed to download: {filename}")
def main():
    pdfs = scrape_pdfs()
    print(pdfs)
    print(f"\nTotal PDFs found: {len(pdfs)}")
    save_pdf(pdfs)


main()


    
