var path = require('path'),
    express = require('express'),
    config = require('./config.json');
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

app.get('/', function (req, res) {
  res.render('index', { message: 'Hello there!'});
})
app.get('/services', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!'});
})

var server = app.listen(config.port, function () {
  console.log('Example app listening at http://localhost:%s', config.port)
})