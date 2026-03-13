const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { getConversations, createConversation, getConversation, updateConversation, deleteConversation } = require('../controllers/conversationController');

router.route('/')
    .get(protect, getConversations)
    .post(protect, createConversation);

router.route('/:id')
    .get(protect, getConversation)
    .put(protect, updateConversation)
    .delete(protect, deleteConversation);

module.exports = router;