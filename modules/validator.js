/**
 * Created by nilupul on 3/9/17.
 */
var validtor = require('validate.js');

var usernameConstraint = {
    username: {
        presence: true,
        format: {
            pattern: "/^([!@#$%]|&)/",
            flag: "i",
            message: "Invalid username"
        }
    }
};

console.log(validtor.validate({username:"nilupul"}, usernameConstraint));