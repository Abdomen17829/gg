import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'member' | 'mod' | 'admin';
  avatarUrl?: string;
  bio?: string;
  language: 'en' | 'ar';
  theme: 'light' | 'dark';
  favorites: mongoose.Types.ObjectId[];
  isBanned: boolean;
  banReason?: string;
  bannedAt?: Date;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['member', 'mod', 'admin'], default: 'member' },
  avatarUrl: String,
  bio: String,
  language: { type: String, enum: ['en', 'ar'], default: 'en' },
  theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Pattern' }],
  isBanned: { type: Boolean, default: false },
  banReason: String,
  bannedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', userSchema);