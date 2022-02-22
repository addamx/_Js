function recu(arr) {
  return arr.reduce((sum, val) => {
    sum.push(val.id)
    if (val.children) {
      sum = sum.concat(recu(val.children))
    }
    return sum
  }, [])
}


//test
var arr = [
  {
    id: 1,
    children: [
      {
        id: 12,
        children: [
          {
            id: 13,
            children: [
              {
                id: 133,
                children: null
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    children: [
      {
        id: 21,
        children: null
      }
    ]
  },
  {
    id: 3,
    children: null
  }
];

recu(arr)