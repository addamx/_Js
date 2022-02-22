/**
 * 时间戳转为格式化时间
 * @Author   chenjun
 * @DateTime 2017-11-10
 * @param    {[date]}   timestamp [时间戳]
 * @param    {[string]}   formats   [时间格式]
 */
function formatDate(timestamp, formats) {
  /*
    formats格式包括
    1. Y-M-D
    2. Y-M-D h:m:s
    3. Y年M月D日
    4. Y年M月D日 h时m分
    5. Y年M月D日 h时m分s秒
    示例：console.log(formatDate(1500305226034, 'Y年M月D日 h:m:s')) ==> 2017年07月17日 23:27:06
     */
  formats = formats || "Y-M-D";

  var myDate = timestamp ? new Date(timestamp) : new Date();

  var year = myDate.getFullYear();
  var month = formatDigit(myDate.getMonth() + 1);
  var day = formatDigit(myDate.getDate());

  var hour = formatDigit(myDate.getHours());
  var minute = formatDigit(myDate.getMinutes());
  var second = formatDigit(myDate.getSeconds());

  return formats.replace(/Y|M|D|h|m|s/g, function(matches) {
    return {
      Y: year,
      M: month,
      D: day,
      h: hour,
      m: minute,
      s: second
    }[matches];
  });
  // 小于10补0
  function formatDigit(n) {
    return n.toString().replace(/^(\d)$/, "0$1");
  }
}
