import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

/**
 * verifyToken verify the user upon login
 * @method verifyToken
 * @param  {string}    req  authorization header
 * @param  {string}    res  token generated
 * @param  {Function}  next move to the next function
 * @return {void}
 */
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
    return res.status(401).send({
      success: false,
      message: 'Please register or login.'
    });
  }
}

/**
 * checking for admin access
 * @method adminAccess
 * @param  {string}    req  authorization header
 * @param  {string}    res  token generated
 * @param  {Function}  next move to the next function
 * @return {void}
 */
function adminAccess(req, res, next) {
  if (req.decoded.roleId === 1) {
    next();
  } else {
    return res.status(403).json({
      message: 'You are not authorized',
    });
  }
}

export default { verifyToken, adminAccess };
