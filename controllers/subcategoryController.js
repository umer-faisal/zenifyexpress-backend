const Subcategory = require('../models/subcategoryModel');
const Category = require('../models/categoryModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');



/* ==========================================================
   🟢 CREATE SUBCATEGORY  (Admin Only)
   ========================================================== */
exports.createSubcategory = catchAsync(async (req, res, next) => {
  const { title, description, icon, category } = req.body;

  if (!title || !category)
    return next(new AppError('Title and category are required', 400));

  // Ensure the referenced category exists
  const existingCategory = await Category.findById(category);
  if (!existingCategory) {
    return next(new AppError('Category not found', 404));
  }

  const newSubcategory = await Subcategory.create({
    title: title.toLowerCase(),
    description,
    icon,
    category,
  });


  // ✅ populate category details
  await newSubcategory.populate('category', 'title');


  res.status(201).json({
    success: true,
    message: 'Subcategory created successfully',
    data: newSubcategory,
  });
});



/* ==========================================================
   🟡 UPDATE SUBCATEGORY (Admin Only)
   ========================================================== */
exports.updateSubcategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  const subcategory = await Subcategory.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!subcategory) {
    return next(new AppError('No subcategory found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Subcategory updated successfully',
    data: subcategory,
  });
});



/* ==========================================================
   🔴 DEACTIVATE SUBCATEGORY (Soft Delete)
   ========================================================== */
exports.deactivateSubcategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const subcategory = await Subcategory.findByIdAndUpdate(id);
  if (!subcategory) {
    return next(new AppError('Subcategory not found', 404));
  }

  subcategory.isActive = false;
  await subcategory.save();

  res.status(200).json({
    success: true,
    message: 'Subcategory deactivated successfully',
    data: subcategory,
  });
});



/* ==========================================================
   🔍 GET ALL SUBCATEGORIES (Public)
   ========================================================== */
// exports.getAllSubcategories = catchAsync(async (req, res, next) => {
//   const subcategories = await Subcategory.find({ isActive: true });

//   res.status(200).json({
//     success: true,
//     results: subcategories.length,
//     data: subcategories,
//   });
// });



/* ==========================================================
   🔍 GET SUBCATEGORIES BY CATEGORY (Public)
   ========================================================== */
exports.getSubcategoriesByCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;

  const subcategories = await Subcategory.find({
    category: categoryId,
    isActive: true,
  });

  if (!subcategories.length) {
    return next(new AppError('No subcategories found for this category', 404));
  }

  res.status(200).json({
    success: true,
    results: subcategories.length,
    data: subcategories,
  });
});





/* ==========================================================
   🧠 GET ALL SUBCATEGORIES (Admin — includes inactive)
   ========================================================== */
exports.getAllSubcategoriesAdmin = catchAsync(async (req, res, next) => {
  // Pagination setup — default 6 per page
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  // Fetch subcategories with pagination
  const subcategories = await Subcategory.find()
    .skip(skip)
    .limit(limit)
    .populate('category', 'title icon');

  const total = await Subcategory.countDocuments();


  // if (!categories.length) {
  //     return next(new AppError('No categories found', 404));
  //   }


  res.status(200).json({
    success: true,
    message: 'All subcategories (including inactive) retrieved successfully',
    total,
    results: subcategories.length,
    page,
    totalPages: Math.ceil(total / limit),
    data: subcategories,
  });
});
