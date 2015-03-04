#!/usr/bin/node
var config = require('./config.json'),
    express = require('express'),
    negotiate = require('express-negotiate'),
    fs = require('fs'),
    httpProxy = require('http-proxy');
    
var app = express();
var proxy = httpProxy.createProxyServer({});
var html = fs.readFileSync('./index.html', "UTF-8");
html = html.replace(/%%VERSION%%/g,config.yasguiVersion);
html = html.replace(/%%SPARQL_ENDPOINT%%/g,config.sparqlEndpoint);
app.all('/', function(req, res, next) {
    req.negotiate({
        'html': function() {
            res.send(html);
        },
        'default': function() {
            // send to endpoint
            proxy.web(req, res, { target: config.sparqlEndpoint });
            //req.pipe(request(url)).pipe(res);
            //res.send('<html><body><h1>Hello World</h1></body></html>');
        }
    });
});


var server = app.listen(config.port, function () {
  console.log('proxy running at  http://localhost:%s', config.port)

})
