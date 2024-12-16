const { check, validationResult  } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { firstNameValidator, lastNameValidator, emailValidator, passwordValidator, confirmPasswordValidator, userTypeValidator, termconditionValidator } = require('./validations');

const MILLIS_IN_MIN = 60 * 1000; 
const sendGrid = require('@sendgrid/mail');
const SEND_GRID_KEY = process.env.SENDGRID_API_KEY;
sendGrid.setApiKey(SEND_GRID_KEY);

 
exports.getLogin = (req, res, next) => {
  res.render('auth/login', {pageTitle: 'Login or Sign Up ', isLoggedIn: false});    
}; 


exports.postLogin =  async (req, res, next) => {
  console.log('Req Body : ',req.body ,'Logged In : ', req.session.isLoggedIn);
  const {email, password} = req.body;
  try{
    const user = await User.findOne({email});
    if (!user) { // if Userb not found 
      throw new Error('User not found ');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
      
    if (!isMatch) {
      throw new Error('Password does not mnatch');
    }
    req.session.isLoggedIn = true; // if user found set the user authentiction is true.
    req.session.user = user;  // save the user info for futurev requirments 
    await req.session.save(); // waiting for saving info then send response 
    res.redirect('/'); // if user found 
  } catch(err) { // When user not Found it catch this code and re-render the login file with error messages 
    res.render('auth/login', {
      isLoggedIn: false,
      pageTitle: 'Login or Sign Up',
      errorMessages: [err.message], 
    });
  } 
}


exports.postLogout = (req, res, next) => {
  req.session.destroy(); 
  res.redirect('/');
}




exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {pageTitle: 'Login or Sign Up ', isLoggedIn: false});    
}; 

exports.getPassword = (req, res, next) => {
  res.render('auth/forgot-password', {pageTitle: 'Login or Sign Up ', isLoggedIn: false});    
}; 

exports.postPassword = async (req, res, next) => {
  const {email} = req.body; 
  try {
    const user = await User.findOne({email});
    console.log('user :', user);
    const otp = Math.floor(100000  + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 20 * MILLIS_IN_MIN;
    await user.save();
    const forgotPassword = {
      to: email, 
      from: process.env.SENDER_EMAIL,
      subject: 'Airbnb || Reset Password ',
      html: `<h1> Here is your Requsted OTP ${otp} </h1>
      <p> Cleck here to  <a href="http://localhost:3000/reset-password?email=${email}">Reset Password </a></p>`
    };

    await sendGrid.send(forgotPassword);
    res.redirect(`/reset-password?email=${email}`);
  } catch (err) {
    console.log('Error Occurred while confirm Email : ', err);
    return res.status(422).render('auth/forgot-password', {
      pageTitle: 'Login or Sign Up',
      isLoggedIn: false,
      errorMessages: [err.message],
      oldInput: req.body,
    });
  }
}; 


exports.postSignup = [ 
  // Validators 
  firstNameValidator,
  lastNameValidator,
  emailValidator,
  passwordValidator,
  confirmPasswordValidator,
  userTypeValidator,
  termconditionValidator, 
  async (req, res, next) => {
    console.log('User came for Sign Up', req.body);
    // Checking validation 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('auth/signup', {
        pageTitle: 'Error in sign Up', 
        isLoggedIn: false,
        errorMessages: errors.array().map(err => err.msg),
        oldInput: req.body,
      });
    }
    const { firstName, lastName, email, password, userType } = req.body;
    try {
      const hashedPassword = await  bcrypt.hash(password, 12);
      const user = new User({
          firstName, lastName, email, password: hashedPassword, userType
        })

      await user.save();
      const welcomeEmail = {
        to: email, 
        from: process.env.SENDER_EMAIL,
        subject: 'Welcome to Airbnb !',
        html: `<h1>Welcome ${firstName}  ${lastName}. Please book your first vacation with us </h1>`
      };
      await sendGrid.send(welcomeEmail);
      return res.redirect('/login');
    } catch(err) {
        console.log('Error Occurred while data Providing to data base : ', err);
        return res.status(422).render('auth/signup', {
          pageTitle: 'Error in sign Up',
          isLoggedIn: false,
          errorMessages: [err.message],
          oldInput: req.body,
        });
    }
  }
]; 


exports.getResetPassword = (req, res, next) => {
  const {email} = req.query; 
  res.render('auth/reset-password', {
    pageTitle: 'Reset Password',
    isLoggedIn: false,
    email: email, });
}; 

exports.postResetPassword = [
  // Validators 
  passwordValidator, 
  confirmPasswordValidator,

  async (req, res, next) => {
  const {email, otp, password, confirm_password} = req.body; 
  // Checking Validatons 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/reset-password', {
      pageTitle: 'Reset Password',
      isLoggedIn: false,
      email: email,
      errorMessages: errors.array().map(err => err.msg),
    });
  }
  try {
    const user = await User.findOne({email});
    if (!user) {
      throw new Error('User Not Found');
    } else if (user.otpExpiry < Date.now())  {
      throw new Error('OTP Expired');
    } else if (user.otp !== otp) {
      throw new Error(' Invalid OTP');
    }
    const hashedPassowrd =await bcrypt.hash(password ,12);
    user.password = hashedPassowrd; 
    user.otp = undefined;
    user.otpExpiry = undefined; 
    await user.save();
    res.redirect('/login');
  } catch (err) {
    console.log('Error Occurred while data Providing to data base : ', err);
    return res.status(422).render('auth/reset-password', {
      pageTitle: 'Reset Password',
      isLoggedIn: false,
      errorMessages: [err.message],
      email: email, 
    });
  }
}]


