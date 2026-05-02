const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getSkills, createSkill, updateSkill, deleteSkill } = require('../controllers/skillController');

router.get('/', getSkills);
router.post('/', auth, createSkill);
router.put('/:id', auth, updateSkill);
router.delete('/:id', auth, deleteSkill);

module.exports = router;
