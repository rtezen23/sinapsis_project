const express = require('express');
// controllers
const campaignRouter = require('./routes/campaign.route');

const app = express();

app.use(express.json())

app.use('/api/v1/campaigns', campaignRouter)

module.exports = app