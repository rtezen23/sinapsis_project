const express = require('express');
// controllers
const campaignRouter = require('./routes/campaign.route');
const customerRouter = require('./routes/customer.route');

const app = express();

app.use(express.json())

app.use('/api/v1/campaigns', campaignRouter)
app.use('/api/v1/customers', customerRouter)

module.exports = app