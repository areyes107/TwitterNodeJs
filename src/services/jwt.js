'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = '12345';

exports.createToken = (user)=>{
    var payload = {
     sub: user._id,
     name: user.name,
     username: user.username,
     lat: moment().unix(),
     exp: moment().add(12, "hours").unix()
    }

    return jwt.encode(payload, key);
}
