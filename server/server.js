const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/trips', authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});