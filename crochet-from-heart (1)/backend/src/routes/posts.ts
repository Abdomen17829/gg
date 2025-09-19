import express from 'express';
import { z } from 'zod';
import Post from '../models/Post';
import Comment from '../models/Comment';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { sanitize } from '../utils/sanitize';

const router = express.Router();

const postSchema = z.object({
  contentMarkdown: z.string().min(1).max(10000),
  images: z.array(z.string().url()).optional()
});

const commentSchema = z.object({
  text: z.string().min(1).max(1000)
});

router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('authorRef', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      posts,
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

router.post('/', authenticateToken, async (req, res) => {
  try {
    const validatedData = postSchema.parse(req.body);
    const sanitizedContent = sanitize(validatedData.contentMarkdown);

    const post = new Post({
      contentMarkdown: sanitizedContent,
      images: validatedData.images || [],
      authorRef: req.user.userId
    });

    const savedPost = await post.save();
    await savedPost.populate('authorRef', 'name avatarUrl');

    res.status(201).json(savedPost);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('authorRef', 'name avatarUrl bio')
      .populate('comments.authorRef', 'name avatarUrl');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/:id/comments', authenticateToken, async (req, res) => {
  try {
    const validatedData = commentSchema.parse(req.body);
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = new Comment({
      text: validatedData.text,
      author: req.user.userId,
      post: req.params.id
    });

    await comment.save();
    await comment.populate('author', 'name avatarUrl');

    post.comments.push({
      authorRef: req.user.userId,
      text: validatedData.text,
      createdAt: new Date()
    });

    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.findIndex(
      (like: any) => like.userId && like.userId.toString() === req.user.userId
    );

    if (likeIndex === -1) {
      post.likes.push({ userId: req.user.userId });
      post.likesCount += 1;
    } else {
      post.likes.splice(likeIndex, 1);
      post.likesCount -= 1;
    }

    await post.save();
    res.json({ likesCount: post.likesCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;