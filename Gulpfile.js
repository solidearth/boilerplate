'use strict';
// generated on 2014-09-26 using generator-gulp-webapp 0.1.0

var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var wiredep = require('wiredep').stream;

// load plugins
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'del', 'uglify-save-license', 'main-bower-files'],
    camelize: true
});

// load options
var bumpType = $.util.env.bump || 'patch';

var basePaths = {
    src: 'app/',
    dest: 'dist/'
};

gulp.task('styles', function() {
    $.util.log('Rebuilding application styles');

    return gulp.src(basePaths.src + 'scss/main.scss')
        .pipe($.plumber())
        .pipe($.sass({
            includePaths: ['./bower_components'],
            errLogToConsole: true,
            onError: browserSync.notify
        }))
        .pipe($.autoprefixer(['last 5 versions', '> 1%', 'ie 8', 'ie 7'], {
            cascade: true
        }))
        .pipe(gulp.dest(basePaths.src + '/css'))
        .pipe($.size({
            showFiles: true
        }))
        .pipe(reload({
            stream: true
        }))
        .pipe($.notify('CSS compiled and autoprefixed'));
});

gulp.task('scripts', function() {
    return gulp.src(basePaths.src + 'scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size())
        .on('error', $.util.log)
        .pipe($.notify('JS hinted'));
});

gulp.task('html', ['styles'], function() {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
    var assets = $.useref.assets();

    return gulp.src(basePaths.src + 'index.html')
        .pipe(assets)
        .pipe(jsFilter)
        .pipe($.uglify({
            preserveComments: $.uglifySaveLicense
        }))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.combineMediaQueries())
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe(assets.restore())
        .pipe($.useref())
        // .pipe($.revReplace())
        .pipe(gulp.dest(basePaths.dest))
        .pipe($.size())
        .pipe($.notify('CSS and JS concatted and minified'));
});

gulp.task('images', function() {
    return gulp.src(basePaths.src + 'images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(basePaths.dest + 'images'))
        .pipe($.size())
        .pipe($.notify('Images minified'));
});

gulp.task('fonts', function() {
    return gulp.src($.mainBowerFiles())
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest(basePaths.dest + 'fonts'))
        .pipe($.size());
});

gulp.task('serve', function() {
    browserSync({
        server: {
            baseDir: basePaths.src
        }
    });
});

gulp.task('bower', function() {
    gulp.src(basePaths.src + 'index.html')
        .pipe(wiredep({
            exclude: [
                'bower_components/bootstrap-sass/dist/js/bootstrap.js',
                'bower_components/bootstrap-sass/dist/css/bootstrap.css'
            ]
        }))
        .pipe(gulp.dest('public-src'));
});

// Update bower, component, npm at once:
gulp.task('bump', function() {
    gulp.src(['./bower.json', './package.json'])
        .pipe($.bump({
            type: bumpType
        }))
        .pipe(gulp.dest('./'));
});


// DEV: "Watch" for changes
gulp.task('watch', ['styles', 'serve'], function() {

    // watch for changes to reload
    gulp.watch([
        // basePaths.src + 'css/**/*.css',
        basePaths.src + '*.html',
        basePaths.src + 'scripts/**/*.js',
        basePaths.src + 'images/**/*'
    ], {}, reload);

    // watch to run tasks
    gulp.watch(basePaths.src + 'scss/**/*', ['styles']);
});

// BUILD
gulp.task('build', ['html', 'images', 'fonts', 'bump']);