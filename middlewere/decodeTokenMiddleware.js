const jwt = require('jsonwebtoken');


module.exports.decodeTokenMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    jwt.verify(token, 'your-secret-key', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token is not valid' });
      }
      req.user = decoded; 
      next();
    });
  } else {
    return res.status(401).json({ message: 'Token is missing' });
  }
};

