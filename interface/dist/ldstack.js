!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.lod2go=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
console.log('blaaaat');



module.exports = {
    mainPage: function() {
        console.log('mainPsagaaaae');
    }
};
//window.$ = jQuery = require("jquery");
//
//$('#addDoc').click(function() {
//    var md5 = $('#documentToAdd').val();
//    console.log('add doc');
//    
//    //todo: validate md5
//    
//    $.ajax({
//        url: '/services/addDataset/' + md5,
//        complete: function() {
//            
//        }
//    })
//})
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

},{}]},{},[1])(1)
});


//# sourceMappingURL=ldstack.js.map