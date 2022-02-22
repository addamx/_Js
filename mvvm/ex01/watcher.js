var uid = 0;

function Dep() {
  this.id = uid++;
  this.subs = [];
}

Dep.prototype = {
  //添加订阅者
  addSub: function(sub) {
    this.subs.push(sub);
  },
  depend: function() {
    Dep.target.addDep(this);
  },
  //删除订阅者
  removeSub: function(sub) {
    var index = this.subs.indexOf(sub);
    if (index != -1) {
      this.subs.splice(index, 1);
    }
  },
  //通知订阅者
  notify: function() {
    this.subs.forEach(function(sub) {
      sub.update();
    });
  }
};
Dep.target = null;
