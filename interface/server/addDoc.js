var config = require('../config.js'),
    util = require('./util.js');

module.exports = function (req, res) {
    var md5 = util.urlToMd5(req.url);
    if (!md5) return res.status(400).send('Invalid request. Append md5 to url');
    var exec = require('child_process').exec;

    var child = exec(config.bash.addMd5 + ' ' + md5, function (error, stdout, stderr) {
      if (stderr){
          return res.status(500).send(stderr);
      } else if (error) {
          return res.status(500).send(error);
      } else {
          $('#refreshDocTable').click();
          return res.send('success');
      }
    });
};




