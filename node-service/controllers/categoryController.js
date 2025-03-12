const { pool } = require('../config/db');

// Get all categories
async function getAllCategories(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM categories');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}

// Create a new category
async function createCategory(req, res) {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO categories (name) VALUES (?)',
      [name]
    );
    
    res.status(201).json({
      id: result.insertId,
      name,
      created_at: new Date(),
      updated_at: new Date()
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
}

module.exports = {
  getAllCategories,
  createCategory
};
