import products from '../models/products.js';
import users from '../models/users.js';
import orders from '../models/orders.js';

export const createProduct = async (req, res) => {
  try {
    let imagePath = [];
    if (!!req.files.images) {
      req.files.images.forEach((item) => {
        imagePath.push(item.path);
      });
    }
    const result = await products.create({
      userId: req.user._id,
      name: req.body.name,
      price: req.body.price,
      maxNumber: req.body.maxNumber,
      description: req.body.description,
      image: req?.files.image[0].path || '',
      images: [...imagePath],
      bankId: req.body.bankId,
      isSell: req.body.isSell,
      category: req.body.category,
      youtubeId: req.body.youtubeId,
    });

    res.status(200).json({
      success: true,
      message: '',
      result: {
        _id: result._id,
        userId: result.userId,
        name: result.name,
        price: result.price,
        maxNumber: result.maxNumber,
        description: result.description,
        image: result.image,
        images: result.images,
        bankId: result.bankId,
        isSell: result.isSell,
        category: result.category,
        youtubeId: result.youtubeId,
      },
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

export const getSellProducts = async (req, res) => {
  try {
    const result = await products
      .find({
        isSell: true,
        status: 0,
      })
      .select('-status -bankId -createDate')
      .populate('userId', '_id name black');
    const getOrder = await orders.find();

    const newResult = JSON.parse(JSON.stringify(result));
    newResult.forEach((reProd) => {
      let total = 0;
      getOrder.forEach((item) => {
        item.products.forEach((prod) => {
          if (reProd._id.toString() === prod.productId.toString()) {
            total += prod.quantity;
          }
        });
      });
      reProd.remaining = reProd.maxNumber - total;
    });

    res.status(200).json({
      success: true,
      message: '',
      result: newResult,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' });
  }
};

export const getSellProduct = async (req, res) => {
  try {
    let result = await products
      .find({
        _id: req.params.id,
        isSell: true,
        status: 0,
      })
      .select('-status -bankId')
      .populate('userId', '_id name black');

    result = result[0].toObject();

    const getOrder = await orders.find({ 'products.productId': req.params.id });

    let total = 0;
    getOrder.forEach((prod) => {
      prod.products.forEach((item) => {
        if (item.productId.toString() === req.params.id) {
          total += item.quantity;
        }
      });
    });

    result.remaining = result.maxNumber - total;

    if (!result) {
      res.status(404).json({ success: false, message: '找不到' });
    } else {
      res.status(200).json({
        success: true,
        message: '',
        result,
      });
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到' });
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' });
    }
  }
};

export const getAllMemberProducts = async (req, res) => {
  try {
    const result = await products
      .find({
        userId: req.user._id,
        status: 0,
      })
      .select('-userId -status');

    const getOrder = await orders.find();
    const newResult = JSON.parse(JSON.stringify(result));
    newResult.forEach((reProd) => {
      let total = 0;
      getOrder.forEach((item) => {
        item.products.forEach((prod) => {
          if (reProd._id.toString() === prod.productId.toString()) {
            total += prod.quantity;
          }
        });
      });
      reProd.sales = total;
    });

    res.status(200).json({
      success: true,
      message: '',
      result: newResult,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' });
  }
};

export const getSellMemberProduct = async (req, res) => {
  try {
    const result = await products
      .find({
        userId: req.params.id,
        isSell: true,
        status: 0,
      })
      .select('-status -maxNumber -bankId -userId');

    const member = await users.findById(req.params.id).select('_id name image black');

    res.status(200).json({
      success: true,
      message: '',
      result: {
        member,
        data: result,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' });
  }
};

export const editProdcut = async (req, res) => {
  try {
    const mainImage = req?.files?.image ? req?.files?.image[0].path : req.body.image;
    const imagePath = [];
    if (!!req?.files.images) {
      req.files.images.forEach((item) => {
        imagePath.push(item.path);
      });
    } else if (!!req.body.images) {
      if (typeof req.body.images === 'string') {
        imagePath.push(req.body.images);
      } else {
        imagePath.push(...req.body.images);
      }
    }

    const data = {
      name: req.body.name,
      price: req.body.price,
      maxNumber: req.body.maxNumber,
      description: req.body.description,
      image: mainImage,
      images: imagePath,
      isSell: req.body.isSell,
      category: req.body.category,
      bankId: req.body.bankId,
      youtubeId: req.body.youtubeId,
    };
    const result = await products
      .findByIdAndUpdate(req.params.id, data, { new: true })
      .select('-likes -status');

    if (!result) {
      res.status(404).json({ success: false, message: '找不到' });
    } else {
      res.status(200).json({
        success: true,
        message: '',
        result,
      });
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res
        .status(400)
        .json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message });
    } else if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到' });
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' });
    }
  }
};

export const deletProduct = async (req, res) => {
  try {
    const data = {
      status: 1,
    };

    const result = await products.findByIdAndUpdate(req.params.id, data, { new: true });

    if (!result) {
      res.status(404).json({ success: false, message: '找不到' });
    } else {
      res.status(200).json({ success: true, message: '' });
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res
        .status(400)
        .json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message });
    } else if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到' });
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' });
    }
  }
};

export const toggleLikeProduct = async (req, res) => {
  try {
    const findProduct = await products.findById(req.body.productId);

    const index = findProduct.likes.findIndex((item) => {
      return item.toString() === req.user._id.toString();
    });

    if (index !== -1) {
      findProduct.likes.splice(index, 1);
    } else {
      findProduct.likes.push(req.user._id);
    }

    await products.findByIdAndUpdate(req.body.productId, findProduct, { new: true });

    res.status(200).json({
      success: true,
      message: '',
      result: {},
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res
        .status(400)
        .json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message });
    } else if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到' });
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' });
    }
  }
};

export const getFatoriteProduct = async (req, res) => {
  try {
    const result = await products
      .find({ _id: req.user.favorites, isSell: true, status: 0 })
      .select('-status -bankId -createDate')
      .populate('userId', '_id name black');

    const getOrder = await orders.find();

    const newResult = JSON.parse(JSON.stringify(result));
    newResult.forEach((reProd) => {
      let total = 0;
      getOrder.forEach((item) => {
        item.products.forEach((prod) => {
          if (reProd._id.toString() === prod.productId.toString()) {
            total += prod.quantity;
          }
        });
      });
      reProd.remaining = reProd.maxNumber - total;
    });
    res.status(200).json({
      success: true,
      message: '',
      result: newResult,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' });
  }
};
