import messages from '../models/messages.js';
import products from '../models/products.js';

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

export const createMessage = async (req, res) => {
  const result = await messages.create({
    userId: req.user._id,
    prodcutId: req.body.prodcutId,
    message: req.body.message,
  });

  res.status(200).json({
    success: true,
    message: '',
    result: {
      userId: result.userId,
      prodcutId: result.prodcutId,
      message: result.message,
    },
  });
  try {
  } catch (error) {
    showError(error, res);
  }
};

export const getProductMessage = async (req, res) => {
  try {
    const result = await messages
      .find({ prodcutId: req.params.id, isShow: true })
      .select('-isShow');

    const page = req.query.page || 1;
    const limit = req.query.limit || 5;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    res.status(200).json({
      success: true,
      message: '',
      result: {
        data: result.slice(startIndex, endIndex),
        totalPages: Math.ceil(result.length / limit),
      },
    });
  } catch (error) {
    showError(error, res);
  }
};

export const getMemberProductMessage = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const result = await messages
      .find({
        $or: [{ prodcutId: req.params.id, isShow: true }, { userId: req.user._id }],
      })
      .select('-isShow -createDate');

    res.status(200).json({
      success: true,
      message: '',
      result: {
        data: result.slice(startIndex, endIndex),
        totalPages: Math.ceil(result.length / limit),
      },
    });
  } catch (error) {
    showError(error, res);
  }
};

export const getMemberAllProductMessage = async (req, res) => {
  try {
    const userProduct = await products.find({ userId: req.user._id }).select('_id ');

    const result = await messages
      .find({ prodcutId: userProduct, reply: '' })
      .select('-isShow')
      .populate('prodcutId', 'name image');

    res.status(200).json({
      success: true,
      message: '',
      result,
    });
  } catch (error) {
    showError(error, res);
  }
};

export const replayMessage = async (req, res) => {
  try {
    await messages.findByIdAndUpdate(
      req.params.id,
      { reply: req.body.reply, isShow: true },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: '',
    });
  } catch (error) {
    showError(error, res);
  }
};
