var path = require('path'),
    express = require('express'),
    
    config = require('./config.js'),
    gulpTasks = require('./gulpFile.js'),
    gulp = require('gulp');
var app = express();
if (app.get('env') === 'development') {
    gulp.start('browserifyForDebug');
    gulp.start('makeCss');
  app.use(require('easy-livereload')({
    watchDirs: [
      path.join(__dirname, 'client'),
      path.join(__dirname, 'views'),
      path.join(__dirname, 'server'),
    ],
    checkFunc: function(file) {
        if (file.indexOf('.js') >= 0) {
            gulp.start('browserifyForDebug');
        }
        if (file.indexOf('.scss') >= 0) {
            gulp.start('makeCss');
        }
        return /\.(scss|css|js|jade|html)$/.test(file);
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
    res.render('index', { title: 'Hey', message: 'Hello there!'});
})

app.use(config.sparql.baseUrl, require('./server/sparqlNegotiate'))



app.get('/', function (req, res) {
    res.render('index');
})


var server = app.listen(config.port, function () {
  console.log('Main interface listening at http://localhost:%s', config.port)
})