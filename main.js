const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const stores = require('./data/stores.json')
const express = require('express');
const timeout = require('await-timeout');
const Twitter = require('twitter-lite');

const app = express();
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
    startup()
})

let browser
const client = new Twitter({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token_key: process.env.access_token_key,
    access_token_secret: process.env.access_token_secret
});

async function startup() {
    try {
        browser = await puppeteer.launch({ headless: true, userDataDir: 'user_store', defaultViewport: { width: 1024, height: 768 } })
        for (const store of stores) {
            createPage(store)
        }
    } catch(error) {
        console.log(error)
    }
}

async function createPage(store) {
    let page = await browser.newPage()
    await page.goto(store.URL, {waitUntil: 'networkidle0'}) 
    let previousHTML = await grabNewHtml()
    let inStockTweetId = null
    let nullTweetId = null

    if (!previousHTML) {
        console.log(`Closing ${store.name} due to null selector. This was the first attempt at grabbing site HTML`)
        await page.close()
        return
    }

    while (true) {
        await timeout.set(store.refreshRate)
        await page.reload({waitUntil: 'networkidle0'})
        const newHTML = await grabNewHtml()

        if (!newHTML) {
            if (store.tweet.nullTweet) {
                nullTweetId = await sendTweet(store.tweet.nullTweet, nullTweetId)
                console.log(store.tweet.nullTweet)
                await timeout.set(store.tweetTimeoutRate)
            } else {
                console.log(`Closing ${store.name} due to null selector`)
                await page.close()
                return
            }
        } else {
            if (newHTML.localeCompare(previousHTML) !== 0) {
                inStockTweetId = await sendTweet(store.tweet.inStock, inStockTweetId)
                console.log(store.tweet.inStock)
                await timeout.set(store.tweetTimeoutRate)
            } else {
                console.log(store.name + " unchaged as of " + new Date().toUTCString())
            }
        }
    }

    async function grabNewHtml() {
        const html = await page.content()
        const $ = cheerio.load(html)
        return $(store.selector).html()
    }

    async function sendTweet(tweetText, tweetID) {
        try {
            let result = await client.post('statuses/update', {
                status: tweetText
            })
            console.log(result)
            return result.id_str
        } catch (error) {
            console.log(error)
            try {
                let result = await client.post(`statuses/update`, {
                    status: `This still appears to be true: https://twitter.com/Ps5Checker/status/${tweetID}\n\nat: ${new Date().toUTCString()}`
                })
                console.log(result)
                return tweetID
            } catch (error) {
                console.log(error)
            }
        }
    }
}

/*executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',*/