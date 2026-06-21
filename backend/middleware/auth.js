const jwt = require('jsonwebtoken');

module.exports = function(roles = []) {
  return (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      
      // Check if user role matches allowed roles
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ msg: 'Unauthorized Access: You do not have permission' });
      }
      next();
    } catch (err) {
      res.status(401).json({ msg: 'Token is not valid' });
    }
  };
};