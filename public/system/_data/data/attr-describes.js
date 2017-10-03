import {
  TYPE
} from './_dictionary';
/** 描述数据 */
let datas = [{
  owner: 1,
  type: TYPE.ACTIVITY,
  content: `<div>熊宝家庭套餐</div><div style="font-size: 14px;">最萌熊宝套餐低价来袭！购买两大一小家庭套票直降100元！可免费参观最新北极熊主题馆，并赠送可爱呆萌北极熊玩偶一只！数量有限，购完即止！</div><div style="font-size: 14px;"><img src="/assets/news/a-1.jpg"/></div><div style="font-size: 14px;"><img src="/assets/news/a-2.jpg"/></div><div style="font-size: 14px;">脑子里装满了十万个为什么的小小探索家们，赶紧收拾行囊，加入长风海洋世界的奇妙夜宿之旅吧！</div><div style="font-size: 14px;">当夜幕降临，海洋世界是孩子们的海底王国。五彩缤纷的鱼儿在身边遨游，奇特又美丽</div><div><img src="/assets/news/a-3.jpg"/></div><div><img src="/assets/news/a-4.jpg"/></div>`
}, {
  owner: 2,
  type: TYPE.ACTIVITY,
  content: `<div>“零距离”触摸海星</div><div style="font-size: 14px;">可爱的海星是小朋友们亲睐的海洋生物之一。常年生活在水底的它们终于现身啦！来海洋世界亲手触摸这些可爱的小家伙吧。</div><div><img src="/assets/news/t-1.jpg"/></div><div><img src="/assets/news/t-2.jpg"/></div><div>给海马宝宝喂食</div><div style="font-size: 14px;">喂食时刻是绝对不可错过的精彩瞬间。在我们神秘的海马王国中，小小探索家们可以亲自喂食海马宝宝，体验一把充当小小水族师的快感。</div><div><img src="/assets/news/t-3.jpg"/></div><div><img src="/assets/news/t-4.jpg"/></div>`
}];


var getDescribe = (id, type) => {
  var describe = datas.find((p) => {
    return p.owner == id && p.type == type;
  });
  if (describe) {
    return describe.content;
  } else {
    return '<div style="font-size:14px;color:#ccc;padding:15px;">没有详细描述</div>';
  }
};

module.exports = {
  get: getDescribe
}