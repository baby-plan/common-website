import tags from './attr-tags';
import addrs from './attr-addrs';
import videos from './attr-videos';
import signups from './attr-signups';
import evaluates from './attr-evaluates';
import describes from './attr-describes';
import publishers from './attr-publishers';
import {
  TYPE
} from './_dictionary';

let _TYPE = TYPE.TRAINING;
/** 机构数据 */
let datas = [
  {
    id: 1,
    title: "【悦通慧享】婴幼儿早教",
    img: "/assets/news/t-1.jpg",
    tags: [1],
  }, {
    id: 2,
    title: "【悦通慧享】婴幼儿英语班",
    img: "/assets/news/t-2.jpg",
    tags: [1]
  }, {
    id: 3,
    title: "东方爱婴沈河中心",
    img: "/assets/news/t-3.jpg",
    tags: ['启蒙类', '创意类'],
    telphone: '024-31303102'
  }, {
    id: 4,
    title: "UGROWUP优成长中心",
    img: "/assets/news/t-4.jpg",
    tags: ['启蒙类', '托班'],
    telphone: '024-2291399'
  }
];

datas.forEach((item, index) => {
  item.type = _TYPE;
  item.addr = addrs.get(item.id, _TYPE);
  item.evaluate = evaluates.getTotal(item.id, _TYPE);
});

let getDetail = (id) => {
  var training = datas.find((item, index) => {
    return item.id == id;
  });
  if (training) {
    training.tags = tags.transf(training.tags);
    // 处理详情数据
    training.desc = describes.get(training.id, _TYPE);

    training.signup = signups.find((p) => {
      return p.owner == training.id && p.type == _TYPE;
    });
    training.evaluate = evaluates.get(training.id, _TYPE);

    return training;
  } else {
    return {
      id: id,
      name: '数据不存在'
    }
  }
}

let filter = (word) => {
  var results = [];
  datas.forEach((item, index) => {
    if (!word || item.title.indexOf(word) > -1) {
      results.push(item);
    }
  });
  return results;
};

module.exports = {
  list: datas,
  get: getDetail,
  filter: filter
};