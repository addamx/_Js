module.exports = class Compilation {
  constructor(compiler, params) {
    this.compiler = compiler;
    this.params = params;
    this.modules = new Set();

    this.moduleGraph = new ModuleGraph();
    this.dependencyFactories = new Map();

    this.hooks = {
      addEntry: new SyncHook(["entry", "options"]),
      succeedEntry: new SyncHook(["entry", "options", "module"]),
    }
  }

  finish(callback) {

  }

  seal(callback) {

  }

  addEntry(context, entry, options, callback) {
    const { name } = options;
    const entryData = {
      dependencies: [],
      includeDependencies: [],
      options: {
        name: undefined,
        ...options
      }
    };
    entryData[target].push(entry);
    this.hooks.addEntry.call(entry, options);

    this.addModuleTree(
			{
				context,
				dependency: entry,
			},
			(_, module) => {
				this.hooks.succeedEntry.call(entry, options, module);
				return callback(null, module);
			}
		);
  }

  addModuleTree({ context, dependency }, callback) {
    const Dep = dependency.constructor;
		const moduleFactory = this.dependencyFactories.get(Dep);
    this.handleModuleCreation(
			{
				factory: moduleFactory,
				dependencies: [dependency],
				originModule: null,
				context
			},
			(_, result) => {
				callback(null, result);
			}
		);
  }

  handleModuleCreation({ factory, dependencies, originModule, context }, callback) {
    const moduleGraph = this.moduleGraph;
  }
};
