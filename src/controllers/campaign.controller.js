const prisma = require('../utils/prismaClient');

const calculateTotals = async (req, res) => {

    try {
        const campaignId = parseInt(req.params.id);

        // buscar id de campaña en BD
        const campaign = await prisma.campaigns.findUnique({
            where: { id: campaignId }
        });

        // si no existe campaña, devolver error
        if (!campaign) {
            return res.status(404).json({
                message: 'Campaña no encontrada'
            });
        }

        // si existe campaña, calcular los valores solicitados:

        // contar total de mensajes de campaña (tabla messages)
        const totalMessages = await prisma.messages.count({
            where: { campaign_id: campaignId }
        });

        // contar mensajes enviados con éxito
        const sentMessages = await prisma.messages.count({
            where: {
                campaign_id: campaignId,
                shipping_status: 2
            }
        });

        // contar mensajes con error
        const errorMessages = await prisma.messages.count({
            where: {
                campaign_id: campaignId,
                shipping_status: 3
            }
        });

        // actualizar campaña
        const newCampaign = await prisma.campaigns.update({
        where: { id: campaignId },
        data: {
            total_records: totalMessages,
            total_sent: sentMessages,
            total_error: errorMessages
        }
        });

        return res.status(200).json({
            message: 'Totales de campaña actualizados',
            data: {
                id: newCampaign.id,
                total_records: newCampaign.total_records,
                total_sent: newCampaign.total_sent,
                total_error: newCampaign.total_error
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = calculateTotals;