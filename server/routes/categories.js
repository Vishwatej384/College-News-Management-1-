const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const [categories] = await pool.query(`
      SELECT c.*, COUNT(n.id) as news_count
      FROM categories c
      LEFT JOIN news n ON c.id = n.category_id AND n.status = 'published'
      GROUP BY c.id
      ORDER BY c.name ASC
    `);

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
