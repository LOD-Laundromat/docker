var config = require('../config.js'),
    express = require('express'),
    negotiate = require('express-negotiate'),
    fs = require('fs'),
    httpProxy = require('http-proxy');


var proxy = httpProxy.createProxyServer({});
//var html = fs.readFileSync(__dirname + '/index.html', "UTF-8");
//html = html.replace(/%%VERSION%%/g,config.yasguiVersion);
//html = html.replace(/%%SPARQL_ENDPOINT%%/g,config.proxyEndpoint);
module.exports = function (req, res) {
    req.negotiate({
        'html': function() {
            res.render('yasgui', { endpoint: config.sparql.baseUrl, yasguiVersion: config.sparql.yasguiVersion});
        },
        'default': function() {
            // send to endpoint
            proxy.web(req, res, { target: config.sparql.sparqlEndpoint,
        forward: function() {
            return '/sparql/query';
        } });
            //req.pipe(request(url)).pipe(res);
            //res.send('<html><body><h1>Hello World</h1></body></html>');
        }
    });
};
//var app = express();




