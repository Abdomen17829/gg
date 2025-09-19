import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  text: string;
  author: mongoose.Types.ObjectId;
  conversation: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  conversation: { type: String, required: true, default: 'global' },
  createdAt: { type: Date, default: Date.now }
});

messageSchema.index({ conversation: 1, createdAt: 1 });

export default mongoose.model<IMessage>('Message', messageSchema);