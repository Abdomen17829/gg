import express from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../models/User';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

const updateUserSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  bio: z.string().max(500).optional(),
  language: z.enum(['en', 'ar']).optional(),
  theme: z.enum(['light', 'dark']).optional(),
  avatarUrl: z.string().url().optional().or(z.literal(''))
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(req.params.id).select('-passwordHash -email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (req.params.id !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    const validatedData = updateUserSchema.parse(req.body);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: validatedData },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = newPasswordHash;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/favorites/:patternId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const patternId = req.params.patternId;
    if (!mongoose.Types.ObjectId.isValid(patternId)) {
      return res.status(400).json({ message: 'Invalid pattern ID' });
    }

    if (user.favorites.includes(new mongoose.Types.ObjectId(patternId))) {
      return res.status(400).json({ message: 'Pattern already in favorites' });
    }

    user.favorites.push(new mongoose.Types.ObjectId(patternId));
    await user.save();

    res.json({ message: 'Pattern added to favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.delete('/favorites/:patternId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const patternId = req.params.patternId;
    if (!mongoose.Types.ObjectId.isValid(patternId)) {
      return res.status(400).json({ message: 'Invalid pattern ID' });
    }

    user.favorites = user.favorites.filter(id => id.toString() !== patternId);
    await user.save();

    res.json({ message: 'Pattern removed from favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/favorites/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(userId)
      .populate('favorites')
      .select('favorites');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;