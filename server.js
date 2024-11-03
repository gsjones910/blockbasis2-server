const express = require('express');
const cors = require('cors');
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
