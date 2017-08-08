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

/** 活动数据 */
let datas = [
  {
    id: 1,
    title: "【长风海洋世界+白鲸表演】职业体验之小导游系列亲子活动",
    img: "/assets/news/a-1.jpg",
    time: '10分钟前',
    tags: [1, 2, 3, 4, 5, 6],
    publisher: 1
  },
  {
    id: 2,
    title: "【长风海洋世界+白鲸表演】职业体验之小导游系列亲子活动",
    img: "/assets/news/a-2.jpg",
    time: '10分钟前',
    tags: [1, 2, 3, 6],
    publisher: 2,
  },
  {
    id: 3,
    title: "【汇通国力】职业体验之软件公司日常生活",
    img: "/assets/news/a-3.jpg",
    time: '10分钟前',
    tags: [5, 6],
    publisher: 1,
  },
  {
    id: 4,
    title: "南京都市风光一日游",
    img: "/assets/news/a-4.jpg",
    time: '刚刚',
    tags: [1, 2, 3, 6],
    publisher: 2,
  }
];

let _TYPE = TYPE.ACTIVITY;

datas.forEach((item, index) => {
  item.type = _TYPE;
  item.publisher = publishers.find((p) => {
    return p.id == item.publisher;
  });

  item.addr = addrs.get(item.id, _TYPE);
  item.evaluate = evaluates.get(item.id, _TYPE);
});

let getDetail = (id) => {
  var activity = datas.find((item, index) => {
    return item.id == id;
  });
  if (activity) {
    activity.signup = signups.find((p) => {
      return p.owner == activity.id && p.type == _TYPE;
    });
    activity.video = videos.find((p) => {
      return p.owner == activity.id && p.type == _TYPE;
    });
    activity.tags = tags.transf(activity.tags);
    // 处理详情数据
    activity.desc = describes.get(activity.id, _TYPE);
    return activity;
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
      results.push({
        id: item.id, title: item.title, time: item.time, addr: item.addr, type: item.type, img: item.img
      });
    }
  });
  return results;
};

module.exports = {
  list: datas,
  get: getDetail,
  filter: filter
};