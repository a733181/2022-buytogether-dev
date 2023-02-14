import products from '../models/products.js';
import users from '../models/users.js';
import banks from '../models/banks.js';
import orders from '../models/orders.js';
import reports from '../models/reports.js';

const showError = (error, res) => {
  if (error.name === 'ValidationError') {
    res
      .status(400)
      .json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message });
  } else if (error.name === 'CastError') {
    res.status(404).json({ success: false, message: '找不到' });
  } else if (error.code === 11000) {
    res.status(400).json({ success: false, message: '重複' });
  } else {
    res.status(500).json({ success: false, message: '未知錯誤' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const imagePath = [];
    if (req.files.images) {
      req.files.images.forEach((item) => {
        imagePath.push(item.path);
      });
    }

    const result = await products.create({
      userId: req.body.userId || req.user._id,
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
    showError(error, res);
  }
};

export const getSellProducts = async (req, res) => {
  try {
    const category = req.query.category || '全部';
    const page = req.query.page || 1;
    const limit = req.query.limit || 24;
    const key = req.query.key || '';

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const find = { isSell: true, status: 0 };

    if (category !== '全部') {
      find.category = category;
    }
    if (key !== '') {
      find.name = new RegExp(key, 'i');
    }

    const result = await products
      .find(find)
      .select('-status -bankId')
      .populate('userId', '_id name black')
      .sort({ createDate: -1 });
    const getOrder = await orders.find();

    let newResult = JSON.parse(JSON.stringify(result));
    newResult = newResult.filter((reProd) => {
      let total = 0;
      getOrder.forEach((item) => {
        item.products.forEach((prod) => {
          if (reProd._id.toString() === prod.productId.toString()) {
            total += prod.quantity;
          }
        });
      });
      reProd.remaining = reProd.maxNumber - total;
      delete reProd.createDate;
      return reProd.remaining > 0;
    });

    res.status(200).json({
      success: true,
      message: '',
      result: {
        data: newResult.slice(startIndex, endIndex),
        totalPages: Math.ceil(newResult.length / limit),
      },
    });
  } catch (error) {
    showError(error, res);
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
      .populate('userId', '_id name image black');

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
    showError(error, res);
  }
};

export const getAllMemberProducts = async (req, res) => {
  try {
    const result = await products
      .find({
        userId: req.user._id,
        $or: [{ status: 0 }, { status: 2 }],
      })
      .select('-userId');

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
    showError(error, res);
  }
};

export const getSellMemberProduct = async (req, res) => {
  try {
    const category = req.query.category || '全部';
    const page = req.query.page || 1;
    const limit = req.query.limit || 12;
    const key = req.query.key || '';

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const find = { userId: req.params.id, isSell: true, status: 0 };

    if (category !== '全部') {
      find.category = category;
    }
    if (key !== '') {
      find.name = new RegExp(key, 'i');
    }

    const result = await products.find(find).select('-status -bankId -userId');

    const member = await users.findById(req.params.id).select('_id name image black');

    const getOrder = await orders.find();

    let newResult = JSON.parse(JSON.stringify(result));

    newResult = newResult.filter((reProd) => {
      let total = 0;
      getOrder.forEach((item) => {
        item.products.forEach((prod) => {
          if (reProd._id.toString() === prod.productId.toString()) {
            total += prod.quantity;
          }
        });
      });
      reProd.remaining = reProd.maxNumber - total;
      return reProd.remaining > 0;
    });

    res.status(200).json({
      success: true,
      message: '',
      result: {
        member,
        data: newResult.slice(startIndex, endIndex),
        totalPages: Math.ceil(newResult.length / limit),
      },
    });
  } catch (error) {
    showError(error, res);
  }
};

export const getAdminProduct = async (req, res) => {
  try {
    const result = await products
      .find({
        $or: [{ status: 0 }, { status: 2 }],
      })
      .populate({
        path: 'userId',
        select: '_id',
      });

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

    const productIdList = Object.values(newResult).map((item) => item._id);
    const banksList = await banks.find({ status: 0 }).select('-status');
    const reportsList = await reports.find({ productId: productIdList });

    res.status(200).json({
      success: true,
      message: '',
      result: {
        products: newResult,
        banks: banksList,
        reports: reportsList,
      },
    });
  } catch (error) {
    showError(error, res);
  }
};

export const editProdcut = async (req, res) => {
  try {
    const mainImage = req?.files?.image ? req?.files?.image[0].path : req.body.image;
    const imagePath = [];

    if (req.files.images) {
      req.files.images.forEach((item) => {
        imagePath.push(item.path);
      });
    }
    if (typeof req.body.images === 'string') {
      imagePath.push(req.body.images);
    }
    if (typeof req.body.images === 'object') {
      req.body.images.forEach((item) => {
        if (item !== '' && item !== undefined && item !== null) {
          imagePath.push(item);
        }
      });
    }

    const data = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: mainImage,
      images: [...imagePath],
      isSell: req.body.isSell,
      category: req.body.category,
      bankId: req.body.bankId,
      youtubeId: req.body.youtubeId || '',
    };

    if (req.user.role === 1) {
      data.maxNumber = req.body.maxNumber;
    }

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
    showError(error, res);
  }
};

export const changeStatusProduct = async (req, res) => {
  try {
    const result = await products
      .findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
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
    showError(error, res);
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
    showError(error, res);
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
    showError(error, res);
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
    showError(error, res);
  }
};
