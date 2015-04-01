var $ = jQuery = require("jquery");


//load bootstrap as well
require('../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js')


var getAlert = function(config) {
    var defaultConfig = {
        html: '',
        text: '',
        type: 'danger'
    }
    config = $.extend(true, {}, defaultConfig, config);
    var alert = $('<div>', {'class': 'alert alert-' + config.type + ' alert-dismissible', role: 'alert'})
        .append($('<button>', {type: 'button', 'class': 'close', 'data-dismiss': 'alert', 'aria-label': 'close'}).append($('<span>', {'aria-hidden': 'true'}).html('&times;')));
    if (config.html.length) {
        alert.append($('<div>').html(config.html));
    } else if (config.text.length) {
        alert.append($('<div>').text(config.text));
    }
    return alert;
}
var showIframe = function() {
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
    
    // Listen to message from child window
    eventer(messageEvent,function(e) {
        var key = e.message ? "message" : "data";
        var md5 = e[key];
        $('#documentToAdd').val('http://lodlaundromat.org/resource/'+md5);
        $('#addDoc').click();
    },false);
//    http://localhost:9880/services/doc/add/8c4b544fd011889a8273ea5b70c55377
    $('#wardrobe').show().attr('src', "http://lodlaundromat.org/wardrobe/#select");
};
var eventsForDatasetAdd = function() {
  $('#addDoc').click(function() {
      var doc = $('#documentToAdd').val();
      var md5 = doc.split('/').pop();
      
      $.ajax({
          url: '/services/doc/add/' + md5,
          
      }).done(function() {
          $('#documentAddMsg').empty().append(getAlert({type:'success', text: 'Added!'}));
      }).fail(function(jqXHR, textStatus, errorThrown) {
          var errorTxt = "<strong>Error!</strong> ";
          if (jqXHR.responseText) errorTxt += jqXHR.responseText;
          $('#documentAddMsg').empty().append(getAlert({html:errorTxt}));
      })
    })
    
    
    
    $('#searchWardrobe').click(showIframe);
};
module.exports = {
    mainPage: function() {
        eventsForDatasetAdd();
    },
    $ : $
};


//var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
//var eventer = window[eventMethod];
//var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
//
//// Listen to message from child window
//eventer(messageEvent,function(e) {
//    var key = e.message ? "message" : "data";
//    var data = e[key];
//    console.log(key, data);
//},false);
//console.log('bla');
//
//
//$(document).ready(function() {
//    console.log('ready');
//    $('#wardrobe').attr('src', "http://ll/wardrobe/#select" );
//})
