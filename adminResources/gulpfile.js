var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    yargs = require('yargs').argv,
    replace = require('gulp-replace-task'),
    browserSync = require('browser-sync'),
    livereload = require('gulp-livereload'),
    watch = require('gulp-watch'),
    browserify = require('browserify'),
    cssnano = require('gulp-cssnano'),
    src = 'src',
    CONTEXT_PATH = '/',
    replace_patterns = [
        {
            match: 'CONTEXT_PATH',
            replacement: yargs.r ? CONTEXT_PATH : ''
        }
    ];

    gulp.task('clean', function () {
    return gulp.src('./src/dest', {read: false})
        .pipe(clean());
    });

    gulp.task('concatJs', ['clean'], function () {
    
        gulp.src(['./src/js/lib/zepto.min.js','./src/js/lib/LAB.min.js','./src/js/tool.js','./src/js/util/wAlert.js', './src/js/lib/datetime-picker.js', './src/js/tianYanStatistics/next_tytj.js', './src/js/productDetail.js'])
            .pipe(concat('entry.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./src/dest/health/js'));
    });


    gulp.task('minifyCss', ['clean'], function(){  
            gulp.src(['./src/css/common.css', './src/css/wAlert.css', './src/css/datetime-picker.css'])  
            .pipe(concat("entry.min.css"))
            .pipe(cssnano()) 
            .pipe(gulp.dest('./src/dest/health/css'));
        });

    gulp.task('js-watch', browserSync.reload);

    gulp.task('server', function () {
        yargs.p = yargs.p || 8080;
        browserSync.init({
            server: {
                baseDir: "./"
            },
            ui: {
                port: yargs.p + 1,
                weinre: {
                    port: yargs.p + 2
                }
            },
            port: yargs.p,
            startPath: 'src/productDetail.html?keyCode=NfaZsA'
        });
        gulp.watch("src/**/*", ['js-watch']);
    });


    gulp.task('default',['server'],function () {
        if (yargs.s) {
            gulp.start('server');
        }

        if (yargs.w) {
            gulp.start('watch');
        }
        if (yargs.m) {
            gulp.start('concatJs', 'minifyCss')
        }
    });