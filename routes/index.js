const router = require('express').Router();



router.get('/', (req, res, next) => res.render('users', {usersActive: "active"}));


module.exports = router;