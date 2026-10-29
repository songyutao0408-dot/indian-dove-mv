// 分镜计划：每个段落的镜头列表。
// at = 镜头开始时间（秒）。默认会吸附到附近的节拍（最多提前 0.33 秒、推后 0.12 秒），
// snap: false 表示不吸附：片头卡翻转时间是 brief 规定的；说唱段一句一个镜头，必须和歌词同步。
// 每段第一个镜头的 at 必须等于段落开始时间（S18/S19 分界见 calibration.json）。

export type CharId =
  | "dove" // 印第安老斑鸠
  | "hen" // 母斑鸠
  | "crow" // 乌鸦
  | "snake" // 响尾蛇
  | "wolf" // 灰狼
  | "vulture" // 秃鹰
  | "bison" // 野牛
  | "lizard" // 蜥蜴
  | "cactus" // 害羞的仙人掌
  | "catdog" // 像猫的狗
  | "seagull" // 海鸥
  | "loach" // 泥鳅
  | "cowboy" // 牛仔
  | "warrior" // 印第安战士
  | "shaman" // 巫师
  | "chief" // 酋长
  | "skull"; // 骷髅头

export const ALL_CAST: CharId[] = [
  "dove", "hen", "crow", "snake", "wolf", "vulture", "bison", "lizard", "cactus",
  "catdog", "seagull", "loach", "cowboy", "warrior", "shaman", "chief", "skull",
];

export const CHAR_NAMES: Record<CharId, string> = {
  dove: "老斑鸠", hen: "母斑鸠", crow: "乌鸦", snake: "响尾蛇", wolf: "灰狼",
  vulture: "秃鹰", bison: "野牛", lizard: "蜥蜴", cactus: "害羞仙人掌",
  catdog: "像猫的狗", seagull: "海鸥", loach: "泥鳅", cowboy: "牛仔",
  warrior: "印第安战士", shaman: "巫师", chief: "酋长", skull: "骷髅头",
};

export type ShotSpec = {
  at: number;
  snap?: boolean;
  title: string;
  desc: string;
  cast: CharId[];
  /** 老斑鸠只是客串一下（不算主要出场） */
  doveCameo?: boolean;
};

const EVERYONE = ALL_CAST;
const PARTY: CharId[] = ["dove", "hen", "wolf", "snake", "lizard", "cactus", "catdog", "vulture", "bison", "loach", "seagull"];

export const SHOT_PLAN: Record<string, ShotSpec[]> = {
  S0: [
    { at: 0, snap: false, title: "歌名卡", desc: "放射状太阳光芒缓缓旋转，木牌上用西部字体写《印第安老斑鸠》；风滚草从卡前滚过，老斑鸠从木牌后探出半个头又缩回去", cast: ["dove"], doveCameo: true },
    { at: 8.95, snap: false, title: "作词卡", desc: "木牌翻转到「词：方文山」；风滚草反方向滚回来", cast: [] },
    { at: 17.91, snap: false, title: "作曲卡", desc: "木牌再翻到「曲：周杰伦」；老斑鸠趴在木牌顶上打瞌睡，冒 Zzz", cast: ["dove"], doveCameo: true },
    { at: 26.0, title: "峡谷大横移", desc: "光圈打开，峡谷全景，四层视差大横移；远处秃鹰是天上一个小点在绕圈", cast: ["vulture"] },
    { at: 31.0, title: "风起", desc: "低机位，风吹起沙尘，一团风滚草从远处滚向镜头越来越大，撞满画面（接 S1）", cast: [] },
  ],
  S1: [
    { at: 35.82, title: "泥鳅钻沙", desc: "干沙鼓起一个包，泥鳅钻出来左右张望", cast: ["loach"] },
    { at: 37.83, title: "海鸥飞过", desc: "海鸥叼着薯条从头顶飞过，泥鳅抬头看；一根薯条掉下插进沙里，泥鳅缩回去", cast: ["seagull", "loach"] },
    { at: 40.81, title: "峡谷大风", desc: "峡谷广角，狂风速度线，风滚草连翻带滚，仙人掌被吹弯，镜头剧烈晃动", cast: [] },
    { at: 44.1, title: "画外质疑", desc: "空镜岩石，画面外伸进来一个对话气泡（大问号＋「真的假的？」），抖两下", cast: [] },
  ],
  S2: [
    { at: 45.57, title: "热昏的响尾蛇", desc: "干涸河床，响尾蛇瘫成一滩，舌头耷拉、满身汗珠，身上热浪扭曲", cast: ["snake"] },
    { at: 48.1, title: "得意的太阳", desc: "镜头上摇，太阳长着一张得意的脸冲下面呼热气；回到蛇，尾巴有气无力地摇响", cast: ["snake"] },
    { at: 50.65, title: "沼泽幻想", desc: "蛇头顶冒出一串小泡鼓成思维气泡（乌云、雨点），镜头一路推进气泡：全屏沼泽，荷叶青蛙，蛇泡在泥水里享受；结尾气泡「啪」地破掉", cast: ["snake"] },
  ],
  S3: [
    { at: 56.13, title: "灰狼啃骨", desc: "灰狼龇牙啃水鹿骨头，咔嚓咬出一个缺口", cast: ["wolf"] },
    { at: 58.24, title: "秃鹰盘旋", desc: "仰拍秃鹰绕圈、眼珠往下死盯，镜头翻转成它的主观俯拍：画面缓缓旋转，地上的灰狼抬头瞪回来", cast: ["vulture", "wolf"] },
    { at: 60.85, title: "野牛对峙", desc: "左右分屏：两头野牛鼻孔喷气、蹄子刨地，眼神对上", cast: ["bison"] },
    { at: 64.56, title: "远方决斗", desc: "远景，两头野牛对冲，撞出一大团尘土云，冒星星", cast: ["bison"] },
  ],
  S4: [
    { at: 66.53, title: "白蚁丘", desc: "镜头推近一座废弃的白蚁丘（裂缝、小洞），风滚草经过", cast: [] },
    { at: 68.58, title: "老斑鸠登场", desc: "老斑鸠从丘顶冒出，饿到摇摇晃晃，眼冒金星，肚子咕咕叫冒声波线", cast: ["dove"] },
    { at: 72.02, title: "亮相定格", desc: "画面冻结，背景换成放射色块，木牌名牌「印第安老斑鸠」弹出来晃两下", cast: ["dove"] },
    { at: 76.4, title: "大哈欠", desc: "解冻，老斑鸠打一个巨大的哈欠，嘴张到半个画面，眼皮又耷拉下去", cast: ["dove"] },
  ],
  S5: [
    { at: 81.32, title: "腿短毛不多", desc: "特写：从小短腿往上摇，稀疏羽毛和秃斑，头顶三根毛「啵」地弹一下", cast: ["dove"] },
    { at: 83.79, title: "空水壶", desc: "大太阳底下，水壶倒过来只掉出一粒沙；老斑鸠半睁眼，一脸淡定", cast: ["dove"] },
    { at: 86.62, title: "秀逗", desc: "眼睛变成转动的螺旋，傻笑，脑袋跟着晃", cast: ["dove"] },
    { at: 88.99, title: "猎物死了", desc: "看到一只死掉的甲虫，嚎啕大哭，泪水像喷泉；旁边秃鹰一脸莫名其妙", cast: ["dove", "vulture"] },
  ],
  S6: [
    { at: 91.43, title: "学人开口", desc: "老斑鸠模仿人说话，嘴巴一张一合，冒对话气泡「Howdy～」", cast: ["dove"] },
    { at: 94.05, title: "害羞仙人掌", desc: "镜头一转看向仙人掌，它脸红，两只胳膊捂住脸扭身躲开", cast: ["cactus"] },
    { at: 95.3, title: "横走蜥蜴", desc: "蜥蜴像螃蟹一样侧着身子横穿画面，表情淡定", cast: ["lizard"] },
    { at: 96.87, title: "怪事①", desc: "闪切：一副鱼骨头在沙里游泳", cast: [] },
    { at: 97.5, title: "怪事②", desc: "闪切：石头咕嘟咕嘟冒泡，像煮开的锅", cast: [] },
    { at: 98.15, title: "怪事③", desc: "闪切：太阳和月亮同时挂在天上互相招手", cast: [] },
    { at: 98.8, title: "怪事④", desc: "闪切：风滚草停下来，自己倒着滚回去", cast: [] },
    { at: 99.53, title: "像猫的狗", desc: "狗舔爪子 → 弓背伸懒腰 → 定格，旁边弹出一个大问号", cast: ["catdog"] },
  ],
  S7: [
    { at: 101.86, title: "坐着发呆", desc: "老斑鸠坐在窝边发呆，一只苍蝇停在嘴上也不动", cast: ["dove"] },
    { at: 104.32, title: "乌鸦偷窝", desc: "蒙面乌鸦踮脚溜进来叼起窝里的树枝就跑；老斑鸠瞬间头顶冒烟、羽毛竖起，小短腿狂奔追出画面，尘土云和速度线", cast: ["crow", "dove"] },
    { at: 107.14, title: "灌木丛邂逅", desc: "老斑鸠急刹车，母斑鸠扭着从灌木丛后走出来，画面变慢", cast: ["dove", "hen"] },
    { at: 109.34, title: "心动", desc: "背景变成粉色，花瓣飘落，老斑鸠心形眼、脸红；母斑鸠眨长睫毛", cast: ["dove", "hen"] },
  ],
  S8: [
    { at: 112.35, title: "分享仙人掌果", desc: "约会①：两只斑鸠分一颗仙人掌果，老斑鸠被刺扎了嘴还在笑", cast: ["dove", "hen"] },
    { at: 117.4, title: "一起看风滚草", desc: "约会②：坐在岩石上的背影，一团风滚草跳着滚过地平线", cast: ["dove", "hen"] },
    { at: 122.4, title: "风滚草进镇", desc: "风把风滚草吹远，镜头跟着它一路滚过沙漠，越过「WELCOME」小镇木牌", cast: [] },
    { at: 127.5, title: "钟楼正午", desc: "钟楼特写，指针一格一格走到正午，铛——；色调开始转做旧", cast: [] },
    { at: 131.9, title: "主街空镜", desc: "做旧胶片的主街：风滚草滚过，百叶窗啪地关上，招牌吱呀摇；135.5 秒重鼓点时急推到街尽头", cast: [] },
  ],
  S9: [
    { at: 137.69, snap: false, title: "背对背决斗", desc: "牛仔和印第安战士背对背，一拍一步地走开", cast: ["cowboy", "warrior"] },
    { at: 139.89, snap: false, title: "灰狼发问", desc: "灰狼戴着牛仔帽凑到镜头前，鼻子快顶到镜头", cast: ["wolf"] },
    { at: 142.7, snap: false, title: "巫师念咒", desc: "巫师围着篝火摇骨头法器，身边冒彩色烟雾和符号", cast: ["shaman"] },
    { at: 143.8, snap: false, title: "诅咒酋长", desc: "彩色烟雾冲向酋长，他头顶「噗」地冒出一朵乌云", cast: ["chief"] },
    { at: 144.55, snap: false, title: "骷髅头抗议", desc: "骷髅头下巴一张一合地抗议", cast: ["skull"] },
    { at: 145.6, snap: false, title: "说书老斑鸠", desc: "老斑鸠像说书人一样坐在木箱上，一拍木箱", cast: ["dove"] },
    { at: 146.78, snap: false, title: "胶片烧穿", desc: "胶片卡住，画面中间烧出一个洞，迅速扩大变成全白", cast: [] },
  ],
  S10: [
    { at: 148.05, title: "月升泥鳅", desc: "白光褪成黄昏，贴地超低机位：泥鳅钻出沙面，身后是刚升起的大月亮", cast: ["loach"] },
    { at: 150.19, title: "海鸥剪影", desc: "海鸥变成剪影横穿落日，薯条剪影掉下来砸中泥鳅的头", cast: ["seagull", "loach"] },
    { at: 152.73, title: "俯瞰大风", desc: "高空俯瞰峡谷，一群风滚草像羊群一样被风赶着跑，镜头倾斜", cast: [] },
    { at: 156.59, title: "揭晓画外音", desc: "反打：原来画外的质疑是老斑鸠在岩石后面冒的气泡，一脸认真", cast: ["dove"] },
    { at: 158.04, title: "凉快的响尾蛇", desc: "入夜，响尾蛇躺在月光下的河床上，汗干了，舒服地吐一口白气", cast: ["snake"] },
    { at: 160.47, title: "河道鸟瞰", desc: "鸟瞰干河床，蛇的身体正好摆成河道的弯曲形状", cast: ["snake"] },
    { at: 163.35, title: "梦里的雨", desc: "蛇睡着了，梦泡泡里是倾盆大雨和青蛙合唱；泡泡破掉，一滴真雨点落在蛇鼻子上，蛇睁开一只眼，再也没有第二滴", cast: ["snake"] },
    { at: 168.37, title: "对月嚎叫", desc: "灰狼在月下山崖上叼着骨头仰头嚎叫，骨头掉下山崖", cast: ["wolf"] },
    { at: 170.58, title: "枯树秃鹰", desc: "秃鹰站在枯树上，背后是月亮，眼睛发光，脑袋 180° 转着盯人", cast: ["vulture"] },
    { at: 173.19, title: "月下决斗", desc: "黑暗中两对发光的眼睛对视、鼻孔喷白气；镜头急速拉远到月亮前的地平线，两头野牛剪影对冲，撞出尘土和星星", cast: ["bison"] },
  ],
  S11: [
    { at: 178.8, title: "月下白蚁丘", desc: "月光下的白蚁丘全景，萤火虫飘，慢推；丘顶一个小小的斑鸠剪影", cast: ["dove"] },
    { at: 180.88, title: "看月亮", desc: "老斑鸠蹲在丘顶看月亮，肚子咕咕叫，月亮在它眼里变成一张大饼", cast: ["dove"] },
    { at: 184.55, title: "安静远景", desc: "剪影远景，巨大的月亮，老斑鸠眨一下眼，一颗流星划过", cast: ["dove"] },
  ],
  S12: [
    { at: 188.52, title: "夜风发抖", desc: "侧面低角度：夜风吹过，老斑鸠缩成一团发抖，三根头毛被吹弯又弹回", cast: ["dove"] },
    { at: 191.05, title: "一滴露水", desc: "月光下倒拿空水壶，只滴出一滴露水，它满足地咂咂嘴", cast: ["dove"] },
    { at: 193.89, title: "看月亮看到秀逗", desc: "盯月亮太久变螺旋眼，萤火虫绕着脑袋转圈", cast: ["dove"] },
    { at: 196.25, title: "甲虫葬礼", desc: "给死甲虫插小木十字架，泪水喷泉浇开了一朵仙人掌花；秃鹰在暗处举着蜡烛一脸问号", cast: ["dove", "vulture"] },
  ],
  S13: [
    { at: 199.08, title: "休息一下", desc: "念白梗：老斑鸠真的躺进吊床，盖上小毯子，头顶冒 Zzz；灰狼、蛇、蜥蜴、仙人掌全部定格", cast: ["dove", "wolf", "snake", "lizard", "cactus"] },
    { at: 201.63, title: "闹钟", desc: "闹钟炸响，老斑鸠弹起来撞到吊床杆冒星星，大家解冻", cast: ["dove"] },
    { at: 202.6, title: "手电筒下的仙人掌", desc: "月光下手电筒照到仙人掌，它捂脸；蜥蜴提着灯笼从前景横着走过", cast: ["cactus", "lizard"] },
    { at: 203.77, title: "夜间怪事①", desc: "闪切：月亮对镜头眨眼", cast: [] },
    { at: 204.55, title: "夜间怪事②", desc: "闪切：星星连成一只斑鸠的星座", cast: [] },
    { at: 205.35, title: "夜间怪事③", desc: "闪切：一排仙人掌跳康加舞", cast: [] },
    { at: 206.15, title: "夜间怪事④", desc: "闪切：飞碟把一团风滚草吸走", cast: [] },
    { at: 206.96, title: "追激光的狗", desc: "像猫的狗追一个红色光点，扑空撞到石头，定格加问号", cast: ["catdog"] },
  ],
  S14: [
    { at: 209.09, title: "星空发呆", desc: "老斑鸠坐在丘顶，一颗流星划过，它一动不动", cast: ["dove"] },
    { at: 211.56, title: "影子小偷", desc: "月光把乌鸦的影子投在岩壁上，影子叼走了窝；老斑鸠的影子头顶冒烟带火星追上去，两个剪影绕着仙人掌跑", cast: ["crow", "dove"] },
    { at: 214.25, title: "萤火虫重逢", desc: "灌木丛里亮起萤火虫，母斑鸠在光里走出来", cast: ["dove", "hen"] },
    { at: 216.7, title: "萤火虫爱心", desc: "萤火虫排成一颗心，夜空泛粉，两只斑鸠对望", cast: ["dove", "hen"] },
  ],
  S15: [
    { at: 219.46, title: "篝火派对", desc: "全景：所有动物围着篝火，跟着节拍左右摇摆", cast: PARTY },
    { at: 224.5, title: "绕篝火", desc: "镜头绕着篝火转：灰狼和响尾蛇对跳，像猫的狗追火星，仙人掌扭腰", cast: ["wolf", "snake", "catdog", "cactus", "dove", "hen"] },
    { at: 229.5, title: "篝火渐熄", desc: "火光变小成余烬，动物们东倒西歪睡着，天边泛白", cast: PARTY },
    { at: 234.5, title: "日出", desc: "太阳打着哈欠升起，白天回归，老斑鸠伸个懒腰", cast: ["dove", "hen"] },
  ],
  S16: [
    { at: 239.77, title: "晨练", desc: "老斑鸠做深蹲，但腿太短，蹲没蹲看不出区别；草尖挂露珠", cast: ["dove"] },
    { at: 242.25, title: "海市蜃楼", desc: "远处冒出绿洲幻影，其他动物狂奔过去扑了个空；老斑鸠抱着空水壶淡定坐着", cast: ["dove", "wolf", "lizard", "bison"] },
    { at: 245.35, title: "缺词卡壳", desc: "缺词梗：唱到「脑袋瓜」卡住，头上冒问号，用翅膀敲自己脑袋咚咚两下，然后接上", cast: ["dove"] },
    { at: 247.4, title: "彩虹眼泪", desc: "又哭了，泪水喷泉在阳光下变成彩虹；秃鹰在旁边撑起一把伞", cast: ["dove", "vulture"] },
  ],
  S17: [
    { at: 249.8, title: "学牛仔说话", desc: "老斑鸠学牛仔说话，牛仔愣住；背景里角色们开始陆续往峡谷前走", cast: ["dove", "cowboy", "wolf", "snake"] },
    { at: 252.41, title: "仙人掌挪步", desc: "仙人掌捂着脸，一小步一小步挪向峡谷", cast: ["cactus"] },
    { at: 253.7, title: "蜥蜴领队", desc: "蜥蜴横着走在最前面，后面跟着一串排队的角色", cast: ["lizard", "loach", "seagull", "bison"] },
    { at: 255.13, title: "集合①", desc: "快切：泥鳅钻出来跟上队伍，头顶上海鸥降落、把薯条分给秃鹰；两头野牛肩并肩走来", cast: ["loach", "seagull", "vulture", "bison"] },
    { at: 256.45, title: "集合②", desc: "快切：巫师给酋长头上的乌云撑了把伞，两人和好，骷髅头在一旁点头", cast: ["shaman", "chief", "skull"] },
    { at: 257.78, title: "最后到场", desc: "像猫的狗最后一个到，跳进酋长怀里蜷成一团；拉开是聚齐的人群", cast: ["catdog", "chief", "dove", "hen", "warrior"] },
  ],
  S18: [
    { at: 260.26, title: "全员到齐", desc: "大合影机位，大家叽叽喳喳冒气泡，中间的老斑鸠安安静静站着", cast: EVERYONE },
    { at: 262.64, title: "全员追乌鸦", desc: "乌鸦又来偷窝，这次全体角色一起追，乌鸦乖乖把窝送回来", cast: EVERYONE },
    { at: 265.41, title: "人群让路", desc: "母斑鸠从灌木丛走出来，人群向两边让开一条路", cast: EVERYONE },
    { at: 267.83, title: "站在中间", desc: "两只斑鸠站在正中间，冒出爱心，全员「哇」，跟着拖音定格", cast: EVERYONE },
  ],
  S19: [
    { at: 270.33, title: "排成一排", desc: "安静段：全员排成一排，太阳开始西斜，大家轻轻摇摆、踮脚等拍子", cast: EVERYONE },
    { at: 275.3, title: "队伍横移", desc: "沿着队伍横移的中近景，每个角色跟着拍子跺脚、挤眼", cast: EVERYONE },
    { at: 280.0, title: "大合跳", desc: "鼓点回来：全员康康舞踢腿大合跳，尘土跟着节拍扬起", cast: EVERYONE },
    { at: 286.3, title: "拉远日落", desc: "镜头慢慢拉远到整片沙漠，队伍越来越小，太阳下山", cast: EVERYONE },
    { at: 291.0, title: "光圈收缩", desc: "光圈收缩，只剩下老斑鸠的脸，它慢慢眨一下眼", cast: ["dove"] },
    { at: 297.0, title: "结束卡", desc: "黑底木牌结束卡：词 方文山 / 曲 周杰伦 / 编曲 钟兴民 / 完；木牌轻轻晃，偶尔闪烁胶片黑点", cast: [] },
  ],
};
