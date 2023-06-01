module.exports = function (list) {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = list.toString();
  console.log('🚀 ~ list.toString():', list.toString())
  document.head.appendChild(styleTag);
}
