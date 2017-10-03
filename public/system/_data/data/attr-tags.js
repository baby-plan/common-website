/** 标签数据 */


let datas = [{
  id: 1,
  text: "官方推荐"
},
{
  id: 2,
  text: "普陀区"
},
{
  id: 3,
  text: "附近活动"
},
{
  id: 4,
  text: "官方活动"
},
{
  id: 5,
  text: "热门推荐"
},
{
  id: 6,
  text: "其他"
}
];

var transf = (array) => {
  let results = [];
  array.forEach((item) => {
    var tag = datas.find((p) => {
      return p.id == item
    });
    if (tag) {
      results.push(tag);
    } else {
      results.push(item);
    }
  });
  return results;
}

module.exports = {
  list: datas,
  transf: transf
};
