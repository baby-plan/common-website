import {
  TYPE
} from './_dictionary';


import contacts from './attr-contacts';
import addrs from './attr-addrs';

let datas = [
  {
    owner: 1,
    type: TYPE.ACTIVITY,
    user: 1,
    time: '4月1日 10:30',
    rate: 4,
    text: '这里应该写一些关于本项活动的评价，内容多少不做限制。',
    thumbup: 10,
    thumbupOn: true
  },
  {
    owner: 1,
    type: TYPE.ACTIVITY,
    user: 2,
    time: '4月1日 10:30',
    rate: 5,
    text: '这里应该写一些关于本项活动的评价，内容多少不做限制。',
    imgs: [{
      id: 1,
      img: '/assets/news/a-1.jpg'
    },
    {
      id: 2,
      img: '/assets/news/a-2.jpg'
    },
    {
      id: 3,
      img: '/assets/news/a-3.jpg'
    }
    ],
    thumbup: 109,
    thumbupOn: false
  }
];

datas.forEach((data, index) => {
  // 处理评论人数据
  var contact = contacts.list.find((p) => {
    return p.id == data.user
  });
  if (contact) {
    data.contact = {
      name: contact.name,
      img: contact.img
    }
  } else {
    data.contact = {
      name: '匿名用户',
      img: ''
    }
  }
  data.addr = addrs.get(data.owner, TYPE.EVALUATE);

});

/**
 * 根据所有者编号及所有者类型获取评论数据
 * @param {number} id 所有者编号
 * @param {string} type 所有者类型
 */
var getEvaluate = (id, type) => {
  let results = [], rate = 0;
  datas.forEach((evaluate) => {
    if (evaluate.owner == id && evaluate.type == type) {
      results.push(evaluate);
      rate = evaluate.rate + rate;
    }
  });

  return {
    rate: (rate / results.length),
    count: results.length,
    list: results
  };
};

module.exports = {
  get: getEvaluate,
  getTotal: (id, type) => {
    var result = getEvaluate(id, type);
    delete result['list'];
    return result;
  }
};