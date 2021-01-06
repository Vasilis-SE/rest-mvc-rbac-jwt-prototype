const validator = require("email-validator");
const passwordStrength = require('check-password-strength')

const isEmailValid = async ( email='' ) => {
    return validator.validate( email ); 
};

const passwordContainsName = async ( pass='', name='' ) => {
    if(pass.includes(name)) return false;
    return true;
};

const checkMinimumPasswordLength = async ( pass='' ) => {
    if(pass.length < 8) return false;
    return true;
};

const checkPasswordStrength = async ( pass='' ) => {
    if( passwordStrength(pass).id === 0 ) return false;
    return true;
};

module.exports = {
    isEmailValid,
    passwordContainsName,
    checkMinimumPasswordLength,
    checkPasswordStrength
};