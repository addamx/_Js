const loader = function (content) {
  return content;
}

loader.pitch = function (remainingRequest, precedingRequest, data) {
  // return `import '!!${remainingRequest}'` // 通过!!来禁用所有的loader
}

module.exports = loader
