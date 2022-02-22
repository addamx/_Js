module.exports = {
  presets: ["@babel/env"],
  plugins: [
    [
      "@babel/plugin-proposal-decorators",
      {
        legacy: true,
      },
    ],
  ],
  env: {
    debug: {
      sourceMaps: "inline",
      retainLines: true,
    },
  },
};
