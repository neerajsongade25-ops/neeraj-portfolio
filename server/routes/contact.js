const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { submitContact, getMessages, markRead, deleteMessage } = require('../controllers/contactController');

router.post('/', submitContact);
router.get('/messages', auth, getMessages);
router.patch('/messages/:id/read', auth, markRead);
router.delete('/messages/:id', auth, deleteMessage);

module.exports = router;
