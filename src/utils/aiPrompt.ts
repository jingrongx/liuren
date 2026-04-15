import { DaLiuRenResult, GAN_WU_XING, ZHI_WU_XING, TIAN_JIANG, getSanChuanTianJiang, getSanChuanWuXing, getLeiShen, wuxingRelation, getSanChuanDetail } from './daLiuRen';
import { DivinationResult } from './divination';

export function generateDaLiuRenPrompt(result: DaLiuRenResult): string {
  const { keTi, sanChuan, dayGan } = result;
  const scTianJiang = getSanChuanTianJiang(sanChuan, result.tianJiangArr, result.tianPan);
  const scWuXing = getSanChuanWuXing(sanChuan);
  const ganWx = GAN_WU_XING[result.dayGan];
  const leiShenList = getLeiShen(dayGan);
  const scDetail = getSanChuanDetail(sanChuan, result.tianJiangArr, result.tianPan, dayGan);

  const chuRelGan = wuxingRelation(scWuXing.chu, ganWx);
  const zhongRelGan = wuxingRelation(scWuXing.zhong, ganWx);
  const moRelGan = wuxingRelation(scWuXing.mo, ganWx);

  const lines = [
    '你是一位精通大六壬的传统术数专家。请根据以下大六壬排盘的完整数据，用通俗易懂的语言为求测者进行详细解读。',
    '',
    '要求：',
    '1. 用大白话解释，避免堆砌专业术语，如果用到术语要同时用通俗语言解释含义',
    '2. 结合三传、四课、天将、课体等信息综合分析，给出整体判断',
    '3. 分别解读初传（事之始）、中传（事之中）、末传（事之终）的含义和趋势',
    '4. 分析三传与日干的关系对求测者的影响',
    '5. 根据课体吉凶和附加格局，给出具体的建议和注意事项',
    '6. 语言风格：亲切自然，像朋友聊天一样，不要过于严肃或玄乎',
    '',
    '=== 大六壬排盘数据 ===',
    '',
    '## 基本信息',
    `- 公历日期：${result.solarDate}`,
    `- 农历日期：${result.lunarDate}`,
    `- 四柱：${result.siZhu.year}年 ${result.siZhu.month}月 ${result.siZhu.day}日 ${result.siZhu.hour}时`,
    `- 日干支：${result.dayGanZhi}（${GAN_WU_XING[result.dayGan]}·${ZHI_WU_XING[result.dayZhi]}）`,
    `- 占时：${result.shiZhi}时`,
    `- 月将：${result.yueJiang.name}（${result.yueJiang.zhi}），中气${result.zhongQi}`,
    `- 贵人方向：${result.guiDirection === '顺' ? '顺行' : '逆行'}`,
    '',
    '## 课体',
    `- 课体名称：${keTi.name}`,
    `- 吉凶等级：${keTi.level}`,
    `- 简评：${keTi.summary}`,
    `- 详解：${keTi.detail}`,
    keTi.subGeju && keTi.subGeju.length > 0 ? `- 附加格局：${keTi.subGeju.join('、')}` : '',
    '',
    '## 四课',
    ...result.siKe.map((ke, i) => `- 第${i + 1}课（${ke.label}）：上神${ke.shang}（${ZHI_WU_XING[ke.shang]}）${ke.guanxi}${ke.xia}（${ZHI_WU_XING[ke.xia]}），关系为${ke.direction}`),
    '',
    '## 三传',
    `- 取传方法：${sanChuan.men}（${sanChuan.desc}）`,
    `- 初传：${scDetail.chu.zhi}（${scDetail.chu.wuxing}），天将${scDetail.chu.tianJiang}，长生十二神${scDetail.chu.changSheng || '无'}，类神${scDetail.chu.leiShen}`,
    `- 中传：${scDetail.zhong.zhi}（${scDetail.zhong.wuxing}），天将${scDetail.zhong.tianJiang}，长生十二神${scDetail.zhong.changSheng || '无'}，类神${scDetail.zhong.leiShen}`,
    `- 末传：${scDetail.mo.zhi}（${scDetail.mo.wuxing}），天将${scDetail.mo.tianJiang}，长生十二神${scDetail.mo.changSheng || '无'}，类神${scDetail.mo.leiShen}`,
    '',
    '## 三传与日干关系',
    `- 初传${sanChuan.chu}（${scWuXing.chu}）${chuRelGan || '比'}日干${dayGan}（${ganWx}）`,
    `- 中传${sanChuan.zhong}（${scWuXing.zhong}）${zhongRelGan || '比'}日干${dayGan}（${ganWx}）`,
    `- 末传${sanChuan.mo}（${scWuXing.mo}）${moRelGan || '比'}日干${dayGan}（${ganWx}）`,
    '',
    '## 三传间关系',
    `- 初传→中传：${wuxingRelation(scWuXing.chu, scWuXing.zhong) || '比'}`,
    `- 中传→末传：${wuxingRelation(scWuXing.zhong, scWuXing.mo) || '比'}`,
    `- 末传→初传：${wuxingRelation(scWuXing.mo, scWuXing.chu) || '比'}`,
    '',
    '## 类神取法',
    ...leiShenList.filter(ls => ls.zhiList.length > 0).map(ls =>
      `- ${ls.name}（${ls.desc}）：${ls.zhiList.map(z => z + (z === sanChuan.chu || z === sanChuan.zhong || z === sanChuan.mo ? '◆在三传中' : '')).join('、')}`
    ),
    '',
    '## 天将排列',
    ...result.tianJiangArr.map((jiang, idx) => {
      const jiangInfo = TIAN_JIANG.find(tj => tj.name === jiang);
      const zhi = result.tianPan[idx];
      const isSC = zhi === sanChuan.chu || zhi === sanChuan.zhong || zhi === sanChuan.mo;
      return `- ${jiang}临${result.diPan[idx]}（天盘${zhi}）${jiangInfo ? `，${jiangInfo.nature === '吉' ? '吉将' : '凶将'}：${jiangInfo.desc}` : ''}${isSC ? ' ★在三传中' : ''}`;
    }),
    '',
    '请根据以上完整数据，给出详细、通俗的解读。',
  ];

  return lines.filter(l => l !== undefined).join('\n');
}

export function generateXiaoLiuRenPrompt(result: DivinationResult): string {
  const lines = [
    '你是一位精通小六壬的传统术数专家。请根据以下小六壬占卜的完整数据，用通俗易懂的语言为求测者进行详细解读。',
    '',
    '要求：',
    '1. 用大白话解释，避免堆砌专业术语，如果用到术语要同时用通俗语言解释含义',
    '2. 结合卦象的五行属性、吉凶含义进行综合分析',
    '3. 解读三步推算过程中每一步的含义和变化趋势',
    '4. 给出具体的建议和注意事项',
    '5. 语言风格：亲切自然，像朋友聊天一样，不要过于严肃或玄乎',
    '',
    '=== 小六壬占卜数据 ===',
    '',
    '## 基本信息',
    `- 公历日期：${result.solarDate}`,
    `- 农历日期：${result.lunarDate}`,
    `- 占卜时辰：${result.shichen}`,
    '',
    '## 最终卦象',
    `- 卦名：${result.gua.result}`,
    `- 吉凶：${result.gua.desc}`,
    `- 对应卦象：${result.gua.gua}卦`,
    `- 五行属性：${result.gua.element}`,
    '',
    '## 推算过程',
    `- 第一步（从大安起月）：落在【${result.steps.step1.gua.result}】，${result.steps.step1.gua.desc}（${result.steps.step1.gua.gua}卦，${result.steps.step1.gua.element}行）`,
    `- 第二步（从上一步起日）：落在【${result.steps.step2.gua.result}】，${result.steps.step2.gua.desc}（${result.steps.step2.gua.gua}卦，${result.steps.step2.gua.element}行）`,
    `- 第三步（从上一步起时）：落在【${result.steps.step3.gua.result}】，${result.steps.step3.gua.desc}（${result.steps.step3.gua.gua}卦，${result.steps.step3.gua.element}行）`,
    '',
    '## 小六壬六宫含义参考',
    '- 大安：属木，大吉，诸事顺利，安定平稳',
    '- 留连：属木，小凶，事情拖延，纠缠不清',
    '- 速喜：属火，中吉，快速成功，喜事临门',
    '- 赤口：属金，大凶，口舌是非，血光之灾',
    '- 小吉：属水，小吉，平稳顺利，小有收获',
    '- 空亡：属土，大凶，诸事不顺，虚耗无成',
    '',
    '请根据以上完整数据，给出详细、通俗的解读。',
  ];

  return lines.join('\n');
}
