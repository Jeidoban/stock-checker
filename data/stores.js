module.exports = [
    {
        "name": "Playstation Direct",
        "URL": "https://direct.playstation.com/en-us/consoles/console/playstation5-console.3005816",
        "selectors": [
            "body > div.root.responsivegrid > div > div.heropdp.background-white.aem-GridColumn.aem-GridColumn--default--12 > producthero-component > div > div > div.productHero-desc.col-lg-6.order-lg-2 > producthero-info > div > div.button-placeholder > div.out-stock-wrpr.js-login-to-purchase",
            "body > div.root.responsivegrid > div > div.heropdp.background-white.aem-GridColumn.aem-GridColumn--default--12 > producthero-component > div > div > div.productHero-desc.col-lg-6.order-lg-2 > producthero-info > div > div.button-placeholder > button"
        ],
        "refreshRate": 5000,
        "tweetTimeoutRate": 600000,
        "pageWaitUntil": "networkidle0",
        "refreshTimeoutRate": 600000,
        "tweet": {
            "inStock": "PS5 might be in stock on Playstation Direct:\n\nDisc: https://direct.playstation.com/en-us/consoles/console/playstation5-console.3005816\nDigital: https://direct.playstation.com/en-us/consoles/console/playstation5-digital-edition-console.3005817",
            "nullTweet": "There may be a Queue on Playstation Direct: https://direct.playstation.com/en-us/consoles/console/playstation5-console.3005816"
        }
    },
    {
        "name": "Amazon",
        "URL": "https://www.amazon.com/PlayStation-5-Console/dp/B08FC5L3RG",
        "selectors": [
            "#availability > span"
        ],
        "refreshRate": 5000,
        "tweetTimeoutRate": 1800000,
        "pageWaitUntil": "domcontentloaded",
        "refreshTimeoutRate": 600000,
        "tweet": {
            "inStock": "PS5 might to be in stock at Amazon:\n\nDisc: https://www.amazon.com/PlayStation-5-Console/dp/B08FC5L3RG\nDigital: https://www.amazon.com/PlayStation-5-Digital/dp/B08FC6MR62/",
            "nullTweet": ""
        }
    },
    {
        "name": "Best Buy",
        "URL": "https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p?skuId=6426149",
        "selectors": [
            ".fulfillment-add-to-cart-button"
        ],
        "refreshRate": 2000,
        "tweetTimeoutRate": 600000,
        "pageWaitUntil": "domcontentloaded",
        "refreshTimeoutRate": 600000,
        "tweet": {
            "inStock": "PS5 might to be in stock at Best Buy:\n\nDisc: https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p?skuId=6426149\nDigital: https://www.bestbuy.com/site/sony-playstation-5-digital-edition-console/6430161.p?skuId=6430161",
            "nullTweet": ""
        }
    },
    {
        "name": "Localhost",
        "URL": "http://localhost:3000",
        "selectors": [
            "body > div > h1"
        ],
        "refreshRate": 5000,
        "tweetTimeoutRate": 10000,
        "pageWaitUntil": "networkidle0",
        "refreshTimeoutRate": 600000,
        "tweet": {
            "inStock": "PS5 appears to be in stock on Playstation Direct:\n\nDisc: https://direct.playstation.com/en-us/consoles/console/playstation5-console.3005816\nDigital: https://direct.playstation.com/en-us/consoles/console/playstation5-digital-edition-console.3005817",
            "nullTweet": ""
        }
    }
]