const Cryptr = require('cryptr');
const cryptr = new Cryptr('premjatol@gmail.com');
const secret_key = "prem@gmail.com";
const jwt = require('jsonwebtoken');

const encryptPass = (password) => {
    return cryptr.encrypt(password);
}

const descryptPass = (password) => {
    return cryptr.decrypt(password);
}

const getToken = (user_data) => {
    // const user_tokens = new Map();
    // const { v4 } = require('uuid');
    // const token = v4();
    // user_tokens.set(token, user_data);
    var token = jwt.sign(user_data, secret_key);
    // var token = jwt.sign(user_data, secret_key, {expiresIn : "24h"});
    return token
}

function verifyToken(token) {
    try{
        return jwt.verify(token, secret_key)
    }catch (err) {
        return false;
    }
    // user_tokens.get(token);
}

module.exports = {
    encryptPass, descryptPass, getToken, verifyToken
}
