const express = require('express');
const router = express.Router();

const subcategoryController = require('../controllers/subcategoryController');
const authController = require('../controllers/authController'); // for protecting routes



/* ==========================================================
   🧠 ROUTE PROTECTION (Helpers)
   ========================================================== */
// These assume you'll later add middleware in authController like:
// exports.protect = ...
// exports.restrictTo = (...roles) => ...



/* ==========================================================
   🌐 PUBLIC ROUTES
   ========================================================== */

// router.get('/', subcategoryController.getAllSubcategories);

// Get all subcategories under a specific category
router.get('/category/:categoryId', subcategoryController.getSubcategoriesByCategory);



/* ==========================================================
   🟢 ADMIN ROUTES (Protected)
   ========================================================== */

   

// 🧠 Get all subcategories (Admin only, includes inactive)      // ✅ NEW
router.get(
  '/admin',
  authController.protect,
  authController.restrictTo('admin'),
  subcategoryController.getAllSubcategoriesAdmin
);



// Create Subcategory
router.post(
  '/',
  authController.protect,
  authController.restrictTo('admin'),
  subcategoryController.createSubcategory
);

// Update Subcategory
router.patch(
  '/:id',
  authController.protect,
  authController.restrictTo('admin'),
  subcategoryController.updateSubcategory
);

// Deactivate Subcategory
router.patch(
  '/:id/deactivate',
  authController.protect,
  authController.restrictTo('admin'),
  subcategoryController.deactivateSubcategory
);



module.exports = router;
