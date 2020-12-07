const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const stores = require('./data/stores')
const express = require('express');
const timeout = require('await-timeout');
const Twitter = require('twitter-lite');
const args = require('yargs').argv;

const app = express();
const client = new Twitter({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token_key: process.env.access_token_key,
    access_token_secret: process.env.access_token_secret
});
let browser
const storenumber = args.storenumber
const userstore = args.userstore
const PORT = process.env.PORT || args.port || 8080;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
    startup()
})

app.get('/send-test-tweet', (req, res) => {
    client.post('statuses/update', {
        status: `Test tweet!\n\nat: ${new Date().toUTCString()}`
    })
        .then(result => {
            res.send("Tweet successful!")
            console.log(result)
        })
        .catch(error => {
            res.send("Tweet successful!")
            console.log(error)
        })
})

async function startup() {
    browser = await puppeteer.launch({ headless: true, userDataDir: __dirname + '/' + userstore || '/user_store', defaultViewport: { width: 1024, height: 768 } })

    if (typeof storenumber === 'undefined') {
        for (const store of stores) {
            createPage(store)
        }
    } else {
        createPage(stores[storenumber])
    }
}

async function createPage(store) {
    try {
        var page = await browser.newPage()
        await page.goto(store.URL, { waitUntil: store.pageWaitUntil, timeout: store.refreshTimeoutRate })
        var previousHTML = await grabNewHtml()
        var inStockTweetId = null
        var nullTweetId = null

        if (!previousHTML) {
            console.log(`Closing ${store.name} due to null selector. This was the first attempt at grabbing site HTML`)
            console.log("PAGE HTML:")
            console.log(await page.content())
            await page.close()
            return
        }
    } catch (error) {
        console.log(error)
        console.log(await page.content())
        await page.close()
        console.log('Creating new instance of ' + store.name)
        createPage(store)
        return
    }

    while (true) {
        try {
            await timeout.set(store.refreshRate)
            await page.reload({ waitUntil: store.pageWaitUntil, timeout: store.refreshTimeoutRate })
            let newHTML = await grabNewHtml()

            if (!newHTML) {
                if (await page.content() !== '<html><head></head><body></body></html>') {
                    if (store.tweet.nullTweet) {
                        nullTweetId = await sendTweet(store.tweet.nullTweet, nullTweetId)
                        console.log("PAGE HTML:")
                        console.log(await page.content())
                        console.log("NULL TWEET TEXT:")
                        console.log(store.tweet.nullTweet)
                        await timeout.set(store.tweetTimeoutRate)
                    } else {
                        console.log(`Closing ${store.name} due to null selector`)
                        console.log("PAGE HTML:")
                        console.log(await page.content())
                        await page.close()
                        console.log('Creating new instance of ' + store.name)
                        createPage(store)
                        return
                    }
                }
            } else {
                if (newHTML.localeCompare(previousHTML) !== 0) {
                    inStockTweetId = await sendTweet(store.tweet.inStock, inStockTweetId)
                    console.log("OLD HTML:")
                    console.log(previousHTML)
                    console.log("NEW HTML:")
                    console.log(newHTML)
                    console.log("TWEET TEXT:")
                    console.log(store.tweet.inStock)
                    await timeout.set(store.tweetTimeoutRate)
                } else {
                    console.log(store.name + " unchaged as of " + new Date().toUTCString())
                }
            }
        } catch (error) {
            console.log(error)
            await page.close()
            console.log('Creating new instance of ' + store.name)
            createPage(store)
            return
        }
    }

    async function grabNewHtml() {
        const html = await page.content()
        const $ = cheerio.load(html)
        let htmlString = ''

        for (let selector of store.selectors) {
            const elem = $(selector)
            elemHtml = $.html(elem)
            if (elemHtml) {
                htmlString += `${elemHtml}\n`
            } else {
                return null
            }
        }

        return htmlString
    }

    async function sendTweet(tweetText, tweetID) {
        try {
            let result = await client.post('statuses/update', {
                status: `${tweetText}\n\nat: ${new Date().toUTCString()}`
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