const { Router } = require('express')
const { customerMessagesReport } = require('../controllers/customer.controller')

const customerRouter = Router()

// Endpoint de reporte de solo los mensajes EXITOSOS por cliente en un rango de fechas
customerRouter.route('/messages-report').get(customerMessagesReport)

module.exports = customerRouter