const jsonwebtoken = require('jsonwebtoken');

const verifyToken = (request, response, next) => {
  let token = request.headers.token;
  
  if (!token && request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
    token = request.headers.authorization.split(' ')[1];
  }
  
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