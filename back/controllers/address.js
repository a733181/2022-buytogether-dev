import address from '../models/address.js';

export const createAddress = async (req, res) => {
  try {
    const result = await address.create({
      userId: req.user._id,
      city: req.body.city,
      districts: req.body.districts,
      street: req.body.street,
      code: req.body.code,
      phone: req.body.phone,
      name: req.body.name,
    });

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

export const editAddress = async (req, res) => {
  try {
    const data = {
      city: req.body.city,
      districts: req.body.districts,
      street: req.body.street,
      code: req.body.code,
      phone: req.body.phone,
      name: req.body.name,
    };

    const result = await address
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
    if (error.name === 'ValidationError') {
      res
        .status(400)
        .json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message });
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' });
    }
  }
};
