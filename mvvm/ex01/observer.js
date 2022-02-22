/**
 * https://zhuanlan.zhihu.com/p/47492137
 */

var data = {name:{ school:"Tust" }, sex : "male"};
observe(data);
data.name.school = {Tust:'taida'}; // 哈哈哈，监听到值变化了 Tust --> {Tust:'Tust_taida'}
data.name.school.Tust = 'hexi' // 哈哈哈，监听到值变化了 Tust_taida --> hexi

function observe(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    // 取出所有属性遍历
    Object.keys(data).forEach(function(key) {
	    defineReactive(data, key, data[key]);
    });
};

function defineReactive(data, key, val) {
    var childObj = observe(val);
    Object.defineProperty(data, key, {		
        enumerable: true, // 可枚举
        configurable: false, // 不能再define
        get: function() {
            return val;
        },
        set: function(newVal) {
            console.log('哈哈哈，监听到值变化了 ', val, ' --> ', newVal);
            val = newVal;
	        childObj = observe(val);
        }
    });
}