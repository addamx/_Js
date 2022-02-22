var gulp = require("gulp"),
  path = require("path"),
  fs = require("fs"),
  npmRun = require("npm-run"),
  log = require("fancy-log"),
  colors = require("ansi-colors"),
  watchPath = require("gulp-watch-path"),
  // combiner = require('stream-combiner2'), // Some tasks errors can lead to gulp.watch is terminated, using **gulp-watch-path & stream-combiner2** can solve the problem.
  sourcemaps = require("gulp-sourcemaps"),
  less = require("gulp-less"),
  autoprefixer = require("gulp-autoprefixer"),
  minifycss = require("gulp-minify-css"),
  babel = require("gulp-babel"),
  rollup = require("gulp-better-rollup"),
  rollBabel = require("rollup-plugin-babel"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify"),
  hash = require("gulp-hash-filename"),
  data = require("gulp-data"),
  ejs = require("gulp-ejs"),
  browserSync = require("browser-sync").create();
(livereload = require("gulp-livereload")),
  (svgstore = require("gulp-svgstore")), // https://github.com/svg/svgo
  (svgmin = require("gulp-svgmin")),
  (cheerio = require("gulp-cheerio"));

var config = {
  root: path.resolve("./"),
  src: path.resolve("./src"),
  dist: path.resolve("./dist"),
};

// 静态服务器
/**
 * browserSync
 * - https://browsersync.io/docs/api
 * - html pages must has a "body" tag to insert essential script
 */
gulp.task("server", function () {
  browserSync.init({
    server: {
      baseDir: config.dist,
      // baseDir: ["./dist", "./assets"]   //added multiple directories to load from parent dir
    },
    reloadDebounce: 0,
    // notify: false,
    open: false,
  });
});

// 代理
gulp.task("proxy", function () {
  browserSync.init({
    proxy: "127.0.0.1:3000",
  });
});

gulp.task("clean", function () {
  npmRun("rm -rf " + config.dist);
});

var handleError = function (err) {
  console.log("\n");
  log(colors.red("Error!"));
  log("fileName: " + colors.red(err.fileName));
  log("lineNumber: " + colors.red(err.lineNumber));
  log("message: " + err.message);
  log("plugin: " + colors.yellow(err.plugin));
};

gulp.task("less", function () {
  return gulp
    .src(config.src + "/less/*.less")
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions", "IE 10"], // https://github.com/browserslist/browserslist#full-list
      })
    )
    .pipe(minifycss())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(config.dist + "/assets/css/"))
    .pipe(browserSync.stream({ match: "**/*.css" }));
});

gulp.task("less-watch", ["less", "server"], function () {
  gulp.watch(config.src + "/less/*.less", ["less"]);

  // var watcher = gulp.watch(config.src + '/less/**/*.less', ['less']);
  // 使用watchPath会引起Browser-sync reload
  // watcher.on('change', function (event) {
  //     var paths = watchPath(event, 'src/less', 'dist/assets/css')
  //     console.log('====================================');
  //     log(colors.green(event.type) + ' ' + paths.srcPath);
  //     log(colors.cyan('==> ') + paths.distPath + '\n');
  // })
});

gulp.task("bundle", function () {
  return gulp
    .src(config.src + "/js/**/index.js")
    .pipe(sourcemaps.init())
    .pipe(
      rollup(
        {
          // roll
          plugins: [rollBabel()],
        },
        "umd"
      )
    )
    .pipe(uglify())
    .pipe(
      rename(function (path) {
        path.basename = path.dirname;
        path.dirname = "";
      })
    )
    .pipe(sourcemaps.write(""))
    .pipe(gulp.dest(config.dist + "/assets/js/"));
});

gulp.task("js", function () {
  // 处理完JS文件后返回流
  return (
    gulp
      .src(config.src + "/js/*.js")
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(uglify())
      // .pipe(hash({
      //     "format": "{name}.{hash:5}.{ext}"
      // }))
      .pipe(sourcemaps.write(""))
      .pipe(gulp.dest(config.dist + "/assets/js/"))
  );
});

gulp.task("html", function () {
  return gulp
    .src(config.src + "/html/*.html")
    .pipe(
      data(function (file) {
        var filePath = file.path,
          jsonPath = path.join(
            path.dirname(filePath),
            path.basename(filePath, ".html") + ".json"
          );
        return Object.assign(
          JSON.parse(fs.readFileSync(config.src + "/html/global.json")),
          {
            local: fs.existsSync(jsonPath)
              ? JSON.parse(fs.readFileSync(jsonPath))
              : {},
          }
        );
      })
    )
    .pipe(
      ejs().on("error", function (err) {
        log(err);
      })
    )
    .pipe(gulp.dest(config.dist));
});

gulp.task("html-watch", ["server"], function () {
  gulp.watch(config.src + "/html/*.*", ["html", browserSync.reload]);
});

gulp.task("svg", function () {
  return gulp
    .src(config.src + "/svg/*.svg")
    .pipe(
      svgmin(function (file) {
        var prefix = path.basename(file.relative, path.extname(file.relative));
        return {
          plugins: [
            {
              cleanupIDs: {
                prefix: prefix + "-",
                minify: true,
              },
            },
          ],
        };
      })
    )
    .pipe(
      cheerio({
        run: function ($) {
          $("[fill]").removeAttr("fill");
        },
        parserOptions: { xmlMode: true },
      })
    )
    .pipe(rename({ prefix: "icon-" }))
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(gulp.dest(config.dist + "/assets/svg/"));
});

gulp.task("watch", ["less", "html", "js", "bundle", "server"], function () {
  // livereload.listen();

  gulp.watch(config.src + "/html/*.*", ["html", browserSync.reload]);
  gulp.watch(config.src + "/js/*.js", ["js", browserSync.reload]);
  gulp.watch(config.src + "/js/**/index.js", ["bundle", browserSync.reload]);
  gulp.watch(config.src + "/less/**/*.less", ["less"]);
});

gulp.task("build", [
  "clean",
  "copy",
  "html",
  "js",
  "bundle",
  "less",
  "svg",
  "server",
]);

gulp.task("copy", function () {
  return gulp
    .src(["fonts/**/*", "images/**/*", "vendor/**/*", "videos/**/*"], {
      cwd: config.src, // 输入路径
      base: config.src, // 输出路径
    })
    .pipe(gulp.dest(config.dist + "/assets"));
});
