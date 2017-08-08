import {
  TYPE
} from './_dictionary';

import addrs from './attr-addrs';

let datas = [
  {
    owner: 1,
    user: 1,
    time: '10:30',
    text: '这里应该写一些关于本项活动的评价，内容多少不做限制。',
    share: true,
    reply: [
      { user: { name: '汇通宝宝' }, date: '2017-1-2 12:20', text: '看样子风景不错哟。' },
      { user: { name: '我' }, targetuser: { name: '汇通宝宝' }, date: '2017-1-2 12:20', text: '拍照水平有限,实际风景更好!!!' },
      { user: { name: '汇通妈妈' }, targetuser: { name: '汇通宝宝' }, date: '刚刚', text: '哈哈哈哈' }
    ], imgs: [{
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
  },
  {
    owner: 1,
    user: 2,
    time: '12:45',
    text: '这里应该写一些关于本项活动的评价，内容多少不做限制。',
    imgs: [{
      id: 1,
      img: '/assets/news/s-1.jpg'
    },
    {
      id: 2,
      img: '/assets/news/s-2.jpg'
    },
    {
      id: 3,
      img: '/assets/news/s-3.jpg'
    }
    ],

  },
  {
    owner: 1,
    user: 1,
    time: '10:30',
    text: '这里应该写一些关于本项活动的评价，内容多少不做限制。'
  },
  {
    owner: 1,
    user: 1,
    time: '10:30',
    text: '这里应该写一些关于本项活动的评价，内容多少不做限制。'
  },
];

datas.forEach((data, index) => {

  data.addr = addrs.get(data.owner, TYPE.FOOTMARK);

});

/**
 * 根据所有者编号及所有者类型获取路书数据
 * @param {number} id 所有者编号
 */
var getDetail = (id) => {
  let results = [], rate = 0;
  datas.forEach((footmark) => {
    results.push(footmark);
  });

  return {
    rate: (rate / results.length),
    count: results.length,
    list: results
  };
};

module.exports = {
  get: getDetail,
  list: datas
};