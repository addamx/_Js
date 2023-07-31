module.exports = {
  json: function (docs) {
    return JSON.stringify(docs, null, 4);
  },
  markdown: require("./markdown"),
};
