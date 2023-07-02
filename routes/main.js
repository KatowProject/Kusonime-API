const router = require('express').Router();
const controller = require('../controllers/general');

router.get('/', (req, res) => res.json({ success: true, message: 'Welcome to the API' }));

router.get('/home', controller.home);
router.get('/home/:page', controller.home);
router.get('/anime-movie-list', controller.animeMovieList);
router.get('/daftar-live-action', controller.liveAction);
router.get('/list-anime-batch', controller.listAnimeBatch);
router.get('/list-anime-bd', controller.listAnimeBluerayDisk);
router.get('/list-anime-ona', controller.animeONA);
router.get('/list-anime-ova', controller.animeOVA);
router.get('/list-anime-special', controller.animeSpecial);
router.get('/genres', controller.genres);
router.get('/genres/:endpoint', controller.listAnimeGenres);
router.get('/genres/:endpoint/page/:page', controller.listAnimeGenres);
router.get('/seasons', controller.seasons);
router.get('/seasons/:endpoint', controller.listAnimeSeasons);
router.get('/seasons/:endpoint/page/:page', controller.listAnimeSeasons);
router.get('/anime/:endpoint', controller.anime);
router.get('/search/', controller.search);
router.get('/search/page/:page', controller.search);

module.exports = router;