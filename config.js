// ==================== 地块类型定义 ====================
// ==================== 1 普通地块 2 空地块 3 可炸开地块 4 5 固定地块 ====================
// ==================== STONE 常规图片 过程 销毁图片 ====================
const BLOCK_TYPES = {
    NORMAL: { id: 1, types: 1, images: ['dikuai1', 'dikuai2', 'dikuai3'] },
    EMPTY: { id: 3, types: 2,  images: ['dikuai3'] },
    STONE: { id: 4, types: 3,  images: ['dikuai4' , 'dikuai3'] },
    END: { id: 5, types: 4,  images: ['dikuaiEnd'] },
    START: { id: 6, types: 5,  images: ['dikuaiStart1', 'dikuaiStart2', 'dikuaiStart3'] }
};

const BLOCK_TYPE_MAP = {};
for (let key in BLOCK_TYPES) {
    const type = BLOCK_TYPES[key];
    BLOCK_TYPE_MAP[type.id] = type;
}

// ==================== 矿石类型定义 ====================
// ==================== 下方配置图片 ====================
const ORES = {
    1: { name: '蓝色徽章', image: 'k001', price: 20, count: 0, key: 'k001' },
    2: { name: '星星贴纸', image: 'k002', price: 100, count: 0, key: 'k002' },
    3: { name: '宝箱', image: 'k003', price: 200, count: 0, key: 'k003' },
    4: { name: '煤炭', image: 'k004', price: 10, count: 0, key: 'k004' },
};

// ==================== 道具类型定义 ====================
// ==== 下方配置图片 OXYGEN_CONFIG恢复值 主程序添加方法映射 ====
const ITEMS = {
    bomb: { name: '星星冲击', price: 50, icon: 'item001', count: 0 },
    h_coffee: { name: '咖啡', price: 300, icon: 'item002', count: 0 },
    e_cdb: { name: '充电宝', price: 100, icon: 'item004', count: 0 },
	e_nlp: { name: '能量枪', price: 200, icon: 'item003', count: 0 } 
};

// ==================== 能量和生命值配置 ====================
const OXYGEN_CONFIG = {
    surfaceValue: 100,
    consumeRates: [
        [0, 0.01],
        [100, 0.02],
        [200, 0.05],
        [500, 0.08],
        [1000, 0.15]
    ],
    iteminti: {
        max: 100,
        consumeWhenOxygenZero: 5,
        h_coffee_recover: 10,
        e_nlp_recover: 20,
        e_cdb_recover: 10
    }
};

// ==================== 地块分布配置 ====================
const MAP_LAYOUT = [
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1],
    [1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 4, 1, 1, 1],
    [1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 4, 1, 1, 1],
    [1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1],
    [1, 3, 1, 1, 1, 1, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 4, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
];

// ==================== 矿石分布配置 ====================
const ORE_LAYOUT = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0],
    [0, 0, 0, 4, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 4, 0],
    [0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 4, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0],
    [4, 0, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0],
    [0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 4],
	[0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 4, 0, 0, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 4, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0],
	[0, 4, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 1, 0],
	[0, 4, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0],
	[0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 4, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0],
	[1, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 4, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 4, 4, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0],
	[0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

// ==================== 游戏配置 ====================
const CONFIG = {
    gravity: 0.5,
    flyForce: -1,
    moveSpeed: 3,
    airResistance: 0.05,
    maxUpSpeed: -8,
    maxDownSpeed: 12,
    horizonOffset: 110,
    blockSize: 76,
    blockCols: 16,
    totalRows: MAP_LAYOUT.length,
    initialVisibleRows: 5,
    animationSpeed: 8,
    drillShakeAmount: 3,
    drillShakeSpeed: 1.2,
    playerShakeSpeed: 1.4,
    screenShakeSpeed: 1.5,
    miningSpeed: 5,//挖掘速度
    maxProgress: 100,
    progressThreshold: 0.3,
    downDrillOffset: 14,
    sideDrillOffset: 8,
    screenShakeAmount: 2,
    cameraSpeed: 6
};

// ==================== 图片加载 ====================
const images = {
    bg: new Image(),
    gamestart: new Image(),
    head1: new Image(),
    head2: new Image(),
    head3: new Image(),
    headLeft: new Image(),
    headRight: new Image(),
    body: new Image(),
    bodyLeftZ: new Image(),
    bodyLeft1: new Image(),
    bodyLeft2: new Image(),
    bodyLeft3: new Image(),
    bodyRightZ: new Image(),
    bodyRight1: new Image(),
    bodyRight2: new Image(),
    bodyRight3: new Image(),
    fire: new Image(),
    zuantou: new Image(),
    zuantouLeft: new Image(),
    zuantouRight: new Image(),
    dikuai1: new Image(),
    dikuai2: new Image(),
    dikuai3: new Image(),
    dikuai4: new Image(),
    dikuaiEnd: new Image(),
    dikuaiStart1: new Image(),
    dikuaiStart2: new Image(),
    dikuaiStart3: new Image(),
    k001: new Image(),
    k002: new Image(),
    k003: new Image(),
    k004: new Image(),
    item001: new Image(),      // 炸弹道具
    item002: new Image(),
    item003: new Image(),
    item004: new Image(),
    gameitem01: new Image(),
    gameitem02: new Image(),
    boom1: new Image(),        // 爆炸动画1
    boom2: new Image(),        // 爆炸动画2
    boom3: new Image(),         // 爆炸动画3
    shop: new Image(),
    decor01: new Image(),
	ano_head_01: new Image(),
	ano_body_01: new Image(),
	ano_head_left: new Image(),
	ano_head_right: new Image(),
	ano_body_left_01: new Image(),
	ano_body_left_02: new Image(),
	ano_body_right_01: new Image(),
	ano_body_right_02: new Image()
};

// 设置图片路径
images.bg.src = 'images/bg.png';
images.gamestart.src = 'images/gamestart.png';
images.head1.src = 'images/player_head_01.png';
images.head2.src = 'images/player_head_02.png';
images.head3.src = 'images/player_head_03.png';
images.headLeft.src = 'images/player_head_left.png';
images.headRight.src = 'images/player_head_right.png';
images.body.src = 'images/player_body_01.png';
images.bodyLeftZ.src = 'images/player_body_left_z.png';
images.bodyLeft1.src = 'images/player_body_left_01.png';
images.bodyLeft2.src = 'images/player_body_left_02.png';
images.bodyLeft3.src = 'images/player_body_left_01.png';
images.bodyRightZ.src = 'images/player_body_right_z.png';
images.bodyRight1.src = 'images/player_body_right_01.png';
images.bodyRight2.src = 'images/player_body_right_02.png';
images.bodyRight3.src = 'images/player_body_right_01.png';
images.fire.src = 'images/fire.png';
images.zuantou.src = 'images/zuantou.png';
images.zuantouLeft.src = 'images/zuantou_left.png';
images.zuantouRight.src = 'images/zuantou_right.png';
images.dikuai1.src = 'images/dikuai_01.png';
images.dikuai2.src = 'images/dikuai_02.png';
images.dikuai3.src = 'images/dikuai_03.png';
images.dikuai4.src = 'images/dikuai_04.png';
images.dikuaiEnd.src = 'images/dikuai_end.png';
images.dikuaiStart1.src = 'images/dikuai_start_01.png';
images.dikuaiStart2.src = 'images/dikuai_start_02.png';
images.dikuaiStart3.src = 'images/dikuai_start_03.png';
images.k001.src = 'images/k_001.png';
images.k002.src = 'images/k_002.png';
images.k003.src = 'images/k_003.png';
images.k004.src = 'images/k_004.png';
images.item001.src = 'images/item_001.png';
images.item002.src = 'images/item_002.png';
images.item003.src = 'images/item_003.png';
images.item004.src = 'images/item_004.png';
images.gameitem01.src = 'images/gameitem_01.png';
images.gameitem02.src = 'images/gameitem_02.png';
images.boom1.src = 'images/boom_01.png';
images.boom2.src = 'images/boom_02.png';
images.boom3.src = 'images/boom_03.png';
images.shop.src = 'images/shop.png';
images.decor01.src = 'images/decor01.png';
images.ano_head_01.src = 'images/npc/ano_head_01.png';
images.ano_body_01.src = 'images/npc/ano_body_01.png';
images.ano_head_left.src = 'images/npc/ano_head_left.png';
images.ano_head_right.src = 'images/npc/ano_head_right.png';
images.ano_body_left_01.src = 'images/npc/ano_body_left_01.png';
images.ano_body_left_02.src = 'images/npc/ano_body_left_02.png';
images.ano_body_right_01.src = 'images/npc/ano_body_right_01.png';
images.ano_body_right_02.src = 'images/npc/ano_body_right_02.png';