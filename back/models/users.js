import { Schema, model, ObjectId, Error } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const cartSchema = new Schema({
  productId: {
    type: ObjectId,
    ref: 'products',
    required: [true, '缺少商品'],
  },
  quantity: {
    type: Number,
    required: [true, '缺少數量'],
  },
});

const userSchema = new Schema(
  {
    phone: {
      type: String,
      required: [true, '缺少電話號碼'],
      unique: true,
      trim: true,
      validate: {
        validator(phone) {
          return validator.isMobilePhone(phone, ['zh-TW']);
        },
      },
    },
    name: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
      maxlength: [12, '名稱太長'],
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
      vaildate: {
        validator(email) {
          return validator.isEmail(email);
        },
      },
    },
    favorites: {
      type: [
        {
          type: ObjectId,
          ref: 'porducts',
        },
      ],
      default: [],
    },
    black: {
      type: [
        {
          type: ObjectId,
          ref: 'users',
        },
      ],
      default: [],
    },
    track: {
      type: [
        {
          type: ObjectId,
          ref: 'users',
        },
      ],
      default: [],
    },
    tokens: {
      type: [String],
      default: [],
    },
    cart: {
      type: [cartSchema],
      default: [],
    },
    image: { type: String },
    role: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false },
);

userSchema.pre('save', function (next) {
  const user = this;
  if (user.isModified('password')) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = bcrypt.hashSync(user.password, 10);
    } else {
      const error = new Error.ValidationError(null);
      error.addError('password', new Error.ValidatorError({ message: '密碼長度錯誤' }));
      next(error);
      return;
    }
  }
  next();
});

userSchema.pre('findOneAndUpdate', function (next) {
  const user = this._update;
  if (user.password) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = bcrypt.hashSync(user.password, 10);
    } else {
      const error = new Error.ValidationError(null);
      error.addError('password', new Error.ValidatorError({ message: '密碼長度錯誤' }));
      next(error);
      return;
    }
  }
  next();
});

export default model('users', userSchema);
