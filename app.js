const express = require('express');
const app = express();
const swig = require('swig');
const path = require('path');
const port = process.env.PORT || 3000;
const routes = require('./routes');


swig.setDefaults({cache: false});
app.set('view engine', "html");
app.engine('html', swig.renderFile);
app.use(express.static(path.join(__dirname, 'node_modules')));

app.get('/', (req, res, next) => res.render('index', {}));
app.use('/users', routes);



app.listen(port, () => console.log(`Listening intently on port ${port}`));