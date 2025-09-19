import express from 'express';
import User from '../models/User';
import Post from '../models/Post';
import Pattern from '../models/Pattern';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken, requireRole(['admin', 'mod']));

router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-passwordHash')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/users/:id/ban', async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBanned = !user.isBanned;
    if (user.isBanned) {
      user.banReason = reason;
      user.bannedAt = new Date();
    } else {
      user.banReason = undefined;
      user.bannedAt = undefined;
    }

    await user.save();

    res.json({ 
      message: user.isBanned ? 'User banned successfully' : 'User unbanned successfully',
      user 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/reports', async (req, res) => {
  try {
    const reports: any[] = [];
    res.json({ reports });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.delete('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.delete('/patterns/:id', async (req, res) => {
  try {
    const pattern = await Pattern.findById(req.params.id);

    if (!pattern) {
      return res.status(404).json({ message: 'Pattern not found' });
    }

    await Pattern.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pattern deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;