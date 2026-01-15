const prisma = require('../utils/prismaClient');

const calculateCampaignTotals = async (req, res) => {

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

        // ACTUALIZAR CAMPAÑA
        const newCampaign = await prisma.campaigns.update({
            where: { id: campaignId },
            data: {
                total_records: totalMessages,
                total_sent: sentMessages,
                total_error: errorMessages,
            }
        });

        return res.status(200).json({
            message: 'Totales de campaña actualizados',
            data: {
                id: newCampaign.id,
                total_records: newCampaign.total_records,
                total_sent: newCampaign.total_sent,
                total_error: newCampaign.total_error,
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const calculateCampaignStatus = async(req, res) => {

    // obtener id de parámetros
    const campaignId = parseInt(req.params.id);

    // ver si campaña existe
    const campaign = await prisma.campaigns.findUnique({
        where:{
            id: campaignId
        }}
    )

    // si no se encontró, devolver error
    if (!campaign){
        return res.status(404).json({
            message: 'Campaña no encontrada'
        })
    }

    // si existe, calcular status
    // actualizar process_status (quedan mensajes pendientes?)
    // ver si hay al menos un mensaje pendiente
    const pendingMessage = await prisma.messages.findFirst({
        where: {
            campaign_id: campaignId,
            shipping_status: 1
        }
    });

    // obtener valor de processStatus antes del resultado para usarlo para final_hour
    const processStatus = pendingMessage ? 1 : 2

    // armamos el objeto que actualizará el campaign 
    const updateCampaign = {
        process_status: processStatus
    }

    // si ya no hay mensajes pendientes (status = 2)
    if (processStatus === 2) {
        // obtener el mensaje de esa campaña con mayor shipping_hour
        const maxShipHourValue = await prisma.messages.aggregate({
            _max: {
                shipping_hour: true,
            },
            where: {
                campaign_id: campaignId,
            }
        });

        // obtener la fecha del valor mayor y asignarlo a objeto de update
        updateCampaign.final_hour = maxShipHourValue._max.shipping_hour;
    }

    // ACTUALIZAR CAMPAÑA
    const newCampaign = await prisma.campaigns.update({
        where: { id: campaignId },
        data: updateCampaign
    });

    // devolver resultado formateando fecha para mostrar solo la hora (visual)
    return res.status(200).json({
        message: 'Status de campaña actualizado',
        data: {
            id: newCampaign.id,
            total_records: newCampaign.total_records,
            total_sent: newCampaign.total_sent,
            total_error: newCampaign.total_error,
            process_status: newCampaign.process_status,
            final_hour: newCampaign.final_hour ? newCampaign.final_hour.toISOString().split('T')[1].split('.')[0]: null,
        }
    });
}

module.exports = {
    calculateCampaignTotals,
    calculateCampaignStatus
};