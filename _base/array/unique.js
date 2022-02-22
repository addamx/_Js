// ES6
// 链接：https://www.zhihu.com/question/29558082/answer/44854426
function unique01 (arr) {
  const seen = new Map()
  return arr.filter((a) => !seen.has(a) && seen.set(a, 1))
}
function unique02 (arr) {
  return Array.from(new Set(arr))
}
