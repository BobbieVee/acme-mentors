const mocha = require('mocha');
const expect = require('chai').expect;
const db = require('../db');
const User = db.models.User;
const Award = db.models.Award;

describe('Acme Users Mentors', function(){
	describe('After seeding:', function(){
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
				expect(viewModel.users[2].awards.length).to.equal(1);
				expect(viewModel.users[1].mentor.mentorName).to.equal('Gandolf the White');
				expect(viewModel.users.length).to.equal(3);
				expect(viewModel.users[1].name).to.equal('Frodo Baggins');
				expect(viewModel.users[1].id).to.equal(2);
			})
			.catch((err) => console.error(err))
		});
		it('creates new user', function(){
			return User.create({name: "Professor Biggins"})
			.then((user) => {
				expect(user.name).to.equal('Professor Biggins');
				expect(user.id).to.equal(4)
			})
			.catch(err => console.error(err));
		});
		it('deletes this new user', function() {
			return User.destroy({where: {id: 4}})
			.then((numberDeleted) => expect(numberDeleted).to.equal(1))
			.catch(err => console.error(err));
		});
		it('removes mentor from user', function() {
			return User.update({mentorId: null}, {where: {id: 1}})
			.then(() => User.findById(1))
			.then((user) => expect(user.mentorId).to.equal(null))
			.catch(err => console.error(err));
		});
		it('adds new mentor from user', function() {
			return User.update({mentorId: 2}, {where: {id: 1}})
			.then(() => User.findById(1))
			.then((user) => expect(user.mentorId).to.equal(2))
			.catch(err => console.error(err));
		});
		it('adds new award to user', function() {
			return User.generateAward(2)
			.then(() => User.findUsersViewModel())
			.then((viewModel) => expect(viewModel.users[1].awards.length).to.equal(2))
			.catch(err => console.error(err));
		});
		it('removes newly added award', function() {
			return User.removeAward(2,5)
			.then(() => User.findUsersViewModel())
			.then((viewModel) => expect(viewModel.users[1].awards.length).to.equal(1))
			.catch(err => console.error(err));
		});

	});
})