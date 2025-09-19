import mongoose, { Document, Schema } from 'mongoose';

export interface IComment {
  authorRef: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IPost extends Document {
  authorRef: mongoose.Types.ObjectId;
  contentMarkdown: string;
  images: string[];
  comments: IComment[];
  likes: { userId: mongoose.Types.ObjectId }[];
  likesCount: number;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>({
  authorRef: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new Schema<IPost>({
  authorRef: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  contentMarkdown: { type: String, required: true },
  images: [String],
  comments: [commentSchema],
  likes: [{ userId: { type: Schema.Types.ObjectId, ref: 'User' } }],
  likesCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPost>('Post', postSchema);