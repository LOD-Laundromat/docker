var gulp = require('gulp'),
	browserify = require('browserify'),
	connect = require('gulp-connect'),
	concat = require('gulp-concat'),
	embedlr = require('gulp-embedlr'),
	jsValidate = require('gulp-jsvalidate'),
	source = require('vinyl-source-stream'),
	uglify = require("gulp-uglify"),
	rename = require("gulp-rename"),
	streamify = require('gulp-streamify'),
	paths = require("./paths.js"),
	buffer = require('vinyl-buffer'),
	exorcist = require('exorcist'),
	notify = require('gulp-notify'),
	sourcemaps = require('gulp-sourcemaps');

gulp.task('browserify', function() {
    var bundler = browserify("./client/entry.js", {standalone: 'lod2go', debug:true})
//    var bundler = browserify("./client/entry.js", debug: true});
    
    return bundler
      .bundle()
      .pipe(exorcist(paths.bundleDir + '/' + paths.bundleName + '.js.map'))
      .pipe(source(paths.bundleName + '.js'))
      .pipe(gulp.dest(paths.bundleDir))
      .pipe(rename(paths.bundleName + '.min.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({
          loadMaps: true,
          debug:true,
      }))
      .pipe(uglify({
          compress: {
              //disable the compressions. Otherwise, breakpoints in minified files don't work (sourcemaped lines get offset w.r.t. original)
              //minified files does increase from 457 to 459 kb, but can live with that 
              negate_iife: false,
              sequences: false
          }
      }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(paths.bundleDir));
});
/**
 * Faster, because we don't minify, and include source maps in js file (notice we store it with .min.js extension, so we don't have to change the index.html file for debugging)
 */
gulp.task('browserifyForDebug', function() {
	var bundler = browserify("./client/entry.js", {standalone: 'lod2go', debug:true});
	
	return bundler
		.bundle()
	    .on("error", notify.onError(function(error) {
	    	return error.message;
	    }))
		.pipe(source(paths.bundleName + '.min.js'))
//		.pipe(embedlr())
		.pipe(gulp.dest(paths.bundleDir));
//		.pipe(connect.reload());
});

