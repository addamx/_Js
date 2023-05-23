import webpack from './index';
const {
    SyncHook,
    SyncBailHook,
    AsyncParallelHook,
    AsyncSeriesHook,
} = require('tapable');

module.exports = class Compiler {
    constructor(context, options) {
        this.context = context;
        this.options = options;
        this.resolverFactory = new ResolverFactory();
        this.webpack = webpack;

        this.hooks = {
            // tap, call
            initialize: new SyncHook([]),
            // tapPromise、tapAsync、callAsync
            done: new AsyncSeriesHook(['stats']),

            beforeRun: new AsyncSeriesHook(['compiler']),
            run: new AsyncSeriesHook(['compiler']),

            compilation: new SyncHook(['compilation', 'params']),

            normalModuleFactory: new SyncHook(['normalModuleFactory']),
            contextModuleFactory: new SyncHook(['contextModuleFactory']),

            beforeCompile: new AsyncSeriesHook(['params']),
            compile: new SyncHook(['params']),
            make: new AsyncParallelHook(['compilation']),

            environment: new SyncHook([]),
        };
    }

    run(callback) {
        const onCompiled = (err, compilation) => {
            //
        };

        const run = () => {
            this.hooks.beforeRun.callAsync(this, () => {
                this.hooks.run.callAsync(this, () => {
                    this.readRecords(() => {
                        this.compile(onCompiled);
                    });
                });
            });
        };
    }

    readRecords(callback) {
        callback();
    }

    compile(callback) {
        const params = this.newCompilationParams();
        this.hooks.beforeCompile.callAsync(params, () => {
            this.hooks.compile.call(params);
            const compilation = this.newCompilation(params);

            this.hooks.make.callAsync(compilation, () => {
                //
            });
        });
    }

    newCompilationParams() {
        const params = {
            normalModuleFactory: this.createNormalModuleFactory(),
            contextModuleFactory: this.createContextModuleFactory(),
        };
        return params;
    }

    createNormalModuleFactory() {
        const normalModuleFactory = new NormalModuleFactory({
            context: this.options.context,
            resolverFactory: this.resolverFactory,
        });
        this.hooks.normalModuleFactory.call(normalModuleFactory);
        return normalModuleFactory;
    }

    createContextModuleFactory() {
        const contextModuleFactory = new ContextModuleFactory(
            this.resolverFactory
        );
        this.hooks.contextModuleFactory.call(contextModuleFactory);
        return contextModuleFactory;
    }

    newCompilation(params) {
        const compilation = this.createCompilation(params);
        this.hooks.compilation.call(compilation, params);
        return compilation;
    }

    createCompilation(params) {
        return new Compilation(this, params);
    }

    close(callback) {
        callback();
    }
}
