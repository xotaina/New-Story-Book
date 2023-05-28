const router = require('express').Router();
const userRoutes = require('./user-routes');
const storyRoutes = require('./book-routes');
const commentRoutes = require('./comment-routes');

router.use('/users', userRoutes);
router.use('/stories', storyRoutes);
router.use('/comments', commentRoutes);

module.exports = router;