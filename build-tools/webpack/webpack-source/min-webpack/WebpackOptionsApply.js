import EntryOptionPlugin from "./plugins/EntryOptionPlugin";

module.exports = class WebpackOptionsApply {
  process(options, compiler) {


    new EntryOptionPlugin().apply(compiler);

  }
}
