var arr = [
  {id: 1, pid: '-1'},
  {id: 11, pid: '1'},
  {id: 12, pid: '1'},
  {id: 13, pid: '12'},
  {id: 14, pid: '13'},
  {id: 15, pid: '12'},
]

function listToTree(list) {
  var map = {}, node, tree= [], i;
  for (i = 0; i < list.length; i ++) {
      map[list[i].id] = list[i];
      list[i].children = [];
  }
  for (i = 0; i < list.length; i += 1) {
      node = list[i];
      console.log(map)
      if (node.pid !== '-1') {
          map[node.pid].children.push(node);
      } else {
          tree.push(node);
      }
  }
  return tree;
}

console.log(listToTree(arr));
