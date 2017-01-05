
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');

var app = module.exports = express();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.favicon(__dirname + '/public/imgs/broadcast2.ico'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(express.errorHandler());
  app.locals.pretty = true;
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.list);
app.get('/all', routes.list_all);
app.get('/new', routes.index);
app.get('/next_item', routes.next_item);
app.get('/ping', routes.ping);
app.post('/create', routes.create);

var PORT = process.env.PORT || 7000;

app.listen(PORT, function(){
  console.log("App running on %s", PORT);
});
