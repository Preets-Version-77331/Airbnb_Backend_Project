const {check} = require('express-validator');

// First Name Validator
exports.firstNameValidator = check('firstName')
 .notEmpty()
 .withMessage('First name is mandatory')
 .trim()
 .isLength({ min : 5 })
 .withMessage('First nam should 8 characters')
 .matches(/^[a-zA-Z\s]+$/)
 .withMessage('First Name should only contains English latters '),

  // Last Name Validator
  exports.lastNameValidator = check('lastName')
  .trim()
  .matches(/^[a-zA-Z\s]*$/)
  .withMessage('Last Name should only contain english aplhabets'),

  // Email Validator
  exports.emailValidator = check('email')
  .isEmail()
  .withMessage('Please enter a valid email')
  .normalizeEmail(),

  // Password Validator
  exports.passwordValidator = check('password')
  .trim()
  .isLength({min: 8})
  .withMessage('Password should be minium 8 chars')
  .matches(/[a-z]/)
  .withMessage('Password should have atleast one small alphabet')
  .matches(/[A-Z]/)
  .withMessage('Password should have atleast one capital alphabet')
  .matches(/[!@#$%^&*_":?]/)
  .withMessage('Password should have atleast one Special Character'),

  // Confirm Password Validator
  exports.confirmPasswordValidator = check('confirm_password')
  .trim()
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Confirm Password does not match Password');
    }
    return true;
  }),

  // User Type Validator
  exports.userTypeValidator = check('userType')
  .trim()
  .notEmpty()
  .withMessage('User type is required')
  .isIn(['guest', 'host'])
  .withMessage('User type is invalid'),

  // User Type Validator
  exports.termconditionValidator = check('termsAccepted')
  .notEmpty()
  .withMessage('Terms and Conditions must be accepted')
  
  