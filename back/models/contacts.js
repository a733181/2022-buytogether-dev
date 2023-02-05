import { Schema, model, ObjectId } from 'mongoose';

const contactSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      ref: 'users',
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
    createDate: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

export default model('contacts', contactSchema);
