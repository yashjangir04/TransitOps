const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');
const driverRoutes = require('./routes/driverRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const financeRoutes = require('./routes/financeRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/maintenance', maintenanceRoutes);
 

const port = process.env.PORT || 3000;

// Bonus Feature: Email Reminders for Expiring Licenses
const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

cron.schedule('0 8 * * *', async () => {
  console.log('Running daily license expiry check...');
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const expiringDrivers = await prisma.driver.findMany({
      where: {
        licenseExpiry: {
          lte: thirtyDaysFromNow,
          gte: new Date()
        }
      }
    });

    if (expiringDrivers.length > 0) {
      console.log(`[ALERT] Found ${expiringDrivers.length} drivers with licenses expiring soon!`);
      expiringDrivers.forEach(d => {
        // Mock email sending
        console.log(`--> Sending email reminder to Admin for driver: ${d.name} (License: ${d.licenseNumber} expires on ${d.licenseExpiry})`);
      });
    }
  } catch (err) {
    console.error('Failed to run license expiry cron job', err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});