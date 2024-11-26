const express = require('express');
const cors = require('cors');
const axios = require('axios');
const puppeteer = require('puppeteer');
const { BeehiivClient } = require('@beehiiv/sdk');
const app = express();
const port = 3000;

app.use(cors({
    origin: ['https://scan.blockbasis.com', 'https://walletscanner.com']
    // origin: '*'
}));

app.use(express.json());

app.post('/api/beehiiv_getByEmail', async (req, res) => {
    const { token, publicationId, userEmail } = req.body;

    const client = new BeehiivClient({ token: token });
    const response = await client.subscriptions.getByEmail(publicationId, userEmail);

    const isPremium = response.data.subscriptionPremiumTierNames.includes('Premium Subscription');

    res.json({ isPremium: isPremium });
});

async function getData(url) {
    try {
        const result = await axios({ method: "get", url: url, headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
        }});
        return result.data;
    } catch (error) {
        return null;
    }
}

async function getDataNN(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36');

    try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 120000 });
        const data = await page.evaluate(() => JSON.parse(document.querySelector('pre').textContent));
        await browser.close();
        return data;
    } catch (error) {
        console.log(error)
        await browser.close();
        return null;
    }
}

app.get('/api/get_defisafety', async (req, res) => {
    const defisafetyURLs = [
        "https://www.defisafety.com/api/pqrs?offset=0&order=DESC&orderBy=default&status=Active&title=",
        "https://www.defisafety.com/api/pqrs?offset=20&order=DESC&orderBy=default&status=Active&title="
    ]

    let defisafetyData = []

    for (const defisafetyURL of defisafetyURLs) {
        var result = await getData(defisafetyURL)
        if (result) {
            defisafetyData = defisafetyData.concat(result.data)
        }
    }

    res.json({ data: defisafetyData });
});

app.get('/api/get_defi', async (req, res) => {
    const defiURL = "https://api.de.fi/v1/rekt/list?sortField=fundsLost&sort=desc&sortDirection=desc&limit=4000&page=0"

    let defiData = []

    var defiRes = await getData(defiURL)
    if (defiRes) {
        defiData = defiRes.items
    }

    res.json({ data: defiData });
});

app.get('/api/get_defillama', async (req, res) => {
    const defillamaURL = "https://defillama.com/_next/data/0.1766176428499524/hacks.json"

    let defillamaData = []

    var defillamaRes = await getDataNN(defillamaURL)
    if (defillamaRes) {
        defillamaData = defillamaRes.pageProps.data
    }

    res.json({ data: defillamaData });
});

app.get('/api/get_certik', async (req, res) => {
    const certikURL = "https://skynet.certik.com/api/leaderboard-all-projects/query-leaderboard-projects?isClientOnly=true&limit=50&skip="

    let certikData = []

    for (let i = 0; i < 4000; i+= 50) {
        const url = certikURL + i;
        var result = await getDataNN(url)
        if (result) {
            certikData = certikData.concat(result.items)
        }
    }

    res.json({ data: certikData });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
