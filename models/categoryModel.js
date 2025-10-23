const mongoose = require('mongoose');



const categorySchema = new mongoose.Schema(
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

    isActive: {
      type: Boolean,
      default: true,
    },


    /* Optional array of subcategory references (future phase) */
    // subcategories: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Subcategory',
    //   },
    // ],

  },
  {
    timestamps: true,
  }
);



const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
