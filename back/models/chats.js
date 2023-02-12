import { Schema, model, ObjectId } from 'mongoose';

const ChatSchema = new Schema(
  {
    fromUserId: {
      type: ObjectId,
      ref: 'users',
      required: true,
    },
    toUserId: {
      type: ObjectId,
      ref: 'users',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    createDate: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

export default model('chats', ChatSchema);
