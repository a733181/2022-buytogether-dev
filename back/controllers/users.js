import jwt from 'jsonwebtoken';
import users from '../models/users.js';
import products from '../models/products.js';
import orders from '../models/orders.js';

const showError = (error, res) => {
  if (error.name === 'ValidationError') {
    res
      .status(400)
      .json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message });
  } else if (error.code === 11000) {
    res.status(400).json({ success: false, message: '重複' });
  } else {
    res.status(500).json({ success: false, message: '未知錯誤' });
  }
};

export const register = async (req, res) => {
  try {
    await users.create({
      phone: req.body.phone,
      password: req.body.password,
    });
    res.status(200).json({ success: true, message: '' });
  } catch (error) {
    showError(error, res);
  }
};

export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' });
    req.user.tokens.push(token);
    await req.user.save();

    res.status(200).json({
      success: true,
      message: '',
      result: {
        token,
        _id: req.user._id,
        phone: req.user.phone,
        cart: req.user.cart.length,
        role: req.user.role,
        name: req.user.name,
        email: req.user.email,
        image: req.user.image,
        favorites: req.user.favorites,
        track: req.user.track,
        black: req.user.black,
        cart: req.user.cart.reduce((total, current) => total + current.quantity, 0),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' });
  }
};

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token !== req.token);
    await req.user.save();
    res.status(200).json({ success: true, message: '' });
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' });
  }
};

export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex((token) => token === req.token);
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' });
    req.user.tokens[idx] = token;
    await req.user.save();
    res.status(200).json({ success: true, message: '', result: token });
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' });
  }
};

export const getUser = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: '',
      result: {
        _id: req.user._id,
        phone: req.user.phone,
        cart: req.user.cart.length,
        role: req.user.role,
        name: req.user.name,
        email: req.user.email,
        image: req.user.image,
        favorites: req.user.favorites,
        track: req.user.track,
        black: req.user.black,
        cart: req.user.cart.reduce((total, current) => total + current.quantity, 0),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' });
  }
};

export const editUser = async (req, res) => {
  try {
    const imageUrl = req.files.image ? req.files.image[0].path : null;
    if (Object.keys(req.body)[0] === 'name') {
      req.user.name = req.body.name;
      if (imageUrl) {
        req.user.image = imageUrl;
      }
    }
    if (Object.keys(req.body)[0] === 'email') {
      req.user.email = req.body.email;
    }
    await req.user.save();

    if (imageUrl) {
      res.status(200).json({
        success: true,
        message: '',
        result: {
          name: req.user.name,
          image: req.user.image,
        },
      });
    } else {
      res.status(200).json({
        success: true,
        message: '',
        result: {},
      });
    }
  } catch (error) {
    showError(error, res);
  }
};

export const toggleFatorite = async (req, res) => {
  try {
    const index = req.user.favorites.findIndex((item) => item.toString() === req.body.productId);

    if (index !== -1) {
      req.user.favorites.splice(index, 1);
    } else {
      req.user.favorites.push(req.body.productId);
    }

    await req.user.save();
    res.status(200).json({
      success: true,
      message: '',
      result: {},
    });
  } catch (error) {
    showError(error, res);
  }
};

export const toggleList = async (req, res) => {
  try {
    if (req.body.id === req.user._id.toString()) {
      res.status(500).json({ success: false, message: '未知錯誤' });
      return;
    }

    const findUser = await users.findById(req.body.id);
    if (!findUser) {
      res.status(404).json({ success: false, message: '找不到' });
      return;
    }

    const indexTrack = req.user.track.findIndex((item) => item.toString() === req.body.id);
    const indexBlack = req.user.black.findIndex((item) => item.toString() === req.body.id);

    if (req.body.type === 'track' && indexBlack === -1) {
      if (indexTrack === -1) {
        req.user.track.push(req.body.id);
      } else {
        req.user.track.splice(indexTrack, 1);
      }
    } else if (req.body.type === 'black' && indexTrack === -1) {
      if (indexBlack === -1) {
        req.user.black.push(req.body.id);
      } else {
        req.user.black.splice(indexBlack, 1);
      }
    } else {
      res.status(404).json({ success: false, message: '發生錯誤' });
      return;
    }

    await req.user.save();
    res.status(200).json({
      success: true,
      message: '',
      result: {},
    });
  } catch (error) {
    showError(error, res);
  }
};

export const getTrackList = async (req, res) => {
  try {
    const result = await users.findById(req.user._id).populate('track', '_id name image');

    res.status(200).json({
      success: true,
      message: '',
      result: result.track,
    });
  } catch (error) {
    showError(error, res);
  }
};

export const getBlackList = async (req, res) => {
  try {
    const result = await users.findById(req.user._id).populate('black', '_id name image');

    res.status(200).json({
      success: true,
      message: '',
      result: result.black,
    });
  } catch (error) {
    showError(error, res);
  }
};

export const editCart = async (req, res) => {
  try {
    const product = await products
      .find({ _id: req.body.id, isSell: true })
      .populate('userId', 'black');

    const getOrder = await orders.find({ 'products.productId': req.body.id });

    let total = 0;
    getOrder.forEach((item) => {
      item.products.forEach((prod) => {
        if (prod.productId.toString() === req.body.id) {
          total += prod.quantity;
        }
      });
    });
    const remaining = product[0].maxNumber - total;

    const index = req.user.cart.findIndex((cart) => cart.productId.toString() === req.body.id);
    if (index > -1) {
      const quantity = req.user.cart[index].quantity + parseInt(req.body.quantity);
      if (quantity <= 0) {
        req.user.cart.splice(index, 1);
      } else {
        req.user.cart[index].quantity = quantity;
        if (req.user.cart[index].quantity > remaining) {
          res.status(404).send({ success: false, message: '超出數量' });
          return;
        }
      }
    } else {
      if (!product) {
        res.status(404).send({ success: false, message: '找不到' });
        return;
      }

      if (product[0].userId.black.some((item) => item.toString() === req.user.id.toString())) {
        res.status(404).send({ success: false, message: '已被加入黑名單' });
        return;
      }
      req.user.cart.push({
        productId: req.body.id,
        quantity: parseInt(req.body.quantity),
      });
    }
    await req.user.save();
    res.status(200).json({
      success: true,
      message: '',
      result: req.user.cart.reduce((total, current) => total + current.quantity, 0),
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res
        .status(400)
        .json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message });
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' });
    }
  }
};

export const getCart = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'cart').populate({
      path: 'cart.productId',
      select: 'image name price',
      populate: {
        path: 'bankId',
        model: 'banks',
        select: 'bankName bankNumber',
      },
    });

    res.status(200).json({ success: true, message: '', result: result.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const index = req.user.cart.findIndex((cart) => cart.productId.toString() === req.params.id);
    req.user.cart.splice(index, 1);
    await req.user.save();

    res.status(200).json({
      success: true,
      message: '',
      result: req.user.cart.reduce((total, current) => total + current.quantity, 0),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' });
  }
};
