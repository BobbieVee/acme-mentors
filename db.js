const Sequelize = require('sequelize');
const faker = require('faker');
// const db = new Sequelize(process.env.DATABASE_URL);

const db = new Sequelize('postgres://localhost/acme_mentors', {logging: false})

const User = db.define('user', {
	name: Sequelize.STRING,
	canBeMentor: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	}
});

const Award = db.define('award', {
	title: Sequelize.STRING
});

User.findUsersViewModel = () => {
  return User.findAll({
  	include: [{
  		model: User, 
			as: "mentor",
			attributes: ['name', 'id', 'canBeMentor']
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

  		memo.push({'name': user.name, 'id': user.id, 'canBeMentor': user.canBeMentor, mentor, 'awards': awards});
  		return memo;
  	}, []);
  	console.log('viewModel = ', viewModel)
  	const mentorList = viewModel.reduce((memo, user) => {
  		if (user.canBeMentor) memo.push({'name': user.name, 'id': user.id, 'test': "test"}) ;
  		return memo;
  	}, [])
  	console.log('mentorList = ', mentorList)
  	return viewModel;
  } )
};

const awardData = (awards) => {
return awards.reduce((memo, award) => {
		memo.push({'title': award.title, 'awardId': award.id });
		return memo;
	}, []);
};

User.generateAward = (id) => {
	return Award.create({title: faker.company.catchPhrase(), userId: id})
	.then(() => Award.checkMentor(id)); 
};

User.removeAward = (awardId) => {
	return Award.destroy({where: {id: awardId}})
	.then(() => Award.checkMentor(id));
};

Award.checkMentor = (id) => {
	return Award.findAll({where: {userId: id}})
	.then((awards) => {
		awards.length > 1 ? User.update({canBeMentor: true}, {where: {id: id}}) : User.update({canBeMentor: false}, {where: {id: id}})
	});
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
			User.generateAward(sam.id),
			User.generateAward(gandolf.id),
			User.generateAward(frodo.id),
			User.generateAward(frodo.id),
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