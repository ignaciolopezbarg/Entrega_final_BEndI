// import mongoose from "mongoose";

// const cartSchema = new mongoose.Schema({
//     products: [
//         {
//             product: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: "products",
//                 required: true
//             },
//             quantity: {
//                 type: Number, 
//                 required: true
//             }
//         }
//     ]
// });

// cartSchema.pre('findOne', function (next) {
//     this.populate('products.product', '_id title price');
//     next();
// });

// const CartModel =  mongoose.model("carts", cartSchema); 

// export default CartModel;

import mongoose from 'mongoose';

// Definir el esquema para un producto dentro del carrito
const productInCartSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

const cartSchema = new mongoose.Schema({
  cid: {
    type: Number,
    required: true,
    unique: true
  },
  prodsAgregado: [productInCartSchema]
});

cartSchema.pre('findOne', function(next) {
  this.populate('prodsAgregado.product', '_id title price');
  next();
});

const CartModel = mongoose.model('carts', cartSchema);

export default CartModel;
