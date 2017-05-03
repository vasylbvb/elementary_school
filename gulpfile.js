var gulp = require("gulp"),
    less = require("gulp-less"),
    nano = require("gulp-cssnano"),
    browserSync = require("browser-sync").create(),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    autoprefixer = require("gulp-autoprefixer"),
    imageMin = require("gulp-imagemin"),
    fontMin = require("gulp-fontmin"),
	sourcemaps = require("gulp-sourcemaps");

gulp.task("html", function(){
    return gulp.src("src/*.html")
        .pipe(gulp.dest("dist"));
});

gulp.task("img", function(){
    return gulp.src("src/images/*")
        .pipe(imageMin())
        .pipe(gulp.dest("dist/images"));
});

gulp.task("fonts", function () {
    return gulp.src([
        "node_modules/bootstrap/dist/fonts/*.*",
		"node_modules/font-awesome/fonts/*.*",
        "src/fonts/**/*"
    ])
        .pipe(fontMin())
        .pipe(gulp.dest("dist/fonts"));
});

gulp.task("vendor-css", function(){
    return gulp.src([
        "node_modules/bootstrap/dist/css/bootstrap.css",
        "node_modules/jgrowl/jquery.jgrowl.css",
        "node_modules/normalize-css/normalize.css",
        "node_modules/font-awesome/css/font-awesome.css",
        "node_modules/bootstrap-star-rating/css/star-rating.css",
        "src/libs/range_slider/nouislider.css"
    ])
        .pipe(concat("bootstrap.css"))
        .pipe(nano())
        .pipe(gulp.dest("dist/css"));
});


gulp.task("css", function(){
    return gulp.src("src/css/main.less")
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ["last 3 versions"],
            cascade: false
        }))
        .pipe(nano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

gulp.task("css:all", ["css", "vendor-css"]);

gulp.task("vendor-js", function(){
    return gulp.src([
		"node_modules/jquery/dist/jquery.js",
        "node_modules/bootstrap/dist/js/bootstrap.js",
        "node_modules/jgrowl/jquery.jgrowl.js",
        //"node_modules/scrollup/index.js",
        //"node_modules/scroll-to/index.js",
        "node_modules/bootstrap-star-rating/js/star-rating.js",
        "src/libs/range_slider/nouislider.js",
        "src/libs/bxslider/*.js",
        "src/libs/goodshare.js-master/goodshare.js"
    ])
        .pipe(sourcemaps.init())
        .pipe(concat("vendor.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist/js"));
});

gulp.task("app-js", function(){
    return gulp.src("src/js/*.js")
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat("app.min.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist/js"));
});

gulp.task("js:all", ["app-js", "vendor-js"]);

gulp.task("watch", ["build"], function(){
    browserSync.init({
        server: "dist"
    });
    gulp.watch("src/css/**/*.less", ["css"]);
    gulp.watch("src/js/**/*.js", ["app-js"]);
    gulp.watch("src/js/**/*.js").on("change", browserSync.reload);
    gulp.watch("src/**/*.html", ["html"]);
    gulp.watch("src/**/*.html").on("change", browserSync.reload);
    gulp.watch("src/images/*", ["img"]);
    gulp.watch("dist/images/*").on("change", browserSync.reload);
    gulp.watch("src/fonts/**/*", ["fonts"]);
    gulp.watch("dist/fonts/*").on("change", browserSync.reload);
});
gulp.task("build", ["html", "css:all", "js:all", "img", "fonts"]);
gulp.task("default", ["build", "watch"]);