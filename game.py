import asyncio
from pyppeteer import launch

async def main():
    executable_path = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
    
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

    # Perform any localStorage operations or other interactions here
    await page.evaluate('''() => {
        localStorage.setItem('myKey', 'myValue');
    }''')
    
    local_storage_value = await page.evaluate('''() => {
        return localStorage.getItem('myKey');
    }''')
    
    print(f"Value from localStorage: {local_storage_value}")

    # Keep the browser running indefinitely
    while True:
        await asyncio.sleep(3600)  # Sleep for 1 hour in a loop, effectively keeping it running indefinitely

# Run the async function
asyncio.get_event_loop().run_until_complete(main())
