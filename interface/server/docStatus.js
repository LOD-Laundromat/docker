var config = require('../config.js'),
_ = require('lodash'),

    util = require('./util.js');

module.exports = function (req, res) {
    var md5 = util.urlToMd5(req.url);
    if (!md5) return res.status(400).send('Invalid request. Append md5 to url');
    var exec = require('child_process').exec;
    var child = exec("echo 'select ll_graph, ll_state from DB.DBA.load_list;' | isql", function (error, stdout, stderr) {
      if (stderr){
          return res.status(500).send(stderr);
      } else if (error) {
          return res.status(500).send(error);
      } else {
          var returned = {status: "notFound"};
          _.forEach(stdout.split("\n"), function(line) {
              if (line.indexOf(md5) >= 0) {
                  var matches = line.match(/(\d)$/);
                  if (matches.length) {
                      var virtStatus = +matches[0];
                      var status = "unknown";
                      if (virtStatus === 0) {
                          status = "notLoaded";
                      } else if (virtStatus === 1) {
                          status = "loading";
                      } else if (virtStatus === 2) {
                          status = "loaded";
                      }
                      returned = {
                          virtuosoStatus: virtStatus
                      }

                  }
                  return false;//stop loop, i.e. take first result                                                                                                                                           
              }
          });
          return res.send(returned);
      }
    });
};
