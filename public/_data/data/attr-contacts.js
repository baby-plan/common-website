/** 位置数据 */
const CHARSET_STAR = "★ 星标朋友";
let data = {};
data.list = [
  {
    id: 1,
    name: '心理咨询：张三',
    group: CHARSET_STAR,
    desc: '你身边的心理咨询专家！',
    img: '/assets/head-icon/avatar1.jpg',
    identity: { name: '官方客服' }
  }, {
    id: 2,
    name: '心理咨询：张思',
    group: CHARSET_STAR,
    desc: '你身边的心理咨询专家！',
    img: '/assets/head-icon/avatar2.jpg'
  }, {
    id: 3,
    name: '小五',
    group: 'X',
    desc: '这个家伙很懒，什么都没有留下',
    img: '/assets/head-icon/avatar3.jpg',
    identity: { name: '机构老师' }
  }, {
    id: 4,
    name: '李四',
    group: 'L',
    desc: '这个家伙很懒，什么都没有留下',
    img: '/assets/head-icon/avatar4.jpg'
  }, {
    id: 5,
    name: '淘宝妈妈',
    group: 'T',
    desc: '这个家伙很懒，什么都没有留下',
    img: '/assets/head-icon/avatar5.jpg'
  }, {
    id: 6,
    name: '闹闹',
    group: 'N',
    desc: '这个家伙很懒，什么都没有留下',
    img: '/assets/head-icon/avatar6.jpg'
  }, {
    id: 7,
    name: '花花',
    group: 'H',
    desc: '你身边的心理咨询专家！',
    img: '/assets/head-icon/avatar1.jpg'
  }, {
    id: 8,
    name: '木头人',
    group: 'M',
    desc: '你身边的心理咨询专家！',
    img: '/assets/head-icon/avatar2.jpg'
  }, {
    id: 9,
    name: 'USB',
    group: 'U',
    desc: '这个家伙很懒，什么都没有留下',
    img: '/assets/head-icon/avatar3.jpg'
  }, {
    id: 10,
    name: '李四',
    group: 'L',
    desc: '这个家伙很懒，什么都没有留下',
    img: '/assets/head-icon/avatar4.jpg'
  }, {
    id: 11,
    name: 'Orange',
    group: 'O',
    desc: '这个家伙很懒，什么都没有留下',
    img: '/assets/head-icon/avatar5.jpg'
  }, {
    id: 12,
    name: '溜溜',
    group: 'L',
    desc: '这个家伙很懒，什么都没有留下',
    img: '/assets/head-icon/avatar6.jpg'
  }, {
    id: 13,
    name: '艾斯阿尔',
    group: 'A',
    desc: '你身边的心理咨询专家！',
    img: '/assets/head-icon/avatar1.jpg'
  }, {
    id: 14,
    name: 'Candy',
    group: 'C',
    desc: '你身边的心理咨询专家！',
    img: '/assets/head-icon/avatar2.jpg'
  }, {
    id: 15,
    name: 'Candy',
    group: 'C',
    desc: '这个家伙很懒，什么都没有留下',
    img: '/assets/head-icon/avatar3.jpg'
  }, {
    id: 16,
    name: '霏凡',
    group: 'F',
    desc: '这个家伙很懒，什么都没有留下',
    img: '/assets/head-icon/avatar4.jpg'
  }, {
    id: 17,
    name: '阿里巴巴',
    group: 'A',
    desc: '这个家伙很懒，什么都没有留下',
    img: '/assets/head-icon/avatar5.jpg'
  }, {
    id: 18,
    name: '百事可乐',
    group: 'B',
    desc: '这个家伙很懒，什么都没有留下',
    img: '/assets/head-icon/avatar6.jpg'
  }
];

data.groups = [];

var map = {};
for (var i = 0; i < data.list.length; i++) {
  var ai = data.list[i];
  if (!map[ai.group]) {
    var group = {
      code: ai.group,
      id: ai.group,
      charset: "_" + ai.group,
      data: [ai]
    };
    if (group.code == CHARSET_STAR) {
      group.id = "★";
      group.charset = '_1';
    }
    data.groups.push(group);
    map[ai.group] = ai;
  } else {
    for (var j = 0; j < data.list.length; j++) {
      var dj = data.groups[j];
      if (dj.code == ai.group) {
        dj.data.push(ai);
        break;
      }
    }
  }
}

data.groups = data.groups.sort(function (a, b) {
  return (b.charset < a.charset) ? 1 : -1;
});

data.filter = (word) => {
  data.groups.forEach((group, index) => {
    group.data.forEach((contact) => {
      contact.display = word == '' || (contact.name.indexOf(word) > -1)
    });
    group.display = group.data.find((contact) => {
      return contact.display;
    }) != undefined;
  });
  return data.groups;
};
// data.charset = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']
module.exports = data;