import { Request, Response } from 'express';
import { Product } from '../models/productModel';
const getAllProducts = async(req:Request,res:Response):Promise<void>=>{
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : String(error) });
    }
}

const getProductById = async(req:Request,res:Response):Promise<void>=>{
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error',  error: error instanceof Error ? error.message : String(error) });
    }
}

const createProduct = async(req:Request,res:Response):Promise<void>=>{
    const { name, description, price, category, stock } = req.body;
    try {
        const newProduct = new Product({ name, description, price, category, stock });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server error',  error: error instanceof Error ? error.message : String(error) });
    }
} 

const updateProduct = async(req:Request,res:Response):Promise<void>=>{
    const { id } = req.params;
    const { name, description, price, category, stock } = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, { name, description, price, category, stock }, { new: true });
        if (!updatedProduct) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server error',  error: error instanceof Error ? error.message : String(error) });
    }
} 

const deleteProduct = async(req:Request, res:Response) : Promise<void>=>{
  const {id} = req.params;
  try{
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
        res.status(404).json({ message: 'Product not found' });
        return;
    }
    res.status(200).json({ message: 'Product deleted successfully' });

  }
  catch (error) {
    res.status(500).json({ message: 'Server error',  error: error instanceof Error ? error.message : String(error) });
  }
}

export {getAllProducts, getProductById, createProduct, updateProduct, deleteProduct}