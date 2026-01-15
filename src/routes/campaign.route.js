const { Router } = require('express')
const { calculateCampaignTotals, calculateCampaignStatus } = require('../controllers/campaign.controller')

const campaignRouter = Router()

campaignRouter.route('/:id/calculate-totals').put(calculateCampaignTotals)
campaignRouter.route('/:id/calculate-status').put(calculateCampaignStatus)

module.exports = campaignRouter

