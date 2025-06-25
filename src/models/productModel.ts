import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true, 
    }
  })
export const Product = mongoose.model("product", ProductSchema);
export default Product;