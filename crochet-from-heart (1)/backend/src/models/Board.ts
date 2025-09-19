import mongoose, { Document, Schema } from 'mongoose';

export interface IBoardItem {
  pattern: mongoose.Types.ObjectId;
  addedAt: Date;
  notes?: string;
}

export interface IBoard extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  items: IBoardItem[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const boardItemSchema = new Schema<IBoardItem>({
  pattern: { type: Schema.Types.ObjectId, ref: 'Pattern', required: true },
  addedAt: { type: Date, default: Date.now },
  notes: String
});

const boardSchema = new Schema<IBoard>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  items: [boardItemSchema],
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

boardSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IBoard>('Board', boardSchema);