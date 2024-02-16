const jwt = require('jsonwebtoken');


module.exports.decodeTokenMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    jwt.verify(token, 'jwtPrivateKey', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token is not valid' });
      }
      console.log(decoded)

      req.user = decoded.userId; 
      next();
    });
  } else {
    return res.status(401).json({ message: 'Token is missing' });
  }
};

