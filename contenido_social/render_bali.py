import asyncio
from playwright.async_api import async_playwright
import os

async def export_carrusel():
    print("Iniciando exportación de Carrusel BALI con Playwright...")
    html_path = f"file:///{os.path.abspath('carruseles/04_carrusel_bali.html')}"
    export_dir = "carrusel_bali_export"
    
    if not os.path.exists(export_dir):
        os.makedirs(export_dir)
        
    async with async_playwright() as p:
        # device_scale_factor = 2 (Retina display quality)
        browser = await p.chromium.launch()
        page = await browser.new_page(device_scale_factor=2)
        
        await page.goto(html_path)
        
        # Ocultar el botón antes de exportar
        await page.evaluate("document.querySelector('.dl-bar').style.display = 'none'")
        
        # Encontrar todos los slides
        slides = await page.locator('.slide').all()
        print(f"Se encontraron {len(slides)} slides para exportar.")
        
        for i, slide in enumerate(slides):
            num_str = str(i + 1).zfill(2)
            filepath = os.path.join(export_dir, f"04_bali_slide_{num_str}.png")
            
            await slide.screenshot(path=filepath, type="png")
            print(f"Guardado: {filepath} (Alta Resolución 2x)")
            
        await browser.close()
        print("\n¡Exportación completada exitosamente!")

if __name__ == "__main__":
    asyncio.run(export_carrusel())
