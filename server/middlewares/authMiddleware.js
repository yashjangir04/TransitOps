const jsonwebtoken = require('jsonwebtoken');

const verifyToken = (request, response, next) => {
  const token = request.headers.token;
  
  if (!token) {
    return response.status(401).json({ error: 'No authorization token provided' });
  }
  
  try {
    const decodedPayload = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    request.user = decodedPayload;
    next();
  } catch (error) {
    response.status(401).json({ error: 'Invalid or expired token' });
  }
};

const checkRole = (allowedRoles) => {
  return (request, response, next) => {
    if (!request.user || !allowedRoles.includes(request.user.role)) {
      return response.status(403).json({ error: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

module.exports = { verifyToken, checkRole };