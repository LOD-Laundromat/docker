var gulp = require('gulp');
    server = require('gulp-express');
 
//gulp.task('server', function () {
//    // Start the server at the beginning of the task 
//    server.run([__dirname + '/../main.js']);
// 
//    // Restart the server when file changes 
//    gulp.watch([__dirname + '/../views/*'], server.notify);
//    gulp.watch(['app/styles/**/*.scss'], ['styles:scss']);
//    //gulp.watch(['{.tmp,app}/styles/**/*.css'], ['styles:css', server.notify]); 
//    //Event object won't pass down to gulp.watch's callback if there's more than one of them. 
//    //So the correct way to use server.notify is as following: 
//    gulp.watch(['{.tmp,app}/styles/**/*.css'], function(event){
//        gulp.run('styles:css');
//        server.notify(event);
//        //pipe support is added for server.notify since v0.1.5, 
//        //see https://github.com/gimm/gulp-express#servernotifyevent 
//    });
// 
//    gulp.watch(['app/scripts/**/*.js'], ['jshint']);
//    gulp.watch(['app/images/**/*'], server.notify);
//    gulp.watch(['app.js', 'routes/**/*.js'], [server.run]);
//});

gulp.task('watch', function() {
	gulp.watch(["./src/**/*.js"], [ 'browserifyForDebug' ]);
	gulp.watch("./src/**/*.scss", [ 'makeCss' ]);
	gulp.watch(['../views/*', '../dist/*', '../main.js'], server.notify);
});

gulp.task('connect', function() {
    // Start the server at the beginning of the task 
    server.run([__dirname + '/../main.js']);
});
