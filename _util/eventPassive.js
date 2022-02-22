// Test via a getter in the options object to see 
// if the passive property is accessed
//https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
var supportsPassive = false;
try {
  //如果下面的window.addEventListener被成功执行, 则passive属性被成功访问, 说明可以添加passive属性;
  var opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsPassive = true;
    }
  });
  window.addEventListener("test", null, opts);
} catch (e) {}

// Use our detect's results. 
// passive applied if supported, capture will be false either way.
document.addEventListener(
  'touchstart',
  function(){console.log('Dude! It works!')},
  supportsPassive ? { passive: true } : false
); 