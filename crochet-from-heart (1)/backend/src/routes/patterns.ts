import express from 'express';
import { z } from 'zod';
import Pattern from '../models/Pattern';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { sanitize } from '../utils/sanitize';

const router = express.Router();

const patternSchema = z.object({
  title: z.string().min(1).max(100),
  summary: z.string().min(1).max(500),
  stepsMarkdown: z.string().min(1),
  materials: z.array(z.string()),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  tags: z.array(z.string())
});

router.get('/', optionalAuth, async (req, res) => {
  try {
    const { q, tag, difficulty } = req.query;
    let filter: any = {};

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { summary: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q as string, 'i')] } }
      ];
    }

    if (tag) {
      filter.tags = { $in: [tag] };
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const patterns = await Pattern.find(filter)
      .populate('authorRef', 'name avatarUrl')
      .sort({ createdAt: -1 });

    res.json(patterns);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const pattern = await Pattern.findById(req.params.id)
      .populate('authorRef', 'name avatarUrl bio');
    
    if (!pattern) {
      return res.status(404).json({ message: 'Pattern not found' });
    }

    res.json(pattern);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const validatedData = patternSchema.parse(req.body);
    const sanitizedSteps = sanitize(validatedData.stepsMarkdown);

    const pattern = new Pattern({
      ...validatedData,
      stepsMarkdown: sanitizedSteps,
      authorRef: req.user.userId,
      images: req.body.images || []
    });

    const savedPattern = await pattern.save();
    await savedPattern.populate('authorRef', 'name avatarUrl');
    
    res.status(201).json(savedPattern);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const pattern = await Pattern.findById(req.params.id);
    
    if (!pattern) {
      return res.status(404).json({ message: 'Pattern not found' });
    }

    if (pattern.authorRef.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this pattern' });
    }

    const validatedData = patternSchema.partial().parse(req.body);
    const updates: any = { ...validatedData };

    if (updates.stepsMarkdown) {
      updates.stepsMarkdown = sanitize(updates.stepsMarkdown);
    }

    if (updates.stepsMarkdown || updates.images) {
      updates.$push = {
        versions: {
          stepsMarkdown: pattern.stepsMarkdown,
          images: pattern.images,
          createdAt: new Date()
        }
      };
    }

    const updatedPattern = await Pattern.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate('authorRef', 'name avatarUrl');

    res.json(updatedPattern);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q, tag, difficulty } = req.query;
    let query: any = {};

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { summary: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q as string, 'i')] } }
      ];
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    const patterns = await Pattern.find(query)
      .populate('authorRef', 'name avatarUrl')
      .sort({ createdAt: -1 });

    res.json(patterns);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;