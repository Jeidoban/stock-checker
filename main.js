const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from App Engine!');
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

// (async function() {
//     const browser = await puppeteer.launch({ headless: true, /*executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',*/ userDataDir: 'data', defaultViewport: {width: 1024, height: 768}})

//     async function determineElementExistence(URL, selector) {
//         let page = await browser.newPage()
//         await page.goto(URL)
//         let elem = await page.$(selector)
//         await page.close()
//         return elem !== null    
//     }
    
//     async function runSonyDirect() {
//         return await determineElementExistence(
//             'https://direct.playstation.com/en-us/consoles/console/playstation5-console.3005816',
//             'div.productHero-info button[data-product-code="3005816"]:not(.hide), div.productHero-info div.js-login-to-purchase:not(.hide)'
//         )
//     }
    
//     async function runSonyDirectController() {
//         return await determineElementExistence(
//             'https://direct.playstation.com/en-us/accessories/accessory/dualsense-wireless-controller.3005715',
//             'div.productHero-info button[data-product-code="3005715"]:not(.hide), div.productHero-info div.js-login-to-purchase:not(.hide)'
//         )
//     }
    
//     const resultArr = await Promise.all([
//         runSonyDirect(),
//         runSonyDirectController()
//     ])

//     for (const item of resultArr) {
//         console.log("In stock: " + item)
//     }

//     browser.close()
// })()


