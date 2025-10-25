const mongoose = require('mongoose');



const subcategorySchema = new mongoose.Schema(
  {
    icon: {
      type: String,
    },

    title: {
      type: String,
    },

    description: {
      type: String,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/* ==========================================================
   ⚙️ MIDDLEWARES & OPTIONS
   ========================================================== */

// Populate category info automatically (optional)
subcategorySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: 'title icon isActive',
  });
  next();
});

// Virtuals for cleaner responses
// subcategorySchema.set('toJSON', { virtuals: true });
// subcategorySchema.set('toObject', { virtuals: true });



const Subcategory = mongoose.model('Subcategory', subcategorySchema);
module.exports = Subcategory;
