import { Schema, model, ObjectId } from 'mongoose';
import validator from 'validator';

const bankSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      ref: 'users',
    },
    bankName: {
      type: String,
      trim: true,
    },
    bankNumber: {
      type: Number,
      trim: true,
      minlength: [11, '帳戶太短'],
      maxlength: [16, '帳號太長'],
      validate: {
        validator(number) {
          return validator.isNumeric(String(number));
        },
      },
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false },
);

export default model('banks', bankSchema);
