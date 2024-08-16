import os
import asyncio
import shutil
import sys
from pyppeteer import launch

async def find_chrome_executable():
    # Define common installation paths
    possible_paths = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
    ]

    # Check if chrome.exe exists in the common paths
    for path in possible_paths:
        if shutil.which(path):
            return path

    # If not found, exit the script with an error
    print("Chrome executable not found. Please install Google Chrome.")
    sys.exit(1)

def get_user_profile_path():
    # Construct the user profile path dynamically
    base_path = os.path.expanduser(r'~\AppData\Local\Google\Chrome\User Data')
    profile_path = os.path.join(base_path, 'Profile 1')
    return profile_path

async def main():
    # Find the chrome.exe path automatically
    executable_path = await find_chrome_executable()

    # Get the dynamically constructed user profile directory
    user_profile_dir = get_user_profile_path()

    # Set the URL you want to open directly
    target_url = 'https://falcontheberd.github.io/DigiTechGame/'
    
    browser = await launch(
        headless=False,
        executablePath=executable_path,
        args=[
            "--disable-infobars",
            "--kiosk",  # Launch the browser in kiosk mode
            f"--user-data-dir={user_profile_dir}",  # Use the dynamically constructed profile path
        ],
        ignoreDefaultArgs=["--enable-automation", "--enable-blink-features=IdleDetection"],
    )
    
    # Get the first page opened by the browser
    page = (await browser.pages())[0]

    # Navigate to the target URL
    await page.goto(target_url)

    # Dynamically retrieve screen dimensions
    screen_width, screen_height = await page.evaluate('''() => {
        return [window.screen.width, window.screen.height];
    }''')

    # Maximize the viewport to match the screen dimensions
    await page.setViewport({
        "width": screen_width,
        "height": screen_height,
    })

    # Keep the browser running until all pages are closed
    while len(await browser.pages()) > 0:
        await asyncio.sleep(1)

    # Close the browser once all pages are closed
    await browser.close()

# Run the async function
asyncio.get_event_loop().run_until_complete(main())
