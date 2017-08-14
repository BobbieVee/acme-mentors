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
				expect(viewModel[0].awards[0].title).to.equal('Wicked-good Wizard');
				expect(viewModel[2].awards.length).to.equal(2);
				expect(viewModel[1].mentor.mentorName).to.equal('Gandolf the White');
				expect(viewModel.length).to.equal(3);
				expect(viewModel[1].name).to.equal('Samwise Gamgee');
				expect(viewModel[1].id).to.equal(1);
			})
			.catch((err) => console.error(err))
		})
	});
})