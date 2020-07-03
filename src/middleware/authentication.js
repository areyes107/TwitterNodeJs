"use strict";
const jwt = require('jwt-simple');
const moment = require('moment');
var  middleware  = require('twitter-command');
const key = "12345";

exports.ensureAuth = (req, res, next) => {
  if (middleware.needsMiddleware(req)) {
    if (!req.headers.authorization) {
      return res.status(403).send({ message: "Petición no autorizada" });
    } else {
      var token = req.headers.authorization.replace(/["']+/g, "");
      try {
        var payload = jwt.decode(token, key);
        if (payload.exp <= moment().unix()) {
          return res.send({ message: "Token Expirado" });
        }
      } catch (error) {
        console.log(error);
      }
      req.user = payload;
      next();
    }
  } else {
    next();
  }
};
