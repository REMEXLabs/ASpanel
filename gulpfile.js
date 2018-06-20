// grab dependencies
const
    gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    stripdebug = require('gulp-strip-debug'),
    uglifyes = require('uglify-es'),
    composer = require('gulp-uglify/composer'),
    uglify = composer(uglifyes, console),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    del = require('del'),
    ngAnnotate = require('gulp-ng-annotate'),
    htmlmin = require('gulp-htmlmin'),
    argv = require('minimist')(process.argv.slice(2)),
    noop = require("gulp-noop"),
    babel = require('gulp-babel');

// define project variables
const
    srcdir = "source",
    destdir = "dist/toolbar/",
    assetsdir = "/assets",
    demodir = "/demo",
    cssdir = assetsdir + "/css",
    jsdir = assetsdir + "/js",
    imgdir = assetsdir + "/images",
    fontsdir = assetsdir + "/fonts",
    psdir = assetsdir + "/preferenceSets",
    htmldir = "/html";


// configure the jshint task
gulp.task('jshint', function () {
    return gulp.src(srcdir + jsdir + '/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

// configure the js task
gulp.task('js', function () {
    return gulp.src(srcdir + jsdir + '/**/*.js')
        .pipe(babel())
        .pipe(ngAnnotate())
        //only uglify if gulp is ran with '--type production'
        .pipe(argv['type'] === 'production' ? uglify() : noop())
        .pipe(gulp.dest(destdir + jsdir));
});

// configure the css task
gulp.task('css', function () {
    return gulp.src(srcdir + cssdir + '/**/*.css')
    //only nanoify if gulp is ran with '--type production'
        .pipe(argv['type'] === 'production' ? cssnano() : noop())
        .pipe(gulp.dest(destdir + cssdir));
});

// configure the img task
gulp.task('img', function () {
    return gulp.src(srcdir + imgdir + '/**/*.+(png|jpg|gif|svg|ico)')
    //only minify if gulp is ran with '--type production'
        .pipe(argv['type'] === 'production' ? cache(imagemin()) : noop())
        .pipe(gulp.dest(destdir + imgdir))
});

// configure the fonts task
gulp.task('fonts', function () {
    return gulp.src(srcdir + fontsdir + '/**/*.*')
        .pipe(gulp.dest(destdir + fontsdir));
});

// configure the preferencesets task
gulp.task('preferencesets', function () {
    return gulp.src(srcdir + psdir + '/**/*')
        .pipe(gulp.dest(destdir + psdir));
});

// configure the demo task
gulp.task('demo', function () {
    return gulp.src(srcdir + demodir + '/**/*')
        .pipe(gulp.dest(destdir + '..'));
});


// configure the html task
gulp.task('html', function () {
    return gulp.src(srcdir + htmldir + '/**/*.html')
    //only minify if gulp is ran with '--type production'
        .pipe(argv['type'] === 'production' ? htmlmin({
            collapseWhitespace: true,
            minifyURLs: true,
            quoteCharacter: '"',
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            sortAttributes: true,
            sortClassName: true,
            useShortDoctype: true
        }) : noop())
        .pipe(gulp.dest(destdir));
});

// configure the cleaning task
gulp.task('clean:dist', function () {
    return del.sync(destdir);
})

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function () {
    gulp.watch(srcdir + jsdir + '/**/*.js', gulp.parallel('js'));
    gulp.watch(srcdir + cssdir + '/**/*.css', gulp.parallel('css'));
    gulp.watch(srcdir + imgdir + '/**/*.+(png|jpg|gif|svg|ico)', gulp.parallel('img'));
    gulp.watch(srcdir + fontsdir + '/**/*', gulp.parallel('fonts'));
    gulp.watch(srcdir + htmldir + '/**/*.html', gulp.parallel('html'));
    gulp.watch(srcdir + psdir + '/**/*.json', gulp.parallel('preferencesets'));
    gulp.watch(srcdir + demodir + '/**/*', gulp.parallel('demo'));
});

// define the default task
gulp.task('default', gulp.parallel('js', 'css', 'img', 'fonts', 'html', 'preferencesets', 'demo'));
