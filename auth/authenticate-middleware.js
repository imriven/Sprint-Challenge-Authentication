/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secrets.jwtSecret, (err, user) => {
      if (err) {
        return res.status(403).send();
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).send();
  }
};
