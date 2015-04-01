var config = require('../config.js'),
_ = require('lodash'),

    util = require('./util.js');

module.exports = function (req, res) {
    var md5 = util.urlToMd5(req.url);
    
    var exec = require('child_process').exec;
    var child = exec("echo 'select ll_graph, ll_state from DB.DBA.load_list;' | isql", function (error, stdout, stderr) {
      if (stderr){
          return res.status(500).send(stderr);
      } else if (error) {
          return res.status(500).send(error);
      } else {
          return res.send(getStatusFromIsql(stdout, md5));
      }
    });
};
var isqlRegex = /^([^ ]*).*(\d)$/;

var getStatusFromIsql = function(result, md5) {
    var getStatusFromLine = function(line) {
        var statusObj = null;
        var matches = line.match(isqlRegex);
        if (matches && matches.length >= 2) {
            var virtStatus = +matches[2];
            var graph = matches[1];
            var statusLabel = "unknown";
            if (virtStatus === 0) {
                statusLabel = "notLoaded";
            } else if (virtStatus === 1) {
                statusLabel = "loading";
            } else if (virtStatus === 2) {
                statusLabel = "loaded";
            }
            statusObj = {
                graph: matches[1],
                status: statusLabel,
                virtuosoStatus: virtStatus
            };

        }
        return statusObj;
    };
    
    var status;
    if (md5) {
       status = {status: "notFound"};
    } else {
        //just get status of all docs
        status = [];
    }
    
    var skip  = true;
    _.forEach(result.split("\n"), function(line) {
        if (line.indexOf('___') == 0) {
            skip = false;
            return;
        }
        if (skip) return;
        if (line.trim().length == 0) return;
        if (md5 && line.indexOf(md5) >= 0) {
            var statusObj = getStatusFromLine(line);
            if (statusObj) status = statusObj;
            return false;//stop loop, i.e. take first matching result                                                                                                                                           
        }
        if (!md5) {
            var statusObj = getStatusFromLine(line);
            if (statusObj) status.push(statusObj);
        }
    });
    return status
    
    
}