var $ = jQuery = require("jquery");

$('#addDoc').click(function() {
    var md5 = $('#documentToAdd').val();
    
    
    //todo: validate md5
    
    $.ajax({
        url: '/services/addDataset/' + md5,
        complete: function() {
            
        }
    })
})