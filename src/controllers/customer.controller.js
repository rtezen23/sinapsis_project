const prisma = require('../utils/prismaClient')

const customerMessagesReport = async (req, res) => {

    // obtener fecha de inicio y final
    const { startDate, endDate } = req.query;

    // validar fechas
    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Fecha inicial y final son requeridos' })
    }

    const fromDate = new Date(startDate)
    const toDate = new Date(endDate)

    if (isNaN(fromDate) || isNaN(toDate)) {
        return res.status(400).json({ error: 'Formato de fecha inválido' })
    }

    // obtener reporte en crudo de los clientes (aprovechamos las relaciones indicadas en el schema)
    const customers = await prisma.customers.findMany({
        select: {
            id: true,
            name: true,
            users: {
                select: {
                    campaigns: {
                        where: {
                            process_date: {
                                gte: fromDate,
                                lte: toDate
                            }
                        },
                        select: {
                            total_sent: true
                        }
                    }
                }
            }
        }
    })

    
    // adaptamos el reporte en crudo haciendo agregaciones para obtener la cantidad de mensajes enviados por cliente
    const report = customers.map(customer => {
        let customerTotal = 0

        for (const user of customer.users) {
            for (const campaign of user.campaigns) {
                customerTotal += campaign.total_sent || 0
            }
        }

        return {
            customerId: customer.id,
            customerName: customer.name,
            total_sent: customerTotal
        }
    })

    res.status(200).json(report)

}

module.exports = {
    customerMessagesReport
};