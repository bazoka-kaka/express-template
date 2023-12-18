const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const roles = [...allowedRoles];
    if (!req.roles) return res.sendStatus(401);
    const result = req.roles
      .map((role) => roles.includes(role))
      .find((val) => val === true);
    if (!result) return res.sendStatus(403);
    next();
  };
};

module.exports = verifyRoles;
