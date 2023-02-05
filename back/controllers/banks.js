import banks from '../models/banks.js';

export const createBank = async (req, res) => {
  try {
    const result = await banks.create({
      userId: req.user._id,
      bankName: req.body.bankName,
      bankNumber: req.body.bankNumber,
    });

    res.status(200).json({
      success: true,
      message: '',
      result: {
        _id: result._id,
        bankName: result.bankName,
        bankNumber: result.bankNumber,
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

export const editBank = async (req, res) => {
  try {
    const data = {
      bankName: req.body.bankName,
      bankNumber: req.body.bankNumber,
    };

    const result = await banks
      .findByIdAndUpdate(req.params.id, data, { new: true })
      .select('-userId -status');

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
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' });
    }
  }
};

export const deleteBank = async (req, res) => {
  try {
    const data = {
      status: 1,
    };

    const result = await banks.findByIdAndUpdate(req.params.id, data, { new: true });

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
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' });
    }
  }
};
