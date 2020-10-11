const jwt = require("jsonwebtoken");
const secret = require("../config/jwtSecret");

module.exports = {
  requiresToken,
  requiresAdmin,
};

function requiresToken(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ error: "Token invalid: expired or modified" });
      } else {
        req.jwt = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ error: "No token provided" });
  }
}

function requiresAdmin(req, res, next) {
  const { admin } = req.jwt;

  if (admin) {
    next();
  } else {
    res.status(403).json({ error: "Must be an admin" });
  }
}
