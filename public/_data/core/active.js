import activityTypes from '../data/activity-types';
import schools from '../data/data-schools';
import trainings from '../data/data-trainings';
import activities from '../data/data-activities';
import {
  TYPE
} from '../data/_dictionary';

var hosts = [
  {
    id: 1,
    img: '/assets/news/n-9.jpg'
  },
  {
    id: 2,
    img: '/assets/news/n-1.jpg'
  },
  {
    id: 3,
    img: '/assets/news/n-2.jpg'
  },
  {
    id: 4,
    img: '/assets/news/n-3.jpg'
  },
  {
    id: 4,
    img: '/assets/news/n-4.jpg'
  }
];

module.exports = {
  TYPE: TYPE,
  /**
   * 查询数据
   * @param {string} type 项目类型
   * @param {string} title 检索标题
   * @return {object[]}
   */
  select: (type, title) => {
    var result = [];
    // 处理活动数据
    if (!type || type == TYPE.ACTIVITY) {
      var list = activities.filter(title);
      list.forEach((item, index) => {
        result.push(item);
      });
    }

    // 处理机构数据
    if (!type || type == TYPE.TRAINING) {
      var list = trainings.filter(title);
      list.forEach((item, index) => {
        result.push(item);
      });
    }

    // 处理学校数据
    if (!type || type == TYPE.SCHOOL) {
      var list = schools.filter(title);
      list.forEach((item, index) => {
        result.push(item);
      });
    }
    return result;
  },

  /**
   * 根据编号获取指定数据
   * @param {string} id 项目编号
   * @param {string} type 项目类型
   */
  find: (id, type) => {
    if (type == TYPE.ACTIVITY) {
      return activities.get(id);
    } else if (type == TYPE.TRAINING) {
      return trainings.get(id);
    } else if (type == TYPE.SCHOOL) {
      return schools.get(id);
    }
  },

  /**
   * 获取全部活动类型
   * @return {object[]} 返回全部活动类型
   */
  getTypes: () => {
    return activityTypes;
  },

  /**
   * 获取热门推荐活动
   * @return {object[]} 返回全部活动类型
   */
  getHots: () => {
    return hosts;
  }
}