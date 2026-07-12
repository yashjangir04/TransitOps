const prismaClient = require('../config/db');

const createDriver = async (request, response) => {
  try {
    const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber } = request.body;

    const existingDriverRecord = await prismaClient.driver.findUnique({
      where: { licenseNumber: licenseNumber }
    });

    if (existingDriverRecord) {
      return response.status(400).json({ error: 'A driver with this license number already exists' });
    }

    const newDriverRecord = await prismaClient.driver.create({
      data: {
        name: name,
        licenseNumber: licenseNumber,
        licenseCategory: licenseCategory,
        licenseExpiryDate: new Date(licenseExpiryDate), 
        contactNumber: contactNumber
      }
    });

    response.status(201).json({ message: 'Driver created successfully', data: newDriverRecord });
  } catch (error) {
    response.status(500).json({ error: 'Internal server error while creating driver' });
  }
};

const getAllDrivers = async (request, response) => {
  try {
    const allDriverRecords = await prismaClient.driver.findMany({
      include: {
        trips: {
          where: {
            status: { in: ['COMPLETED', 'CANCELLED'] }
          },
          select: { status: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedDriverProfiles = allDriverRecords.map((driverData) => {
      const totalAssignedTrips = driverData.trips.length;
      const completedTrips = driverData.trips.filter(trip => trip.status === 'COMPLETED').length;

      let completionRatePercentage = 100; 
      if (totalAssignedTrips > 0) {
        completionRatePercentage = Math.round((completedTrips / totalAssignedTrips) * 100);
      }

      // Remove the raw trips array and inject the calculated percentage string
      const { trips, ...driverDetails } = driverData;
      
      return {
        ...driverDetails,
        tripCompletionRate: `${completionRatePercentage}%`
      };
    });

    response.json({ message: 'Drivers retrieved successfully', data: formattedDriverProfiles });
  } catch (error) {
    response.status(500).json({ error: 'Internal server error while fetching drivers' });
  }
};

const updateDriverStatus = async (request, response) => {
  try {
    const { driverId } = request.params;
    const { newStatus } = request.body;

    const updatedDriverRecord = await prismaClient.driver.update({
      where: { id: parseInt(driverId) },
      data: { status: newStatus }
    });

    response.json({ message: 'Driver status updated successfully', data: updatedDriverRecord });
  } catch (error) {
    response.status(500).json({ error: 'Internal server error while updating driver status' });
  }
};

const getAvailableDrivers = async (request, response) => {
  try {
    const availableDriverRecords = await prismaClient.driver.findMany({
      where: { status: 'AVAILABLE' },
      orderBy: { createdAt: 'desc' }
    });

    response.json({ message: 'Available drivers retrieved successfully', data: availableDriverRecords });
  } catch (error) {
    response.status(500).json({ error: 'Internal server error while fetching available drivers' });
  }
};

module.exports = { createDriver, getAllDrivers, updateDriverStatus , getAvailableDrivers };