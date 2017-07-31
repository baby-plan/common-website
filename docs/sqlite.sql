
DROP TABLE IF EXISTS `action_article`;
CREATE TABLE `action_article` (
  `id` int(20) NOT NULL,
  `text` varchar(800) NOT NULL,
  `owner` varchar(32) NOT NULL,
  `ownertype` varchar(10) NOT NULL,
  `client` varchar(50) NOT NULL,
  `imgs` varchar(300) DEFAULT NULL,
  `date` int(11) NOT NULL,
  PRIMARY KEY (`id`)
  );

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
  `id` int(11) NOT NULL,
  `owner` varchar(32) NOT NULL,
  `target` int(30) NOT NULL,
  `targettype` varchar(10) NOT NULL,
  `client` varchar(50) NOT NULL,
  `text` varchar(400) NOT NULL,
  `date` int(11) NOT NULL,
  PRIMARY KEY (`id`)
);

-- ----------------------------
-- Records of action_comment
-- ----------------------------

-- ----------------------------
-- Table structure for `action_evaluate`
-- ----------------------------
DROP TABLE IF EXISTS `action_evaluate`;
CREATE TABLE `action_evaluate` (
  `id` int(11) NOT NULL,
  `owner` varchar(36) NOT NULL,
  `userid` varchar(36) NOT NULL,
  `point` int(2) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
);

-- ----------------------------
-- Records of action_evaluate
-- ----------------------------

-- ----------------------------
-- Table structure for `action_recommend`
-- ----------------------------
DROP TABLE IF EXISTS `action_recommend`;
CREATE TABLE `action_recommend` (
  `id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
);

-- ----------------------------
-- Records of action_recommend
-- ----------------------------

-- ----------------------------
-- Table structure for `common_dicts`
-- ----------------------------
DROP TABLE IF EXISTS `common_dicts`;
CREATE TABLE `common_dicts` (
  `dictkey` varchar(20) NOT NULL,
  `itemkey` varchar(50) NOT NULL,
  `itemvalue` varchar(50) NOT NULL,
  PRIMARY KEY (`dictkey`,`itemkey`)
);

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
INSERT INTO common_dicts VALUES ('orgatype', 'O-1', '艺术类');
INSERT INTO common_dicts VALUES ('orgatype', 'O-2', '体育类');
INSERT INTO common_dicts VALUES ('orgatype', 'O-3', '口才训练');
INSERT INTO common_dicts VALUES ('orgatype', 'O-4', '乐器培训');
INSERT INTO common_dicts VALUES ('orgatype', 'O-5', '少儿舞蹈');
INSERT INTO common_dicts VALUES ('orgatype', 'O-6', '跆拳道培训');
INSERT INTO common_dicts VALUES ('sex', '1', '男');
INSERT INTO common_dicts VALUES ('sex', '2', '女');
INSERT INTO common_dicts VALUES ('schooltype', 'S-1', '幼教');
INSERT INTO common_dicts VALUES ('schooltype', 'S-2', '幼儿园');
INSERT INTO common_dicts VALUES ('schooltype', 'S-3', '小学');
INSERT INTO common_dicts VALUES ('schooltype', 'S-4', '初中');

-- ----------------------------
-- Table structure for `common_files`
-- ----------------------------
DROP TABLE IF EXISTS `common_files`;
CREATE TABLE `common_files` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `dir` varchar(100) DEFAULT NULL,
  `path` varchar(1000) NOT NULL,
  `size` int(11) NOT NULL DEFAULT '0',
  `extname` varchar(20) NOT NULL DEFAULT '',
  `owner` varchar(32) NOT NULL,
  `date` int(11) NOT NULL,
  PRIMARY KEY (`id`)
);

-- ----------------------------
-- Records of common_files
-- ----------------------------
INSERT INTO common_files VALUES ('1', 'a1.jpg', null, 'public/avatar/user1/a1.jpg', '170823', '.jpg', 'user1', '1481354145');
INSERT INTO common_files VALUES ('2', 'a2.jpg', null, 'public/avatar/user2/a2.jpg', '307599', '.jpg', 'user2', '1481514983');
INSERT INTO common_files VALUES ('3', 'a3.jpg', null, 'public/avatar/user3/a3.jpg', '267731', '.jpg', 'user3', '1481514985');
INSERT INTO common_files VALUES ('4', 'a4.jpg', null, 'public/avatar/user4/a4.jpg', '322156', '.jpg', 'user4', '1481514989');
INSERT INTO common_files VALUES ('5', 'a5.jpg', null, 'public/avatar/user5/a5.jpg', '170823', '.jpg', 'user5', '1481514992');
INSERT INTO common_files VALUES ('6', 'a6.jpg', null, 'public/avatar/wangxin/a6.jpg', '151766', '.jpg', 'wangxin', '1481524930');
INSERT INTO common_files VALUES ('7', 'a7.jpg', null, 'public/avatar/admin/a7.jpg', '170823', '.jpg', 'admin', '1481527401');
INSERT INTO common_files VALUES ('9', 'p_big1.jpg', null, 'public/avatar/wangxin/p_big1.jpg', '322156', '.jpg', 'wangxin', '1481527432');
INSERT INTO common_files VALUES ('10', 'p_big2.jpg', null, 'public/avatar/wangxin/p_big2.jpg', '170823', '.jpg', 'wangxin', '1481528708');
INSERT INTO common_files VALUES ('11', 'p_big3.jpg', null, 'public/avatar/wangxin/p_big3.jpg', '170823', '.jpg', 'wangxin', '1481528723');
INSERT INTO common_files VALUES ('12', 'p1.jpg', null, 'public/avatar/admin/p1.jpg', '170823', '.jpg', 'admin', '1481528723');
INSERT INTO common_files VALUES ('13', 'p2.jpg', null, 'public/avatar/admin/p2.jpg', '170823', '.jpg', 'admin', '1481528723');
INSERT INTO common_files VALUES ('14', 'p3.jpg', null, 'public/avatar/admin/p3.jpg', '170823', '.jpg', 'admin', '1481528723');

-- ----------------------------
-- Table structure for `interest_activity`
-- ----------------------------
DROP TABLE IF EXISTS `interest_activity`;
CREATE TABLE `interest_activity` (
  `owner` varchar(32) NOT NULL,
  `target` varchar(32) NOT NULL,
  PRIMARY KEY (`owner`,`target`)
);

-- ----------------------------
-- Records of interest_activity
-- ----------------------------

-- ----------------------------
-- Table structure for `interest_orga`
-- ----------------------------
DROP TABLE IF EXISTS `interest_orga`;
CREATE TABLE `interest_orga` (
  `owner` varchar(32) NOT NULL,
  `target` varchar(32) NOT NULL,
  PRIMARY KEY (`owner`,`target`)
);

-- ----------------------------
-- Records of interest_orga
-- ----------------------------

-- ----------------------------
-- Table structure for `interest_user`
-- ----------------------------
DROP TABLE IF EXISTS `interest_user`;
CREATE TABLE `interest_user` (
  `owner` varchar(32) NOT NULL,
  `target` varchar(32) NOT NULL,
  PRIMARY KEY (`owner`,`target`)
);

-- ----------------------------
-- Records of interest_user
-- ----------------------------
INSERT INTO interest_user VALUES ('wangxin', 'admin');
INSERT INTO interest_user VALUES ('wangxin', 'user1');

-- ----------------------------
-- Table structure for `object_activity`
-- ----------------------------
DROP TABLE IF EXISTS `object_activity`;
CREATE TABLE `object_activity` (
  `id` int(20) NOT NULL,
  `name` varchar(500) NOT NULL,
  `describe` varchar(4000) DEFAULT NULL,
  `price` float(8,2) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `begintime` int(17) NOT NULL,
  `endtime` int(17) NOT NULL,
  `sender` varchar(36) NOT NULL,
  `sendertype` varchar(36) NOT NULL,
  `imgs` varchar(370) DEFAULT NULL,
  `person` int(11) NOT NULL,
  `children` int(11) NOT NULL,
  PRIMARY KEY (`id`)
);

-- ----------------------------
-- Records of object_activity
-- ----------------------------
INSERT INTO object_activity VALUES ('1', '长白山万达智选假日酒店入住1晚＋不限次滑雪（含雪具）和娱雪项目＋2人早餐＋水乐园＋1名12岁以下儿童以上项目＋机场接送', '长白山万达智选假日酒店由两座欧式建筑群组成，内设众多房型，客房舒适素雅，房内设备齐备，并让您拥有具有特色的淋浴体验。酒店设有迷你超市、雪具存放库、自助商务中心等；更有400平方米的多功能厅，可以满足中小型规模的会议需求。\n此外，度假区内还提供滑雪、温泉、高尔夫和登山等丰富的山地度假活动，为您开启舒适、便捷、精彩的假日之旅。', '2.00', 'A-5', '1480525555', '1480999267', 'wangxin', 'self', '9,10,11', '5', '5');

-- ----------------------------
-- Table structure for `object_organization`
-- ----------------------------
DROP TABLE IF EXISTS `object_organization`;
CREATE TABLE `object_organization` (
  `id` int(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `addr` varchar(200) DEFAULT NULL,
  `telphone` varchar(15) DEFAULT NULL ,
  `describe` varchar(4000) DEFAULT NULL,
  `imgs` varchar(370) DEFAULT NULL,
  `jointime` int(17) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;

-- ----------------------------
-- Records of object_organization
-- ----------------------------
INSERT INTO object_organization VALUES ('1', '【悦通慧享】幼儿早教中心', 'O-1', '沈阳市和平区民主路225号1303室', '13700043840', '此处为培训机构简介', '12', '1479225600');
INSERT INTO object_organization VALUES ('2', '【悦通慧享】幼儿早教中心(双语)', 'O-3', '上海市闵行区绿地科技岛广场A座2606室', '13700043840', '此处为培训机构简介', '13', '1451577600');
INSERT INTO object_organization VALUES ('3', '【悦通慧享】中学辅导中心', 'O-4,O-5,O-6', '上海市闵行区绿地科技岛广场A座2606室', '13700043840', '此处为培训机构简介', '14', '1482076800');

-- ----------------------------
-- Table structure for `object_school`
-- ----------------------------
DROP TABLE IF EXISTS `object_school`;
CREATE TABLE `object_school` (
  `id` int(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `addr` varchar(200) DEFAULT NULL,
  `telphone` varchar(15) DEFAULT NULL,
  `describe` varchar(4000) DEFAULT NULL,
  `imgs` varchar(370) DEFAULT NULL,
  `jointime` int(17) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ----------------------------
-- Table structure for `sys_logs`
-- ----------------------------
DROP TABLE IF EXISTS `sys_logs`;
CREATE TABLE `sys_logs` (
  `id` int(20) NOT NULL,
  `date` int(11) NOT NULL,
  `owner` varchar(32) NOT NULL DEFAULT '',
  `ip` varchar(15) NOT NULL,
  `type` varchar(50) NOT NULL,
  `msg` varchar(500) NOT NULL ,
  PRIMARY KEY (`id`)
);


-- ----------------------------
-- Table structure for `sys_options`
-- ----------------------------
DROP TABLE IF EXISTS `sys_options`;
CREATE TABLE `sys_options` (
  `optionkey` varchar(20) NOT NULL,
  `optionvalue` varchar(20) NOT NULL,
  PRIMARY KEY (`optionkey`)
);

-- ----------------------------
-- Records of sys_options
-- ----------------------------
INSERT INTO sys_options VALUES ('pagesize', '6');
INSERT INTO sys_options VALUES ('password', '123456');

-- ----------------------------
-- Table structure for `sys_roles`
-- ----------------------------
DROP TABLE IF EXISTS `sys_roles`;
CREATE TABLE `sys_roles` (
  `id` int(20) NOT NULL,
  `name` varchar(20) NOT NULL,
  `funcids` varchar(2000) DEFAULT NULL,
  `state` int(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
);

-- ----------------------------
-- Records of sys_roles
-- ----------------------------
INSERT INTO sys_roles VALUES ('1', '系统管理员', '101,102,103,201,301,302,303,304,305,401,402,601,901,902,903,904,0101,0102,0103,0201,0202,0203,0204,0205,0206,0207,d01,d02,d03,d04,d05,d06,d07', '1');
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
  `id` int(20) NOT NULL,
  `account` varchar(36) NOT NULL,
  `password` varchar(36) NOT NULL,
  `name` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL ,
  `nickname` varchar(20) NOT NULL,
  `roleid` varchar(36) NOT NULL,
  `header` int(20) DEFAULT NULL,
  `describe` varchar(2000) DEFAULT NULL,
  `addr` varchar(500) DEFAULT NULL,
  `state` int(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
);

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
