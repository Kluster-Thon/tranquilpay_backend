const ProductRouter = require('express').Router();
const {
  CREATE_PRODUCT_RULES,
  validationResult,
} = require('../utils/requestParser');
const Product = require('../models/products');
const User = require('../models/user');
const ERROR = require('../utils/logger');
const { percentageIncrease } = require('..utils/tools');

ProductRouter.post(
  '/create-product',
  CREATE_PRODUCT_RULES,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { product_name, unit_price, quantity, user_id } = req.body;

    const existingUser = await User.findById(user_id);

    try {
      const newProduct = await Product.create({
        product_name,
        unit_price,
        quantity,
        revenue: unit_price * quantity,
        userId: existingUser._id,
      });
      res
        .status(201)
        .json({ message: 'Product created successfully', data: newProduct });
    } catch (error) {
      ERROR(`Error creating product: ${error.message}`);

      res.status(500).json({
        error: `Error creating product: ${error.message}`,
      });
    }
  }
);

ProductRouter.post('/update-product/:product_id', CREATE_PRODUCT_RULES, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { product_name, unit_price, quantity, user_id } = req.body;

  const product_id = req.params.product_id;
  const existingProduct = await Product.findOne(product_id);

  const existingRevenue = existingProduct.revenue;
  const currentRevenue = unit_price * quantity;
  const percentage_increase = percentageIncrease(
    existingRevenue,
    currentRevenue
  );

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { product_id, user_id },
      {
        product_name,
        unit_price,
        quantity,
        revenue: unit_price * quantity,
        percentage_increase,
      },
      { new: true }
    );
    res
      .status(201)
      .json({ message: 'Product updated successfully', data: updatedProduct });
  } catch (error) {
    ERROR(`Error updating product: ${error.message}`);

    res.status(500).json({
      error: `Error updating product: ${error.message}`,
    });
  }
});

ProductRouter.get('/allproducts/:user_id', async (req, res) => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const userId = req.params.user_id;

  try {
    const allProducts = await Product.find({userId, deleted: { $ne: true } });

    res
      .status(201)
      .json({ message: 'Products found successfully', data: allProducts });
  } catch (error) {
    ERROR(`Error fetching products: ${error.message}`);

    res.status(500).json({
      error: `Error fetching products: ${error.message}`,
    });
  }
})

ProductRouter.get('/product/:product_id', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const productId = req.params.product_id;

  try {
    const product = await Product.findOne({productId, deleted: { $ne: true } });

    res
      .status(201)
      .json({ message: 'Product found successfully', data: product });
  } catch (error) {
    ERROR(`Error fetching product: ${error.message}`);

    res.status(500).json({
      error: `Error fetching product: ${error.message}`,
    });
  }
})

ProductRouter.delete('/products/delete/:user_id', async (req, res) => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const userId = req.params.user_id;
  const selectedProductIds = req.body.selected_ids;
  try {
    await Product.updateMany({ _id: { $in: selectedProductIds }, userId}, { deleted: true }, { new: true });
    res
      .status(201)
      .json({ message: 'Products deleted successfully'});
} catch (error) {
    ERROR(`Error deleting products: ${error.message}`);

    res.status(500).json({
      error: `Error deleting products: ${error.message}`,
    });
  }
})

ProductRouter.delete('/products/delete/:user_id', async (req, res) => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const userId = req.params.user_id;
  const productId = req.body.product_id;
  try {
    await Product.findOneAndUpdate({ productId, userId}, { deleted: true }, { new: true });
    res
      .status(201)
      .json({ message: 'The product has been deleted successfully'});
} catch (error) {
    ERROR(`Error deleting product: ${error.message}`);

    res.status(500).json({
      error: `Error deleting product: ${error.message}`,
    });
  }
})