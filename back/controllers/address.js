import address from '../models/address.js';

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

export const createAddress = async (req, res) => {
  try {
    const result = await address.create({
      userId: req.body.userId || req.user._id,
      city: req.body.city,
      districts: req.body.districts,
      street: req.body.street,
      code: req.body.code,
      phone: req.body.phone,
      name: req.body.name,
      preset: req.body.preset,
    });

    if (req.body.preset) {
      await address.findOneAndUpdate({ preset: true }, { preset: false }, { new: true });
    }

    res.status(200).json({
      success: true,
      message: '',
      result: {
        _id: result._id,
        city: result.city,
        districts: result.districts,
        street: result.street,
        code: result.code,
        phone: result.phone,
        name: req.body.name,
        preset: result.preset,
        userId: result.userId,
      },
    });
  } catch (error) {
    showError(error, res);
  }
};

export const editAddress = async (req, res) => {
  try {
    const data = {
      city: req.body.city,
      districts: req.body.districts,
      street: req.body.street,
      code: req.body.code,
      phone: req.body.phone,
      name: req.body.name,
      preset: req.body.preset,
    };

    if (req.body.preset) {
      await address.findOneAndUpdate({ preset: true }, { preset: false }, { new: true });
    }

    const result = await address
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

export const deleteAddress = async (req, res) => {
  try {
    const data = {
      status: 1,
    };

    const result = await address.findByIdAndUpdate(req.params.id, data, { new: true });

    if (!result) {
      res.status(404).json({ success: false, message: '找不到' });
    } else {
      res.status(200).json({ success: true, message: '' });
    }
  } catch (error) {
    showError(error, res);
  }
};
