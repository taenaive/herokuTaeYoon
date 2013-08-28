
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes/index.js')
  , restApi= require('./routes/restapi')
  , user = require('./routes/user')
  , test1 = require('./routes/test1')
  , test2 = require('./routes/test2')  
  , test3 = require('./routes/test3')
  , mobileTest3 = require('./routes/mobileTest3')
  , test4 = require('./routes/test4')  
  , cypher4 = require('./routes/cypher4')
  , login = require('./routes/login')
  , logout = require('./routes/logout')
  , signup = require('./routes/signup')
  , insert = require('./routes/insert')  
  , http = require('http')  
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 5850);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon(path.join(__dirname, 'public/images/taeyoon.ico')));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//For authentication
function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    res.send('You are not authorized to view this page, Must be logged in as a super user.');
  } else {
    next();
  }
}
//enables CORS for express.js
app.all('*', function(req, res, next) {
  
  //heroku
  if( (process.env.PORT !== undefined) && (req.headers['x-forwarded-proto']!='https') ){
    res.redirect('https://'+req.host+req.url);
  }
  else{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
  }
  next();
 });

app.get('/', routes.index);
app.get('/restapi/:name', restApi.index),
app.get('/users', user.list);
app.get('/test1', test1.index);
app.get('/test2', test2.index);
app.get('/signup', signup.index);
app.get('/test3', checkAuth, test3.index);
app.get('/mobile', mobileTest3.index);
app.get('/test4', test4.index);
app.post('/cypher4', cypher4.index);
app.post('/login', login.index);
app.post('/insert', insert.index);
app.get('/logout', logout.index);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

