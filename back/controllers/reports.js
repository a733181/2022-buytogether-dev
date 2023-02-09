import reports from '../models/reports.js';

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

export const createReports = async (req, res) => {
  await reports.create({
    userId: req.user._id,
    productId: req.body.productId,
    message: req.body.message,
  });

  res.status(200).json({
    success: true,
    message: '',
  });
  try {
  } catch (error) {
    showError(error, res);
  }
};
