const express = require('express');
const exphbs = require('express-handlebars');
const helpers = require('handlebars-helpers');
const { router } = require('./router/');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const config = require('./config/').getConfig(app.get('env'));

const hbs = exphbs.create({
  engine: 'hbs',
  extname: 'hbs',
  defaultLayout: 'main',
  helpers: helpers.comparison(),
  layoutsDir: `${__dirname}/views/layouts/`,
  partialsDir: ['views/templates/'],
});
app.engine('hbs', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view cache', true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '/public')));
app.use('/public', express.static(path.join(__dirname, '/public')));

app.use(router);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = config.isDev ? err : {};
  res.status(err.status || 500);
  res.render('error');
});


app.listen(config.port, () => console.log(`Server start http://${config.host}:${config.port}`));

