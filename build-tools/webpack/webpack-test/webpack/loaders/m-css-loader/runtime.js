module.exports = function () {
  const list = [];
  list.import = function (modules) {
    modules.forEach(item => {
      list.push(item)
    });
  };
  list.toString = () => {
    return list.map(v => v[1]).join('\n');
  }
  return list;
};
