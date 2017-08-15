const router = require('express').Router();
const models = require('../db').models;
const User = models.User;

const redirect = (res)=> {
  return ()=> {
    res.redirect('/users');
  };
};

//READ
// viewModel=   [ { name: 'Gandolf the White',
//     id: 3,
//     mentor: {},
//     awards: [ [Object] ] },
//   { name: 'Samwise Gamgee',
//     id: 1,
//     mentor: { mentorName: 'Gandolf the White', mentorId: 3 },
//     awards: [ [Object] ] },
//   { name: 'Frodo Baggins',
//     id: 2,
//     mentor: { mentorName: 'Gandolf the White', mentorId: 3 },
//     awards: [ [Object], [Object] ] } ]
//   AwardsArray: (viewModel[0].awards[0].title).to.equal('Wicked-good Wizard')
router.get('/', (req, res, next)=> {
  User.findUsersViewModel()
    .then(( viewModel )=> {
    	console.log('viewModel = ', viewModel)
    	console.log('viewModel[0].awards = ', viewModel.users[0].awards)
      res.render('users', Object.assign({usersActive: 'active'},viewModel));  
    })
    .catch(next);
});

//CREATE
router.post('/', (req, res, next)=> {
	console.log('req.body = ', req.body)
  User.create(req.body)
    .then(redirect(res))
    .catch(next);
});

//DELETE
router.delete('/:id', (req, res, next)=> {
  User.destroy({where: {id: req.params.id}})
    .then(redirect(res))
    .catch( next);
});

//UPDATE MENTOR
router.put('/:id', (req, res, next)=> {
	User.updateMentor(req.body, req.params.id)
    .then(redirect(res))
    .catch(next);
});

//CREATE AWARD
router.post('/:id/awards', (req, res, next)=> {
  User.generateAward(req.params.id)
    .then(redirect(res))
    .catch(next);
});

//DELETE AWARD
router.delete('/:userId/awards/:id', (req, res, next)=> {
	console.log('*Here')
  User.removeAward(req.params.userId, req.params.id)
    .then(redirect(res))
    .catch( next);
});



router.get('/', (req, res, next) => res.render('users', {usersActive: "active"}));


module.exports = router;