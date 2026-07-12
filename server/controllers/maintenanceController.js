const prismaClient = require('../config/db');
 
exports.getMaintenanceLogs = async (req, res) => {
    try {
        const logs = await prismaClient.maintenanceLog.findMany({
            include: {
                vehicle: {
                    select: {
                        registrationNumber: true,
                        model: true,
                        status: true
                    }
                }
            },
            orderBy: {
                logDate: 'desc'
            }
        });

        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

exports.createMaintenanceLog = async (req, res) => {
    try {
        const { vehicleId, serviceType, cost, logDate, status } = req.body;

        const vehicle = await prismaClient.vehicle.findUnique({
            where: { id: parseInt(vehicleId) }
        });

        if (!vehicle) {
            return res.status(404).json({ success: false, error: 'Vehicle not found' });
        }

        const [maintenanceLog, updatedVehicle] = await prismaClient.$transaction([
            prismaClient.maintenanceLog.create({
                data: {
                    vehicleId: parseInt(vehicleId),
                    serviceType,
                    cost: parseFloat(cost),
                    logDate: logDate ? new Date(logDate) : new Date(),
                    status: status ? status.toUpperCase() : 'ACTIVE' 
                }
            }),
            prismaClient.vehicle.update({
                where: { id: parseInt(vehicleId) },
                data: { status: 'IN_SHOP' }
            })
        ]);

        res.status(201).json({ 
            success: true, 
            data: maintenanceLog,
            message: `Record created. Vehicle ${updatedVehicle.registrationNumber} moved to IN_SHOP.`
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.updateMaintenanceLog = async (req, res) => {
    try {
        const logId = parseInt(req.params.id);
        const { status, cost, serviceType } = req.body;

        const currentLog = await prismaClient.maintenanceLog.findUnique({
            where: { id: logId },
            include: { vehicle: true }
        });

        if (!currentLog) {
            return res.status(404).json({ success: false, error: 'Maintenance log not found' });
        }

        let updateData = {};
        if (status) updateData.status = status.toUpperCase();
        if (cost) updateData.cost = parseFloat(cost);
        if (serviceType) updateData.serviceType = serviceType;

        if (status && status.toUpperCase() === 'CLOSED' && currentLog.vehicle.status !== 'RETIRED') {
            const [updatedLog] = await prismaClient.$transaction([
                prismaClient.maintenanceLog.update({
                    where: { id: logId },
                    data: updateData
                }),
                prismaClient.vehicle.update({
                    where: { id: currentLog.vehicleId },
                    data: { status: 'AVAILABLE' }
                })
            ]);
            
            return res.status(200).json({ success: true, data: updatedLog });
        }

        const updatedLog = await prismaClient.maintenanceLog.update({
            where: { id: logId },
            data: updateData
        });

        res.status(200).json({ success: true, data: updatedLog });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};