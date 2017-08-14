const mocha = require('mocha');
const expect = require('chai').expect;
const db = require('../db');
const User = db.models.User;
const Award = db.models.Award;

describe('Acme Users Mentors', function(){
	describe('seeding:', function(){
		before(()=> {
    	return db.sync()
      .then(()=> {
      	return db.seed();
      } );

  	});
		it('should have 3 users', function(){
			return User.findAll()
			.then(users => {
				expect(users.length).to.equal(3);
			}); 
		});
		it('should have 4 awards', function(){
			return Award.findAll()
			.then(awards => {
				expect(awards.length).to.equal(4);
			}); 
		});
		it('Sam should have Gandolf as a mentor', function(){
			return User.findOne({
				where: {name: "Samwise Gamgee"},
				include: [{model: User, 
					as: "mentor",
					attributes: ['name', 'id']
				}]
			})
			.then((user) => {
				expect(user.mentor.name).to.equal('Gandolf the White');
			});  
		});
		it('findUsersViewModel() returns viewModel', function(){
			return User.findUsersViewModel() 
			.then(viewModel => {
				console.log('viewModel[1].award.title = ', viewModel[1].award[0].title)
				expect(viewModel[1].mentor.name).to.equal('Gandolf the White');
				expect(viewModel[1].award[0].title).to.equal('Fellowship of the Ring');
				expect(viewModel[1].mentor.id).to.equal(3);
				expect(viewModel.length).to.equal(3);
				expect(viewModel[0].id).to.equal(3);
			})
			.catch((err) => console.error(err))
		})
	});
})