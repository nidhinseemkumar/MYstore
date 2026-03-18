const { chromium } = require('playwright');
(async () => {
    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log('CONSOLE ERROR:', msg.text());
            }
        });
        page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
        await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);
        await browser.close();
    } catch (e) {
        console.error(e);
    }
})();
