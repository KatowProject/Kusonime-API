const router = require('express').Router();
const controller = require('../controllers/general');

router.get('/', (req, res) => res.json({ success: true, message: 'Welcome to the API' }));

router.get('/home', controller.home);
router.get('/home/:page', controller.home);
router.get('/anime/:endpoint', controller.anime);

module.exports = router;