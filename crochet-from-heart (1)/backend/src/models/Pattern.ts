import mongoose, { Document, Schema } from 'mongoose';

interface IPatternVersion {
  stepsMarkdown: string;
  images: string[];
  createdAt: Date;
}

export interface IPattern extends Document {
  title: string;
  authorRef: mongoose.Types.ObjectId;
  summary: string;
  stepsMarkdown: string;
  materials: string[];
  images: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  likesCount: number;
  versions: IPatternVersion[];
  createdAt: Date;
}

const patternVersionSchema = new Schema<IPatternVersion>({
  stepsMarkdown: { type: String, required: true },
  images: [String],
  createdAt: { type: Date, default: Date.now }
});

const patternSchema = new Schema<IPattern>({
  title: { type: String, required: true },
  authorRef: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  summary: { type: String, required: true },
  stepsMarkdown: { type: String, required: true },
  materials: [String],
  images: [String],
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  tags: [String],
  likesCount: { type: Number, default: 0 },
  versions: [patternVersionSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPattern>('Pattern', patternSchema);