const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding realistic data...');
  await prisma.expense.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.driver.deleteMany();

  const driver1 = await prisma.driver.create({
    data: { name: 'Alice Driver', licenseNumber: 'DL-111', licenseCategory: 'LMV', licenseExpiryDate: new Date('2028-01-01'), contactNumber: '555-1111', status: 'AVAILABLE', safetyScore: 95 }
  });
  const driver2 = await prisma.driver.create({
    data: { name: 'Bob Driver', licenseNumber: 'DL-222', licenseCategory: 'HMV', licenseExpiryDate: new Date('2028-01-01'), contactNumber: '555-2222', status: 'AVAILABLE', safetyScore: 88 }
  });

  // Create a couple of vehicles (with moderate acquisition costs so ROI can be positive quickly for demo)
  const vehicle1 = await prisma.vehicle.create({
    data: { registrationNumber: 'VH-100', model: 'Transit Van', type: 'Van', maxCapacityKg: 1000, odometer: 15000, acquisitionCost: 50000, status: 'AVAILABLE' }
  });
  const vehicle2 = await prisma.vehicle.create({
    data: { registrationNumber: 'VH-200', model: 'Heavy Truck', type: 'Truck', maxCapacityKg: 5000, odometer: 45000, acquisitionCost: 120000, status: 'AVAILABLE' }
  });

  // Create completed trips with high revenue
  const trip1 = await prisma.trip.create({
    data: { source: 'New York', destination: 'Boston', tripNumber: 'TRIP-001', cargoWeightKg: 800, plannedDistance: 350, revenue: 45000, status: 'COMPLETED', vehicleId: vehicle1.id, driverId: driver1.id, createdAt: new Date() }
  });
  const trip2 = await prisma.trip.create({
    data: { source: 'Los Angeles', destination: 'San Francisco', tripNumber: 'TRIP-002', cargoWeightKg: 4000, plannedDistance: 600, revenue: 125000, status: 'COMPLETED', vehicleId: vehicle2.id, driverId: driver2.id, createdAt: new Date() }
  });
  const trip3 = await prisma.trip.create({
    data: { source: 'Chicago', destination: 'Detroit', tripNumber: 'TRIP-003', cargoWeightKg: 900, plannedDistance: 450, revenue: 65000, status: 'COMPLETED', vehicleId: vehicle1.id, driverId: driver1.id, createdAt: new Date() }
  });

  // Create some small expenses and fuel logs
  await prisma.fuelLog.create({ data: { vehicleId: vehicle1.id, tripId: trip1.id, liters: 40, cost: 4000, logDate: new Date() } });
  await prisma.fuelLog.create({ data: { vehicleId: vehicle2.id, tripId: trip2.id, liters: 120, cost: 12000, logDate: new Date() } });

  await prisma.expense.create({ data: { vehicleId: vehicle1.id, tripId: trip1.id, type: 'TOLL', amount: 500 } });
  await prisma.expense.create({ data: { vehicleId: vehicle2.id, tripId: trip2.id, type: 'ALLOWANCE', amount: 2000 } });

  console.log('Seed complete! Revenue: 235k, Cost: ~18.5k, Vehicle Acq: 170k -> ROI will be strongly positive.');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
