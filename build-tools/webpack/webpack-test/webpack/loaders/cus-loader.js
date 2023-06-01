const loader = function (content) {
  console.log('heandler cus-loader\n');
  return content;
}

loader.pitch = function (remainingRequest, precedingRequest, data) {
  console.log('cus-loader pitch ==START==');
  console.log('🚀 ~ remainingRequest:', remainingRequest)
  console.log('🚀 ~ precedingRequest:', precedingRequest)
  console.log('🚀 ~ data:', data)
  console.log('cus-loader pitch ==END==\n');
  // return `import '!!${remainingRequest}'` // 通过!!来禁用所有的loader
}

module.exports = loader
