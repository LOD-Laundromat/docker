var path = require('path'),
    url = require('url');

var md5Regex = /[a-z0-9]{32}/;
module.exports = {
   urlToMd5: function urlToMd5(urlString) {
        var base = path.basename(url.parse(urlString).pathname);
        if (base.match(md5Regex)) {
            return base;
        } else {
            return null;
        }
    }
           
}



