import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  text: string;
  author: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>({
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  createdAt: { type: Date, default: Date.now }
});

commentSchema.index({ post: 1, createdAt: 1 });

export default mongoose.model<IComment>('Comment', commentSchema);