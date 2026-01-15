const { Router } = require('express')
const calculateTotals = require('../controllers/campaign.controller')

const campaignRouter = Router()

campaignRouter.route('/:id/calculate-totals').put(calculateTotals)

module.exports = campaignRouter

