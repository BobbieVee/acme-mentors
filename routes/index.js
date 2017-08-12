const router = require('express').Router();



router.get('/', (req, res, next) => res.render('users', {}));


module.exports = router;