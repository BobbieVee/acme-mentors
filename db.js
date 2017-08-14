const Sequelize = require('sequelize');
// const db = new Sequelize(process.env.DATABASE_URL);

const db = new Sequelize('postgres://localhost/acme_mentors', {logging: false})

const User = db.define('user', {
	name: Sequelize.STRING
});

User.findUsersViewModel = function() {
  return User.findAll({
  	include: [{
  		model: User, 
			as: "mentor",
			attributes: ['name', 'id']
		}, {model: Award, as: 'award', attributes: ['title', 'userId']}]
  })
  .then( (users) => {
  	return users;
  } )
};

const Award = db.define('award', {
	title: Sequelize.STRING
});


// Award.belongsTo(User, {as: 'user', foreignKey: 'userId' });
// User.hasOne(User, { as: 'mentee', foreignKey: 'menteeId'});
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