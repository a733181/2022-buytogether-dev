import banks from '../models/banks.js';

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

export const createBank = async (req, res) => {
  try {
    const result = await banks.create({
      userId: req.body.userId || req.user._id,
      bankName: req.body.bankName,
      bankNumber: req.body.bankNumber,
      preset: req.body.preset,
    });

    if (req.body.preset) {
      await banks.findOneAndUpdate({ preset: true }, { preset: false }, { new: true });
    }
    res.status(200).json({
      success: true,
      message: '',
      result: {
        _id: result._id,
        bankName: result.bankName,
        bankNumber: result.bankNumber,
        preset: result.preset,
        userId: result.userId,
      },
    });
  } catch (error) {
    showError(error, res);
  }
};

export const editBank = async (req, res) => {
  try {
    const data = {
      bankName: req.body.bankName,
      bankNumber: req.body.bankNumber,
      preset: req.body.preset || false,
    };

    if (req.body.preset) {
      await banks.findOneAndUpdate({ preset: true }, { preset: false }, { new: true });
    }

    const result = await banks
      .findByIdAndUpdate(req.params.id, data, { new: true })
      .select('-status');

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
    showError(error, res);
  }
};
