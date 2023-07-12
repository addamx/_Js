module.exports = class EntryOptionPlugin {
    apply(compiler) {
        compiler.hooks.entryOption.tap(
            'EntryOptionPlugin',
            (context, entry) => {
                EntryOptionPlugin.applyEntryOption(compiler, context, entry);
                return true;
            }
        );
    }

    static applyEntryOption(compiler, context, entry) {
        Object.values(entry).forEach((entryItem) => {
            Object.values(entryItem.import).forEach((entryImportItem) => {
                new EntryPlugin(context, entryImportItem, options).apply(
                    compiler
                );
            });
        });
    }
}
