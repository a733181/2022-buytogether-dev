import orders from '../models/orders.js';
import users from '../models/users.js';

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

export const createOrder = async (req, res) => {
  try {
    if (req.user.cart.length === 0) {
      res.status(400).json({ success: false, message: '購物車是空的' });
      return;
    }

    const result = await users.findById(req.user._id, 'cart').populate({
      path: 'cart.productId',
      populate: {
        path: 'userId',
        model: 'users',
      },
    });

    const isBlack = result.cart.some((cart) =>
      cart.productId.userId.black.some((black) => black.toString() === req.user._id.toString()),
    );

    const isCheckout = result.cart.every((cart) => cart.productId.isSell);

    if (!isCheckout) {
      res.status(400).json({ success: false, message: '包含下架商品' });
      return;
    }

    if (isBlack) {
      res.status(400).json({ success: false, message: '包含被加入黑名單' });
      return;
    }

    const newResult = await orders.create({
      userId: req.user._id,
      products: req.user.cart,
      addressId: req.body.addressId,
      bankId: req.body.bankId,
    });

    req.user.cart = [];
    await req.user.save();
    res.status(200).json({
      success: true,
      message: '',
      result: {
        _id: newResult._id,
      },
    });
  } catch (error) {
    showError(error, res);
  }
};

export const editOrder = async (req, res) => {
  try {
    let result = await orders.findById(req.params.id);
    result = result.toObject();
    if (req.body.type === 'paid') {
      if (req.body.productId === '') {
        result.products = result.products.map((item) => {
          item.paid.isPaid = true;
          return item;
        });

        await orders.findByIdAndUpdate(req.params.id, result, { new: true });

        res.status(200).json({
          success: true,
          message: '',
        });
        return;
      } else {
        result.products = result.products.map((item) => {
          if (item.productId.toString() === req.body.productId) {
            item.paid.isPaid = true;
          }
          return item;
        });
      }
    } else if (req.body.type === 'ship') {
      result.products = result.products.map((item) => {
        if (item.productId.toString() === req.body.productId) {
          if (item.paid.isPaid) {
            item.shippingStatus = 1;
          }
        }
        return item;
      });
    } else if (req.body.type === 'archive') {
      if (req.body.member === 'buy') {
        result.buyStatus = req.body.status;
      } else {
        result.sellStatus = req.body.status;
      }
    } else if (req.body.type === 'cancel') {
      result.products = result.products.map((item) => {
        if (item.productId.toString() === req.body.productId) {
          item.shippingStatus = 2;
        }
        return item;
      });
    }

    const newResult = await orders
      .findByIdAndUpdate(req.params.id, result, { new: true })
      .populate({
        path: 'products.productId',
        select: '_id addressId bankId name image category userId price',
        populate: {
          path: 'bankId',
          model: 'banks',
          select: 'bankName bankNumber',
        },
      })
      .populate('addressId', '-status -userId')
      .populate('bankId', '-status -userId');

    res.status(200).json({
      success: true,
      message: '',
      result: newResult,
    });
  } catch (error) {
    showError(error, res);
  }
};

export const getMyBuyOrders = async (req, res) => {
  try {
    const result = await orders
      .find({ userId: req.user._id })
      .populate({
        path: 'products.productId',
        select: '_id addressId bankId name image category userId price',
        populate: {
          path: 'bankId',
          model: 'banks',
          select: 'bankName bankNumber',
        },
      })
      .populate('addressId', '-status -userId')
      .populate('bankId', '-status -userId');

    res.status(200).json({ success: true, message: '', result });
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' });
  }
};

export const getMySellOrders = async (req, res) => {
  try {
    let result = await orders
      .find()
      .populate({
        path: 'products.productId',
        select: '_id addressId bankId name image category userId price',
        populate: {
          path: 'userId',
          model: 'users',
          select: '_id',
        },
      })
      .populate('addressId', '-status -userId')
      .populate('bankId', '-status -userId');

    result = result.filter((item) => {
      item.products = item.products.filter((prod) => {
        return prod.productId.userId._id.toString() === req.user._id.toString();
      });
      return item.products.length > 0;
    });

    res.status(200).json({ success: true, message: '', result });
  } catch (error) {
    showError(error, res);
  }
};

export const getAdminOrders = async (req, res) => {
  try {
    const result = await orders
      .find()
      .populate({
        path: 'products.productId',
        select: '_id addressId bankId name image category userId price',
        populate: {
          path: 'userId',
          model: 'users',
          select: '_id',
        },
        populate: {
          path: 'bankId',
          model: 'banks',
          select: 'bankName bankNumber',
        },
      })
      .populate('addressId', '-status -userId')
      .populate('bankId', '-status -userId');

    res.status(200).json({ success: true, message: '', result });
  } catch (error) {
    showError(error, res);
  }
};
