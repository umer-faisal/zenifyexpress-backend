const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const AppError = require('../utils/appError');           // Optional if you have global error handling
// const asyncHandler = require('express-async-handler');
const catchAsync = require('../utils/catchAsync');



// ==========================================================
// 🧠 JWT TOKEN GENERATION 
// ==========================================================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};



// ==========================================================
// 📝 SIGNUP CONTROLLER
// ==========================================================
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role } = req.body;

  if (!name || !email || !password || !passwordConfirm) {
    return next(new AppError('All fields are required', 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already registered', 400));
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



// ==========================================================
// 🔑 LOGIN CONTROLLER
// ==========================================================
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
