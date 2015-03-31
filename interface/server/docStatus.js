var config = require('../config.js'),
    fs = require('fs'),
    path = require('path'),
    url = require('url');
var md5Regex = /[a-z0-9]{32}/;
module.exports = function (req, res) {
    var getMd5 = function() {
        var base = path.basename(url.parse(req.url).pathname);
        if (base.match(md5Regex)) {
            return base;
        } else {
            return null;
        }
    }
    
    var md5 = getMd5();
    if (!md5) return res.status(400).send('Invalid request. Append md5 to url');
    var exec = require('child_process').exec;

    var child = exec("mkdir /test", function (error, stdout, stderr) {
      if (stderr){
          return res.status(500).send(stderr);
      } else if (error) {
          return res.status(500).send(error);
      } else {
          return res.send('success');
      }
    });
};




