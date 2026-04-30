import asyncio
import os
from playwright.async_api import async_playwright

async def main():
    # Folder to save PNGs
    output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "carrusel_red_flags_export"))
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    html_path = f"file:///{os.path.abspath(os.path.join(os.path.dirname(__file__), 'carruseles', '03_carrusel_red_flags.html'))}".replace('\\', '/')

    async with async_playwright() as p:
        # device_scale_factor=2 ensures we get 2160x2700 instead of 1080x1350
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 1200, 'height': 1500},
            device_scale_factor=2
        )
        page = await context.new_page()
        
        print(f"Cargando HTML: {html_path}")
        await page.goto(html_path)
        
        # Wait a bit for fonts to load and svgs to render
        await page.wait_for_timeout(2000)

        slides = await page.locator('.slide').all()
        total = len(slides)
        print(f"Se encontraron {total} slides. Comenzando exportación...")

        for i, slide in enumerate(slides):
            num = str(i + 1).zfill(2)
            filepath = os.path.join(output_dir, f"03_red_flags_slide_{num}.png")
            # Take screenshot of the specific element
            await slide.screenshot(path=filepath)
            print(f"Guardado: {filepath} (Alta Resolución 2x)")

        await browser.close()
        print("\n¡Exportación completada exitosamente!")

if __name__ == "__main__":
    asyncio.run(main())
