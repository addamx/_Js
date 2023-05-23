const { applyWebpackOptionsDefaults } = require('./config/default');
const { default: WebpackOptionsApply } = require('./WebpackOptionsApply');

module.exports = webpack;

function webpack(rawOptions, callback) {
    const compiler = createCompiler;
    compiler.run(() => {
        // compiler.close(() => {
        //     callback();
        // });
    });
}

function createCompiler(rawOptions) {
    const options = { context: process.cwd(), ...rawOptions }; // getNormalizedWebpackOptions

    const compiler = new Compiler(options.context, options);

    if (Array.isArray(options.plugins)) {
        for (const plugin of options.plugins) {
            if (typeof plugin === 'function') {
                plugin.call(compiler, compiler);
            } else {
                plugin.apply(compiler);
            }
        }
    }

    applyWebpackOptionsDefaults(options);
    compiler.hooks.environment.call();
    new WebpackOptionsApply().process(options, compiler);

    compiler.hooks.initialize.call();

    return compiler;
}
