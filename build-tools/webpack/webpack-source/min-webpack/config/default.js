exports.applyWebpackOptionsDefaults = (options) => {
  for (const key of Object.keys(options.entry)) {
    options.entry[key].import = ["./src"];
  }
  Object.values(options.entry).forEach((entry) => {
    entry.import = ["./src"];
  });
}
