const router = require('express').Router();
const Model = require('../models/Achievements');
const createCRUD = require('../controllers/crudController');
const { protect } = require('../middleware/auth');
const resolveUser = require('../middleware/resolveUser');
const upload = require('../middleware/upload');
const crud = createCRUD(Model);

router.get('/me', protect, crud.getMine);
router.get('/public/:username', resolveUser, crud.getPublic);
router.post('/', protect, upload.single('image'), crud.create);
router.put('/:id', protect, upload.single('image'), crud.update);
router.delete('/:id', protect, crud.remove);

module.exports = router;
