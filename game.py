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

async def main():
    # Find the chrome.exe path automatically
    executable_path = await find_chrome_executable()

    # Set the URL you want to open directly
    target_url = 'https://falcontheberd.github.io/DigiTechGame/'  # Replace with your desired URL
    
    browser = await launch(
        headless=False,
        executablePath=executable_path,
        args=[
            "--disable-infobars",
            "--kiosk",  # Launch the browser in kiosk mode
            target_url,  # Open the desired URL directly
        ],
        ignoreDefaultArgs=["--enable-automation", "--enable-blink-features=IdleDetection"],
    )
    
    # Get the first page opened by the browser
    page = (await browser.pages())[0]

    # Dynamically retrieve screen dimensions
    screen_width, screen_height = await page.evaluate('''() => {
        return [window.screen.width, window.screen.height];
    }''')

    # Maximize the viewport to match the screen dimensions
    await page.setViewport({
        "width": screen_width,
        "height": screen_height,
    })

    # Monitor browser pages and close the script when all pages are closed
    while len(await browser.pages()) > 0:
        await asyncio.sleep(1)

    # Close the browser once all pages are closed
    await browser.close()

# Run the async function
asyncio.get_event_loop().run_until_complete(main())
