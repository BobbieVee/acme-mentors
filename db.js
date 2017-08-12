const Sequelize = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL);

const User = db.define('user', {
	name: Sequelize.STRING
});

const Award = db.define('award', {
	title: Sequelize.STRING
});

Award.belongsTo(User);
User.hasOne(User, {as: 'mentor'});

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
			User.update({mentorId: frodo.id}, {where: {id: sam.id}})
		])
	})
	.catch(err => console.log(err))
}

module.exports = {
	sync,
	seed
};