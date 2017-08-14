const Sequelize = require('sequelize');
const faker = require('faker');
// const db = new Sequelize(process.env.DATABASE_URL);

const db = new Sequelize('postgres://localhost/acme_mentors', {logging: false})

const User = db.define('user', {
	name: Sequelize.STRING
});

const Award = db.define('award', {
	title: Sequelize.STRING
});

User.findUsersViewModel = () => {
  return User.findAll({
  	include: [{
  		model: User, 
			as: "mentor",
			attributes: ['name', 'id']
		}, {
			model: Award, 
			as: 'award', 
			attributes: ['title', 'userId', 'id']
		}]
  })
  .then( (users) => {
  	// Create view model from all user info:
  	let viewModel = users.reduce((memo, user) => {

  		// If mentor and/or awards exist, populate object or Array
  		const mentor = (user.mentor) ? {'mentorName': user.mentor.name, 'mentorId': user.mentor.id} : {};
  		const awards = (user.award) ? awardData(user.award) : [];

  		memo.push({'name': user.name, 'id': user.id, mentor, 'awards': awards});
  		return memo;
  	}, []);
  	return viewModel;
  } )
};

const awardData = (awards) => {
return awards.reduce((memo, award) => {
		memo.push({'title': award.title, 'awardId': award.id });
		return memo;
	}, []);
};

User.destroyById = (id) => {
	return User.destroy({where: {id: id}})
	.then(numberDeleted => numberDeleted);
};

User.generateAward = (id) => {
	return Award.create({title: faker.company.catchPhrase(), userId: id});
};

User.removeAward = (awardId) => {
	return Award.destroy({where: {id: awardId}});
};

User.belongsTo(User,{ as: 'mentor', foreignKey: 'mentorId'});
User.hasMany(Award, {as: 'award', foreignKey: 'userId' });

const sync = () => db.sync({force: true});

const seed = () => {
	Promise.all([
		User.create({name: "Samwise Gamgee"}),
		User.create({name: "Frodo Baggins"}),
		User.create({name: "Gandolf the White"})
	])
	.then(([sam, frodo, gandolf]) => {
		Promise.all([
			Award.create({title: 'Fellowship of the Ring', userId: sam.id}),
			Award.create({title: 'Wicked-good Wizard', userId: gandolf.id}),
			Award.create({title: 'Bearer of the Ring', userId: frodo.id}),
			Award.create({title: 'Disappearing Hobbit', userId: frodo.id}),
			User.update({mentorId: gandolf.id}, {where: {id: sam.id}}),
			User.update({mentorId: gandolf.id}, {where: {id: frodo.id}}),
		])
	})
	.catch(err => console.log(err))
}

module.exports = {
	sync,
	seed,
	models: { User, Award},
};