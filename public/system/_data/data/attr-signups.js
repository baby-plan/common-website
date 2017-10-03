import users from './attr-users';
import {
  TYPE
} from './_dictionary';
/** 报名数据 */
let datas = [
  {
    owner: 1,
    type: TYPE.ACTIVITY,
    count: 55,
    pay: 44,
    money: 208,
    list: [1, 2, 3, 4, 5, 6]
  },
  {
    owner: 2,
    type: TYPE.ACTIVITY,
    count: 650,
    pay: 493,
    money: 403,
    list: [1, 2, 3, 4, 5, 6]
  },
  {
    owner: 3,
    type: TYPE.ACTIVITY,
    count: 650,
    pay: 493,
    money: 403,
    list: [4, 2, 6]
  },
];

datas.forEach((item, index) => {
  var userlist = [];
  item.list.forEach((userid) => {
    userlist.push(users.find((p) => {
      return p.id == userid
    }));
  });
  item.list = userlist;
});

module.exports = datas;