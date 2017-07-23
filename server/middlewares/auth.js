import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;


function verifyToken(req, res, next) {
  const token = req.headers.authorization || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
}

function adminAccess(req, res, next) {
  if (req.decoded.roleId === 1) {
    next();
  } else {
    return res.status(401).json({
      message: 'You are not authorized',
    });
  }
}

export default { verifyToken, adminAccess };
