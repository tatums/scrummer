/* File: gulpfile.js */

// grab our gulp packages
var gulp    = require('gulp');
var gutil   = require('gulp-util');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var source_dir = 'bower_components'
var target_dir = 'app/public/js/vendor'

// Concat & Minify JS
gulp.task('minify-vendor', function(){
  return gulp.src([
          source_dir + '/jquery/dist/jquery.js',
          source_dir + '/angular/angular.js',
          source_dir + '/angular-route/angular-route.js',
          source_dir + '/angular-resource/angular-resource.js',
          source_dir + '/angular-form-builder/dist/angular-form-builder.js',
          source_dir + '/angular-form-builder/dist/angular-form-builder-components.js',
          source_dir + '/angular-validator/dist/angular-validator.js',
          source_dir + '/angular-validator/dist/angular-validator-rules.js',
          source_dir + '/bootstrap/dist/js/bootstrap.js'
        ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(target_dir))
    .pipe(rename('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(target_dir));
});

var appSourceDir = 'app/public/js'
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
