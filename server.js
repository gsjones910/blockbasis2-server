const express = require('express');
const cors = require('cors');
const axios = require('axios');
const puppeteer = require('puppeteer');
const { BeehiivClient } = require('@beehiiv/sdk');
const app = express();
const port = 3000;
const fs = require('fs');
const { makingData } = require('./makingData');

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
        const result = await axios({
            method: "get", url: url, headers: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
            }
        });
        return result.data;
    } catch (error) {
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
    fs.writeFileSync('./data/audit_defisafety.json', JSON.stringify(defisafetyData, null, 4));

    res.json({ count: defisafetyData.length, data: defisafetyData });
});

app.get('/api/get_defi', async (req, res) => {
    const defiURL = "https://api.de.fi/v1/rekt/list?sortField=fundsLost&sort=desc&sortDirection=desc&limit=4000&page=0"

    let defiData = []

    var defiRes = await getData(defiURL)
    if (defiRes) {
        defiData = defiRes.items
    }
    fs.writeFileSync('./data/hack_defi.json', JSON.stringify(defiData, null, 4));

    res.json({ count: defiData.length, data: defiData });
});

app.get('/api/get_defillama', async (req, res) => {
    let defillamaData = []

    const browser = await puppeteer.launch();

    try {
        const page = await browser.newPage();

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36');

        await page.goto('https://defillama.com/hacks', { waitUntil: 'domcontentloaded', timeout: 10000 });

        const url_num = await page.evaluate(() => {
            const scripts = document.querySelectorAll('script');

            for (let script of scripts) {
                if (script.src.includes('_buildManifest.js')) {
                    const match = script.src.match(/\/(\d+\.\d+)\//);
                    if (match) {
                        return match[1];
                    }
                }
            }
            return null;
        });

        await page.goto("https://defillama.com/_next/data/" + url_num + "/hacks.json", { waitUntil: 'domcontentloaded', timeout: 10000 });

        const data = await page.evaluate(() => JSON.parse(document.querySelector('pre').textContent));
        if (data) {
            defillamaData = data.pageProps.data
        }
    } catch (error) {
        console.log(error)
    }

    await browser.close();
    fs.writeFileSync('./data/hack_defillama.json', JSON.stringify(defillamaData, null, 4));

    res.json({ count: defillamaData.length, data: defillamaData });
});

async function fetchDataWithRetry(page, url, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
            const data = await page.evaluate(() => JSON.parse(document.querySelector('pre').textContent));
            return data;
        } catch (error) {
            if (attempt === maxRetries) {
                return null;
            }
            
            const waitTime = Math.pow(2, attempt) * 1000;
            console.log(`Attempt ${attempt} failed. Retrying in ${waitTime/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
}

app.get('/api/get_certik', async (req, res) => {
    const certikURL = "https://skynet.certik.com/api/leaderboard-all-projects/query-leaderboard-projects?isClientOnly=true&limit=50&skip="

    let certikData = []
    let totalCount = 4000

    const browser = await puppeteer.launch();

    try {
        const page = await browser.newPage();

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36');

        try {
            await page.goto('https://skynet.certik.com/leaderboards/pre-launch', { waitUntil: 'domcontentloaded', timeout: 10000 });
        } catch (error) {
            console.log(error)
        }

        const data = await fetchDataWithRetry(page, certikURL);
        totalCount = data.page.total;
        console.log('totalCount==========', totalCount)

        for (let i = 0; i < totalCount; i += 50) {
            if (i == 2500) {
                try {
                    await page.goto('https://skynet.certik.com/leaderboards/security', { waitUntil: 'domcontentloaded', timeout: 10000 });
                } catch (error) {
                    console.log(error)
                }
            }
            const url = certikURL + i;

            const data = await fetchDataWithRetry(page, url);

            if (data) {
                certikData = certikData.concat(data.items)
                console.log('skip===========', i)
            }
        }
    } catch (error) {
        console.log(error)
    }

    await browser.close();
    fs.writeFileSync('./data/audit_certik.json', JSON.stringify(certikData, null, 4));

    res.json({ count: certikData.length, data: certikData });
});

app.get('/api/read_defisafety', async (req, res) => {
    const linksData_defisafety = fs.readFileSync('./data/audit_defisafety.json');
    const links_defisafety = JSON.parse(linksData_defisafety);

    res.json({ count: links_defisafety.length, data: links_defisafety });
});

app.get('/api/set_data', async (req, res) => {
    await makingData();
    res.json({ data: '' });
});

app.get('/api/read_audits', async (req, res) => {
    const audits = fs.readFileSync('./result/audits.json');
    const auditsData = JSON.parse(audits);
    res.json({ data: auditsData });
});

app.get('/api/read_hacks', async (req, res) => {
    const hacks = fs.readFileSync('./result/hacks.json');
    const hacksData = JSON.parse(hacks);
    res.json({ data: hacksData });
});

app.get('/api/read_projects', async (req, res) => {
    const projects = fs.readFileSync('./result/projects.json');
    const projectsData = JSON.parse(projects);
    res.json({ data: projectsData });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
