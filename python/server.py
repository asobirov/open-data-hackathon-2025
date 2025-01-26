from parsera import Parsera
from langchain_groq import ChatGroq
from playwright.async_api import Page
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from patchright.async_api import async_playwright
import asyncio

llm = ChatGroq(
    model="llama3-70b-8192",
    temperature=0.4,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)

app = FastAPI()


# Define an async main function
async def scrape_company_data(company_id: str):
    async with async_playwright() as p:
        # Launch the browser (use headless=True if you want a headless browser)
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()

        # 1. Go to the search page
        await page.goto(f"https://myorg.uz/en/search?query={company_id}")

        # 2. Click the search result link
        await page.locator(
            "xpath=/html/body/div[1]/main/div/div/div[2]/div/div/div/div[2]/div/a"
        ).click()
        await page.wait_for_load_state("networkidle")

        # 3. Extract myorg_id from the clicked page
        myorg_id = page.url.split("/")[-1]

        async def initial_script(page: Page) -> Page:
            """Logs in one time only (if needed)."""

            await page.goto("https://myorg.uz/en/log-in")
            await page.wait_for_load_state("networkidle")
            # Wait for form elements
            await page.locator(
                "xpath=/html/body/div[1]/header/div/div/div/nav/button[2]"
            ).wait_for()
            await page.locator(
                "xpath=/html/body/div[1]/main/div/div/form/div[1]/div/input"
            ).fill("said24abdi04@gmail.com")
            await page.locator(
                "xpath=/html/body/div[1]/main/div/div/form/div[2]/div/input"
            ).fill("%hGjArRwvzE2r4")
            await page.locator(
                "xpath=/html/body/div[1]/main/div/div/form/button"
            ).click()
            await page.wait_for_load_state("networkidle")

            return page

        async def repeating_script(page: Page) -> Page:
            """Executes on every subsequent navigation to keep the session alive."""
            await page.reload()
            await page.wait_for_timeout(1500)
            return page

        # Elements to be scraped from main page
        elements = {
            "company_name": "Name of the company",
            "company_inn": "Unique number (ИНН) of the company",
            "registration_date": "Date the company was registered",
            "director_name": "Name of the company's director",
            "business_activity": "Type of business activity the company is engaged in",
            "region": "Region or location of the company",
            "address": "Full address of the company",
            "email_address": "Email address (Электронные адреса)",
            "contact_number": "Company's contact phone number (Контактные телефоны)",
            "fund": "Уставной фонд компании/Company's charter fund",
            "rating": "Рейтинг устойчивости",
            "registration_number": "Номер регистрации (e.g. 1987718)",
            "registration_center": "Орган, в котором зарегистрирована компания (e.g. Управление юстиции области)",
            "enterprise_category": "Категория предприятия (e.g. Large enterprise, Small enterprise, etc)",
            "is_small_business_subject": "Принадлежность к субъектам малого предпринимательства (True/False)",
            "taxation_type": "Вид налогообложения (e.g. Плательщик НДС)",
            "vat_certificate_number": "Номер сертификата НДС (e.g. 306010000427)",
            "opf": "Организационно-правовая форма (e.g. Акционерное общество)",
            "opf_code": "Код ОПФ (e.g. 153)",
            "coato": "СОАТО (full text including address)",
            "soogu": "СООГУ (e.g. 79994)",
            "tax_debt": "Налоговая задолженность (e.g. 1,535.01 UZS)",
            "is_large_taxpayer": "Является ли крупным налогоплательщиком (True/False)",
            "has_license": "Наличие лицензии (True/False)",
            "misuses_vat_reduction": "Злоупотребляет правом уменьшения суммы НДС (True/False)",
            "is_it_park_resident": "Является резидентом IT Парка (True/False)",
            "government_procurement_rating": "Рейтинг участников электронной системы государственных закупок",
            "construction_contractor_industry_rating": "Рейтинг отраслевых строительных подрядных организаций",
            "unscrupulous_registry_status": "Входит ли в единый реестр недобросовестных исполнителей (True/False)",
        }

        # Initialize Parsera with the LLM and the script for the first-time login
        scrapper = Parsera(model=llm, initial_script=initial_script)

        # ===============================
        #  First extraction: Company page
        # ===============================
        url = f"https://myorg.uz/en/company/uz/{myorg_id}"
        result = await scrapper.arun(
            url=url, elements=elements, playwright_script=repeating_script
        )
        print(url)
        print(result)

        # ===============================
        #  Second extraction: Connections
        # ===============================
        url_connections = f"https://myorg.uz/en/company/uz/{myorg_id}/connections"
        result2 = await scrapper.arun(
            url=url_connections,
            elements={
                "connections": [
                    {
                        "connection_inn": "connection's INN",
                        "connection_names": "array of connection's names",
                        "reason": "reasons for the connection",
                    }
                ],
            },
            playwright_script=repeating_script,
        )
        print(url_connections)
        print(result2)

        # Close Parsera's browser context
        await scrapper.loader.close()

        # Close Playwright browser
        await browser.close()

        # ===============================
        #  Merge both dictionaries here
        # ===============================

        merged_result = [{**result[0], **result2[0]}]
        return merged_result

    await async_playwright()


@app.get("/scrape/{company_id}")
async def scrape_endpoint(company_id: str):
    try:
        result = await scrape_company_data(company_id)
        if not result:
            raise HTTPException(status_code=404, detail="Company data not found")
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
