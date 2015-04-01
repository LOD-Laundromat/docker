var $ = jQuery = require("jquery"),
    _ = require('lodash');


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
var docAdd = function() {
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

var drawDocOverviewTable = function() {
    $table = $("#docData").empty();
    
    if ($table.length == 0) return;
    $table.append($('<tr>')
            .append($('<th>').text('Graph'))
            .append($('<th>').text('Dataset Info'))
            .append($('<th>').text('Status'))
        );
    $.ajax({
        url: '/services/doc/status/',
    }).done(function(data) {
        
        _.forEach(data, function(status) {
            var $row = $('<tr>');
            
            var row = [];
            if (status.graph) row[0] = status.graph;
            if (status.graph) row[1] = status.graph;
            if (status.status) row[2] = status.status;
            
            _.forEach(row, function(col) {
                $row.append($('<td>').text(col))
            })
            $table.append($row);
            
        });
        $('#docTableMsg').empty().append(getAlert({type:'success', text: 'Added!'}));
    }).fail(function(jqXHR, textStatus, errorThrown) {
        $("#docData").empty();
        var errorTxt = "<strong>Error!</strong> ";
        if (jqXHR.responseText) errorTxt += jqXHR.responseText;
        $('#docTableMsg').empty().append(getAlert({html:errorTxt}));
    })
}
var docOverview = function() {
    $('#refreshDocTable').click(drawDocOverviewTable);
    $(document).ready(function() {
        drawDocOverviewTable(); 
    });
    
};
module.exports = {
    mainPage: function() {
        docAdd();
        docOverview();
    },
    $ : $
};

