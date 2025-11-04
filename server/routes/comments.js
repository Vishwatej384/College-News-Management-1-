const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get comments for a news article
router.get('/news/:newsId', async (req, res) => {
  try {
    const { newsId } = req.params;

    const [comments] = await pool.query(`
      SELECT c.*, u.name as user_name, u.profile_image as user_image, u.role as user_role
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.news_id = ?
      ORDER BY c.created_at DESC
    `, [newsId]);

    // Organize comments into threads
    const commentMap = {};
    const rootComments = [];

    comments.forEach(comment => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });

    comments.forEach(comment => {
      if (comment.parent_id) {
        if (commentMap[comment.parent_id]) {
          commentMap[comment.parent_id].replies.push(commentMap[comment.id]);
        }
      } else {
        rootComments.push(commentMap[comment.id]);
      }
    });

    res.json({ comments: rootComments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment
router.post('/', auth, [
  body('news_id').isInt().withMessage('Valid news ID is required'),
  body('content').trim().notEmpty().withMessage('Comment content is required'),
  body('parent_id').optional().isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { news_id, content, parent_id } = req.body;

    const [result] = await pool.query(
      'INSERT INTO comments (news_id, user_id, content, parent_id) VALUES (?, ?, ?, ?)',
      [news_id, req.user.id, content, parent_id || null]
    );

    res.status(201).json({
      message: 'Comment added successfully',
      comment: { id: result.insertId }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const [comments] = await pool.query('SELECT * FROM comments WHERE id = ?', [id]);
    if (comments.length === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comments[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await pool.query('DELETE FROM comments WHERE id = ?', [id]);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
