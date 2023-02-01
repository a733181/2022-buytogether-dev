import { Schema, model, ObjectId } from 'mongoose';
import validator from 'validator';

const addressSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      ref: 'users',
    },
    code: {
      type: Number,
      validate: {
        validator(number) {
          return validator.isNumeric(String(number));
        },
      },
    },
    city: {
      type: String,
      trim: true,
    },
    districts: {
      type: String,
      trim: true,
    },
    street: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator(phone) {
          return validator.isMobilePhone(phone, ['zh-TW']);
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

export default model('address', addressSchema);
