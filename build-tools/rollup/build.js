const fs = require('fs');
const path = require('path');
const uglify = require('uglify-js');
const rollup = require('rollup');
const buble = require('rollup-plugin-buble');

const packageJson = require('./package.json');
const version = packageJson.version;
const moduleName = packageJson.name;
const author = packageJson.author;
const banner =
`/*!
 * ${moduleName} v${version}
 * (c) ${new Date().getFullYear()} ${author}
 * @license MIT
 */`;

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

const resolve = _path => path.resolve(__dirname, _path);

const entry = resolve('src/index.js');

const distName = moduleName;

build([
  {
    dest: resolve(`dist/${distName}.js`),
    format: 'umd',
  },
  {
    dest: resolve(`dist/${distName}.min.js`),
    format: 'umd',
  },
  {
    dest: resolve(`dist/${distName}.common.js`),
    format: 'cjs'
  },
  {
    dest: resolve(`dist/${distName}.esm.js`),
    format: 'es'
  }
]);

function build(builds) {
  let built = 0;
  const total = builds.length;
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++;
      if (built < total) {
        next();
      }
    }).catch((e) => console.log(e));
  }

  next();
}

function buildEntry(opts) {
  const isProd = /min\.js$/.test(opts.dest);
  return rollup
    .rollup({
      input: entry,
      plugins: [buble()],
    })
    .then(bundle => bundle.generate({
      file: opts.dest,
      format: opts.format,
      name: `${moduleName}`,
      banner,
    }))
    .then(({code}) => {
      if (isProd) {
        code = (banner ? banner + '\n' : '') + uglify.minify(code, {
          output: {
            ascii_only: true
          },
          compress: {
            pure_funcs: ['makeMap']
          }
        }).code;
      }
      return write(opts.dest, code);
    })
}

function write(dest, code) {
  return new Promise((resolve, reject) => {
    fs.writeFile(dest, code, err => {
      if (err) {
        return reject(err);
      }

      console.log(path.relative(process.cwd(), dest));
      resolve();
    });
  });
}
