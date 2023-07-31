function resolveType(targetType, referenceTypesMap = {}) {
  const tsTypeAnnotationMap = {
    TSStringKeyword: "string",
    TSNumberKeyword: "number",
    NumberTypeAnnotation: "number",
    StringTypeAnnotation: "string",
  };
  const type = targetType.type;

  if (type === "TSTypeReference") {
    return referenceTypesMap[targetType.typeName.name];
  }
  
  return tsTypeAnnotationMap[type];
}

function noStackTraceWrapper(cb) {
  const tmp = Error.stackTraceLimit;
  Error.stackTraceLimit = 0;
  cb && cb(Error);
  Error.stackTraceLimit = tmp;
}

exports.resolveType = resolveType;
exports.noStackTraceWrapper = noStackTraceWrapper;
