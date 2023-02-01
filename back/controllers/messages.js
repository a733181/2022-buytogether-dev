import message from '../models/messages.js';

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
  const result = await message.create({
    userId: req.user._id,
    prodcutId: req.body.prodcutId,
    message: req.body.message,
  });

  console.log(result);
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
