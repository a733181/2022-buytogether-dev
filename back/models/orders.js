import { Schema, model, ObjectId } from 'mongoose';

const productsSchema = new Schema({
  productId: {
    type: ObjectId,
    ref: 'products',
    required: [true, '缺少商品'],
  },
  quantity: {
    type: Number,
    required: [true, '缺少數量'],
  },
  price: {
    type: Number,
    require: [true, '缺少金額'],
  },
  paid: {
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidDate: {
      type: Date,
    },
  },
  shippingStatus: {
    type: Number,
    trim: true,
    default: 0,
  },
});

const schema = new Schema(
  {
    userId: {
      type: ObjectId,
      ref: 'users',
      required: [true, '缺少會員'],
    },
    products: {
      type: [productsSchema],
      default: [],
    },
    addressId: {
      type: ObjectId,
      ref: 'address',
      required: [true, '缺少收件地址'],
    },
    bankId: {
      type: ObjectId,
      ref: 'banks',
      required: [true, '缺少付款帳戶'],
    },
    createDate: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

export default model('orders', schema);
