var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat');

var sasssrc = "./src/sass/*";
var jssrc = "./src/js/**/*";
var jsfiles = ["./src/js/fieldcontrol.js"];

var cssdest = "./dest/";
var jsdest = "./dest/";
var dest = "./dest/";


gulp.task('compile', function() {
  gulp.src(jsfiles)
    .pipe(uglify({
      compress: {
        hoist_funs: false,
        hoist_vars: false
      }
    }))
    .pipe(concat('fieldcontrol.min.js'))
    .pipe(gulp.dest(jsdest))
});

todest = function(str) {
    return dest + str;
}
