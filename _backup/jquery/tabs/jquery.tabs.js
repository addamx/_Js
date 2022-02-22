/**
 *(如何写一个完善的jquery UI组件)
 *  http://www.myronliu.com/2016/03/30/javscript/%E5%A6%82%E4%BD%95%E5%86%99%E4%B8%80%E4%B8%AA%E5%AE%8C%E5%96%84%E7%9A%84jquery%20ui%E7%BB%84%E4%BB%B6/
 */
/*
<div id="test">
  <ul class="nav">
    <li name="tab1" class="active">menu1</li>
    <li name="tab2">menu2</li>
  </ul>
  <div id="tab1">
    This is content
  </div>
  <div id="tab2">
    This is content
  </div>
</div>
*/

Tabs.defaults = {
  showName: null, //当前显示tab名称
  activeClass: 'active',  //当tab被选择时的样式
  menuSelector: '.nav li',  //找到menu的选择器
  menuAttr: 'name'    //menu指定属于哪个tab名称的属性
}

function Tabs($element, options) {
  this.tabs = {};
  this.container = $element;
  var op = this.options = $.extend({}, Tabs.defaults, options);
  var self = this;
  //init
  $('div', $element).hide();
  $(op.menuSelector, $element).removeClass(op.activeClass);
  if(op.showName) {
    this.showName = op.showName;
  } else {
    this.showName = $(op.menuSelector, $element).eq(0).attr('name');
  }

  //init Tab
  $(op.menuSelector, $element).each(function(){
    var name = $(this).attr(op.menuAttr);
    var $menu = $(this);
    var $panel = $('#' + name);
    var tabOp = {
      activeClass: op.activeClass
    }
    self.tabs[name] = new Tab($menu, $panel, tabOp);
  })

  //bind event
  $element.on('click', op.menuSelector, function(){
    self.show($(this).attr(op.menuAttr));
  })

  //init
  this.tabs[this.showName].show();
}

Tabs.prototype.show = function(name){
  if(name === this.showName) return;
  this.tabs[this.showName].hide();
  this.showName = name;
  this.tabs[name].show();
  this.container.trigger('tabs.show', this.showName);
}

function Tab($menu, $panel, $tabOp) {
  this.$menu = $menu;
  this.$panel = $panel;
  this.options = $tabOp;
}
Tab.prototype.show = function() {
  this.$menu.addClass(this.options.activeClass);
  this.$panel.show();
}

Tab.prototype.hide = function() {
  this.$menu.removeClass(this.options.activeClass);
  this.$panel.hide();
}
$.fn.tabs = function(options){
  return new Tabs(this, options || {});
}
