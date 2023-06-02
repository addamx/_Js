let styleTag;

module.exports = function (list) {
  if (!styleTag) {
    styleTag = document.createElement('style');
    document.head.appendChild(styleTag);
  }
  styleTag.innerHTML = list.toString();
}
