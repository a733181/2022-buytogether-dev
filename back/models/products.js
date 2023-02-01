import { Schema, model, ObjectId } from 'mongoose';

const porductsSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      ref: 'users',
      required: [true, '缺少會員'],
    },
    name: {
      type: String,
      trim: true,
      required: [true, '缺少名稱'],
    },
    price: {
      type: Number,
      trim: true,
      min: [0, '價格錯誤'],
      required: [true, '缺少價格'],
    },
    maxNumber: {
      type: Number,
      trim: true,
      min: [0, '數量錯誤'],
      required: [true, '缺少最大數量'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, '缺少說明'],
    },
    image: {
      type: String,
      required: [true, '缺少圖片'],
    },
    images: {
      type: [String],
      default: [],
    },
    bankId: {
      type: ObjectId,
      ref: 'banks',
      required: [true, '缺少收款帳戶'],
    },
    likes: {
      type: [
        {
          type: ObjectId,
          ref: 'users',
        },
      ],
      default: [],
    },
    isSell: {
      type: Boolean,
      required: [true, '缺少狀態'],
    },
    category: {
      type: String,
      required: [true, '缺少分類'],
      enum: {
        values: ['3C', '家電', '日用', '食品', '生活', '戶外', '美妝', '衣鞋包錶', '飾品', '書'],
        message: '分類錯誤',
      },
    },
    status: {
      type: Number,
      default: 0,
    },
    youtubeId: {
      type: String,
      default: '',
    },
    createDate: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

export default model('products', porductsSchema);
