const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prismaClient = new PrismaClient();

async function executeDatabaseSeeding() {
  console.log('Initiating database seeding...');

  const systemRoles = ['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'];
  
  for (const currentRoleName of systemRoles) {
    const existingRoleRecord = await prismaClient.role.findFirst({
      where: { name: currentRoleName }
    });

    if (!existingRoleRecord) {
      await prismaClient.role.create({
        data: {
          name: currentRoleName,
          permissions: []
        }
      });
      console.log(`Successfully created role: ${currentRoleName}`);
    }
  }

  const defaultSystemUsers = [
    { email: 'fleetmanager@gmail.com', name: 'Fleet Manager', roleName: 'FLEET_MANAGER' },
    { email: 'dispatcher@gmail.com', name: 'Dispatcher', roleName: 'DISPATCHER' },
    { email: 'safetyofficer@gmail.com', name: 'Safety Officer', roleName: 'SAFETY_OFFICER' },
    { email: 'financialanalyst@gmail.com', name: 'Financial Analyst', roleName: 'FINANCIAL_ANALYST' }
  ];

  const defaultPasswordHash = await bcrypt.hash('password123', 10);
  for (const userData of defaultSystemUsers) {
    const associatedRoleRecord = await prismaClient.role.findFirst({
      where: { name: userData.roleName }
    });

    if (associatedRoleRecord) {
      const existingUserRecord = await prismaClient.user.findUnique({
        where: { email: userData.email }
      });

      if (!existingUserRecord) {
        await prismaClient.user.create({
          data: {
            email: userData.email,
            passwordHash: defaultPasswordHash,
            name: userData.name,
            roleId: associatedRoleRecord.id
          }
        });
        console.log(`Successfully created user account: ${userData.email}`);
      } else {
        console.log(`User account already exists: ${userData.email}`);
      }
    }
  }

  console.log('Database seeding completed.');
}

executeDatabaseSeeding()
  .catch((seedingError) => {
    console.error('Seeding failed:', seedingError);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });