var path = require('path'),
    express = require('express'),
    config = require('./config.js');
var app = express();
if (app.get('env') === 'development') {
  app.use(require('easy-livereload')({
    watchDirs: [
      path.join(__dirname, 'public'),
      path.join(__dirname, 'views')
    ],
    checkFunc: function(file) {
      return /\.(css|js|jade)$/.test(file);
    },
    renameFunc: function(file) {
      return file.replace(/\.jade$/, '.html');
    },
    port: process.env.LIVERELOAD_PORT || 35729
  }));
}






require('lodash-express')(app, 'html'); 
app.set('view engine', 'html');

app.use('/dist', express.static(__dirname + '/dist'));

app.use('/services/doc/add/', require('./server/addDoc'));
app.use('/services/doc/status/', require('./server/docStatus'));
app.use('/services', function (req, res) {
    console.log('services');
    res.render('index', { title: 'Hey', message: 'Hello there!'});
})

app.use(config.sparql.baseUrl, require('./server/sparqlNegotiate'))



app.get('/', function (req, res) {
    console.log('main route');
    res.render('index');
})


var server = app.listen(config.port, function () {
  console.log('Main interface listening at http://localhost:%s', config.port)
})