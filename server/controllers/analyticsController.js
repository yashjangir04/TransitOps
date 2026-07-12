const prismaClient = require('../config/db');

const getDashboardSummary = async (request, response) => {
  try {
    const vehicleStats = await prismaClient.vehicle.groupBy({
      by: ['status'],
      _count: { status: true }
    });

    const tripStats = await prismaClient.trip.aggregate({
      _count: { id: true },
      _sum: { revenue: true, plannedDistance: true }
    });

    const expenseStats = await prismaClient.expense.aggregate({
      _sum: { amount: true }
    });

    const fuelStats = await prismaClient.fuelLog.aggregate({
      _sum: { cost: true, liters: true }
    });

    const fleetStatus = vehicleStats.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, { AVAILABLE: 0, ON_TRIP: 0, IN_SHOP: 0, RETIRED: 0 });

    const totalRev = tripStats._sum.revenue || 0;
    const totalExp = expenseStats._sum.amount || 0;
    const totalFuel = fuelStats._sum.cost || 0;

    response.json({
      success: true,
      data: {
        fleet: fleetStatus,
        trips: {
          totalCount: tripStats._count.id,
          totalRevenue: totalRev,
          totalPlannedDistance: tripStats._sum.plannedDistance || 0
        },
        finances: {
          totalExpenses: totalExp,
          totalFuelCost: totalFuel,
          totalFuelLiters: fuelStats._sum.liters || 0,
          netProfit: totalRev - totalExp - totalFuel // calculates profit
        }
      }
    });

  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, error: 'Internal server error while generating analytics' });
  }
};

module.exports = { getDashboardSummary };