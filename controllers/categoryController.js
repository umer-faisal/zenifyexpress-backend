const Category = require('../models/categoryModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/* ==========================================================
   ➕ CREATE CATEGORY (Admin only)
   ========================================================== */
exports.createCategory = catchAsync(async (req, res, next) => {
  const { icon, title, description } = req.body;

  if (!title) {
    return next(new AppError('Category title is required', 400));
  }

  const existingCategory = await Category.findOne({ title: title.toLowerCase()});
  if (existingCategory) {
    return next(new AppError('Category with this title already exists', 400));
  }

  const category = await Category.create({
    icon,
    title: title.toLowerCase(),
    description,
  });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    category,
  });
});




/* ==========================================================
   🧩 GET ALL CATEGORIES (Admin — includes inactive + pagination)
   ========================================================== */
exports.getAllCategoriesAdmin = catchAsync(async (req, res, next) => {

  // Default values: page = 1, limit = 6
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 6;
  const skip = (page - 1) * limit;

  // Fetch categories with pagination
  const categories = await Category.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }); // newest first

  // Count total documents for pagination metadata
  const totalCategories = await Category.countDocuments();

  if (!categories.length) {
    return next(new AppError('No categories found', 404));
  }

  res.status(200).json({
    success: true,
    results: categories.length,
    totalRecords: totalCategories,
    data: categories,
  });
});




/* ==========================================================
   🧠 GET ALL CATEGORIES (Public)
   ========================================================== */
exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({ isActive: true });

  res.status(200).json({
    success: true,
    results: categories.length,
    data: categories,
  });
});


/* ==========================================================
   🔍 GET CATEGORY BY ID (Public)
   ========================================================== */
exports.getCategoryById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findOne({ _id: id, isActive: true });

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});


/* ==========================================================
   ✏️ UPDATE CATEGORY (Admin only)
   ========================================================== */
exports.updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { icon, title, description, isActive } = req.body;

  const category = await Category.findByIdAndUpdate(
    id,
    { icon, title, description, isActive },
    { new: true, runValidators: true }
  );

  if (!category) {
    return next(new AppError('No category found with this ID', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: category,
  });
});


/* ==========================================================
   🔥 DEACTIVATE CATEGORY (Admin only)
   ========================================================== */
exports.deactivateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true, runValidators: true }
  );

  if (!category) {
    return next(new AppError('No category found with this ID', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Category deactivated successfully',
    data: category,
  });
});
