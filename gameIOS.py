import os
import asyncio
import shutil
import sys
from pyppeteer import launch

async def find_chrome_executable():
    
    possible_paths = [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    ]

    
    for path in possible_paths:
        if shutil.which(path):
            return path

    
    print("Chrome executable not found. Please install Google Chrome.")
    sys.exit(1)

def get_user_profile_path():
    
    base_path = os.path.expanduser('~/Library/Application Support/Google/Chrome')
    profile_path = os.path.join(base_path, 'Profile 1')
    return profile_path

async def main():
    
    executable_path = await find_chrome_executable()

    
    user_profile_dir = get_user_profile_path()

    
    target_url = 'https://falcontheberd.github.io/DigiTechGame/'
    
    browser = await launch(
        headless=False,
        executablePath=executable_path,
        args=[
            "--disable-infobars",
            "--kiosk",  
            f"--user-data-dir={user_profile_dir}",  
        ],
        ignoreDefaultArgs=["--enable-automation", "--enable-blink-features=IdleDetection"],
    )
    
    
    page = (await browser.pages())[0]

    
    await page.goto(target_url)

    
    screen_width, screen_height = await page.evaluate('''() => {
        return [window.screen.width, window.screen.height];
    }''')

    
    await page.setViewport({
        "width": screen_width,
        "height": screen_height,
    })

    
    while len(await browser.pages()) > 0:
        await asyncio.sleep(1)

    
    await browser.close()


asyncio.get_event_loop().run_until_complete(main())
