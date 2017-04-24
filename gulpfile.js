var gulp = require("gulp"),
    less = require("gulp-less"),
    nano = require("gulp-cssnano"),
    browserSync = require("browser-sync").create(),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
	sourcemaps = require("gulp-sourcemaps");

gulp.task("html", function(){
    return gulp.src("src/*.html")
        .pipe(gulp.dest("dist"));
});

gulp.task("img", function(){
    return gulp.src("src/images/*")
        .pipe(gulp.dest("dist/images"));
});

gulp.task("fonts", function () {
    return gulp.src([
        "src/vendor/bootstrap/dist/fonts/*.*",
		"src/vendor/font-awesome/fonts/*.*",
        "src/fonts/**/*"
    ])
        .pipe(gulp.dest("dist/fonts"));
});

gulp.task("vendor-css", function(){
    return gulp.src([
        "src/vendor/bootstrap/dist/css/bootstrap.css",
        "src/vendor/jGrowl/jquery.jgrowl.css",
        "src/vendor/normalize-css/normalize.css",
        "src/vendor/font-awesome/css/font-awesome.css",
        "src/vendor/bootstrap-star-rating/css/star-rating.css",
        "src/libs/range_slider/nouislider.css"
    ])
        .pipe(concat("bootstrap.css"))
        .pipe(nano())
        .pipe(gulp.dest("dist/css"));
});


gulp.task("css", function(){
    return gulp.src("src/css/main.less")
        .pipe(less())
        .pipe(nano())
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

gulp.task("css:all", ["css", "vendor-css"]);

gulp.task("vendor-js", function(){
    return gulp.src([
		"src/vendor/jquery/dist/jquery.js",
        "src/vendor/bootstrap/dist/js/bootstrap.js",
        "src/libs/range_slider/nouislider.js",
        "src/vendor/jGrowl/jquery.jgrowl.js",
        "src/vendor/scrollup/dist/jquery.scrollUp.js",
        "src/libs/bxslider/*.js",
        "src/libs/goodshare.js-master/goodshare.js",
        "src/vendor/bootstrap-star-rating/js/star-rating.js",
        "src/vendor/bootstrap-star-rating/js/star-rating_locale_ua.js"
    ])
        .pipe(concat("vendor.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("dist/js"));
});

gulp.task("app-js", function(){
    return gulp.src("src/js/*.js")
        .pipe(uglify())
        .pipe(concat("app.min.js"))
        .pipe(gulp.dest("dist/js"));
});

gulp.task("jqueryjs", function() {
    return gulp.src("src/vendor/jquery/dist/jquery.min.js")
        .pipe(gulp.dest("dist/js"));
});
gulp.task("javascript", function() {
  gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
      //.pipe(concat())
      //.pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});
gulp.task("watch", function(){
    browserSync.init({
        server: "dist"
    });
    gulp.watch("src/css/**/*.less", ["css"]);
    gulp.watch("src/js/**/*.js", ["app-js"]);
    gulp.watch("src/**/*.html", ["html"]);
    gulp.watch("src/**/*.html").on("change", browserSync.reload);
});

gulp.task("default", ["html", "img", "fonts", "css:all", "vendor-js", "app-js", "jqueryjs", "javascript", "watch"]);