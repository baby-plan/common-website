/*
Navicat MySQL Data Transfer

Source Server         : 本地连接
Source Server Version : 50624
Source Host           : localhost:3306
Source Database       : nodejs

Target Server Type    : MYSQL
Target Server Version : 50624
File Encoding         : 65001

Date: 2017-08-08 10:08:07
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for `action_article`
-- ----------------------------
DROP TABLE IF EXISTS `action_article`;
CREATE TABLE `action_article` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '唯一标识',
  `text` varchar(800) NOT NULL COMMENT '动态的内容',
  `owner` varchar(32) NOT NULL COMMENT '发布动态的用户,关联SYS_USERS表ACCOUNT字段',
  `ownertype` varchar(10) NOT NULL COMMENT '动态发布者的类型:U=用户,A=活动,O=机构',
  `client` varchar(50) NOT NULL COMMENT '发布动态的客户端',
  `imgs` varchar(300) DEFAULT NULL COMMENT '动态中包含的图片编号',
  `date` int(11) NOT NULL COMMENT '发布动态的时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COMMENT='人员动态表';

-- ----------------------------
-- Records of action_article
-- ----------------------------
INSERT INTO action_article VALUES ('1', '前不久，苹果公司高级副总裁 Eddy Cue 还在宣称 Apple Music 试用期用户超 1100 万，最近就有一份来自 MusicWatch 的调查报告，让人大跌眼镜。\r\n\r\nMusicWatch 针对美国 5000 名 13 岁以上人群进行抽样调查，得出数据：约有 77% 的 iOS 用户知道 Apple Music，只有 11% 的用户正在使用它；而在已经注册 Apple Music 三个月免费试用服务的用户中，48% 表示已经弃用，61% 称已关闭 iTunes 中的自动订阅功能。', 'wangxin', 'U', 'iPhone 6S Plus', '9,10,11', '1481514985');
INSERT INTO action_article VALUES ('2', '近日天天有人在朋友圈里放出“酒店 X 折”的广告，原来七夕到了。恰恰在这个中国人的传统节日里，美国也凑起了热闹，FDA 通过了 Addyi 的审批，这是第一种能解决女性性欲问题的药物。此前，Addyi 在 2010 年和2013 年曾两次报批被拒，理由是“药效的边际效应和副作用”。', 'wangxin', 'U', '浏览器', '', '1481514985');
INSERT INTO action_article VALUES ('3', '1. 阿里富士康等 5 亿美元投资印度“淘宝” Snapdeal。印度大型电子商务公司 Snapdeal 已获得 5 亿美元的投资，公司现估值 50 亿美元，主要投资者为阿里巴巴、富士康和软银。据称，阿里巴巴与富士康均投资 2 亿美元。', 'wangxin', 'U', '浏览器', null, '1481514985');
INSERT INTO action_article VALUES ('4', 'http://localhost:8080/api/article/', 'admin', 'U', '浏览器', '12,13,14', '1481514985');
INSERT INTO action_article VALUES ('5', 'MusicWatch 针对美国 5000 名 13 岁以上人群进行抽样调查，得出数据：约有 77% 的 iOS 用户知道 Apple Music，只有 11% 的用户正在使用它；而在已经注册 Apple Music 三个月免费试用服务的用户中，48% 表示已经弃用，61% 称已关闭 iTunes 中的自动订阅功能。', 'wangxin', 'U', 'iPhone 6S Plus', '', '1481514985');
INSERT INTO action_article VALUES ('6', 'MusicWatch 针对美国 5000 名 13 岁以上人群进行抽样调查，得出数据：约有 77% 的 iOS 用户知道 Apple Music，只有 11% 的用户正在使用它；而在已经注册 Apple Music 三个月免费试用服务的用户中，48% 表示已经弃用，61% 称已关闭 iTunes 中的自动订阅功能。', 'wangxin', 'U', 'iPhone 6S Plus', '', '1481514985');
INSERT INTO action_article VALUES ('7', 'MusicWatch 针对美国 5000 名 13 岁以上人群进行抽样调查，得出数据：约有 77% 的 iOS 用户知道 Apple Music，只有 11% 的用户正在使用它；而在已经注册 Apple Music 三个月免费试用服务的用户中，48% 表示已经弃用，61% 称已关闭 iTunes 中的自动订阅功能。', 'wangxin', 'U', 'iPhone 6S Plus', '', '1481695713');
INSERT INTO action_article VALUES ('8', '地方', 'admin', 'U', '浏览器', '', '1481695713');
INSERT INTO action_article VALUES ('9', '123123', 'admin', 'U', '浏览器', '', '1481695713');
INSERT INTO action_article VALUES ('10', '12月13日是南京大屠杀79周年纪念日，大陆方面举行隆重活动，纪念我遇难同胞。前台湾地区领导人马英九也应邀赴岛内中国文化大学演讲时，也谈到此一重大浩劫。然而，令人感到可悲、可耻的是，就在13日当晚，蔡英文当局自封的“外交部长”李大维，“亚东关系协会会长”、前“陈水扁军师”邱义仁，不仅跑去参加“日本交流协会台北事务所”在台北举办的“天皇诞生日庆祝酒会”，还在现场宣称“台日友谊极为深厚”、“盼台日共推新南向政策”云云。', 'user1', 'U', 'iPhone 6', null, '1481769486');

-- ----------------------------
-- Table structure for `action_comment`
-- ----------------------------
DROP TABLE IF EXISTS `action_comment`;
CREATE TABLE `action_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一标识',
  `owner` varchar(32) NOT NULL COMMENT '评论人:关联SY_USERS表ACCOUNT字段',
  `target` int(30) NOT NULL COMMENT '评论的机构编号:关联机构表',
  `targettype` varchar(10) NOT NULL COMMENT '评论的类型:U=用户,A=活动,O=机构',
  `client` varchar(50) NOT NULL COMMENT '发布评论的客户端',
  `text` varchar(400) NOT NULL COMMENT '评论内容',
  `date` int(11) NOT NULL COMMENT '评论发布时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COMMENT='机构评论表';

-- ----------------------------
-- Records of action_comment
-- ----------------------------
INSERT INTO action_comment VALUES ('2', 'admin', '10', 'A', 'Windows Phone', 'nnd', '1481769486');
INSERT INTO action_comment VALUES ('3', 'wangxin', '8', 'A', 'pc', '这个是评论内容', '1481788492');
INSERT INTO action_comment VALUES ('8', 'admin', '9', 'A', 'iPhone', '手机评论', '1481789530');
INSERT INTO action_comment VALUES ('9', 'wangxin', '8', 'A', 'iPhone', '这个还是手机评论', '1481789609');
INSERT INTO action_comment VALUES ('10', 'wangxin', '8', 'A', 'pc', '1', '1495775657');

-- ----------------------------
-- Table structure for `action_evaluate`
-- ----------------------------
DROP TABLE IF EXISTS `action_evaluate`;
CREATE TABLE `action_evaluate` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一标识',
  `owner` varchar(36) NOT NULL COMMENT '评价所属:机构学校活动个人路书等等',
  `userid` varchar(36) NOT NULL COMMENT '用户编号',
  `point` int(2) NOT NULL DEFAULT '0' COMMENT '积分',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='评价';

-- ----------------------------
-- Records of action_evaluate
-- ----------------------------

-- ----------------------------
-- Table structure for `action_recommend`
-- ----------------------------
DROP TABLE IF EXISTS `action_recommend`;
CREATE TABLE `action_recommend` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一标识',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='推荐/点赞';

-- ----------------------------
-- Records of action_recommend
-- ----------------------------

-- ----------------------------
-- Table structure for `citydefine`
-- ----------------------------
DROP TABLE IF EXISTS `citydefine`;
CREATE TABLE `citydefine` (
  `CityID` varchar(9) NOT NULL COMMENT '市编号',
  `CityName` varchar(100) NOT NULL COMMENT '市名称',
  `state` varchar(3) NOT NULL COMMENT '状态',
  PRIMARY KEY (`CityID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of citydefine
-- ----------------------------

-- ----------------------------
-- Table structure for `codedefine`
-- ----------------------------
DROP TABLE IF EXISTS `codedefine`;
CREATE TABLE `codedefine` (
  `CodeID` varchar(100) NOT NULL COMMENT '号段编号',
  `CodeName` varchar(100) NOT NULL COMMENT '号段名称',
  `ProvinceID` varchar(9) NOT NULL COMMENT '所属省代码',
  `CityID` varchar(9) NOT NULL COMMENT '所属市代码',
  `state` varchar(3) NOT NULL COMMENT '状态',
  PRIMARY KEY (`CodeID`),
  KEY `FK_CodeCifyDefine` (`CityID`),
  KEY `FK_CodeProvinceDefine` (`ProvinceID`),
  CONSTRAINT `FK_CodeCifyDefine` FOREIGN KEY (`CityID`) REFERENCES `citydefine` (`CityID`),
  CONSTRAINT `FK_CodeProvinceDefine` FOREIGN KEY (`ProvinceID`) REFERENCES `provincedefine` (`ProvinceID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of codedefine
-- ----------------------------

-- ----------------------------
-- Table structure for `common_dicts`
-- ----------------------------
DROP TABLE IF EXISTS `common_dicts`;
CREATE TABLE `common_dicts` (
  `dictkey` varchar(20) NOT NULL COMMENT '数据字典代码',
  `itemkey` varchar(50) NOT NULL COMMENT '数据字典项代码',
  `itemvalue` varchar(50) NOT NULL COMMENT '数据字典项对应的值',
  PRIMARY KEY (`dictkey`,`itemkey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='公共数据字典表';

-- ----------------------------
-- Records of common_dicts
-- ----------------------------
INSERT INTO common_dicts VALUES ('activitytype', 'A-1', '艺术类');
INSERT INTO common_dicts VALUES ('activitytype', 'A-2', '户外活动');
INSERT INTO common_dicts VALUES ('activitytype', 'A-3', '艺术表演');
INSERT INTO common_dicts VALUES ('activitytype', 'A-4', '亲子互动');
INSERT INTO common_dicts VALUES ('activitytype', 'A-5', '体育竞技');
INSERT INTO common_dicts VALUES ('filetype', '.html,.htm', 'HTML 网页文件');
INSERT INTO common_dicts VALUES ('filetype', '.md', 'Markdown 文件');
INSERT INTO common_dicts VALUES ('filetype', '.png,.jpg,.gif', '图片文件');
INSERT INTO common_dicts VALUES ('filetype', '.txt', '文本文件');
INSERT INTO common_dicts VALUES ('orgatype', 'O-0-1', '中小学辅导班');
INSERT INTO common_dicts VALUES ('orgatype', 'O-0-2', '艺术培训');
INSERT INTO common_dicts VALUES ('orgatype', 'O-0-3', '语言培训');
INSERT INTO common_dicts VALUES ('orgatype', 'O-1', '艺术类');
INSERT INTO common_dicts VALUES ('orgatype', 'O-1-1', '小学');
INSERT INTO common_dicts VALUES ('orgatype', 'O-1-2', '初中');
INSERT INTO common_dicts VALUES ('orgatype', 'O-1-3', '课外英语');
INSERT INTO common_dicts VALUES ('orgatype', 'O-1-4', '夏冬令营');
INSERT INTO common_dicts VALUES ('orgatype', 'O-2', '体育类');
INSERT INTO common_dicts VALUES ('orgatype', 'O-2-1', '舞蹈');
INSERT INTO common_dicts VALUES ('orgatype', 'O-2-10', '园艺');
INSERT INTO common_dicts VALUES ('orgatype', 'O-2-2', '乐器');
INSERT INTO common_dicts VALUES ('orgatype', 'O-2-3', '美术');
INSERT INTO common_dicts VALUES ('orgatype', 'O-2-4', '声乐');
INSERT INTO common_dicts VALUES ('orgatype', 'O-2-5', '表演');
INSERT INTO common_dicts VALUES ('orgatype', 'O-2-6', '利益');
INSERT INTO common_dicts VALUES ('orgatype', 'O-2-7', '摄影');
INSERT INTO common_dicts VALUES ('orgatype', 'O-2-8', '书法');
INSERT INTO common_dicts VALUES ('orgatype', 'O-2-9', '形体');
INSERT INTO common_dicts VALUES ('orgatype', 'O-3', '口才训练');
INSERT INTO common_dicts VALUES ('orgatype', 'O-4', '乐器培训');
INSERT INTO common_dicts VALUES ('orgatype', 'O-5', '少儿舞蹈');
INSERT INTO common_dicts VALUES ('orgatype', 'O-6', '跆拳道培训');
INSERT INTO common_dicts VALUES ('schooltype', 'S-1', '艺术类');
INSERT INTO common_dicts VALUES ('schooltype', 'S-2', '小学(私立)');
INSERT INTO common_dicts VALUES ('sex', '1', '男');
INSERT INTO common_dicts VALUES ('sex', '2', '女');

-- ----------------------------
-- Table structure for `common_files`
-- ----------------------------
DROP TABLE IF EXISTS `common_files`;
CREATE TABLE `common_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一标识',
  `name` varchar(100) NOT NULL COMMENT '显示的文件名称',
  `dir` varchar(100) DEFAULT NULL COMMENT '显示的目录名称',
  `path` varchar(1000) NOT NULL COMMENT '文件完整的存放目录',
  `size` int(11) NOT NULL DEFAULT '0' COMMENT '文件大小',
  `extname` varchar(20) NOT NULL DEFAULT '' COMMENT '文件扩展名',
  `owner` varchar(32) NOT NULL COMMENT '文件所有者',
  `date` int(11) NOT NULL COMMENT '文件上传日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COMMENT='上传文件保存表';

-- ----------------------------
-- Records of common_files
-- ----------------------------
INSERT INTO common_files VALUES ('1', 'a1.jpg', null, 'public/resource/avatar/user1/a1.jpg', '170823', '.jpg', 'user1', '1481354145');
INSERT INTO common_files VALUES ('2', 'a2.jpg', null, 'public/resource/avatar/user2/a2.jpg', '307599', '.jpg', 'user2', '1481514983');
INSERT INTO common_files VALUES ('3', 'a3.jpg', null, 'public/resource/avatar/user3/a3.jpg', '267731', '.jpg', 'user3', '1481514985');
INSERT INTO common_files VALUES ('4', 'a4.jpg', null, 'public/resource/avatar/user4/a4.jpg', '322156', '.jpg', 'user4', '1481514989');
INSERT INTO common_files VALUES ('5', 'a5.jpg', null, 'public/resource/avatar/user5/a5.jpg', '170823', '.jpg', 'user5', '1481514992');
INSERT INTO common_files VALUES ('6', 'a6.jpg', null, 'public/resource/avatar/wangxin/a6.jpg', '151766', '.jpg', 'wangxin', '1481524930');
INSERT INTO common_files VALUES ('7', 'a7.jpg', null, 'public/resource/avatar/admin/a7.jpg', '170823', '.jpg', 'admin', '1481527401');
INSERT INTO common_files VALUES ('9', 'p_big1.jpg', null, 'public/resource/avatar/wangxin/p_big1.jpg', '322156', '.jpg', 'wangxin', '1481527432');
INSERT INTO common_files VALUES ('10', 'p_big2.jpg', null, 'public/resource/avatar/wangxin/p_big2.jpg', '170823', '.jpg', 'wangxin', '1481528708');
INSERT INTO common_files VALUES ('11', 'p_big3.jpg', null, 'public/resource/avatar/wangxin/p_big3.jpg', '170823', '.jpg', 'wangxin', '1481528723');
INSERT INTO common_files VALUES ('12', 'p1.jpg', null, 'public/resource/avatar/admin/p1.jpg', '170823', '.jpg', 'admin', '1481528723');
INSERT INTO common_files VALUES ('13', 'p2.jpg', null, 'public/resource/avatar/admin/p2.jpg', '170823', '.jpg', 'admin', '1481528723');
INSERT INTO common_files VALUES ('14', 'p3.jpg', null, 'public/resource/avatar/admin/p3.jpg', '170823', '.jpg', 'admin', '1481528723');

-- ----------------------------
-- Table structure for `interest_activity`
-- ----------------------------
DROP TABLE IF EXISTS `interest_activity`;
CREATE TABLE `interest_activity` (
  `owner` varchar(32) NOT NULL COMMENT '所有者编号:关联用户表',
  `target` varchar(32) NOT NULL COMMENT '关注目标编号:关联活动表',
  PRIMARY KEY (`owner`,`target`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户关注活动';

-- ----------------------------
-- Records of interest_activity
-- ----------------------------

-- ----------------------------
-- Table structure for `interest_orga`
-- ----------------------------
DROP TABLE IF EXISTS `interest_orga`;
CREATE TABLE `interest_orga` (
  `owner` varchar(32) NOT NULL COMMENT '所有者编号:关联用户表',
  `target` varchar(32) NOT NULL COMMENT '关注目标编号:关联机构表',
  PRIMARY KEY (`owner`,`target`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户关注机构';

-- ----------------------------
-- Records of interest_orga
-- ----------------------------

-- ----------------------------
-- Table structure for `interest_user`
-- ----------------------------
DROP TABLE IF EXISTS `interest_user`;
CREATE TABLE `interest_user` (
  `owner` varchar(32) NOT NULL COMMENT '所有者编号:关联用户表',
  `target` varchar(32) NOT NULL COMMENT '关注目标编号:关联用户表',
  PRIMARY KEY (`owner`,`target`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户关注用户';

-- ----------------------------
-- Records of interest_user
-- ----------------------------
INSERT INTO interest_user VALUES ('wangxin', 'admin');
INSERT INTO interest_user VALUES ('wangxin', 'user1');

-- ----------------------------
-- Table structure for `merchaninfo`
-- ----------------------------
DROP TABLE IF EXISTS `merchaninfo`;
CREATE TABLE `merchaninfo` (
  `MerchanID` varchar(100) NOT NULL COMMENT '商户编号',
  `MerchanLogin` varchar(100) DEFAULT NULL COMMENT '商户登录名',
  `Password` varchar(100) DEFAULT NULL COMMENT '登录密码',
  `MerchanName` varchar(100) DEFAULT NULL COMMENT '商户名称',
  `StoreName` varchar(100) DEFAULT NULL COMMENT '商户名称',
  `MerchanAddress` varchar(100) DEFAULT NULL,
  `Signatory` varchar(100) DEFAULT NULL COMMENT '签约人',
  `SignTime` decimal(20,0) DEFAULT NULL,
  `Time` decimal(20,0) DEFAULT NULL COMMENT '生效时间',
  `PublishState` varchar(3) NOT NULL COMMENT '发布状态（待发布、已发布）',
  `CheckState` varchar(3) NOT NULL COMMENT '审核状态（待审核、已审核、未通过）',
  `VlidityDate` decimal(20,0) DEFAULT NULL COMMENT '有效期',
  `ServiceItems` varchar(100) DEFAULT NULL COMMENT '服务项目',
  `lng` decimal(20,0) NOT NULL COMMENT '商户经度',
  `lat` decimal(20,0) NOT NULL COMMENT '商户纬度',
  `CreateUser` varchar(100) NOT NULL COMMENT '创建者',
  `CreateTime` decimal(20,0) NOT NULL COMMENT '创建时间',
  `LastModifyUser` varchar(100) NOT NULL COMMENT '最后修改者',
  `LastModiftTime` decimal(20,0) NOT NULL COMMENT '最后修改时间',
  `state` varchar(3) NOT NULL COMMENT '状态',
  PRIMARY KEY (`MerchanID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of merchaninfo
-- ----------------------------

-- ----------------------------
-- Table structure for `merchanserviceinfo`
-- ----------------------------
DROP TABLE IF EXISTS `merchanserviceinfo`;
CREATE TABLE `merchanserviceinfo` (
  `MerchanID` varchar(100) NOT NULL COMMENT '商户编号',
  `ServiceID` varchar(100) NOT NULL COMMENT '服务项目编号',
  `ServiceName` varchar(100) NOT NULL COMMENT '服务名称（小轿车普洗、SUV普洗、商务车普洗、小轿车精洗、SUV精洗、商务车精洗）',
  `ServiceType` varchar(100) NOT NULL COMMENT '服务类别（普洗、精洗）',
  `ServiceCarType` varchar(100) NOT NULL COMMENT '服务类别（普洗、精洗）',
  `ServiceBegin` decimal(20,0) NOT NULL COMMENT '服务开始时间',
  `ServiceEnd` decimal(20,0) NOT NULL COMMENT '服务结束时间',
  `SourceAmount` decimal(20,0) NOT NULL COMMENT '门市价格',
  `VIPAmount` decimal(20,0) NOT NULL COMMENT '签约折扣价格',
  `state` varchar(3) NOT NULL COMMENT '状态',
  PRIMARY KEY (`MerchanID`,`ServiceID`),
  CONSTRAINT `FK_MerchanServiceDefine` FOREIGN KEY (`MerchanID`) REFERENCES `merchaninfo` (`MerchanID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='商户服务项目定义表';

-- ----------------------------
-- Records of merchanserviceinfo
-- ----------------------------

-- ----------------------------
-- Table structure for `methodinfo`
-- ----------------------------
DROP TABLE IF EXISTS `methodinfo`;
CREATE TABLE `methodinfo` (
  `methodid` varchar(100) NOT NULL COMMENT '功能编号',
  `methodname` varchar(100) NOT NULL COMMENT '功能名称',
  `remark` varchar(100) DEFAULT NULL COMMENT '功能描述',
  PRIMARY KEY (`methodid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='定义模块功能,例如添加功能,删除功能,查询功能,编辑功能等';

-- ----------------------------
-- Records of methodinfo
-- ----------------------------
INSERT INTO methodinfo VALUES ('add', '添加', '添加一条记录');
INSERT INTO methodinfo VALUES ('edit', '编辑', '修改一条记录');
INSERT INTO methodinfo VALUES ('remove', '删除', '删除一条记录');

-- ----------------------------
-- Table structure for `moduleinfo`
-- ----------------------------
DROP TABLE IF EXISTS `moduleinfo`;
CREATE TABLE `moduleinfo` (
  `ModuleID` varchar(100) NOT NULL COMMENT '菜单编号',
  `ModuleName` varchar(100) NOT NULL COMMENT '菜单名称',
  `ModuleParent` varchar(100) NOT NULL,
  `ModulePage` varchar(100) DEFAULT NULL COMMENT '页面地址',
  `ModulePackage` varchar(100) NOT NULL COMMENT '页面组件包',
  `ModuleInitMethod` varchar(100) NOT NULL COMMENT '页面初始化方法',
  `ModuleArgs` varchar(100) DEFAULT NULL COMMENT '页面参数',
  `ModuleMethods` varchar(100) DEFAULT NULL COMMENT '页面功能清单',
  `ModuleDestory` varchar(100) DEFAULT NULL COMMENT '页面销毁函数',
  `ModuleIcon` varchar(100) DEFAULT NULL COMMENT '页面图标',
  `ModuleDesc` varchar(100) DEFAULT NULL COMMENT '页面描述',
  `CreateUser` varchar(100) NOT NULL COMMENT '创建者',
  `CreateTime` decimal(20,0) NOT NULL COMMENT '创建时间',
  `LastModifyUser` varchar(100) NOT NULL COMMENT '最后修改者',
  `LastModiftTime` decimal(20,0) NOT NULL COMMENT '最后修改时间',
  `state` varchar(3) NOT NULL COMMENT '状态',
  PRIMARY KEY (`ModuleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of moduleinfo
-- ----------------------------
INSERT INTO moduleinfo VALUES ('0100', '监控中心', '000', null, '', '', null, null, null, 'fa fa-tachometer', null, 'wangxin', '1502106468', 'wangxin', '1502106468', '1');
INSERT INTO moduleinfo VALUES ('0101', '服务器状态', '0100', 'views/common/serverstatus.html', 'module-server', 'status', null, null, null, 'fa fa-file-text-o', null, 'wangxin', '1502122497', 'wangxin', '1502122497', '1');
INSERT INTO moduleinfo VALUES ('0102', '服务端版本', '0100', 'views/common/version.server.html', '', '', '', '', '', 'fa fa-server', '', 'wangxin', '1502122497', 'wangxin', '1502124385', '1');
INSERT INTO moduleinfo VALUES ('0103', '客户端版本', '0100', 'views/common/version.client.html', '', '', null, null, null, 'fa fa-server', null, 'wangxin', '1502123660', 'wangxin', '1502123717', '1');
INSERT INTO moduleinfo VALUES ('0200', '查询统计', '000', null, '', '', null, null, null, 'fa fa-bar-chart-o', null, 'wangxin', '1502106899', 'wangxin', '1502123592', '1');
INSERT INTO moduleinfo VALUES ('0201', '用户全历史查询', '0200', '', 'module-statistics', 'initUserSearch', '', '', '', 'fa fa-search', '', 'wangxin', '1502122497', 'wangxin', '1502122497', '1');
INSERT INTO moduleinfo VALUES ('0202', '领券情况查询', '0200', null, 'module-statistics', 'initCouponStatus', null, null, null, null, null, 'wangxin', '1502122497', 'wangxin', '1502122497', '1');
INSERT INTO moduleinfo VALUES ('0203', '活跃用户统计月表', '0200', null, 'module-statistics', 'initActiveUser', null, null, null, null, null, 'wangxin', '1502122497', 'wangxin', '1502122497', '1');
INSERT INTO moduleinfo VALUES ('0204', '活跃商户统计月表', '0200', null, 'module-statistics', 'initActiveTenant', null, null, null, null, null, 'wangxin', '1502122497', 'wangxin', '1502122497', '1');
INSERT INTO moduleinfo VALUES ('0205', '商户上线成功率统计', '0200', null, 'module-statistics', 'initTenantUseRate', null, null, null, null, null, 'wangxin', '1502122497', 'wangxin', '1502122497', '1');
INSERT INTO moduleinfo VALUES ('0206', '商户签约数量统计', '0200', null, 'module-statistics', '', null, null, null, null, null, 'wangxin', '1502122497', 'wangxin', '1502122497', '1');
INSERT INTO moduleinfo VALUES ('0300', '订单管理', '000', null, '', '', null, null, null, 'fa fa-file-text-o', null, 'wangxin', '1502122497', 'wangxin', '1502122497', '1');
INSERT INTO moduleinfo VALUES ('0301', '订单信息查询', '0300', null, 'module-order', 'init', null, null, null, 'fa fa-search', null, 'wangxin', '1502122497', 'wangxin', '1502122497', '1');
INSERT INTO moduleinfo VALUES ('0302', '结算订单查询', '0300', null, 'module-order', 'initSettlementSearch', null, null, null, 'fa fa-search', null, 'wangxin', '1502122497', 'wangxin', '1502122497', '1');
INSERT INTO moduleinfo VALUES ('0400', '商户管理', '000', null, '', '', null, null, null, 'fa fa-cubes', null, 'wangxin', '1502122497', 'wangxin', '1502122497', '1');
INSERT INTO moduleinfo VALUES ('0401', '商户基本信息管理', '0400', null, 'module-tenant', 'initInfo', null, null, null, 'fa fa-file-text-o', null, 'wangxin', '1502122497', 'wangxin', '1502122497', '1');
INSERT INTO moduleinfo VALUES ('0402', '商户服务项目管理', '0400', null, 'module-tenant', 'initProject', null, null, null, 'fa fa-file-text-o', null, 'wangxin', '1502122497', 'wangxin', '1502122497', '1');
INSERT INTO moduleinfo VALUES ('0403', '商户全历史查询', '0400', null, 'module-tenant', 'initHistorySearch', null, null, null, 'fa fa-search', null, 'wangxin', '1502122497', 'wangxin', '1502122497', '1');
INSERT INTO moduleinfo VALUES ('0501', '合作方信息管理', '0500', null, '', '', null, null, null, null, null, 'wangxin', '1502122497', 'wangxin', '1502122497', '1');
INSERT INTO moduleinfo VALUES ('0600', '系统维护', '000', null, '', '', null, null, null, 'fa fa-cogs', null, 'wangxin', '1502122497', 'wangxin', '1502122497', '1');
INSERT INTO moduleinfo VALUES ('0601', '角色管理', '0600', null, 'module-common', 'init-role', null, null, null, 'fa fa-users', null, 'wangxin', '1502122497', 'wangxin', '1502122497', '1');
INSERT INTO moduleinfo VALUES ('0602', '账户管理', '0600', null, 'module-common', 'init-admin', null, null, 'uninit-admin', 'fa fa-users', null, 'wangxin', '1502122497', 'wangxin', '1502122497', '1');
INSERT INTO moduleinfo VALUES ('0603', '菜单功能管理', '0600', null, 'module-common', 'init-method', null, null, null, 'fa fa-cog', null, 'wangxin', '1502122497', 'wangxin', '1502122497', '1');
INSERT INTO moduleinfo VALUES ('0604', '菜单管理', '0600', null, 'module-common', 'init-module', null, null, null, 'fa fa-cog', null, 'wangxin', '1502122497', 'wangxin', '1502122497', '1');
INSERT INTO moduleinfo VALUES ('0605', '参数设置', '0600', 'views/common/option.html', 'module-common', 'init-options', null, null, null, 'fa fa-cog', null, 'wangxin', '1502122497', 'wangxin', '1502122497', '1');
INSERT INTO moduleinfo VALUES ('0606', '日志查询', '0600', null, 'module-common', 'init-log-search', null, null, null, 'fa fa-search', null, 'wangxin', '1502122497', 'wangxin', '1502122497', '1');
INSERT INTO moduleinfo VALUES ('0700', '数据字典管理', '000', null, '', '', null, null, null, null, null, 'wangxin', '1502122497', 'wangxin', '1502122497', '1');
INSERT INTO moduleinfo VALUES ('0701', '行政区划管理', '0700', null, 'module-dict', '', null, null, null, null, null, 'wangxin', '1502122497', 'wangxin', '1502122497', '1');
INSERT INTO moduleinfo VALUES ('0702', '号段表管理', '0700', null, 'module-dict', '', null, null, null, null, null, 'wangxin', '1502122497', 'wangxin', '1502122497', '1');

-- ----------------------------
-- Table structure for `object_activity`
-- ----------------------------
DROP TABLE IF EXISTS `object_activity`;
CREATE TABLE `object_activity` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '唯一标识',
  `name` varchar(100) NOT NULL COMMENT '活动名称',
  `describe` varchar(4000) DEFAULT NULL COMMENT '活动介绍,支持HTML,Markdown格式',
  `price` float(8,2) NOT NULL COMMENT '活动报名费用',
  `type` varchar(50) DEFAULT NULL COMMENT '活动类型',
  `begintime` int(11) NOT NULL COMMENT '活动开始时间:utc格式,精确到秒',
  `endtime` int(11) NOT NULL COMMENT '活动结束时间:utc格式,精确到秒',
  `sender` varchar(36) NOT NULL COMMENT '活动发起者',
  `sendertype` varchar(36) NOT NULL COMMENT '活动发起者类型:个人\\官方\\机构\\场地等',
  `imgs` varchar(370) DEFAULT NULL COMMENT '活动介绍图片,最多10个文件,采用逗号分割',
  `person` int(5) NOT NULL COMMENT '家长报名上限',
  `children` int(5) NOT NULL COMMENT '儿童报名上限',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='活动信息表';

-- ----------------------------
-- Records of object_activity
-- ----------------------------
INSERT INTO object_activity VALUES ('1', '长白山万达智选假日酒店入住1晚＋不限次滑雪（含雪具）和娱雪项目＋2人早餐＋水乐园＋1名12岁以下儿童以上项目＋机场接送', '长白山万达智选假日酒店由两座欧式建筑群组成，内设众多房型，客房舒适素雅，房内设备齐备，并让您拥有具有特色的淋浴体验。酒店设有迷你超市、雪具存放库、自助商务中心等；更有400平方米的多功能厅，可以满足中小型规模的会议需求。\n此外，度假区内还提供滑雪、温泉、高尔夫和登山等丰富的山地度假活动，为您开启舒适、便捷、精彩的假日之旅。', '2.00', 'A-5', '1480525555', '1480999267', 'wangxin', 'self', '9,10,11', '5', '5');

-- ----------------------------
-- Table structure for `object_organization`
-- ----------------------------
DROP TABLE IF EXISTS `object_organization`;
CREATE TABLE `object_organization` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '唯一标识',
  `name` varchar(50) NOT NULL COMMENT '机构名称',
  `type` varchar(50) NOT NULL COMMENT '机构类型:关联字典表:orgatype',
  `addr` varchar(200) DEFAULT NULL COMMENT '机构地址',
  `telphone` varchar(15) DEFAULT NULL COMMENT '机构联系电话',
  `describe` varchar(4000) DEFAULT NULL COMMENT '机构介绍,支持HTML,Markdown格式',
  `imgs` varchar(370) DEFAULT NULL COMMENT '机构介绍图片,最多10张,逗号分割',
  `jointime` int(17) DEFAULT NULL COMMENT '加入时间:utc格式,精确到秒',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='机构信息表';

-- ----------------------------
-- Records of object_organization
-- ----------------------------
INSERT INTO object_organization VALUES ('1', '【悦通慧享】幼儿早教中心', 'O-1', '沈阳市和平区民主路225号1303室', '13700043840', '此处为培训机构简介', '12', '1479225600');
INSERT INTO object_organization VALUES ('2', '【悦通慧享】幼儿早教中心(双语)', 'O-3', '上海市闵行区绿地科技岛广场A座2606室', '13700043840', '此处为培训机构简介', '13', '1451577600');
INSERT INTO object_organization VALUES ('3', '【悦通慧享】中学辅导中心', 'O-4,O-5,O-6', '上海市闵行区绿地科技岛广场A座2606室', '13700043840', '此处为培训机构简介', '14', '1482076800');

-- ----------------------------
-- Table structure for `orderinfo`
-- ----------------------------
DROP TABLE IF EXISTS `orderinfo`;
CREATE TABLE `orderinfo` (
  `OrderID` varchar(100) NOT NULL COMMENT '订单编号',
  `ID` varchar(100) DEFAULT NULL COMMENT '验证码ID',
  `IDcontent` varchar(100) DEFAULT NULL COMMENT '验证码内容',
  `ServiceItems` varchar(100) DEFAULT NULL COMMENT '服务项目',
  `SettlementAmount` decimal(20,0) DEFAULT NULL COMMENT '结算价格',
  `MerchanID` varchar(100) DEFAULT NULL COMMENT '商户编号',
  `OrdertTme` decimal(20,0) DEFAULT NULL COMMENT '订单时间',
  `OrderAmounts` decimal(20,0) DEFAULT NULL COMMENT '订单金额',
  `OrderType` varchar(100) DEFAULT NULL COMMENT '订单类型',
  `CustomerID` varchar(100) DEFAULT NULL COMMENT '客户编号',
  `CouponID` varchar(100) DEFAULT NULL COMMENT '优惠卷编号',
  `Remark` varchar(100) DEFAULT NULL COMMENT '备注说明',
  PRIMARY KEY (`OrderID`),
  KEY `FK_OrderMerchanDefine` (`MerchanID`),
  CONSTRAINT `FK_OrderMerchanDefine` FOREIGN KEY (`MerchanID`) REFERENCES `merchaninfo` (`MerchanID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of orderinfo
-- ----------------------------

-- ----------------------------
-- Table structure for `partnerinfo`
-- ----------------------------
DROP TABLE IF EXISTS `partnerinfo`;
CREATE TABLE `partnerinfo` (
  `PartnerID` varchar(100) NOT NULL COMMENT '合作方编号',
  `PartnerName` varchar(100) DEFAULT NULL COMMENT '合作方名称',
  `PartnerPhone` varchar(100) DEFAULT NULL COMMENT '合作方联系电话',
  `PartnerAddress` varchar(200) DEFAULT NULL COMMENT '合作方地址',
  `PartnerRange` varchar(500) DEFAULT NULL COMMENT '关联行政区划-省,多个内容,使用半角逗号分割',
  `CreateUser` varchar(100) NOT NULL COMMENT '创建者',
  `CreateTime` decimal(20,0) NOT NULL COMMENT '创建时间',
  `LastModifyUser` varchar(100) NOT NULL COMMENT '最后修改者',
  `LastModiftTime` decimal(20,0) NOT NULL COMMENT '最后修改时间',
  `state` varchar(3) NOT NULL COMMENT '状态',
  PRIMARY KEY (`PartnerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of partnerinfo
-- ----------------------------

-- ----------------------------
-- Table structure for `provincedefine`
-- ----------------------------
DROP TABLE IF EXISTS `provincedefine`;
CREATE TABLE `provincedefine` (
  `ProvinceID` varchar(9) NOT NULL COMMENT '省编号',
  `ProvinceName` varchar(100) NOT NULL COMMENT '省名称',
  `state` varchar(3) NOT NULL COMMENT '状态',
  PRIMARY KEY (`ProvinceID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of provincedefine
-- ----------------------------

-- ----------------------------
-- Table structure for `sys_logs`
-- ----------------------------
DROP TABLE IF EXISTS `sys_logs`;
CREATE TABLE `sys_logs` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '唯一标识',
  `date` int(11) NOT NULL COMMENT '日志记录时间,utc格式,精确到秒',
  `owner` varchar(32) NOT NULL DEFAULT '' COMMENT '操作用户',
  `ip` varchar(15) NOT NULL COMMENT '操作用户所属IP地址',
  `type` varchar(50) NOT NULL COMMENT '日志类型',
  `msg` varchar(500) NOT NULL COMMENT '日志内容',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_logs
-- ----------------------------

-- ----------------------------
-- Table structure for `sys_options`
-- ----------------------------
DROP TABLE IF EXISTS `sys_options`;
CREATE TABLE `sys_options` (
  `optionkey` varchar(20) NOT NULL COMMENT '设置项代码',
  `optionvalue` varchar(20) NOT NULL COMMENT '设置项对应的值',
  PRIMARY KEY (`optionkey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_options
-- ----------------------------
INSERT INTO sys_options VALUES ('pagesize', '10');
INSERT INTO sys_options VALUES ('password', '123456');

-- ----------------------------
-- Table structure for `sys_roles`
-- ----------------------------
DROP TABLE IF EXISTS `sys_roles`;
CREATE TABLE `sys_roles` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '唯一标识',
  `name` varchar(20) NOT NULL COMMENT '角色名称',
  `funcids` varchar(2000) DEFAULT NULL COMMENT '角色包含的权限,逗号分割',
  `state` int(1) NOT NULL DEFAULT '1' COMMENT '角色状态:0=禁用,1=可用',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COMMENT='系统角色表';

-- ----------------------------
-- Records of sys_roles
-- ----------------------------
INSERT INTO sys_roles VALUES ('1', '系统管理员', '101,102,103,104,105,301,302,0101,0103,0104,0201,0202,0203,0204,0205,0206,0301,0302,0401,0402,0403,0501,d01,d06', '1');
INSERT INTO sys_roles VALUES ('2', '数据管理员', '201,301,302,303,304,d02,d03', '1');
INSERT INTO sys_roles VALUES ('3', '一般用户', '101,102,103', '1');
INSERT INTO sys_roles VALUES ('4', '机构用户', '101,102,103', '1');
INSERT INTO sys_roles VALUES ('5', '平台用户', '101,102,103', '1');
INSERT INTO sys_roles VALUES ('6', '游客', '101,102,103', '1');

-- ----------------------------
-- Table structure for `sys_users`
-- ----------------------------
DROP TABLE IF EXISTS `sys_users`;
CREATE TABLE `sys_users` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '唯一标识',
  `account` varchar(36) NOT NULL COMMENT '用户账号:用于登录',
  `password` varchar(36) NOT NULL COMMENT '账号密码:base64+md5加密',
  `name` varchar(20) NOT NULL COMMENT '用户姓名',
  `email` varchar(100) NOT NULL COMMENT 'EMail地址,用于找回密码',
  `nickname` varchar(20) NOT NULL COMMENT '用户昵称',
  `roleid` varchar(36) NOT NULL COMMENT '所属角色编号,关联角色定义表',
  `header` int(20) DEFAULT NULL COMMENT '头像图片',
  `describe` varchar(300) DEFAULT NULL COMMENT '个人介绍',
  `addr` varchar(500) DEFAULT NULL COMMENT '详细地址',
  `state` int(1) NOT NULL DEFAULT '1' COMMENT '用户状态:0=禁用,1=可用',
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_uk_account` (`account`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COMMENT='系统用户表';

-- ----------------------------
-- Records of sys_users
-- ----------------------------
INSERT INTO sys_users VALUES ('1', 'admin', 'NFFyY09VbTZXYXUrVnVCWDhnK0lQZz09', '悦通慧享', 'admin@163.com', '悦通慧享', '1', '7', '会点前端技术，div+css啊，jQuery之类的，不是很精；热爱生活，热爱互联网，热爱新技术；有一个小的团队，在不断的寻求新的突破。', '上海市闵行区绿地科技岛广场A座2606室', '1');
INSERT INTO sys_users VALUES ('2', 'dataadmin', 'NFFyY09VbTZXYXUrVnVCWDhnK0lQZz09', '数据管理员', 'dataadmin@nvlbs.com', '数据管理员', '2', null, null, null, '1');
INSERT INTO sys_users VALUES ('3', 'wangxin', 'NFFyY09VbTZXYXUrVnVCWDhnK0lQZz09', '王鑫', 'admin_small@163.com', '小伍', '1', '6', '近日天天有人在朋友圈里放出“酒店 X 折”的广告，原来七夕到了。恰恰在这个中国人的传统节日里，美国也凑起了热闹，FDA 通过了 Addyi 的审批，这是第一种能解决女性性欲问题的药物。此前，Addyi 在 2010 年和2013 年曾两次报批被拒，理由是“药效的边际效应和副作用”。 ', '沈阳市和平区民主路225号1303室', '1');
INSERT INTO sys_users VALUES ('4', 'user1', 'NFFyY09VbTZXYXUrVnVCWDhnK0lQZz09', '普通用户', 'user1@nvlbs.com', '普通用户', '3', '1', null, null, '1');
INSERT INTO sys_users VALUES ('5', 'user2', 'NFFyY09VbTZXYXUrVnVCWDhnK0lQZz09', '普通用户', 'user2@nvlbs.com', '普通用户', '3', null, null, null, '1');
INSERT INTO sys_users VALUES ('6', 'user3', 'NFFyY09VbTZXYXUrVnVCWDhnK0lQZz09', '普通用户', 'user3@nvlbs.com', '普通用户', '3', null, null, null, '1');
INSERT INTO sys_users VALUES ('7', 'user4', 'NFFyY09VbTZXYXUrVnVCWDhnK0lQZz09', '普通用户', 'user4@nvlbs.com', '普通用户', '3', null, null, null, '1');
INSERT INTO sys_users VALUES ('8', 'user5', 'NFFyY09VbTZXYXUrVnVCWDhnK0lQZz09', '普通用户', 'user5@nvlbs.com', '普通用户', '3', null, null, null, '1');
