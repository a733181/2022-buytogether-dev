import contacts from '../models/contacts.js';

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

export const creatContact = async (req, res) => {
  try {
    await contacts.create({
      userId: req.user._id,
      message: req.body.message,
    });

    res.status(200).json({
      success: true,
      message: '',
    });
  } catch (error) {
    showError(error, res);
  }
};

export const replayContact = async (req, res) => {
  try {
    await contacts.findByIdAndUpdate(req.body.id, { reply: req.body.reply }, { new: true });

    res.status(200).json({
      success: true,
      message: '',
    });
  } catch (error) {
    showError(error, res);
  }
};

export const getMemberContact = async (req, res) => {
  try {
    const result = await contacts.find({ userId: req.user._id });

    res.status(200).json({
      success: true,
      message: '',
      result: result.filter((item) => item.reply !== ''),
    });
  } catch (error) {
    showError(error, res);
  }
};

export const getAdminContact = async (req, res) => {
  try {
    const result = await contacts.find();

    res.status(200).json({
      success: true,
      message: '',
      result,
    });
  } catch (error) {
    showError(error, res);
  }
};
