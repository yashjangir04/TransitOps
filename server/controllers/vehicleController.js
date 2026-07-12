const prismaClient = require('../config/db');

exports.getVehicles = async (req, res) => {
    try {
        const { type, status, search } = req.query;
        let whereClause = {};
 
        if (type && type !== 'All') {
            whereClause.type = type;
        }
 
        if (status && status !== 'All') { 
            const enumStatus = status.toUpperCase().replace(' ', '_');
            whereClause.status = enumStatus;
        } 
        
        if (search) {
            whereClause.registrationNumber = {
                contains: search,
                mode: 'insensitive'
            };
        }

        const vehicles = await prismaClient.vehicle.findMany({
            where: whereClause,
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({
            success: true,
            count: vehicles.length,
            data: vehicles
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};
 
exports.createVehicle = async (req, res) => {
    try {
        console.log(req.body);
        const { 
            registrationNumber, 
            model, 
            type, 
            maxCapacityKg, 
            odometer, 
            acquisitionCost, 
            status 
        } = req.body; 

        const existingVehicle = await prismaClient.vehicle.findUnique({
            where: { registrationNumber }
        });

        if (existingVehicle) {
            return res.status(400).json({ 
                success: false, 
                error: 'Vehicle registration number must be unique.' 
            });
        }
 
        const vehicle = await prismaClient.vehicle.create({
            data: {
                registrationNumber,
                model,
                type,
                maxCapacityKg: parseFloat(maxCapacityKg),
                odometer: odometer ? parseFloat(odometer) : 0,
                acquisitionCost: parseFloat(acquisitionCost),
                status: status ? status.toUpperCase().replace(' ', '_') : 'AVAILABLE'
            }
        });

        res.status(201).json({ success: true, data: vehicle });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
exports.updateVehicleStatus = async (req, res) => {
    try {
        const vehicleId = parseInt(req.params.id);
        const { status } = req.body;
        
        const newStatus = status.toUpperCase().replace(' ', '_');

        const updateOperations = [
            prismaClient.vehicle.update({
                where: { id: vehicleId },
                data: { status: newStatus }
            })
        ];

        // If retiring a vehicle, close any active maintenance logs
        if (newStatus === 'RETIRED') {
            updateOperations.push(
                prismaClient.maintenanceLog.updateMany({
                    where: { vehicleId: vehicleId, status: 'ACTIVE' },
                    data: { status: 'CLOSED' }
                })
            );
        }

        const results = await prismaClient.$transaction(updateOperations);
        
        res.status(200).json({ success: true, data: results[0] });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.deleteVehicle = async (req, res) => {
    try {
        const vehicleId = parseInt(req.params.id);
        
        await prismaClient.vehicle.delete({
            where: { id: vehicleId }
        });
        
        res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};