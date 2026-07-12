const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prismaClient = require('../config/db');

const loginUser = async (request, response) => {
  try {
    const { email, password, role } = request.body;
    
    const userRecord = await prismaClient.user.findUnique({
      where: { email },
      include: { role: true }
    });
    
    if (!userRecord) {
      return response.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, userRecord.passwordHash);
    if (!isPasswordValid) {
      return response.status(401).json({ error: 'Invalid credentials' });
    }

    if (userRecord.role.name !== role) {
      return response.status(403).json({ error: 'Selected role does not match user profile' });
    }

    const token = jsonwebtoken.sign(
      { userId: userRecord.id, role: userRecord.role.name , userName: userRecord },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    response.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000
    });

    response.json({ token });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

const getMe = async (request, response) => {
  try {
    const token = request.headers.cookie.slice(6);
    const decodedPayload = jsonwebtoken.verify(token, process.env.JWT_SECRET);

    response.json({ user: decodedPayload });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

module.exports = { loginUser , getMe };