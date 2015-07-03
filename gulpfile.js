/* File: gulpfile.js */

// grab our gulp packages
var gulp    = require('gulp');
var gutil   = require('gulp-util');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var vendorSourceDir = 'bower_components'
var vendorTargetDir = 'app/public/js'

// Concat & Minify JS
gulp.task('minify-vendor', function(){
  return gulp.src([
          vendorSourceDir + '/jquery/dist/jquery.js',
          vendorSourceDir + '/angular/angular.js',
          vendorSourceDir + '/angular-ui-router/release/angular-ui-router.js',
          vendorSourceDir + '/angular-resource/angular-resource.js',
          vendorSourceDir + '/angular-form-builder/dist/angular-form-builder.js',
          vendorSourceDir + '/angular-form-builder/dist/angular-form-builder-components.js',
          vendorSourceDir + '/angular-validator/dist/angular-validator.js',
          vendorSourceDir + '/angular-validator/dist/angular-validator-rules.js',
          vendorSourceDir + '/bootstrap/dist/js/bootstrap.js',
          vendorSourceDir + '/angular-bootstrap/ui-bootstrap.js',
          vendorSourceDir + '/angular-bootstrap/ui-bootstrap-tpls.js'
        ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(vendorTargetDir))
    .pipe(rename('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(vendorTargetDir));
});

var appSourceDir = 'source/app'
var appTargetDir = 'app/public/js'


appFiles = [
    appSourceDir + '/init.js',
    appSourceDir + '/app.js',
    appSourceDir + '/controllers/**/*.js',
    appSourceDir + '/services/**/*.js'
]


// Concat & Minify JS
gulp.task('minify-app', function(){
  return gulp.src(appFiles)
    .pipe(concat('application.js'))
    .pipe(gulp.dest(appTargetDir))
    .pipe(rename('application.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(appTargetDir));
});

// Watch Our Files
gulp.task('watch', function() {
  gulp.watch(appFiles, ['minify-app']);
});


gulp.task('default', ['minify-vendor', 'minify-app']);
