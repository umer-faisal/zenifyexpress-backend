const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    category: {
      type: ObjectId,
      ref: "Category",
    },
     subcategory: {
      type: ObjectId,
      ref: "Subcategory",
    },
    isActive: [{
      type: Boolean,
      default: true,
    }],
    image: {
        type: String,
    }
  }
)
