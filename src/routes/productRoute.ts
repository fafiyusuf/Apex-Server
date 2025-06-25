const productRoute = require('express').Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controller/productController');
const { authenticate } = require('../middleware/authenticate');
const { protectAdmin } = require('../middleware/adminValidator');


productRoute.get('/', getAllProducts);  

productRoute.get('/:id', getProductById);

productRoute.post('/', authenticate, protectAdmin, createProduct);
productRoute.put('/:id', authenticate, protectAdmin, updateProduct);
// Route to delete a product by ID (admin only)
productRoute.delete('/:id', authenticate, protectAdmin, deleteProduct);
