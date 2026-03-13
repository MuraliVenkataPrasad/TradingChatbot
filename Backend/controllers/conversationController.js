const Conversation = require('../models/Conversation');

// @desc    Get all conversations for logged-in user
// @route   GET /api/conversations
// @access  Private
const getConversations = async (req, res) => {
  try {
    console.log('📥 Fetching conversations for user:', req.user.id);
    const conversations = await Conversation.find({ user: req.user.id })
      .sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (error) {
    console.error('❌ Error fetching conversations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single conversation by ID
// @route   GET /api/conversations/:id
// @access  Private
const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new conversation
// @route   POST /api/conversations
// @access  Private
const createConversation = async (req, res) => {
  try {
    console.log('➕ Creating new conversation for user:', req.user.id);
    const { title } = req.body;
    const conversation = new Conversation({
      user: req.user.id,
      title: title || 'New Conversation',
      messages: [],
    });
    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    console.error('❌ Error creating conversation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a conversation (add message, change title)
// @route   PUT /api/conversations/:id
// @access  Private
const updateConversation = async (req, res) => {
  try {
    const { title, messages } = req.body;
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (title) conversation.title = title;
    if (messages) conversation.messages = messages;

    await conversation.save();
    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a conversation
// @route   DELETE /api/conversations/:id
// @access  Private
const deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    await conversation.deleteOne();
    res.json({ message: 'Conversation removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getConversations,
  getConversation,
  createConversation,
  updateConversation,
  deleteConversation,
};