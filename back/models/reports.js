import { Schema, model, ObjectId } from 'mongoose';

const reportSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      ref: 'users',
    },
    prodcutId: {
      type: ObjectId,
      ref: 'products',
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    createDate: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

export default model('reports', reportSchema);
