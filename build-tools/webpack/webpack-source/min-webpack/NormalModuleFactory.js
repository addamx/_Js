module.exports = class NormalModuleFactory {
    constructor({ context, resolverFactory }) {
        this.context = context;
        this.resolverFactory = resolverFactory;
    }
};
