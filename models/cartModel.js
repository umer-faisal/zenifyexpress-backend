const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    items: [{
      product: { 
        type: ObjectId, 
        ref: "Product", 
        required: true 
    },
      quantity: { 
        type: Number, 
        default: 1 
    }
    }],
    updatedAt: {
      type: Date,
      default: Date.now,
    }
  }
)
 