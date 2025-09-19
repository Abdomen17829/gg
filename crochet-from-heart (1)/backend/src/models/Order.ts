import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  pattern: mongoose.Types.ObjectId;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  stripePaymentIntentId?: string;
  createdAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  pattern: { type: Schema.Types.ObjectId, ref: 'Pattern', required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const orderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded'], 
    default: 'pending' 
  },
  stripePaymentIntentId: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IOrder>('Order', orderSchema);