import { Solar, Lunar } from 'lunar-javascript';

// ============================================================
// 大六壬核心算法（完善版）
// ============================================================

// 十二地支
export const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 十天干
export const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 十二天将
export const TIAN_JIANG = [
  { name: '贵人', alias: '天乙', nature: '吉', desc: '主官禄、贵人相助', category: '贵神' },
  { name: '腾蛇', alias: '腾蛇', nature: '凶', desc: '主惊恐、怪异、虚惊', category: '凶神' },
  { name: '朱雀', alias: '朱雀', nature: '凶', desc: '主口舌、文书、是非', category: '凶神' },
  { name: '六合', alias: '六合', nature: '吉', desc: '主和合、婚姻、交易', category: '吉神' },
  { name: '勾陈', alias: '勾陈', nature: '凶', desc: '主田土、牢狱、迟滞', category: '凶神' },
  { name: '青龙', alias: '青龙', nature: '吉', desc: '主财喜、婚姻、升迁', category: '吉神' },
  { name: '天空', alias: '天空', nature: '凶', desc: '主欺诈、虚空、不实', category: '凶神' },
  { name: '白虎', alias: '白虎', nature: '凶', desc: '主血光、疾病、道路', category: '凶神' },
  { name: '太常', alias: '太常', nature: '吉', desc: '主衣食、官职、安稳', category: '吉神' },
  { name: '玄武', alias: '玄武', nature: '凶', desc: '主盗贼、暗昧、私情', category: '凶神' },
  { name: '太阴', alias: '太阴', nature: '吉', desc: '主阴私、暗昧、女人', category: '吉神' },
  { name: '天后', alias: '天后', nature: '吉', desc: '主婚姻、阴柔、后宫', category: '吉神' },
];

// 十二月将（按中气换将）
// 口诀：雨水后亥（登明）、春分戌（河魁）、谷雨酉（从魁）、小满申（传送）、
//       夏至未（小吉）、大暑午（胜光）、处暑巳（太乙）、秋分辰（天罡）、
//       霜降卯（太冲）、小雪寅（功曹）、冬至丑（大吉）、大寒子（神后）
export const YUE_JIANG = [
  { name: '登明', zhi: '亥', jieQi: '雨水' },
  { name: '河魁', zhi: '戌', jieQi: '春分' },
  { name: '从魁', zhi: '酉', jieQi: '谷雨' },
  { name: '传送', zhi: '申', jieQi: '小满' },
  { name: '小吉', zhi: '未', jieQi: '夏至' },
  { name: '胜光', zhi: '午', jieQi: '大暑' },
  { name: '太乙', zhi: '巳', jieQi: '处暑' },
  { name: '天罡', zhi: '辰', jieQi: '秋分' },
  { name: '太冲', zhi: '卯', jieQi: '霜降' },
  { name: '功曹', zhi: '寅', jieQi: '小雪' },
  { name: '大吉', zhi: '丑', jieQi: '冬至' },
  { name: '神后', zhi: '子', jieQi: '大寒' },
];

// 十二长生诀
export const CHANG_SHENG: Record<string, Record<string, string>> = {
  '木': { 长生: '亥', 沐浴: '子', 冠带: '丑', 临官: '寅', 帝旺: '卯', 衰: '辰', 病: '巳', 死: '午', 墓: '未', 绝: '申', 胎: '酉', 养: '戌' },
  '火': { 长生: '寅', 沐浴: '卯', 冠带: '辰', 临官: '巳', 帝旺: '午', 衰: '未', 病: '申', 死: '酉', 墓: '戌', 绝: '亥', 胎: '子', 养: '丑' },
  '土': { 长生: '寅', 沐浴: '卯', 冠带: '辰', 临官: '巳', 帝旺: '午', 衰: '未', 病: '申', 死: '酉', 墓: '戌', 绝: '亥', 胎: '子', 养: '丑' },
  '金': { 长生: '巳', 沐浴: '午', 冠带: '未', 临官: '申', 帝旺: '酉', 衰: '戌', 病: '亥', 死: '子', 墓: '丑', 绝: '寅', 胎: '卯', 养: '辰' },
  '水': { 长生: '申', 沐浴: '酉', 冠带: '戌', 临官: '亥', 帝旺: '子', 衰: '丑', 病: '寅', 死: '卯', 墓: '辰', 绝: '巳', 胎: '午', 养: '未' },
};

// 天干五行
export const GAN_WU_XING: Record<string, string> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
};

// 地支五行
export const ZHI_WU_XING: Record<string, string> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

// 地支阴阳
export const ZHI_YIN_YANG: Record<string, string> = {
  '子': '阳', '丑': '阴', '寅': '阳', '卯': '阴', '辰': '阳', '巳': '阴',
  '午': '阳', '未': '阴', '申': '阳', '酉': '阴', '戌': '阳', '亥': '阴'
};

// 天干阴阳
export const GAN_YIN_YANG: Record<string, string> = {
  '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴', '戊': '阳',
  '己': '阴', '庚': '阳', '辛': '阴', '壬': '阳', '癸': '阴'
};

// 天干寄宫（日干寄宫地支）
// 口诀：甲课寅兮乙课辰，丙戊课巳不需论，丁己课未庚申上，辛戌壬亥是其真，癸课原来丑宫坐，分明不用四正神
// 阳干寄禄位，阴干寄墓库/冠带，土不寄四正（子午卯酉）
export const GAN_JI_GONG: Record<string, string> = {
  '甲': '寅', '乙': '辰', '丙': '巳', '丁': '未', '戊': '巳',
  '己': '未', '庚': '申', '辛': '戌', '壬': '亥', '癸': '丑'
};

// 地支三合局
export const ZHI_HE: Record<string, string> = {
  '子': '申辰', '申': '子辰', '辰': '申子',  // 水局
  '寅': '午戌', '午': '寅戌', '戌': '寅午',  // 火局
  '巳': '酉丑', '酉': '巳丑', '丑': '巳酉',  // 金局
  '亥': '卯未', '卯': '亥未', '未': '亥卯',  // 木局
};

// 地支六冲
export const ZHI_CHONG: Record<string, string> = {
  '子': '午', '丑': '未', '寅': '申', '卯': '酉', '辰': '戌', '巳': '亥',
  '午': '子', '未': '丑', '申': '寅', '酉': '卯', '戌': '辰', '亥': '巳',
};

// 地支三刑
export const ZHI_XING: Record<string, string> = {
  '子': '卯', '卯': '子',
  '寅': '巳', '巳': '申', '申': '寅',
  '丑': '戌', '戌': '未', '未': '丑',
  '辰': '辰', '午': '午', '酉': '酉', '亥': '亥',
};

// 地支自刑
export const ZHI_ZI_XING = new Set(['辰', '午', '酉', '亥']);

// 五行生克关系
export function wuxingRelation(wx1: string, wx2: string): string {
  const sheng: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const ke: Record<string, string> = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };
  if (wx1 === wx2) return '比';
  if (sheng[wx1] === wx2) return '生';
  if (ke[wx1] === wx2) return '克';
  if (sheng[wx2] === wx1) return '被生';
  if (ke[wx2] === wx1) return '被克';
  return '';
}

// 地支序号 (子=0, 丑=1, ...)
export function zhiIndex(zhi: string): number {
  return DI_ZHI.indexOf(zhi);
}

// 从地支A数到地支B的步数（顺时针）
export function zhiDistance(from: string, to: string): number {
  const f = zhiIndex(from);
  const t = zhiIndex(to);
  return (t - f + 12) % 12;
}

// ============================================================
// 贵人定局
// ============================================================

// 阳贵人（白天用）
const YANG_GUI: Record<string, string> = {
  '甲': '丑', '戊': '丑', '庚': '丑',
  '乙': '子', '己': '子',
  '丙': '亥', '丁': '亥',
  '壬': '卯', '癸': '卯',
  '辛': '午',
};

// 阴贵人（夜间用）
const YIN_GUI: Record<string, string> = {
  '甲': '未', '戊': '未', '庚': '未',
  '乙': '申', '己': '申',
  '丙': '酉', '丁': '酉',
  '壬': '巳', '癸': '巳',
  '辛': '寅',
};

// 判断是否白天（卯时至酉时为白天）
function isDaytime(shichen: string): boolean {
  return ['卯', '辰', '巳', '午', '未', '申', '酉'].includes(shichen);
}

export function getGuiZhi(dayGan: string, shichen: string): string {
  const guiTable = isDaytime(shichen) ? YANG_GUI : YIN_GUI;
  return guiTable[dayGan] || '丑';
}

// 贵人顺逆：昼占（卯—酉）贵人顺排，夜占（戌—寅）贵人逆排
// 顺逆判断：天盘贵人落在地盘亥子丑寅卯辰位顺行，落在地盘巳午未申酉戌位逆行
// guiPosOnEarth: 天盘贵人所在的地盘位置索引
export function arrangeTianJiangByPos(guiPosOnEarth: number): string[] {
  // 亥(9)子(10)丑(11)寅(0)卯(1)辰(2) → 顺行
  const shunSet = new Set([9, 10, 11, 0, 1, 2]);
  const isShun = shunSet.has(guiPosOnEarth);
  const result: string[] = new Array(12);
  if (isShun) {
    for (let i = 0; i < 12; i++) {
      result[(guiPosOnEarth + i) % 12] = TIAN_JIANG[i].name;
    }
  } else {
    for (let i = 0; i < 12; i++) {
      result[(guiPosOnEarth - i + 12) % 12] = TIAN_JIANG[i].name;
    }
  }
  return result;
}

// 保留旧函数兼容
export function arrangeTianJiang(guiZhiOnEarth: string): string[] {
  return arrangeTianJiangByPos(zhiIndex(guiZhiOnEarth));
}

// ============================================================
// 月将计算（按中气换将 — 精确版）
// ============================================================

// 二十四节气对应月将索引（使用当前节气推算月将）
// 规则：中气后换将，每个中气对应一个月将
// 雨水后→登明亥(0)，春分后→河魁戌(1)，谷雨后→从魁酉(2)，小满后→传送申(3)，
// 夏至后→小吉未(4)，大暑后→胜光午(5)，处暑后→太乙巳(6)，秋分后→天罡辰(7)，
// 霜降后→太冲卯(8)，小雪后→功曹寅(9)，冬至后→大吉丑(10)，大寒后→神后子(11)
const JIEQI_TO_YUEJIANG: Record<string, number> = {
  '雨水': 0, '惊蛰': 0,
  '春分': 1, '清明': 1,
  '谷雨': 2, '立夏': 2,
  '小满': 3, '芒种': 3,
  '夏至': 4, '小暑': 4,
  '大暑': 5, '立秋': 5,
  '处暑': 6, '白露': 6,
  '秋分': 7, '寒露': 7,
  '霜降': 8, '立冬': 8,
  '小雪': 9, '大雪': 9,
  '冬至': 10, '小寒': 10,
  '大寒': 11, '立春': 11,
};

// 获取当前节气名称（使用 Lunar API）
export function getZhongQi(date: Date): string {
  try {
    const solar = Solar.fromDate(date);
    const lunar = Lunar.fromSolar(solar);
    const prevJQ = lunar.getPrevJieQi?.();
    if (prevJQ) {
      const name = prevJQ.getName?.();
      if (name) return name;
    }
    const currentJQ = lunar.getCurrentJieQi();
    if (currentJQ) {
      const name = currentJQ.getName();
      if (name) return name;
    }
    const jqStr = lunar.getJieQi();
    if (jqStr) return jqStr;
  } catch {
    // ignore
  }
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const approx: [number, number, string][] = [
    [1, 5, '小寒'], [1, 20, '大寒'], [2, 4, '立春'], [2, 19, '雨水'],
    [3, 6, '惊蛰'], [3, 21, '春分'], [4, 5, '清明'], [4, 20, '谷雨'],
    [5, 6, '立夏'], [5, 21, '小满'], [6, 6, '芒种'], [6, 21, '夏至'],
    [7, 7, '小暑'], [7, 23, '大暑'], [8, 7, '立秋'], [8, 23, '处暑'],
    [9, 8, '白露'], [9, 23, '秋分'], [10, 8, '寒露'], [10, 23, '霜降'],
    [11, 7, '立冬'], [11, 22, '小雪'], [12, 7, '大雪'], [12, 22, '冬至'],
  ];
  let result = '冬至';
  for (const [m, d, name] of approx) {
    if (month > m || (month === m && day >= d)) {
      result = name;
    }
  }
  return result;
}

// 获取月将地支（按中气换将）
export function getYueJiangZhi(date: Date): string {
  const zhongQi = getZhongQi(date);
  const yueJiangIdx = JIEQI_TO_YUEJIANG[zhongQi] ?? 0;
  return YUE_JIANG[yueJiangIdx].zhi;
}

// ============================================================
// 天盘排法
// ============================================================

export function buildTianPan(yueJiangZhi: string, shiZhi: string): string[] {
  // 月将加时：将月将放在地盘时辰位置上，其余顺时针排满
  // 天盘[i]表示地盘位置i上对应的天盘地支
  // 地盘位置i的时辰是DI_ZHI[i]
  // 月将放在地盘shiZhi位置上，即天盘[shiIdx] = yueJiangZhi
  // 然后从月将开始顺时针排满十二地支
  const yueJiangIdx = zhiIndex(yueJiangZhi);
  const shiIdx = zhiIndex(shiZhi);
  const tianPan: string[] = [];
  for (let i = 0; i < 12; i++) {
    // 地盘位置i上，天盘地支 = 从月将地支开始，顺推(i - shiIdx)步
    tianPan[i] = DI_ZHI[(yueJiangIdx + (i - shiIdx) + 12) % 12];
  }
  return tianPan;
}

// ============================================================
// 获取日期信息
// ============================================================

export function getRiGanZhi(date: Date): { gan: string; zhi: string } {
  const solar = Solar.fromDate(date);
  const lunar = Lunar.fromSolar(solar);
  const dayGanZhi = lunar.getDayInGanZhi();
  return { gan: dayGanZhi[0], zhi: dayGanZhi[1] };
}

export function getShiZhi(date: Date): string {
  const solar = Solar.fromDate(date);
  const lunar = Lunar.fromSolar(solar);
  return lunar.getTimeZhi();
}

// 获取四柱（年柱、月柱、日柱、时柱）
export interface SiZhu {
  year: string;   // 年柱
  month: string;  // 月柱
  day: string;    // 日柱
  hour: string;   // 时柱
}

export function getSiZhu(date: Date, shichen?: string): SiZhu {
  const solar = Solar.fromDate(date);
  const lunar = Lunar.fromSolar(solar);

  // 年柱
  const yearGanZhi = lunar.getYearInGanZhi();

  // 月柱
  const monthGanZhi = lunar.getMonthInGanZhi();

  // 日柱
  const dayGanZhi = lunar.getDayInGanZhi();

  // 时柱
  let hourGanZhi: string;
  if (shichen) {
    const shiIdx = DI_ZHI.indexOf(shichen);
    const dayGanTianGanIdx = TIAN_GAN.indexOf(dayGanZhi[0]);
    // 时干计算公式：(日干序 * 2 + 时支序) % 10
    const hourGanIdx = (dayGanTianGanIdx * 2 + shiIdx) % 10;
    hourGanZhi = TIAN_GAN[hourGanIdx] + shichen;
  } else {
    hourGanZhi = lunar.getTimeInGanZhi();
  }

  return {
    year: yearGanZhi,
    month: monthGanZhi,
    day: dayGanZhi,
    hour: hourGanZhi
  };
}

// ============================================================
// 四课计算
// ============================================================

export interface Ke {
  shang: string;     // 上神
  xia: string;       // 下神
  label: string;     // 课名
  guanxi: string;    // 克/生/比
  direction: string; // 上克下/下贼上/上生下/下生上/比和
}

// 计算上下神关系
function calcKeRelation(shang: string, xia: string): { guanxi: string; direction: string } {
  const shangWx = ZHI_WU_XING[shang] || '';
  const xiaWx = ZHI_WU_XING[xia] || '';
  const rel = wuxingRelation(shangWx, xiaWx);
  if (rel === '克') return { guanxi: '克', direction: '上克下' };
  if (rel === '被克') return { guanxi: '克', direction: '下贼上' };
  if (rel === '生') return { guanxi: '生', direction: '上生下' };
  if (rel === '被生') return { guanxi: '生', direction: '下生上' };
  return { guanxi: '比', direction: '比和' };
}

export function calculateSiKe(dayGan: string, dayZhi: string, tianPan: string[]): Ke[] {
  const ganJiGong = GAN_JI_GONG[dayGan];

  // 第一课：日干阳神 — 天盘在日干寄宫上的神
  const ke1Shang = tianPan[zhiIndex(ganJiGong)];
  const ke1: Ke = { shang: ke1Shang, xia: ganJiGong, label: '日干阳神', ...calcKeRelation(ke1Shang, ganJiGong) };

  // 第二课：日干阴神 — 天盘在第一课上神上的神
  const ke2Shang = tianPan[zhiIndex(ke1Shang)];
  const ke2: Ke = { shang: ke2Shang, xia: ke1Shang, label: '日干阴神', ...calcKeRelation(ke2Shang, ke1Shang) };

  // 第三课：日支阳神 — 天盘在日支上的神
  const ke3Shang = tianPan[zhiIndex(dayZhi)];
  const ke3: Ke = { shang: ke3Shang, xia: dayZhi, label: '日支阳神', ...calcKeRelation(ke3Shang, dayZhi) };

  // 第四课：日支阴神 — 天盘在第三课上神上的神
  const ke4Shang = tianPan[zhiIndex(ke3Shang)];
  const ke4: Ke = { shang: ke4Shang, xia: ke3Shang, label: '日支阴神', ...calcKeRelation(ke4Shang, ke3Shang) };

  return [ke1, ke2, ke3, ke4];
}

// ============================================================
// 三传计算（九宗门 — 完善版）
// ============================================================

export interface Chuan {
  chu: string;     // 初传
  zhong: string;   // 中传
  mo: string;      // 末传
  men: string;     // 宗门名
  desc: string;    // 取传说明
}

// 孟仲季：寅申巳亥为孟，子午卯酉为仲，辰戌丑未为季
const MENG_ZHI = new Set(['寅', '申', '巳', '亥']);
const ZHONG_ZHI = new Set(['子', '午', '卯', '酉']);

function getZhiType(zhi: string): '孟' | '仲' | '季' {
  if (MENG_ZHI.has(zhi)) return '孟';
  if (ZHONG_ZHI.has(zhi)) return '仲';
  return '季';
}

// 判断某课是否有克（上克下或下贼上）
function hasKe(ke: Ke): boolean {
  return ke.direction === '上克下' || ke.direction === '下贼上';
}

// ---- 第一门：贼克法 ----
function zeiKe(siKe: Ke[]): Chuan | null {
  // 先看四课中是否有下贼上
  const zeiList = siKe.filter(ke => ke.direction === '下贼上');
  if (zeiList.length === 1) {
    return {
      chu: zeiList[0].shang, zhong: '', mo: '',
      men: '贼克',
      desc: `四课中第${siKe.indexOf(zeiList[0]) + 1}课下贼上，取上神${zeiList[0].shang}为初传（重审课）`
    };
  }
  // 再看是否有上克下
  const keList = siKe.filter(ke => ke.direction === '上克下');
  if (keList.length === 1) {
    return {
      chu: keList[0].shang, zhong: '', mo: '',
      men: '贼克',
      desc: `四课中第${siKe.indexOf(keList[0]) + 1}课上克下，取上神${keList[0].shang}为初传（元首课）`
    };
  }
  // 多个克贼，交给比用法
  if (zeiList.length > 1 || keList.length > 1) {
    return null; // 交给比用
  }
  return null;
}

// ---- 第二门：比用法 ----
// 当有多个克贼时，取与日干同阴阳者为初传
function biYong(siKe: Ke[], dayGan: string): Chuan | null {
  const ganYy = GAN_YIN_YANG[dayGan];

  const zeiList = siKe.filter(ke => ke.direction === '下贼上');
  const keList = siKe.filter(ke => ke.direction === '上克下');

  if (zeiList.length > 1) {
    const matched = zeiList.filter(ke => ZHI_YIN_YANG[ke.shang] === ganYy);
    if (matched.length === 1) {
      return {
        chu: matched[0].shang, zhong: '', mo: '',
        men: '比用',
        desc: `多课下贼上，取与日干同阴阳（${ganYy}）的上神${matched[0].shang}为初传（知一课）`
      };
    }
    if (matched.length > 1) return null;
    const opposite = zeiList.filter(ke => ZHI_YIN_YANG[ke.shang] !== ganYy);
    if (opposite.length === 1) {
      return {
        chu: opposite[0].shang, zhong: '', mo: '',
        men: '比用',
        desc: `多课下贼上无同阴阳者，取异阴阳上神${opposite[0].shang}为初传（知一课）`
      };
    }
    return null;
  }

  if (zeiList.length === 1) {
    return {
      chu: zeiList[0].shang, zhong: '', mo: '',
      men: '比用',
      desc: `下贼上优先，取上神${zeiList[0].shang}为初传（重审课）`
    };
  }

  if (keList.length > 1) {
    const matched = keList.filter(ke => ZHI_YIN_YANG[ke.shang] === ganYy);
    if (matched.length === 1) {
      return {
        chu: matched[0].shang, zhong: '', mo: '',
        men: '比用',
        desc: `多课上克下，取与日干同阴阳（${ganYy}）的上神${matched[0].shang}为初传（知一课）`
      };
    }
    if (matched.length > 1) return null;
    const opposite = keList.filter(ke => ZHI_YIN_YANG[ke.shang] !== ganYy);
    if (opposite.length === 1) {
      return {
        chu: opposite[0].shang, zhong: '', mo: '',
        men: '比用',
        desc: `多课上克下无同阴阳者，取异阴阳上神${opposite[0].shang}为初传（知一课）`
      };
    }
    return null;
  }

  return null;
}

// ---- 第三门：涉害法 ----
// 计算涉害深浅：从上神在地盘位置顺数到下神位置，上神五行克地盘五行的次数
function calcSheHaiDepth(shang: string, xia: string): number {
  const shangWx = ZHI_WU_XING[shang];
  const shangIdx = zhiIndex(shang);
  const xiaIdx = zhiIndex(xia);
  let depth = 0;
  for (let i = 1; i <= 12; i++) {
    const idx = (shangIdx + i) % 12;
    if (idx === xiaIdx) break;
    const posWx = ZHI_WU_XING[DI_ZHI[idx]];
    if (wuxingRelation(shangWx, posWx) === '克') {
      depth++;
    }
  }
  return depth;
}

function sheHai(siKe: Ke[], dayGan: string): Chuan | null {
  const ganYy = GAN_YIN_YANG[dayGan];

  // 收集所有克贼的课
  const allKeZei = siKe.filter(ke => hasKe(ke));
  if (allKeZei.length <= 1) return null;

  // 取与日干同阴阳的克贼课
  let candidates = allKeZei.filter(ke => ZHI_YIN_YANG[ke.shang] === ganYy);
  if (candidates.length === 0) candidates = allKeZei;
  if (candidates.length === 1) {
    return {
      chu: candidates[0].shang, zhong: '', mo: '',
      men: '涉害',
      desc: `涉害法，唯一候选${candidates[0].shang}为初传`
    };
  }

  // 计算涉害深度
  const withDepth = candidates.map(ke => ({
    ke,
    depth: calcSheHaiDepth(ke.shang, ke.xia),
    type: getZhiType(ke.xia), // 孟仲季看下神位置
    shangType: getZhiType(ke.shang), // 也可看上神位置
  }));

  // 按涉害深度排序（深者优先）
  withDepth.sort((a, b) => b.depth - a.depth);

  const maxDepth = withDepth[0].depth;
  const sameDepth = withDepth.filter(c => c.depth === maxDepth);

  if (sameDepth.length === 1) {
    const c = sameDepth[0];
    return {
      chu: c.ke.shang, zhong: '', mo: '',
      men: '涉害',
      desc: `涉害法，取涉害最深（${c.depth}重）的${c.ke.shang}为初传（涉害课）`
    };
  }

  // 深度相同，按孟仲季优先级（看下神位置，孟>仲>季）
  const priority: Record<string, number> = { '孟': 3, '仲': 2, '季': 1 };
  sameDepth.sort((a, b) => (priority[b.type] || 0) - (priority[a.type] || 0));

  const topType = sameDepth[0].type;
  const sameType = sameDepth.filter(c => c.type === topType);

  if (sameType.length === 1) {
    const c = sameType[0];
    const typeName = topType === '孟' ? '见机' : topType === '仲' ? '察微' : '缠绵';
    return {
      chu: c.ke.shang, zhong: '', mo: '',
      men: '涉害',
      desc: `涉害深度相同，取${topType}位${typeName}，${c.ke.shang}为初传（${typeName}课）`
    };
  }

  // 仍无法区分，取第一个
  const c = sameType[0];
  return {
    chu: c.ke.shang, zhong: '', mo: '',
    men: '涉害',
    desc: `涉害法，取${c.ke.shang}为初传（涉害课）`
  };
}

// ---- 第四门：遥克法 ----
function yaoKe(siKe: Ke[], dayGan: string): Chuan | null {
  const ganWx = GAN_WU_XING[dayGan];

  // 四课都无克贼时使用
  // 蒿矢：四课上神克日干（寄宫五行）
  for (let i = 0; i < siKe.length; i++) {
    const shangWx = ZHI_WU_XING[siKe[i].shang] || '';
    if (wuxingRelation(shangWx, ganWx) === '克') {
      return {
        chu: siKe[i].shang, zhong: '', mo: '',
        men: '蒿矢',
        desc: `四课上神${siKe[i].shang}（${shangWx}）克日干${dayGan}（${ganWx}），蒿矢法取为初传`
      };
    }
  }

  // 弹射：日干克四课上神
  for (let i = 0; i < siKe.length; i++) {
    const shangWx = ZHI_WU_XING[siKe[i].shang] || '';
    if (wuxingRelation(ganWx, shangWx) === '克') {
      return {
        chu: siKe[i].shang, zhong: '', mo: '',
        men: '弹射',
        desc: `日干${dayGan}（${ganWx}）克上神${siKe[i].shang}（${shangWx}），弹射法取为初传`
      };
    }
  }
  return null;
}

// ---- 第五门：昴星法 ----
// 四课无克又无遥克时使用
function maoXing(siKe: Ke[], dayGan: string, tianPan: string[]): Chuan | null {
  const ganYy = GAN_YIN_YANG[dayGan];
  const youTian = tianPan[zhiIndex('酉')]; // 酉上天盘

  if (ganYy === '阳') {
    // 阳日：取酉上天盘为初传，地盘酉为末传
    return {
      chu: youTian, zhong: '', mo: '',
      men: '昴星',
      desc: `阳日昴星法，取酉上天盘${youTian}为初传`
    };
  } else {
    // 阴日：取地盘酉为初传，酉上天盘为末传
    return {
      chu: '酉', zhong: '', mo: '',
      men: '昴星',
      desc: `阴日昴星法，取地盘酉为初传`
    };
  }
}

// ---- 第六门：别责法 ----
// 四课不全（只有三课）时使用
function bieZe(siKe: Ke[], dayGan: string, tianPan: string[]): Chuan | null {
  const ganHe: Record<string, string> = {
    '甲': '己', '己': '甲', '乙': '庚', '庚': '乙',
    '丙': '辛', '辛': '丙', '丁': '壬', '壬': '丁',
    '戊': '癸', '癸': '戊'
  };
  const heGan = ganHe[dayGan];
  const heJiGong = GAN_JI_GONG[heGan];
  const heJiGongShang = tianPan[zhiIndex(heJiGong)];
  return {
    chu: heJiGongShang, zhong: '', mo: '',
    men: '别责',
    desc: `别责法，日干${dayGan}合${heGan}，取${heGan}寄宫${heJiGong}上天盘${heJiGongShang}为初传`
  };
}

// ---- 第七门：八专法 ----
// 日干寄宫与日支相同时使用（干支同位、四课两备）
// 口诀：阳日顺数，阴日逆数；干上神起，数三位取初传
function baZhuan(siKe: Ke[], dayGan: string, dayZhi: string, tianPan: string[]): Chuan | null {
  const ganJiGong = GAN_JI_GONG[dayGan];
  if (ganJiGong !== dayZhi) return null;

  const ganYy = GAN_YIN_YANG[dayGan];
  // 干上神 = 第一课的上神
  const ganShangShen = siKe[0].shang;
  const shangIdx = zhiIndex(ganShangShen);

  let chu: string;
  if (ganYy === '阳') {
    // 阳日：从干上神在天盘中顺数3位取初传
    chu = DI_ZHI[(shangIdx + 3) % 12];
  } else {
    // 阴日：从干上神在天盘中逆数3位取初传
    chu = DI_ZHI[(shangIdx - 3 + 12) % 12];
  }

  // 中传取初传之上神（地盘chu上的天盘），末传取中传之上神
  const zhong = tianPan[zhiIndex(chu)];
  const mo = tianPan[zhiIndex(zhong)];

  return {
    chu, zhong, mo,
    men: '八专',
    desc: `八专法，干支同位（${dayGan}寄${ganJiGong}=${dayZhi}），${ganYy}日从干上神${ganShangShen}${ganYy === '阳' ? '顺' : '逆'}数3位取${chu}为初传，中传${zhong}，末传${mo}`
  };
}

// ---- 伏吟 ----
function fuYin(tianPan: string[]): boolean {
  for (let i = 0; i < 12; i++) {
    if (tianPan[i] !== DI_ZHI[i]) return false;
  }
  return true;
}

// ---- 返吟 ----
function fanYin(tianPan: string[]): boolean {
  for (let i = 0; i < 12; i++) {
    if (tianPan[i] !== DI_ZHI[(i + 6) % 12]) return false;
  }
  return true;
}

// 伏吟取传
function fuYinChuan(siKe: Ke[], dayGan: string, dayZhi: string): Chuan {
  const ganYy = GAN_YIN_YANG[dayGan];
  let chu: string;

  const keKe = siKe.filter(ke => hasKe(ke));
  if (keKe.length > 0) {
    chu = keKe[0].shang;
    const zhong = ZHI_ZI_XING.has(chu) ? ZHI_CHONG[chu] : (ZHI_XING[chu] || chu);
    const mo = ZHI_ZI_XING.has(zhong) ? ZHI_CHONG[zhong] : (ZHI_XING[zhong] || zhong);
    return {
      chu,
      zhong,
      mo,
      men: '伏吟',
      desc: `伏吟有克，取${keKe[0].direction}的上神${chu}为初传，中传取刑${zhong}，末传取刑${mo}`
    };
  }

  if (ganYy === '阳') {
    chu = GAN_JI_GONG[dayGan];
    const zhong = ZHI_ZI_XING.has(chu) ? ZHI_CHONG[chu] : (ZHI_XING[chu] || chu);
    const mo = ZHI_ZI_XING.has(zhong) ? ZHI_CHONG[zhong] : (ZHI_XING[zhong] || zhong);
    return {
      chu,
      zhong,
      mo,
      men: '伏吟',
      desc: `伏吟阳日无克，取日干寄宫${chu}为初传（自任课），中传取刑${zhong}，末传取刑${mo}`
    };
  } else {
    chu = dayZhi;
    const zhong = ZHI_ZI_XING.has(chu) ? ZHI_CHONG[chu] : (ZHI_XING[chu] || chu);
    const mo = ZHI_ZI_XING.has(zhong) ? ZHI_CHONG[zhong] : (ZHI_XING[zhong] || zhong);
    return {
      chu,
      zhong,
      mo,
      men: '伏吟',
      desc: `伏吟阴日无克，取日支${chu}为初传（自信课），中传取刑${zhong}，末传取刑${mo}`
    };
  }
}

// 返吟取传
function fanYinChuan(siKe: Ke[], dayGan: string, dayZhi: string, tianPan: string[]): Chuan {
  const keKe = siKe.filter(ke => hasKe(ke));
  if (keKe.length > 0) {
    const chu = keKe[0].shang;
    const zhong = tianPan[zhiIndex(chu)];
    const mo = tianPan[zhiIndex(zhong)];
    return {
      chu,
      zhong,
      mo,
      men: '返吟',
      desc: `返吟有克，取${keKe[0].direction}的上神${chu}为初传，中传${zhong}，末传${mo}`
    };
  }

  const yiMaMap: Record<string, string> = {
    '申': '寅', '子': '寅', '辰': '寅',
    '寅': '申', '午': '申', '戌': '申',
    '巳': '亥', '酉': '亥', '丑': '亥',
    '亥': '巳', '卯': '巳', '未': '巳',
  };
  const chu = yiMaMap[dayZhi] || siKe[0].shang;
  const zhong = ZHI_CHONG[chu] || chu;
  const mo = ZHI_CHONG[zhong] || zhong;
  return {
    chu,
    zhong,
    mo,
    men: '返吟',
    desc: `返吟无克，取日支${dayZhi}驿马${chu}为初传，中传取冲${zhong}，末传取冲${mo}`
  };
}

// 填充中末传（通用方法：初传之上神为中传，中传之上神为末传）
function fillZhongMo(chuan: Chuan, tianPan: string[]): Chuan {
  if (!chuan.zhong) {
    chuan.zhong = tianPan[zhiIndex(chuan.chu)];
  }
  if (!chuan.mo) {
    chuan.mo = tianPan[zhiIndex(chuan.zhong)];
  }
  return chuan;
}

// 完整的三传计算（九宗门）
export function calculateSanChuan(siKe: Ke[], dayGan: string, dayZhi: string, tianPan: string[]): Chuan {
  // 伏吟返吟先判断
  if (fuYin(tianPan)) return fuYinChuan(siKe, dayGan, dayZhi);
  if (fanYin(tianPan)) return fanYinChuan(siKe, dayGan, dayZhi, tianPan);

  // 检查四课是否有克
  const keZeiCount = siKe.filter(ke => hasKe(ke)).length;

  // 第一门：贼克（只有一个克贼时）
  if (keZeiCount === 1) {
    const result = zeiKe(siKe);
    if (result) return fillZhongMo(result, tianPan);
  }

  // 第二门：比用（多个克贼时，取与日干同阴阳者）
  if (keZeiCount > 1) {
    const result = biYong(siKe, dayGan);
    if (result) return fillZhongMo(result, tianPan);

    // 第三门：涉害（比用仍无法决定时）
    const result2 = sheHai(siKe, dayGan);
    if (result2) return fillZhongMo(result2, tianPan);
  }

  // 无克贼，走遥克
  // 第四门：遥克
  const ykResult = yaoKe(siKe, dayGan);
  if (ykResult) return fillZhongMo(ykResult, tianPan);

  // 第五门：八专（干支同位时，优先于昴星）
  const bzhResult = baZhuan(siKe, dayGan, dayZhi, tianPan);
  if (bzhResult) return bzhResult;

  // 第六门：昴星
  const mxResult = maoXing(siKe, dayGan, tianPan);
  if (mxResult) return fillZhongMo(mxResult, tianPan);

  // 第七门：别责（四课不全时）
  const bzResult = bieZe(siKe, dayGan, tianPan);
  if (bzResult) return fillZhongMo(bzResult, tianPan);

  // 兜底
  return fillZhongMo({
    chu: siKe[0].shang, zhong: '', mo: '',
    men: '重审',
    desc: `取日干上神${siKe[0].shang}为初传`
  }, tianPan);
}

// ============================================================
// 课体格局判断（完善版）
// ============================================================

export interface KeTi {
  name: string;       // 课体名称（宗门课格）
  level: string;      // 吉凶等级
  summary: string;    // 简评
  detail: string;     // 详解
  subGeju: string[];  // 附加格局
}

export function analyzeSanChuanGeju(sanChuan: Chuan, dayGan: string): string[] {
  const geju: string[] = [];
  const { chu, zhong, mo } = sanChuan;
  const chuWx = ZHI_WU_XING[chu] || '';
  const zhongWx = ZHI_WU_XING[zhong] || '';
  const moWx = ZHI_WU_XING[mo] || '';
  const ganWx = GAN_WU_XING[dayGan] || '';

  if (wuxingRelation(chuWx, zhongWx) === '生' && wuxingRelation(zhongWx, moWx) === '生') {
    geju.push('三传递生');
  }
  if (wuxingRelation(chuWx, zhongWx) === '克' && wuxingRelation(zhongWx, moWx) === '克') {
    geju.push('三传递克');
  }
  if (wuxingRelation(moWx, chuWx) === '生') {
    geju.push('始败终成');
  }
  if (wuxingRelation(chuWx, ganWx) === '克') {
    geju.push('初克日');
  }
  if (wuxingRelation(chuWx, ganWx) === '生') {
    geju.push('初生日');
  }
  if (wuxingRelation(moWx, ganWx) === '生') {
    geju.push('末生日');
  }
  if (wuxingRelation(moWx, ganWx) === '克') {
    geju.push('末克日');
  }

  if (ZHI_CHONG[chu] === mo || ZHI_CHONG[mo] === chu) {
    geju.push('初末交冲');
  }
  if (ZHI_CHONG[chu] === zhong || ZHI_CHONG[zhong] === chu) {
    geju.push('初中交冲');
  }

  if (ZHI_XING[chu] === zhong || ZHI_XING[zhong] === mo) {
    geju.push('三传见刑');
  }

  if (chuWx === zhongWx && zhongWx === moWx) {
    geju.push('三传同气');
  }
  if (chuWx === zhongWx || zhongWx === moWx || chuWx === moWx) {
    if (chuWx !== zhongWx || zhongWx !== moWx) {
      geju.push('三传半合');
    }
  }

  if (ZHI_HE[chu]?.includes(zhong) && ZHI_HE[zhong]?.includes(mo)) {
    geju.push('三传合局');
  }

  if (chu === zhong || zhong === mo) {
    geju.push('传中空亡');
  }

  return geju;
}

export function judgeKeTi(sanChuan: Chuan, siKe: Ke[], dayGan: string, men: string): KeTi {
  const chuWx = ZHI_WU_XING[sanChuan.chu] || '';
  const zhongWx = ZHI_WU_XING[sanChuan.zhong] || '';
  const moWx = ZHI_WU_XING[sanChuan.mo] || '';
  const ganWx = GAN_WU_XING[dayGan] || '';

  const subGeju = analyzeSanChuanGeju(sanChuan, dayGan);

  if (men === '贼克') {
    const isZei = siKe.some(ke => ke.direction === '下贼上' && ke.shang === sanChuan.chu);
    if (isZei) {
      return {
        name: '重审',
        level: '小凶',
        summary: '下贼上，事从内起，须反复审视方可',
        detail: '重审课，如臣子复审君命，事有反复。下贼上为逆，须谨慎行事，历经曲折方得成功。宜守不宜进。',
        subGeju
      };
    }
    return {
      name: '元首',
      level: '吉',
      summary: '上克下，尊伐卑，事顺利',
      detail: '元首课，上克下为顺，如君令臣、尊制卑。凡事顺遂，谋为有成。为九宗门第一吉课。',
      subGeju
    };
  }

  if (men === '比用') {
    const isZei = siKe.some(ke => ke.direction === '下贼上' && ke.shang === sanChuan.chu);
    if (isZei) {
      return {
        name: '知一（重审）',
        level: '小凶',
        summary: '比用取下贼上，事有两端取其一，从逆',
        detail: '知一课，多克之中取与日干比和者为用。此课取下贼上，事有反复，须择善而从。',
        subGeju
      };
    }
    return {
      name: '知一',
      level: '平',
      summary: '比者亲也，事有两端取其一',
      detail: '知一课，多克之中取与日干比和者为用。事有二途，须择善而从。',
      subGeju
    };
  }

  if (men === '涉害') {
    const chuType = getZhiType(sanChuan.chu);
    const xiaType = siKe.filter(ke => hasKe(ke) && ke.shang === sanChuan.chu).map(ke => getZhiType(ke.xia))[0];
    if (xiaType === '孟') {
      return {
        name: '见机',
        level: '小吉',
        summary: '涉害取孟位，见机行事',
        detail: '见机课，涉害深浅相同取孟位为用。孟为长生之地，事须及早见机而作，先发制人。',
        subGeju
      };
    }
    if (xiaType === '仲') {
      return {
        name: '察微',
        level: '平',
        summary: '涉害取仲位，须察微知著',
        detail: '察微课，涉害深浅相同取仲位为用。仲为帝旺之地，事须明察秋毫，审慎而行。',
        subGeju
      };
    }
    if (xiaType === '季') {
      return {
        name: '缠绵',
        level: '小凶',
        summary: '涉害取季位，事多缠绵',
        detail: '缠绵课，涉害深浅相同取季位为用。季为墓库之地，事多拖延纠缠。',
        subGeju
      };
    }
    if (chuType === '孟') {
      return {
        name: '见机',
        level: '小吉',
        summary: '涉害取孟位，见机行事',
        detail: '见机课，涉害深浅相同取孟位为用。孟为长生之地，事须及早见机而作，先发制人。',
        subGeju
      };
    }
    if (chuType === '仲') {
      return {
        name: '察微',
        level: '平',
        summary: '涉害取仲位，须察微知著',
        detail: '察微课，涉害深浅相同取仲位为用。仲为帝旺之地，事须明察秋毫，审慎而行。',
        subGeju
      };
    }
    return {
      name: '缠绵',
      level: '小凶',
      summary: '涉害取季位，事多缠绵',
      detail: '缠绵课，涉害深浅相同取季位为用。季为墓库之地，事多拖延纠缠。',
      subGeju
    };
  }

  if (men === '蒿矢') {
    return {
      name: '蒿矢',
      level: '小凶',
      summary: '上神克日如蒿矢，力弱虚惊',
      detail: '蒿矢课，上神遥克日干，力弱如蒿草为矢。主虚惊不实，虽凶亦浅。',
      subGeju
    };
  }

  if (men === '弹射') {
    return {
      name: '弹射',
      level: '小凶',
      summary: '日克上神如弹射，主动出击',
      detail: '弹射课，日干遥克上神，如弹丸射远。主主动行事但力有不逮。',
      subGeju
    };
  }

  if (men === '昴星') {
    return {
      name: '昴星',
      level: '凶',
      summary: '四方无克，昴星为用，事多惊恐',
      detail: '昴星课，四课无克又无遥克，取酉为用。主惊恐虚惊，进退两难。',
      subGeju
    };
  }

  if (men === '别责') {
    return {
      name: '别责',
      level: '凶',
      summary: '四课不全，另寻出路',
      detail: '别责课，四课不备，取合干寄宫上神为用。主事有欠缺，须另辟蹊径。',
      subGeju
    };
  }

  if (men === '八专') {
    return {
      name: '八专',
      level: '凶',
      summary: '干支同位，阴阳不分',
      detail: '八专课，日干寄宫与日支同位，阴阳不分。主事多牵连不分，或暧昧不明。',
      subGeju
    };
  }

  if (men === '伏吟') {
    const ganYy = GAN_YIN_YANG[dayGan];
    const hasKeZei = siKe.some(ke => hasKe(ke));
    if (hasKeZei) {
      return {
        name: '伏吟有克',
        level: '平',
        summary: '伏吟有克，事虽停滞而有端绪',
        detail: '伏吟课天盘地盘相同，主事停滞不前。但有克贼可取，尚有转机。',
        subGeju
      };
    }
    if (ganYy === '阳') {
      return {
        name: '自任',
        level: '凶',
        summary: '伏吟阳日无克，过刚自任',
        detail: '自任课，伏吟阳日无克，取日干寄宫为用。过刚易折，须防自大招祸。',
        subGeju
      };
    }
    return {
      name: '自信',
      level: '小凶',
      summary: '伏吟阴日无克，包裹难行',
      detail: '自信课，伏吟阴日无克，取日支为用。事情停滞，宜静不宜动。',
      subGeju
    };
  }

  if (men === '返吟') {
    const hasKeZei = siKe.some(ke => hasKe(ke));
    if (hasKeZei) {
      return {
        name: '返吟有克',
        level: '平',
        summary: '返吟有克，事反复而有端绪',
        detail: '返吟课天盘地盘对冲，主事反复来去。有克可取，尚可把握。',
        subGeju
      };
    }
    return {
      name: '无依',
      level: '凶',
      summary: '返吟无克，事无所依',
      detail: '无依课，返吟无克，取驿马为用。事情反复无常，来去不定。',
      subGeju
    };
  }

  if (wuxingRelation(chuWx, zhongWx) === '生' && wuxingRelation(zhongWx, moWx) === '生') {
    return {
      name: '三传递生',
      level: '大吉',
      summary: '初生中、中生末，递相生助',
      detail: '三传递生，主扶助相生，有贵人接引，事事顺遂。',
      subGeju
    };
  }

  if (wuxingRelation(chuWx, zhongWx) === '克' && wuxingRelation(zhongWx, moWx) === '克') {
    return {
      name: '三传递克',
      level: '大凶',
      summary: '初克中、中克末，递相克害',
      detail: '三传递克，主层层克制，事事受阻，须防连累。',
      subGeju
    };
  }

  if (wuxingRelation(moWx, chuWx) === '生') {
    return {
      name: '始败终成',
      level: '小吉',
      summary: '先难后易，终有转机',
      detail: '末传生初传，事情起初困难，终得成就。',
      subGeju
    };
  }

  if (wuxingRelation(chuWx, ganWx) === '克') {
    return {
      name: '初克日',
      level: '小凶',
      summary: '初传克日，事有阻滞',
      detail: '初传克日干，事情开端不利，须防阻碍。',
      subGeju
    };
  }

  if (wuxingRelation(chuWx, ganWx) === '生') {
    return {
      name: '初生日',
      level: '吉',
      summary: '初传生助日干，事有扶助',
      detail: '初传生助日干，事情开端有人帮扶，较为顺利。',
      subGeju
    };
  }

  return {
    name: men || '一般',
    level: '平',
    summary: '吉凶参半，需细审',
    detail: '课体一般，需综合三传四课天将判断。',
    subGeju
  };
}

// ============================================================
// 完整排盘
// ============================================================

export interface DaLiuRenResult {
  solarDate: string;
  lunarDate: string;
  dayGan: string;
  dayZhi: string;
  dayGanZhi: string;
  shiZhi: string;
  yueJiang: { name: string; zhi: string };
  zhongQi: string;
  diPan: string[];
  tianPan: string[];
  siKe: Ke[];
  sanChuan: Chuan;
  tianJiangArr: string[];
  guiDirection: '顺' | '逆';
  keTi: KeTi;
  siZhu: SiZhu;
}

export function calculateDaLiuRen(date: Date, shichen?: string): DaLiuRenResult {
  const solar = Solar.fromDate(date);
  const lunar = Lunar.fromSolar(solar);

  const { gan: dayGan, zhi: dayZhi } = getRiGanZhi(date);
  const dayGanZhi = `${dayGan}${dayZhi}`;
  const shiZhi = shichen || getShiZhi(date);

  // 月将
  const yueJiangZhi = getYueJiangZhi(date);
  const yueJiangInfo = YUE_JIANG.find(yj => yj.zhi === yueJiangZhi);

  // 中气
  const zhongQi = getZhongQi(date);

  // 天盘
  const tianPan = buildTianPan(yueJiangZhi, shiZhi);
  const diPan = DI_ZHI.slice();

  // 四课
  const siKe = calculateSiKe(dayGan, dayZhi, tianPan);

  // 三传
  const sanChuan = calculateSanChuan(siKe, dayGan, dayZhi, tianPan);

  // 天将
  // 贵人定局给出的是贵人的地支，需要找到该地支在天盘上的位置
  const guiZhi = getGuiZhi(dayGan, shiZhi);
  // 天盘上贵人所在的地盘位置
  const guiPosOnEarth = tianPan.indexOf(guiZhi);
  const guiShunSet = new Set([9, 10, 11, 0, 1, 2]);
  const guiDirection: '顺' | '逆' = guiShunSet.has(guiPosOnEarth) ? '顺' : '逆';
  const tianJiangArr = arrangeTianJiangByPos(guiPosOnEarth);

  // 课体
  const keTi = judgeKeTi(sanChuan, siKe, dayGan, sanChuan.men);

  const lunarDateStr = `${lunar.getYearInChinese()}年 ${lunar.getMonthInChinese()}月 ${lunar.getDayInChinese()}日`;

  // 四柱
  const siZhu = getSiZhu(date, shiZhi);

  return {
    solarDate: solar.toYmd(),
    lunarDate: lunarDateStr,
    dayGan,
    dayZhi,
    dayGanZhi,
    shiZhi,
    yueJiang: { name: yueJiangInfo?.name || '', zhi: yueJiangZhi },
    zhongQi,
    diPan,
    tianPan,
    siKe,
    sanChuan,
    tianJiangArr,
    guiDirection,
    keTi,
    siZhu,
  };
}

// ============================================================
// 辅助函数
// ============================================================

export function getSanChuanTianJiang(sanChuan: Chuan, tianJiangArr: string[], tianPan: string[]): { chu: string; zhong: string; mo: string } {
  return {
    chu: tianJiangArr[tianPan.indexOf(sanChuan.chu)] || '—',
    zhong: tianJiangArr[tianPan.indexOf(sanChuan.zhong)] || '—',
    mo: tianJiangArr[tianPan.indexOf(sanChuan.mo)] || '—',
  };
}

export function getSanChuanWuXing(sanChuan: Chuan): { chu: string; zhong: string; mo: string } {
  return {
    chu: ZHI_WU_XING[sanChuan.chu] || '—',
    zhong: ZHI_WU_XING[sanChuan.zhong] || '—',
    mo: ZHI_WU_XING[sanChuan.mo] || '—',
  };
}

export function getTianJiangInfo(name: string) {
  return TIAN_JIANG.find(tj => tj.name === name);
}

// 获取长生状态
export function getChangSheng(gan: string, zhi: string): string | null {
  const wx = GAN_WU_XING[gan];
  if (!wx || !CHANG_SHENG[wx]) return null;
  const cs = CHANG_SHENG[wx];
  for (const [key, value] of Object.entries(cs)) {
    if (value === zhi) return key;
  }
  return null;
}

// ============================================================
// 天将临位详解
// ============================================================

export interface TianJiangLinWei {
  position: string;
  tianJiang: string;
  tianPanZhi: string;
  diPanZhi: string;
  relation: string;
  desc: string;
}

export function getTianJiangLinWeiDetail(tianPan: string[], tianJiangArr: string[]): TianJiangLinWei[] {
  const result: TianJiangLinWei[] = [];

  for (let i = 0; i < 12; i++) {
    const diZhi = DI_ZHI[i];
    const tianPanZhi = tianPan[i];
    const tianJiang = tianJiangArr[i];
    const tjInfo = TIAN_JIANG.find(tj => tj.name === tianJiang);
    const diWx = ZHI_WU_XING[diZhi];
    const tianWx = ZHI_WU_XING[tianPanZhi];

    let relation = '';
    if (tianPanZhi === diZhi) {
      relation = '伏吟';
    } else if (ZHI_CHONG[tianPanZhi] === diZhi) {
      relation = '返吟';
    } else if (ZHI_HE[diZhi]?.includes(tianPanZhi)) {
      relation = '三合';
    } else {
      const wxRel = wuxingRelation(tianWx, diWx);
      if (wxRel) relation = wxRel;
    }

    let desc = '';
    if (tjInfo) {
      desc = `${tianJiang}临${diZhi}，${tjInfo.desc}`;
      if (tianJiang === '贵人') {
        desc += `。贵人临${diZhi}，主有贵人相助`;
      } else if (tianJiang === '白虎') {
        desc += `。白虎临${diZhi}，主血光凶险`;
      } else if (tianJiang === '青龙') {
        desc += `。青龙临${diZhi}，主喜庆财利`;
      }
    }

    result.push({
      position: diZhi,
      tianJiang,
      tianPanZhi,
      diPanZhi: diZhi,
      relation,
      desc,
    });
  }

  return result;
}

// ============================================================
// 类神取法
// ============================================================

export interface LeiShen {
  name: string;
  category: string;
  zhiList: string[];
  desc: string;
}

export const LEI_SHEN: LeiShen[] = [
  { name: '日干类', category: '日', zhiList: [], desc: '日干本身为类神，代表求测者自身' },
  { name: '日支类', category: '日', zhiList: [], desc: '日支为类神，代表对方或事体' },
  { name: '父母类', category: '生我', zhiList: [], desc: '生我者为父母，主长辈、文书、庇护' },
  { name: '兄弟类', category: '比', zhiList: [], desc: '比和者为兄弟，主同辈、竞争、合作' },
  { name: '妻财类', category: '我克', zhiList: [], desc: '我克者为妻财，主财利、欲望、下属' },
  { name: '子孙类', category: '我生', zhiList: [], desc: '我生者为子孙，主晚辈、解忧、福德' },
  { name: '官鬼类', category: '克我', zhiList: [], desc: '克我者为官鬼，主官讼、疾病、灾祸' },
];

export function getLeiShen(dayGan: string): LeiShen[] {
  const ganWx = GAN_WU_XING[dayGan];
  const result: LeiShen[] = [];

  for (const ls of LEI_SHEN) {
    const matchedZhi: string[] = [];
    for (const zhi of DI_ZHI) {
      const zhiWx = ZHI_WU_XING[zhi];
      const rel = wuxingRelation(ganWx, zhiWx);
      if (ls.category === '生我' && rel === '被生') matchedZhi.push(zhi);
      if (ls.category === '比' && rel === '比') matchedZhi.push(zhi);
      if (ls.category === '我克' && rel === '克') matchedZhi.push(zhi);
      if (ls.category === '我生' && rel === '生') matchedZhi.push(zhi);
      if (ls.category === '克我' && rel === '被克') matchedZhi.push(zhi);
    }
    result.push({ ...ls, zhiList: matchedZhi });
  }

  result[0].zhiList = [GAN_JI_GONG[dayGan]];
  return result;
}

export function findLeiShenInSanChuan(sanChuan: Chuan, dayGan: string): { chu: string; zhong: string; mo: string } {
  const leiShen = getLeiShen(dayGan);
  const { chu, zhong, mo } = sanChuan;

  const classify = (zhi: string): string => {
    for (const ls of leiShen) {
      if (ls.zhiList.includes(zhi)) return ls.name;
    }
    return '无';
  };

  return {
    chu: classify(chu),
    zhong: classify(zhong),
    mo: classify(mo),
  };
}

// ============================================================
// 天将临位与三传综合解读
// ============================================================

export interface SanChuanDetail {
  chu: { zhi: string; wuxing: string; tianJiang: string; changSheng: string; leiShen: string };
  zhong: { zhi: string; wuxing: string; tianJiang: string; changSheng: string; leiShen: string };
  mo: { zhi: string; wuxing: string; tianJiang: string; changSheng: string; leiShen: string };
}

export function getSanChuanDetail(sanChuan: Chuan, tianJiangArr: string[], tianPan: string[], dayGan: string): SanChuanDetail {
  const leiShenMap = findLeiShenInSanChuan(sanChuan, dayGan);

  const buildDetail = (zhi: string, tjName: string, lsName: string) => ({
    zhi,
    wuxing: ZHI_WU_XING[zhi] || '',
    tianJiang: tjName,
    changSheng: getChangSheng(dayGan, zhi) || '',
    leiShen: lsName,
  });

  return {
    chu: buildDetail(sanChuan.chu, tianJiangArr[tianPan.indexOf(sanChuan.chu)] || '', leiShenMap.chu),
    zhong: buildDetail(sanChuan.zhong, tianJiangArr[tianPan.indexOf(sanChuan.zhong)] || '', leiShenMap.zhong),
    mo: buildDetail(sanChuan.mo, tianJiangArr[tianPan.indexOf(sanChuan.mo)] || '', leiShenMap.mo),
  };
}
