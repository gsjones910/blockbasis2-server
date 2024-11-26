const express = require('express');
const cors = require('cors');
const axios = require('axios');
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

app.get('/api/get_defillama', async (req, res) => {
    const defillamaURL = "https://defillama.com/_next/data/0.1766176428499524/hacks.json"

    let defillamaData = []

    var defillamaRes = await getData(defillamaURL)
    if (defillamaRes) {
        defillamaData = defillamaRes.pageProps.data
    }

    res.json({ data: defillamaData });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
