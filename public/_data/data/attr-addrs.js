import {
  TYPE
} from './_dictionary';
/** 位置数据 */
let datas = [{
  owner: 1,
  type: TYPE.ACTIVITY,
  distance: '102米',
  desc: '沈阳市和平区民主路225号1303室',
  lng: 123.40,
  lat: 41.78
},
{
  owner: 2,
  type: TYPE.ACTIVITY,
  distance: '1.2公里',
  desc: '沈阳市浑南区藏珑1620（白塔河二路南160米）',
  lng: 123.49,
  lat: 41.70
},
{
  owner: 1,
  type: TYPE.TRAINING,
  distance: '10公里',
  desc: '沈阳市和平区民主路225号1303室',
  lng: 123.40,
  lat: 41.78
},
{
  owner: 1,
  type: TYPE.SCHOOL,
  distance: '10米以内',
  desc: '沈阳市和平区民主路225号1303室',
  lng: 123.40,
  lat: 41.78
},
{
  owner: 2,
  type: TYPE.EVALUATE,
  desc: '上海市 - 普陀区 - 长风海洋世界'
},
{
  owner: 2,
  type: TYPE.EVALUATE,
  desc: '上海市 - 普陀区 - 长风海洋世界'
},
];

/**
 * 根据所有者编号及所有者类型获取地址数据
 * @param {number} id 所有者编号
 * @param {string} type 所有者类型
 */
var getAddr = (id, type) => {
  var addr = datas.find((p) => {
    return p.owner == id && p.type == type;
  });

  if (addr) {
    return {
      distance: addr.distance,
      desc: addr.desc,
      lng: addr.lng,
      lat: addr.lat
    };
  } else {
    return {
      desc: '尚未选择地点...'
    }
  }
};


module.exports = {
  get: getAddr
}