import Mock from 'mockjs'

let home = {
    "errno": 0,
    "data": {
        "newGoodsList": [
            {
                "id": 1181000,
                "name": "母亲节礼物-舒适安睡组合",
                "brief": "安心舒适是最好的礼物",
                "picUrl": "http://yanxuan.nosdn.127.net/1f67b1970ee20fd572b7202da0ff705d.png",
                "isNew": true,
                "isHot": false,
                "counterPrice": 2618,
                "retailPrice": 2598
            },
            {
                "id": 1116011,
                "name": "蔓越莓曲奇 200克",
                "brief": "酥脆奶香，甜酸回味",
                "picUrl": "http://yanxuan.nosdn.127.net/767b370d07f3973500db54900bcbd2a7.png",
                "isNew": true,
                "isHot": true,
                "counterPrice": 56,
                "retailPrice": 36
            },
            {
                "id": 1127047,
                "name": "趣味粉彩系列笔记本",
                "brief": "粉彩色泽，记录生活",
                "picUrl": "http://yanxuan.nosdn.127.net/6c03ca93d8fe404faa266ea86f3f1e43.png",
                "isNew": true,
                "isHot": false,
                "counterPrice": 49,
                "retailPrice": 29
            },
            {
                "id": 1135002,
                "name": "宫廷奢华真丝四件套",
                "brief": "100%桑蚕丝，丝滑润肤",
                "picUrl": "http://yanxuan.nosdn.127.net/45548f26cfd0c7c41e0afc3709d48286.png",
                "isNew": true,
                "isHot": false,
                "counterPrice": 2619,
                "retailPrice": 2599
            },
            {
                "id": 1152161,
                "name": "竹语丝麻印花四件套",
                "brief": "3重透气，清爽柔滑",
                "picUrl": "http://yanxuan.nosdn.127.net/977401e75113f7c8334c4fb5b4bf6215.png",
                "isNew": true,
                "isHot": false,
                "counterPrice": 479,
                "retailPrice": 459
            },
            {
                "id": 1166008,
                "name": "Carat钻石 不粘厨具组合",
                "brief": "钻石涂层，不粘锅锅具组",
                "picUrl": "http://yanxuan.nosdn.127.net/615a16e899e01efb780c488df4233f48.png",
                "isNew": true,
                "isHot": false,
                "counterPrice": 479,
                "retailPrice": 459
            }
        ],
        "couponList": [
            {
                "id": 1,
                "name": "限时满减券",
                "desc": "全场通用",
                "tag": "无限制",
                "discount": 5,
                "min": 99,
                "days": 10
            },
            {
                "id": 2,
                "name": "限时满减券",
                "desc": "全场通用",
                "tag": "无限制",
                "discount": 10,
                "min": 99,
                "days": 10
            }
        ],
        "channel": [
            {
                "id": 1005000,
                "name": "居家",
                "iconUrl": "http://yanxuan.nosdn.127.net/a45c2c262a476fea0b9fc684fed91ef5.png"
            },
            {
                "id": 1005001,
                "name": "餐厨",
                "iconUrl": "http://yanxuan.nosdn.127.net/ad8b00d084cb7d0958998edb5fee9c0a.png"
            },
            {
                "id": 1005002,
                "name": "饮食",
                "iconUrl": "http://yanxuan.nosdn.127.net/c9280327a3fd2374c000f6bf52dff6eb.png"
            },
            {
                "id": 1008000,
                "name": "配件",
                "iconUrl": "http://yanxuan.nosdn.127.net/11abb11c4cfdee59abfb6d16caca4c6a.png"
            },
            {
                "id": 1010000,
                "name": "服装",
                "iconUrl": "http://yanxuan.nosdn.127.net/28a685c96f91584e7e4876f1397767db.png"
            },
            {
                "id": 1011000,
                "name": "婴童",
                "iconUrl": "http://yanxuan.nosdn.127.net/1ba9967b8de1ac50fad21774a4494f5d.png"
            },
            {
                "id": 1012000,
                "name": "杂货",
                "iconUrl": "http://yanxuan.nosdn.127.net/c2a3d6349e72c35931fe3b5bcd0966be.png"
            },
            {
                "id": 1013001,
                "name": "洗护",
                "iconUrl": "http://yanxuan.nosdn.127.net/9fe068776b6b1fca13053d68e9c0a83f.png"
            },
            {
                "id": 1019000,
                "name": "志趣",
                "iconUrl": "http://yanxuan.nosdn.127.net/7093cfecb9dde1dd3eaf459623df4071.png"
            }
        ],
        "grouponList": [
            {
                "id": 1109008,
                "name": "云端沙发组合",
                "brief": "MUJI供应商携手打造",
                "picUrl": "http://yanxuan.nosdn.127.net/c5be2604c0e4186a4e7079feeb742cee.png",
                "counterPrice": 4019,
                "retailPrice": 3999,
                "grouponPrice": 3199,
                "grouponDiscount": 800,
                "grouponMember": 15,
                "expireTime": "2022-01-31 00:00:00"
            },
            {
                "id": 1110016,
                "name": "天然硅胶宠物除毛按摩刷",
                "brief": "顺滑平面，猫狗通用，去除死毛",
                "picUrl": "http://yanxuan.nosdn.127.net/3bd73b7279a83d1cbb50c0e45778e6d6.png",
                "counterPrice": 59,
                "retailPrice": 39,
                "grouponPrice": 29,
                "grouponDiscount": 10,
                "grouponMember": 12,
                "expireTime": "2022-01-31 00:00:00"
            }
        ],
        "banner": [
            {
                "id": 1,
                "name": "合作 谁是你的菜",
                "link": "",
                "url": "http://yanxuan.nosdn.127.net/65091eebc48899298171c2eb6696fe27.jpg",
                "position": 1,
                "content": "合作 谁是你的菜",
                "enabled": true,
                "addTime": "2018-02-01 00:00:00",
                "updateTime": "2018-02-01 00:00:00",
                "deleted": false
            },
            {
                "id": 2,
                "name": "活动 美食节",
                "link": "",
                "url": "http://yanxuan.nosdn.127.net/bff2e49136fcef1fd829f5036e07f116.jpg",
                "position": 1,
                "content": "活动 美食节",
                "enabled": true,
                "addTime": "2018-02-01 00:00:00",
                "updateTime": "2018-02-01 00:00:00",
                "deleted": false
            },
            {
                "id": 3,
                "name": "活动 母亲节",
                "link": "",
                "url": "http://yanxuan.nosdn.127.net/8e50c65fda145e6dd1bf4fb7ee0fcecc.jpg",
                "position": 1,
                "content": "活动 母亲节5",
                "enabled": true,
                "addTime": "2018-02-01 00:00:00",
                "updateTime": "2018-02-01 00:00:00",
                "deleted": false
            }
        ],
        "brandList": [
            {
                "id": 1001000,
                "name": "MUJI制造商",
                "desc": "严选精选了MUJI制造商和生产原料，\n用几乎零利润的价格，剔除品牌溢价，\n让用户享受原品牌的品质生活。",
                "picUrl": "http://yanxuan.nosdn.127.net/1541445967645114dd75f6b0edc4762d.png",
                "floorPrice": 12.9
            },
            {
                "id": 1001002,
                "name": "内野制造商",
                "desc": "严选从世界各地挑选毛巾，最终选择了为日本内野代工的工厂，追求毛巾的柔软度与功能性。品质比肩商场几百元的毛巾。",
                "picUrl": "http://yanxuan.nosdn.127.net/8ca3ce091504f8aa1fba3fdbb7a6e351.png",
                "floorPrice": 29
            },
            {
                "id": 1001003,
                "name": "Adidas制造商",
                "desc": "严选找到为Adidas等品牌制造商，\n选取优质原材料，与厂方一起设计，\n为你提供好的理想的运动装备。",
                "picUrl": "http://yanxuan.nosdn.127.net/335334d0deaff6dc3376334822ab3a2f.png",
                "floorPrice": 49
            },
            {
                "id": 1001007,
                "name": "优衣库制造商",
                "desc": "严选找到日本知名服装UNIQLO的制造商，\n选取优质长绒棉和精梳工艺，\n与厂方一起设计，为你提供理想的棉袜。",
                "picUrl": "http://yanxuan.nosdn.127.net/0d72832e37e7e3ea391b519abbbc95a3.png",
                "floorPrice": 29
            }
        ],
        "hotGoodsList": [
            {
                "id": 1152008,
                "name": "魔兽世界 部落 护腕 一只",
                "brief": "吸汗、舒适、弹性、防护、耐用",
                "picUrl": "http://yanxuan.nosdn.127.net/203cb83d93606865e3ddde57b69b9e9a.png",
                "isNew": false,
                "isHot": true,
                "counterPrice": 49,
                "retailPrice": 29
            },
            {
                "id": 1152009,
                "name": "魔兽世界 联盟 护腕 一只",
                "brief": "吸汗、舒适、弹性、防护、耐用",
                "picUrl": "http://yanxuan.nosdn.127.net/ae6d41117717387b82dcaf1dfce0cd97.png",
                "isNew": false,
                "isHot": true,
                "counterPrice": 49,
                "retailPrice": 29
            },
            {
                "id": 1152031,
                "name": "魔兽世界-伊利丹颈枕眼罩套装",
                "brief": "差旅好伴侣",
                "picUrl": "http://yanxuan.nosdn.127.net/fd6e78a397bd9e9804116a36f0270b0a.png",
                "isNew": false,
                "isHot": true,
                "counterPrice": 119,
                "retailPrice": 99
            },
            {
                "id": 1022000,
                "name": "意式毛线绣球四件套",
                "brief": "浪漫毛线绣球，简约而不简单",
                "picUrl": "http://yanxuan.nosdn.127.net/5350e35e6f22165f38928f3c2c52ac57.png",
                "isNew": false,
                "isHot": true,
                "counterPrice": 319,
                "retailPrice": 299
            },
            {
                "id": 1011004,
                "name": "色织精梳AB纱格纹空调被",
                "brief": "加大加厚，双色精彩",
                "picUrl": "http://yanxuan.nosdn.127.net/0984c9388a2c3fd2335779da904be393.png",
                "isNew": false,
                "isHot": true,
                "counterPrice": 219,
                "retailPrice": 199
            },
            {
                "id": 1084003,
                "name": "纯棉美式绞花针织盖毯",
                "brief": "美式提花，温暖舒适",
                "picUrl": "http://yanxuan.nosdn.127.net/cf40c167e7054fe184d49f19121f63c7.png",
                "isNew": false,
                "isHot": true,
                "counterPrice": 219,
                "retailPrice": 199
            }
        ],
        "topicList": [
            {
                "id": 264,
                "title": "设计师们推荐的应季好物",
                "subtitle": "原创设计春款系列上新",
                "price": 29.9,
                "readCount": "77.7k",
                "picUrl": "https://yanxuan.nosdn.127.net/14918201901050274.jpg"
            },
            {
                "id": 266,
                "title": "一条丝巾就能提升时髦度",
                "subtitle": "不知道大家对去年G20时，严选与国礼制造商一起推出的《凤凰于飞》等几款丝巾是否还...",
                "price": 0,
                "readCount": "35.0k",
                "picUrl": "https://yanxuan.nosdn.127.net/14919007135160213.jpg"
            },
            {
                "id": 268,
                "title": "米饭好吃的秘诀：会呼吸的锅",
                "subtitle": "今年1月份，我们联系到了日本伊贺地区的长谷园，那里有着180年伊贺烧历史的窑厂。...",
                "price": 0,
                "readCount": "33.3k",
                "picUrl": "https://yanxuan.nosdn.127.net/14920623353130483.jpg"
            },
            {
                "id": 271,
                "title": "选式新懒人",
                "subtitle": "懒出格调，懒出好生活。",
                "price": 15,
                "readCount": "57.7k",
                "picUrl": "https://yanxuan.nosdn.127.net/14924199099661697.jpg"
            }
        ],
        "floorGoodsList": [
            {
                "name": "居家",
                "goodsList": [
                    {
                        "id": 1110018,
                        "name": "耐用狗狗清洁美容护理套装",
                        "brief": "精致钢材，耐咬美容",
                        "picUrl": "http://yanxuan.nosdn.127.net/d93aa5d6e7a296101cf4cb72613aeda6.png",
                        "isNew": false,
                        "isHot": false,
                        "counterPrice": 99,
                        "retailPrice": 79
                    },
                    {
                        "id": 1110019,
                        "name": "宠物合金钢安全除菌指甲护理组合",
                        "brief": "猫狗皆可用，保护家具",
                        "picUrl": "http://yanxuan.nosdn.127.net/1e7e392b6fc9da99dc112197b7444eec.png",
                        "isNew": false,
                        "isHot": false,
                        "counterPrice": 89,
                        "retailPrice": 69
                    },
                    {
                        "id": 1131017,
                        "name": "平滑细篾头层青碳化竹凉席",
                        "brief": "细篾整密，凉滑不夹肉",
                        "picUrl": "http://yanxuan.nosdn.127.net/2b6e2268ed712f1a336283f013abb7a1.png",
                        "isNew": false,
                        "isHot": false,
                        "counterPrice": 279,
                        "retailPrice": 259
                    },
                    {
                        "id": 1057036,
                        "name": "日式纯色水洗亚麻抱枕",
                        "brief": "水洗亚麻，透气亲肤",
                        "picUrl": "http://yanxuan.nosdn.127.net/8a9ee5ba08929cc9e40b973607d2f633.png",
                        "isNew": false,
                        "isHot": false,
                        "counterPrice": 99,
                        "retailPrice": 79
                    }
                ],
                "id": 1005000
            },
            {
                "name": "餐厨",
                "goodsList": [
                    {
                        "id": 1023003,
                        "name": "100年传世珐琅锅 全家系列",
                        "brief": "特质铸铁，大容量全家共享",
                        "picUrl": "http://yanxuan.nosdn.127.net/c39d54c06a71b4b61b6092a0d31f2335.png",
                        "isNew": false,
                        "isHot": false,
                        "counterPrice": 418,
                        "retailPrice": 398
                    },
                    {
                        "id": 1073008,
                        "name": "铸铁珐琅牛排煎锅",
                        "brief": "沥油隔水，煎出外焦里嫩",
                        "picUrl": "http://yanxuan.nosdn.127.net/619e46411ccd62e5c0f16692ee1a85a0.png",
                        "isNew": false,
                        "isHot": false,
                        "counterPrice": 169,
                        "retailPrice": 149
                    },
                    {
                        "id": 1051000,
                        "name": "Carat钻石炒锅30cm",
                        "brief": "安全涂层，轻便无烟",
                        "picUrl": "http://yanxuan.nosdn.127.net/e564410546a11ddceb5a82bfce8da43d.png",
                        "isNew": false,
                        "isHot": false,
                        "counterPrice": 200,
                        "retailPrice": 180
                    },
                    {
                        "id": 1051001,
                        "name": "Carat钻石煎锅28cm",
                        "brief": "耐磨涂层，导热迅速",
                        "picUrl": "http://yanxuan.nosdn.127.net/f53ed57d9e23fda7e24dfd0e0a50c5d1.png",
                        "isNew": false,
                        "isHot": false,
                        "counterPrice": 179,
                        "retailPrice": 159
                    }
                ],
                "id": 1005001
            },
            {
                "name": "饮食",
                "goodsList": [
                    {
                        "id": 1045000,
                        "name": "绿茶蛋黄酥 200克/4枚入",
                        "brief": "香甜茶食，果腹优选",
                        "picUrl": "http://yanxuan.nosdn.127.net/b2adc3fd9b84a289a1be03e8ee400e61.png",
                        "isNew": false,
                        "isHot": false,
                        "counterPrice": 48,
                        "retailPrice": 28
                    },
                    {
                        "id": 1116011,
                        "name": "蔓越莓曲奇 200克",
                        "brief": "酥脆奶香，甜酸回味",
                        "picUrl": "http://yanxuan.nosdn.127.net/767b370d07f3973500db54900bcbd2a7.png",
                        "isNew": true,
                        "isHot": true,
                        "counterPrice": 56,
                        "retailPrice": 36
                    },
                    {
                        "id": 1070000,
                        "name": "星云酥 180克/3颗",
                        "brief": "酥饼界的小仙女",
                        "picUrl": "http://yanxuan.nosdn.127.net/8392725765cdd57fdae3f173877f4bda.png",
                        "isNew": false,
                        "isHot": false,
                        "counterPrice": 46,
                        "retailPrice": 26
                    },
                    {
                        "id": 1155015,
                        "name": "绿豆糕 80克（4枚入）",
                        "brief": "细腻松软，入口绵柔",
                        "picUrl": "http://yanxuan.nosdn.127.net/66b9f1638c0517d179262f14ed1345f9.png",
                        "isNew": true,
                        "isHot": false,
                        "counterPrice": 32.9,
                        "retailPrice": 12.9
                    }
                ],
                "id": 1005002
            },
            {
                "name": "配件",
                "goodsList": [
                    {
                        "id": 1085019,
                        "name": "20寸 纯PC“铝框”（非全铝）登机箱",
                        "brief": "铝质包角，牢固抗摔",
                        "picUrl": "http://yanxuan.nosdn.127.net/65c955a7a98e84d44ca30bb88a591eac.png",
                        "isNew": false,
                        "isHot": false,
                        "counterPrice": 369,
                        "retailPrice": 349
                    },
                    {
                        "id": 1086052,
                        "name": "20寸 铝镁合金登机箱",
                        "brief": "时尚金属箱，奢品质感",
                        "picUrl": "http://yanxuan.nosdn.127.net/93171a281c4ed272c007a050816e6f6c.png",
                        "isNew": false,
                        "isHot": false,
                        "counterPrice": 879,
                        "retailPrice": 859
                    },
                    {
                        "id": 1152101,
                        "name": "魔兽世界 部落 奥格瑞玛 拉杆箱 可登机",
                        "brief": "18寸，可携带登机",
                        "picUrl": "http://yanxuan.nosdn.127.net/c1c62211a17b71a634fa0c705d11fb42.png",
                        "isNew": false,
                        "isHot": true,
                        "counterPrice": 908,
                        "retailPrice": 888
                    },
                    {
                        "id": 1114011,
                        "name": "104升 纯PC拉链斜纹拉杆箱",
                        "brief": "104升的体积，90升的价格",
                        "picUrl": "http://yanxuan.nosdn.127.net/196b5ce11930b4eadaec563cb0406634.png",
                        "isNew": false,
                        "isHot": false,
                        "counterPrice": 319,
                        "retailPrice": 299
                    }
                ],
                "id": 1008000
            }
        ]
    },
    "errmsg": "成功"
};
// 模拟home/index请求数据
Mock.mock("https://api.boychai.xyz/v1/home/index",home)