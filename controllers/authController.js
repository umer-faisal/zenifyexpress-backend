const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');             // Optional if you have global error handling
const catchAsync = require('../utils/catchAsync');
// const asyncHandler = require('express-async-handler');
// const bcrypt = require('bcryptjs');

const { promisify } = require('util');




/* ==========================================================
   🧠 JWT TOKEN GENERATION 
   ========================================================== */

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};



/* ==========================================================
   📝 SIGNUP CONTROLLER
   ========================================================== */

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role } = req.body;

  if (!name || !email || !password || !passwordConfirm) {
    return next(new AppError('All fields are required', 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('User already Exist.', 409));
  }



  if (password !== passwordConfirm) {
    return next(new AppError('Passwords do not match', 400));
  }

    

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});



/* ==========================================================
   🔑 LOGIN CONTROLLER
   ========================================================== */

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 1️⃣ Check user existence
  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new AppError('Invalid credentials', 401));

  // 2️⃣ Validate password
  const isValidPassword = await user.correctPassword(password, user.password);
  if (!isValidPassword) return next(new AppError('Invalid credentials', 401));

  // 3️⃣ Generate token
  const token = generateToken(user._id);

  // 4️⃣ Respond
  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});





/* ==========================================================
   🔒 PROTECT MIDDLEWARE (Verify JWT)
   ========================================================== */
   
exports.protect = catchAsync(async (req, res, next) => {
  // 1️⃣ Get token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2️⃣ Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3️⃣ Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }

  // 4️⃣ Check if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // ✅ Grant access
  req.user = currentUser;
  next();
});


/* ==========================================================
   ⚙️ ROLE-BASED ACCESS CONTROL
   ========================================================== */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles = ['admin', 'user']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
