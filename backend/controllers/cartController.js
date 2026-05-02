const Cart = require("../models/Cart");

// GET CART
exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  res.json(cart || { items: [] });
};

// ADD TO CART
exports.addToCart = async (req, res) => {
  const { userId, productId } = req.body;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [{ productId, quantity: 1 }]
    });
  } else {
    const item = cart.items.find(i => i.productId === productId);

    if (item) item.quantity += 1;
    else cart.items.push({ productId, quantity: 1 });

    await cart.save();
  }

  res.json(cart);
};

// REMOVE ITEM
exports.removeFromCart = async (req, res) => {
  const { userId, productId } = req.params;

  let cart = await Cart.findOne({ userId });

  cart.items = cart.items.filter(i => i.productId !== productId);
  await cart.save();

  res.json(cart);
};