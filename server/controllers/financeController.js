const prismaClient = require('../config/db');

// Fuel Management

const addFuelLog = async (request, response) => {
  try {
    const { liters, cost, vehicleId, tripId } = request.body;

    const newFuelRecord = await prismaClient.fuelLog.create({
      data: {
        liters: liters,
        cost: cost,
        vehicleId: vehicleId,
        tripId: tripId || null 
      }
    });

    response.status(201).json({ message: 'Fuel record added successfully', data: newFuelRecord });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal server error while logging fuel' });
  }
};

const getAllFuelLogs = async (request, response) => {
  try {
    const fuelRecords = await prismaClient.fuelLog.findMany({
      include: {
        vehicle: { select: { registrationNumber: true } },
        trip: { select: { tripNumber: true } }
      },
      orderBy: { logDate: 'desc' }
    });

    response.json({ message: 'Fuel logs retrieved successfully', data: fuelRecords });
  } catch (error) {
    response.status(500).json({ error: 'Internal server error while fetching fuel logs' });
  }
};

// Expense Management

const addExpense = async (request, response) => {
  try {
    const { type, amount, vehicleId, tripId } = request.body;
    const newExpenseRecord = await prismaClient.expense.create({
      data: {
        type: type,
        amount: amount,
        vehicleId: vehicleId,
        tripId: tripId
      }
    });

    response.status(201).json({ message: 'Expense added successfully', data: newExpenseRecord });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal server error while logging expense' });
  }
};

const getAllExpenses = async (request, response) => {
  try {
    const expenseRecords = await prismaClient.expense.findMany({
      include: {
        vehicle: { select: { registrationNumber: true } },
        trip: { select: { tripNumber: true } }
      },
      orderBy: { expenseDate: 'desc' }
    });

    response.json({ message: 'Expenses retrieved successfully', data: expenseRecords });
  } catch (error) {
    response.status(500).json({ error: 'Internal server error while fetching expenses' });
  }
};

module.exports = { addFuelLog, getAllFuelLogs, addExpense, getAllExpenses };