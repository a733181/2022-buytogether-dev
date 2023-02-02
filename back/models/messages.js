import { Schema, model, ObjectId } from 'mongoose';

const messagesShema = new Schema(
  {
    userId: {
      type: ObjectId,
      ref: 'users',
    },
    prodcutId: {
      type: ObjectId,
      ref: 'products',
    },
    message: {
      type: String,
      trim: true,
    },
    reply: {
      type: String,
      trim: true,
      default: '',
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    createDate: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

export default model('message', messagesShema);
