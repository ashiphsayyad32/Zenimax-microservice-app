const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

// Todo routes
router.get('/todos', todoController.getAllTodos);

module.exports = router;
