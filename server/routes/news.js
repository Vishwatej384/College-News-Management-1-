const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Helper function to create slug
const createSlug = (title) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

// Get all published news (public)
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT n.*, u.name as author_name, u.profile_image as author_image, u.department as author_department,
             c.name as category_name, c.slug as category_slug, c.color as category_color,
             (SELECT COUNT(*) FROM likes WHERE news_id = n.id) as likes_count,
             (SELECT COUNT(*) FROM comments WHERE news_id = n.id) as comments_count
      FROM news n
      LEFT JOIN users u ON n.author_id = u.id
      LEFT JOIN categories c ON n.category_id = c.id
      WHERE n.status = 'published'
    `;

    const params = [];

    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (n.title LIKE ? OR n.content LIKE ? OR n.excerpt LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (featured === 'true') {
      query += ' AND n.is_featured = TRUE';
    }

    query += ' ORDER BY n.published_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [news] = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM news n LEFT JOIN categories c ON n.category_id = c.id WHERE n.status = "published"';
    const countParams = [];
    
    if (category) {
      countQuery += ' AND c.slug = ?';
      countParams.push(category);
    }
    
    if (search) {
      countQuery += ' AND (n.title LIKE ? OR n.content LIKE ? OR n.excerpt LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      news,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single news by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const [news] = await pool.query(`
      SELECT n.*, u.name as author_name, u.profile_image as author_image, u.department as author_department, u.bio as author_bio,
             c.name as category_name, c.slug as category_slug, c.color as category_color,
             (SELECT COUNT(*) FROM likes WHERE news_id = n.id) as likes_count,
             (SELECT COUNT(*) FROM comments WHERE news_id = n.id) as comments_count
      FROM news n
      LEFT JOIN users u ON n.author_id = u.id
      LEFT JOIN categories c ON n.category_id = c.id
      WHERE n.slug = ? AND n.status = 'published'
    `, [slug]);

    if (news.length === 0) {
      return res.status(404).json({ message: 'News not found' });
    }

    // Increment views
    await pool.query('UPDATE news SET views = views + 1 WHERE id = ?', [news[0].id]);
    news[0].views += 1;

    res.json({ news: news[0] });
  } catch (error) {
    console.error('Get news by slug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create news (admin/editor only)
router.post('/', auth, authorize('admin', 'editor'), upload.single('featured_image'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('category_id').isInt().withMessage('Valid category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, excerpt, category_id, status, is_featured } = req.body;
    const slug = createSlug(title) + '-' + Date.now();
    const featured_image = req.file ? `/uploads/${req.file.filename}` : null;
    const published_at = status === 'published' ? new Date() : null;

    const [result] = await pool.query(
      `INSERT INTO news (title, slug, content, excerpt, featured_image, author_id, category_id, status, is_featured, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, content, excerpt || null, featured_image, req.user.id, category_id, status || 'draft', is_featured || false, published_at]
    );

    res.status(201).json({
      message: 'News created successfully',
      news: { id: result.insertId, slug }
    });
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update news (admin/editor only)
router.put('/:id', auth, authorize('admin', 'editor'), upload.single('featured_image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, category_id, status, is_featured } = req.body;

    // Check if news exists and user has permission
    const [existingNews] = await pool.query('SELECT * FROM news WHERE id = ?', [id]);
    if (existingNews.length === 0) {
      return res.status(404).json({ message: 'News not found' });
    }

    if (req.user.role !== 'admin' && existingNews[0].author_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const slug = title ? createSlug(title) + '-' + Date.now() : existingNews[0].slug;
    const featured_image = req.file ? `/uploads/${req.file.filename}` : existingNews[0].featured_image;
    const published_at = status === 'published' && !existingNews[0].published_at ? new Date() : existingNews[0].published_at;

    await pool.query(
      `UPDATE news SET title = ?, slug = ?, content = ?, excerpt = ?, featured_image = ?, 
       category_id = ?, status = ?, is_featured = ?, published_at = ? WHERE id = ?`,
      [
        title || existingNews[0].title,
        slug,
        content || existingNews[0].content,
        excerpt !== undefined ? excerpt : existingNews[0].excerpt,
        featured_image,
        category_id || existingNews[0].category_id,
        status || existingNews[0].status,
        is_featured !== undefined ? is_featured : existingNews[0].is_featured,
        published_at,
        id
      ]
    );

    res.json({ message: 'News updated successfully' });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete news (admin/editor only)
router.delete('/:id', auth, authorize('admin', 'editor'), async (req, res) => {
  try {
    const { id } = req.params;

    const [existingNews] = await pool.query('SELECT * FROM news WHERE id = ?', [id]);
    if (existingNews.length === 0) {
      return res.status(404).json({ message: 'News not found' });
    }

    if (req.user.role !== 'admin' && existingNews[0].author_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await pool.query('DELETE FROM news WHERE id = ?', [id]);
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike news
router.post('/:id/like', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT * FROM likes WHERE news_id = ? AND user_id = ?', [id, req.user.id]);

    if (existing.length > 0) {
      await pool.query('DELETE FROM likes WHERE news_id = ? AND user_id = ?', [id, req.user.id]);
      res.json({ message: 'Like removed', liked: false });
    } else {
      await pool.query('INSERT INTO likes (news_id, user_id) VALUES (?, ?)', [id, req.user.id]);
      res.json({ message: 'News liked', liked: true });
    }
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bookmark/Unbookmark news
router.post('/:id/bookmark', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT * FROM bookmarks WHERE news_id = ? AND user_id = ?', [id, req.user.id]);

    if (existing.length > 0) {
      await pool.query('DELETE FROM bookmarks WHERE news_id = ? AND user_id = ?', [id, req.user.id]);
      res.json({ message: 'Bookmark removed', bookmarked: false });
    } else {
      await pool.query('INSERT INTO bookmarks (news_id, user_id) VALUES (?, ?)', [id, req.user.id]);
      res.json({ message: 'News bookmarked', bookmarked: true });
    }
  } catch (error) {
    console.error('Bookmark error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's bookmarked news
router.get('/user/bookmarks', auth, async (req, res) => {
  try {
    const [news] = await pool.query(`
      SELECT n.*, u.name as author_name, c.name as category_name, c.color as category_color,
             (SELECT COUNT(*) FROM likes WHERE news_id = n.id) as likes_count,
             (SELECT COUNT(*) FROM comments WHERE news_id = n.id) as comments_count
      FROM bookmarks b
      JOIN news n ON b.news_id = n.id
      LEFT JOIN users u ON n.author_id = u.id
      LEFT JOIN categories c ON n.category_id = c.id
      WHERE b.user_id = ? AND n.status = 'published'
      ORDER BY b.created_at DESC
    `, [req.user.id]);

    res.json({ news });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
