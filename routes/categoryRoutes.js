const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');
const { protect, restrictTo } = require('../controllers/authController'); 



/* ==========================================================
   📦 CATEGORY ROUTES
   ========================================================== */

// 🧠 Public routes — accessible to all users
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// 🔒 Admin-only routes — protected by JWT and role restrictions

router.get('/admin/all', protect, restrictTo('admin'), categoryController.getAllCategoriesAdmin); // ✅ NEW

router.post('/', protect, restrictTo('admin'), categoryController.createCategory);
router.patch('/:id', protect, restrictTo('admin'), categoryController.updateCategory);
router.patch('/:id/deactivate', protect, restrictTo('admin'), categoryController.deactivateCategory);



module.exports = router;




