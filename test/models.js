const mocha = require('mocha');
const expect = require('chai').expect;
const db = require('../db');




describe('Acme Users Mentors', function(){
	describe('seeding:', function(){
		it('should have 3 users', function(){
			return db.User.findAll()
			.then(users => {
				expect(users.length).to.equal(3);
			}) 
		})
	})

})

