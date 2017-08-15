const express = require('express');
const app = express();
const swig = require('swig');
const path = require('path');
const port = process.env.PORT || 3000;
const routes = require('./routes');
const db = require('./db');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));
swig.setDefaults({cache: false});
app.set('view engine', "html");
app.engine('html', swig.renderFile);
app.use(express.static(path.join(__dirname, 'node_modules')));

app.get('/', (req, res, next) => res.render('index', {homeActive: "active"}));
app.use('/users', routes);

db.sync()
.then(() => db.seed())
.then(() => {
  console.log('Synced and Seeded, Baby!');
  app.listen(port, () => console.log(`Listening intently on port ${port}`));
})
.catch( (err)  => console.log(err));

