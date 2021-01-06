// External modules
const validator = require("email-validator");
const passwordStrength = require('check-password-strength');

// Custome modules
const RBAC = require('../security/rbacAuthorization');

const containsSpecialChars = async ( string ) => {
    let format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/; // Special chars
    return format.test( string );
};

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

const isUserRoleValid = async ( role='' ) => {
    let rbac = new RBAC();
    let accessList = rbac.getAccessList();
    if(typeof accessList[ role ] === 'undefined') return false;
    return true;
};

module.exports = {
    containsSpecialChars,
    isEmailValid,
    passwordContainsName,
    checkMinimumPasswordLength,
    checkPasswordStrength,
    isUserRoleValid
};