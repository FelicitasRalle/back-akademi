const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
      if (!req.user || !allowedRoles.includes(req.user.rol)) {
        return res.status(403).json({ mensaje: 'No tienes permiso para realizar esta acción' });
      }
      next();
    };
  };
  
  module.exports = checkRole;