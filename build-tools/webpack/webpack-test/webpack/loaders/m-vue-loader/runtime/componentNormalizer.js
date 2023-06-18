export default function normalizeComponent(
  scriptExports,
  render,
  staticRenderFns
) {
  const options = scriptExports;
  if (render) {
    options.render = render;
    options.staticRenderFns = staticRenderFns;
    options._compiled = true;
  }
  return {
    exports: scriptExports,
    options,
  };
}
