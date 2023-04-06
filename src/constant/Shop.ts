export const JJC_SHOP_TAB = [
    {
        name: '六星套装',
        id: 'sixSet'
    },
    {
        name: '五星套装',
        id: 'fiveSet'
    },
    {
        name: '专用色卡',
        id: 'colorCard'
    },
    {
        name: '时尚妆容',
        id: 'makeup'
    },
    {
        name: '聊天道具',
        id: 'chat'
    }
]

export const JJC_SHOP_TAB_LIST = JJC_SHOP_TAB.map(item => item.id);


export const JJC_SHOP_ITEM: { [key: string]: ShopItem[] } = {
    'sixSet': [{
        position: '连衣裙',
        name: '梦羽知花',
        count: 13500,
    },
    {
        position: '发饰',
        name: '撷花',
        count: 1500,
    },
    {
        position: '纹身',
        name: '缱绻花语',
        count: 1500,
    }, {
        position: '鞋',
        name: '梦春花藤',
        count: 3000,
    }, {
        position: '翅膀',
        name: '化蝶予梦',
        count: 3000,
    },
    {
        position: '头发',
        name: '流雪之诗',
        count: 4500,
    },
    {
        position: '手环',
        name: '沽梦晨花',
        count: 1500,
    },
    {
        position: '耳环',
        name: '晨雨花露',
        count: 1500,
    }],
    'fiveSet': [{
        position: '头发',
        name: '星钥乐章',
        count: 1800,
    },
    {
        position: '连衣裙',
        name: '月光奏鸣曲',
        count: 6000,
    },
    {
        position: '袜子',
        name: '月光风琴',
        count: 400,
    }, {
        position: '鞋',
        name: '夜下恋曲',
        count: 1200,
    }, {
        position: '帽子',
        name: '星月交响',
        count: 800,
    }, {
        position: '项链',
        name: '月予心锁',
        count: 600,
    },
    ],
    'colorCard': [
        {
            position: '-',
            name: '六星色卡',
            count: 14250,
        },
        {
            position: '-',
            name: '六星风向标',
            count: 13800,
        },
        {
            position: '-',
            name: '五星色卡',
            count: 10200,
        },
        {
            position: '-',
            name: '五星风向标',
            count: 10500,
        },
    ],
    'makeup': [
        {
            position: '美瞳',
            name: '蔚蓝天际',
            count: 2400,
        },
        {
            position: '美瞳',
            name: '斑斓星宇',
            count: 2400,
        },
        {
            position: '唇妆',
            name: '玫瑰星云',
            count: 2400,
        },
        {
            position: '唇妆',
            name: '星梦几何',
            count: 2400,
        }, {
            position: '纹面',
            name: '深白星屑',
            count: 2400,
        }, {
            position: '纹面',
            name: '银翼星辰',
            count: 2400,
        }, {
            position: '美瞳',
            name: '熠熠星光',
            count: 2400,
        }, {
            position: '唇妆',
            name: '绯色星芒',
            count: 2400,
        },
    ],
    'chat': [{
        position: '头像',
        name: '夜游都市',
        count: 2000,
    }, {
        position: '头像框',
        name: 'C位封面',
        count: 2000,
    }, {
        position: '聊天背景',
        name: '琉璃落雪',
        count: 2000,
    },]
}