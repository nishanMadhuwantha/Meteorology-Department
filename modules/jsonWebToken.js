/**
 * Created by nilupul on 3/12/17.
 */
var jwt = require('jsonwebtoken');
function generateJWT(username, time, callback) {
    jwt.sign({
        username: username,
        expire: Date().now()}, '3235g#$#@%^wt4v3drv', {algorithm: 'HS256'}, function (err, token) {
        console.log(token);
    });
}