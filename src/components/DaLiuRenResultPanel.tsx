import React from 'react';
import {
  DaLiuRenResult,
  TIAN_JIANG,
  ZHI_WU_XING,
  GAN_WU_XING,
  ZHI_CHONG,
  ZHI_LIU_HE,
  ZHI_LIU_HAI,
  ZHI_PO,
  ZHI_AN_HE,
  GAN_WU_HE,
  ZHI_CANG_GAN,
  canHuaQi,
  getSanChuanTianJiang,
  getSanChuanWuXing,
  wuxingRelation,
  getLeiShen,
  getSanChuanDetail,
  isKongWang,
} from '../utils/daLiuRen';
import AIAnalysisButton from './AIAnalysisButton';
import AISettingsButton from './AISettingsButton';
import { generateDaLiuRenPrompt } from '../utils/aiPrompt';

interface DaLiuRenResultPanelProps {
  result: DaLiuRenResult;
}

const DaLiuRenResultPanel: React.FC<DaLiuRenResultPanelProps> = ({ result }) => {
  const { keTi, sanChuan, dayGan } = result;
  const scTianJiang = getSanChuanTianJiang(sanChuan, result.tianJiangArr, result.tianPan);
  const scWuXing = getSanChuanWuXing(sanChuan);
  const ganWx = GAN_WU_XING[result.dayGan];
  const leiShenList = getLeiShen(dayGan);
  const scDetail = getSanChuanDetail(sanChuan, result.tianJiangArr, result.tianPan, dayGan);

  const levelBg = keTi.level === '大吉' ? 'bg-green-50 border-green-200' :
    keTi.level === '吉' ? 'bg-emerald-50 border-emerald-200' :
    keTi.level === '小吉' ? 'bg-teal-50 border-teal-200' :
    keTi.level === '大凶' ? 'bg-red-50 border-red-200' :
    keTi.level === '凶' ? 'bg-orange-50 border-orange-200' :
    keTi.level === '小凶' ? 'bg-amber-50 border-amber-200' :
    'bg-gray-50 border-gray-200';

  const levelColor = keTi.level === '大吉' || keTi.level === '吉' ? 'text-red-700' :
    keTi.level === '小吉' ? 'text-red-600' :
    keTi.level === '大凶' || keTi.level === '凶' ? 'text-red-700' :
    keTi.level === '小凶' ? 'text-orange-600' : 'text-gray-600';

  // 三传与日干的关系
  const chuRelGan = wuxingRelation(scWuXing.chu, ganWx);
  const zhongRelGan = wuxingRelation(scWuXing.zhong, ganWx);
  const moRelGan = wuxingRelation(scWuXing.mo, ganWx);

  // 检查是否有冲
  const chuChong = ZHI_CHONG[sanChuan.chu] === sanChuan.zhong;
  const zhongChong = ZHI_CHONG[sanChuan.zhong] === sanChuan.mo;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">大六壬排盘结果</h3>

      {/* 基本信息 */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">公历日期</span>
          <span className="font-medium text-gray-800">{result.solarDate}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">农历日期</span>
          <span className="font-medium text-gray-800">{result.lunarDate}</span>
        </div>

        {/* 四柱显示 */}
        <div className="py-2 border-b border-gray-100">
          <div className="text-gray-600 mb-2">四柱</div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '年柱', value: result.siZhu.year },
              { label: '月柱', value: result.siZhu.month },
              { label: '日柱', value: result.siZhu.day },
              { label: '时柱', value: result.siZhu.hour },
            ].map((zhu) => (
              <div key={zhu.label} className="text-center bg-indigo-50 rounded-lg p-2">
                <div className="text-xs text-gray-500 mb-1">{zhu.label}</div>
                <div className="font-bold text-gray-800 text-sm">{zhu.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {GAN_WU_XING[zhu.value[0]]}·{ZHI_WU_XING[zhu.value[1]]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">日干支</span>
          <span className="font-medium text-gray-800">
            {result.dayGanZhi}
            <span className="text-sm text-gray-500 ml-2">
              （{GAN_WU_XING[result.dayGan]}·{ZHI_WU_XING[result.dayZhi]}）
            </span>
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">占时</span>
          <span className="font-medium text-gray-800">{result.shiZhi}时</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">月将</span>
          <span className="font-medium text-gray-800">
            {result.yueJiang.name}（{result.yueJiang.zhi}）
            <span className="text-xs text-gray-400 ml-1">中气{result.zhongQi}</span>
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">贵人方向</span>
          <span className="font-medium text-gray-800">
            {result.guiDirection === '顺' ? '顺行' : '逆行'}
            <span className="text-xs text-gray-400 ml-1">
              （{result.guiDirection === '顺' ? '亥子丑寅卯辰' : '巳午未申酉戌'}）
            </span>
          </span>
        </div>
      </div>

      {/* 课体吉凶 */}
      <div className={`text-center py-4 rounded-lg mb-6 border-2 ${levelBg}`}>
        <div className="text-lg font-bold text-indigo-700 mb-1">课体：{keTi.name}</div>
        <div className={`text-3xl font-bold mb-1 ${levelColor}`}>{keTi.level}</div>
        <div className="text-gray-600">{keTi.summary}</div>
      </div>

      {/* 课体详解 */}
      <div className="bg-indigo-50 rounded-lg p-4 mb-4">
        <h4 className="font-bold text-indigo-800 mb-2">课体详解</h4>
        <p className="text-sm text-gray-700">{keTi.detail}</p>
      </div>

      {/* 附加格局 */}
      {keTi.subGeju && keTi.subGeju.length > 0 && (
        <div className="bg-purple-50 rounded-lg p-4 mb-4">
          <h4 className="font-bold text-purple-800 mb-2">附加格局</h4>
          <div className="flex flex-wrap gap-2">
            {keTi.subGeju.map((gj, idx) => (
              <span key={idx} className={`px-2 py-1 rounded text-xs font-medium ${
                gj.includes('生') ? 'bg-green-100 text-green-700' :
                gj.includes('克') ? 'bg-red-100 text-red-700' :
                gj.includes('冲') ? 'bg-orange-100 text-orange-700' :
                gj.includes('刑') ? 'bg-red-100 text-red-700' :
                gj.includes('合') ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {gj}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 类神取法 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-bold text-gray-800 mb-3">类神取法</h4>
        <div className="space-y-2.5">
          {leiShenList.filter(ls => ls.zhiList.length > 0).map((ls) => (
            <div key={ls.name} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 text-sm">
              <div className="font-medium text-gray-700 w-16 shrink-0">{ls.name}</div>
              <div className="text-gray-400 shrink-0 hidden sm:block">→</div>
              <div className="flex gap-1 flex-wrap sm:flex-nowrap overflow-x-auto whitespace-nowrap py-1">
                {ls.zhiList.map(z => {
                  const isChu = sanChuan.chu === z;
                  const isZhong = sanChuan.zhong === z;
                  const isMo = sanChuan.mo === z;
                  return (
                    <span key={z} className={`px-1.5 py-0.5 rounded text-xs ${isChu || isZhong || isMo ? 'bg-red-100 text-red-700 font-bold' : 'bg-gray-100 text-gray-600'}`}>
                      {z}{(isChu || isZhong || isMo) && '◆'}
                    </span>
                  );
                })}
              </div>
              <div className="text-xs text-gray-400 ml-0 sm:ml-2 shrink-0">{ls.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 三传详解 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-bold text-gray-800 mb-3">三传详解</h4>
        <div className="grid grid-cols-3 gap-3 text-sm">
          {[
            { label: '初传', detail: scDetail.chu },
            { label: '中传', detail: scDetail.zhong },
            { label: '末传', detail: scDetail.mo },
          ].map((item) => (
            <div key={item.label} className="text-center p-2 bg-white rounded border">
              <div className="text-xs text-gray-500 font-medium">{item.label}</div>
              <div className="font-bold text-gray-800 text-lg">{item.detail.zhi}</div>
              <div className="text-xs text-gray-400">{item.detail.wuxing}</div>
              <div className="text-xs text-indigo-600">{item.detail.tianJiang}</div>
              <div className="text-xs text-purple-600">{item.detail.changSheng || '—'}</div>
              <div className="text-xs text-amber-600">{item.detail.leiShen}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 三传与日干关系 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-bold text-gray-800 mb-3">三传与日干关系</h4>
        <div className="grid grid-cols-3 gap-3 text-sm">
          {[
            { label: '初传', zhi: sanChuan.chu, wx: scWuXing.chu, tianJiang: scTianJiang.chu, rel: chuRelGan },
            { label: '中传', zhi: sanChuan.zhong, wx: scWuXing.zhong, tianJiang: scTianJiang.zhong, rel: zhongRelGan },
            { label: '末传', zhi: sanChuan.mo, wx: scWuXing.mo, tianJiang: scTianJiang.mo, rel: moRelGan },
          ].map((item) => {
            const relColor = item.rel === '生' ? 'text-green-600' :
              item.rel === '克' ? 'text-red-600' :
              item.rel === '被生' ? 'text-blue-600' :
              item.rel === '被克' ? 'text-orange-600' : 'text-gray-500';
            const info = TIAN_JIANG.find(tj => tj.name === item.tianJiang);

            return (
              <div key={item.label} className="text-center p-2 bg-white rounded border">
                <div className={`text-xs ${info?.nature === '吉' ? 'text-red-600' : 'text-gray-700'} font-medium`}>
                  {item.label}（{info?.nature === '吉' ? '吉' : '凶'}）
                </div>
                <div className="font-bold text-gray-800">{item.zhi}</div>
                <div className="text-xs text-gray-400">{item.wx}</div>
                <div className={`text-xs font-medium ${relColor} mt-1`}>
                  {item.rel || '比'}日干
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 三传间关系 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-bold text-gray-800 mb-3">三传间关系</h4>
        <div className="flex items-center justify-center gap-2 text-sm">
          <div className="text-center">
            <div className="text-xs text-gray-500">初→中</div>
            <div className={`font-medium ${wuxingRelation(scWuXing.chu, scWuXing.zhong) === '生' ? 'text-green-600' : wuxingRelation(scWuXing.chu, scWuXing.zhong) === '克' ? 'text-red-600' : 'text-gray-600'}`}>
              {wuxingRelation(scWuXing.chu, scWuXing.zhong) || '比'}
              {chuChong && <span className="text-xs text-red-500 ml-1">（冲）</span>}
            </div>
          </div>
          <div className="text-gray-400">→</div>
          <div className="text-center">
            <div className="text-xs text-gray-500">中→末</div>
            <div className={`font-medium ${wuxingRelation(scWuXing.zhong, scWuXing.mo) === '生' ? 'text-green-600' : wuxingRelation(scWuXing.zhong, scWuXing.mo) === '克' ? 'text-red-600' : 'text-gray-600'}`}>
              {wuxingRelation(scWuXing.zhong, scWuXing.mo) || '比'}
              {zhongChong && <span className="text-xs text-red-500 ml-1">（冲）</span>}
            </div>
          </div>
          <div className="text-gray-400">→</div>
          <div className="text-center">
            <div className="text-xs text-gray-500">末→初</div>
            <div className={`font-medium ${wuxingRelation(scWuXing.mo, scWuXing.chu) === '生' ? 'text-green-600' : wuxingRelation(scWuXing.mo, scWuXing.chu) === '克' ? 'text-red-600' : 'text-gray-600'}`}>
              {wuxingRelation(scWuXing.mo, scWuXing.chu) || '比'}
            </div>
          </div>
        </div>
      </div>

      {/* 天将排列 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-bold text-gray-800 mb-3">天将排列</h4>
        <div className="grid grid-cols-6 gap-2 text-xs">
          {result.tianJiangArr.map((jiang, idx) => {
            const jiangInfo = TIAN_JIANG.find(tj => tj.name === jiang);
            const isGood = jiangInfo?.nature === '吉';
            const zhi = result.tianPan[idx];
            const isChu = zhi === sanChuan.chu;
            const isZhong = zhi === sanChuan.zhong;
            const isMo = zhi === sanChuan.mo;
            const isSC = isChu || isZhong || isMo;
            let scLabel = '';
            if (isChu && isZhong && isMo) scLabel = '初中末';
            else if (isChu && isZhong) scLabel = '初中';
            else if (isChu && isMo) scLabel = '初末';
            else if (isZhong && isMo) scLabel = '中末';
            else if (isChu) scLabel = '初';
            else if (isZhong) scLabel = '中';
            else if (isMo) scLabel = '末';
            return (
              <div key={idx} className={`p-2 rounded border text-center relative ${isSC ? 'ring-2 ring-red-400 ring-offset-1' : ''} ${
                isGood ? 'bg-red-50 border-red-200' : 'bg-gray-100 border-gray-300'
              }`}>
                {scLabel && (
                  <span className={`absolute -top-1 -right-1 bg-red-500 text-white rounded-full flex items-center justify-center text-[7px] font-bold leading-none ${scLabel.length >= 3 ? 'w-auto px-1 h-4' : scLabel.length === 2 ? 'w-4 h-4' : 'w-3.5 h-3.5'}`}>
                    {scLabel}
                  </span>
                )}
                <div className="font-bold">{jiang}</div>
                <div className="text-gray-500">{zhi}</div>
                <div className={`font-medium ${isGood ? 'text-red-600' : 'text-gray-800'}`}>
                  {jiangInfo?.nature}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 德煞信息 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-bold text-gray-800 mb-3">德煞</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          {[
            { label: '天德', value: result.deSha.tianDe, color: 'text-green-600' },
            { label: '月德', value: result.deSha.yueDe, color: 'text-green-600' },
            { label: '日德', value: `${result.deSha.riDe}（${result.dayGan}禄）`, color: 'text-green-600' },
            { label: '驿马', value: result.deSha.yiMa, color: 'text-blue-600' },
            { label: '桃花', value: result.deSha.taoHua, color: 'text-pink-600' },
            { label: '华盖', value: result.deSha.huaGai, color: 'text-purple-600' },
            { label: '劫煞', value: result.deSha.jieSha, color: 'text-red-600' },
            { label: '灾煞', value: result.deSha.zaiSha, color: 'text-red-600' },
            { label: '天乙贵人', value: result.deSha.tianYiGuiRen, color: 'text-amber-600' },
            { label: '天干五合', value: result.deSha.ganWuHe.he ? `${result.dayGan}${result.deSha.ganWuHe.he}合化${result.deSha.ganWuHe.huaQi}${canHuaQi(result.dayGan, result.deSha.ganWuHe.he, result.deSha.lunarMonth) ? '（可化）' : '（未化）'}` : '', color: 'text-indigo-600' },
          ].filter(item => item.value).map((item) => (
            <div key={item.label} className="flex items-center gap-2 bg-white rounded px-2 py-1.5 border">
              <span className="text-gray-500 text-xs shrink-0">{item.label}</span>
              <span className={`font-bold ${item.color}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 空亡 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-bold text-gray-800 mb-3">空亡</h4>
        <div className="space-y-2">
          {result.deSha.kongWangDetail.map((kw) => (
            <div key={kw.zhi} className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded font-bold text-lg ${kw.isZhenKong ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                {kw.zhi}
              </span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${kw.isZhenKong ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
                {kw.isZhenKong ? '真空' : '假空'}
              </span>
              <span className="text-xs text-gray-500">{kw.reason.replace(/^[真假]空（/, '').replace('）', '')}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[result.sanChuan.chu, result.sanChuan.zhong, result.sanChuan.mo].map((zhi, idx) => {
            const isKW = isKongWang(zhi, result.dayGan, result.dayZhi);
            const kwDetail = result.deSha.kongWangDetail.find(k => k.zhi === zhi);
            const label = idx === 0 ? '初传' : idx === 1 ? '中传' : '末传';
            return (
              <span key={label} className={`text-xs px-1.5 py-0.5 rounded ${isKW ? (kwDetail?.isZhenKong ? 'bg-red-200 text-red-700 font-bold' : 'bg-amber-200 text-amber-700 font-bold') : 'bg-gray-100 text-gray-500'}`}>
                {label}{zhi}{isKW ? (kwDetail?.isZhenKong ? '（真空）' : '（假空）') : ''}
              </span>
            );
          })}
        </div>
      </div>

      {/* 四课不全提示 */}
      {result.siKeBuQuan.isBuQuan && (
        <div className="bg-amber-50 rounded-lg p-4 mb-4 border border-amber-200">
          <h4 className="font-bold text-amber-800 mb-1">四课不全</h4>
          <p className="text-sm text-amber-700">{result.siKeBuQuan.reason}</p>
        </div>
      )}

      {/* 地支藏干 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-bold text-gray-800 mb-3">地支藏干</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          {[result.sanChuan.chu, result.sanChuan.zhong, result.sanChuan.mo].map((zhi, idx) => {
            const cangGan = ZHI_CANG_GAN[zhi] || [];
            const label = idx === 0 ? '初传' : idx === 1 ? '中传' : '末传';
            return (
              <div key={label} className="bg-white rounded px-3 py-2 border">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gray-500 text-xs">{label}</span>
                  <span className="font-bold text-gray-800">{zhi}</span>
                  <span className="text-xs text-gray-400">（{ZHI_WU_XING[zhi]}）</span>
                </div>
                <div className="flex gap-1">
                  {cangGan.map((gan, gi) => (
                    <span key={gan} className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                      gi === 0 ? 'bg-blue-50 text-blue-700' : gi === 1 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
                    }`}>
                      {gan}{gi === 0 ? '本' : gi === 1 ? '中' : '余'}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 三传刑冲合害 */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-bold text-gray-800 mb-3">三传刑冲合害</h4>
        <div className="grid grid-cols-1 gap-2 text-sm">
          {[
            { label: '初→中', from: sanChuan.chu, to: sanChuan.zhong },
            { label: '中→末', from: sanChuan.zhong, to: sanChuan.mo },
            { label: '初→末', from: sanChuan.chu, to: sanChuan.mo },
          ].map((pair) => {
            const tags: string[] = [];
            if (ZHI_CHONG[pair.from] === pair.to) tags.push('冲');
            if (ZHI_LIU_HE[pair.from]?.he === pair.to) tags.push(`合${ZHI_LIU_HE[pair.from].wuxing}`);
            if (ZHI_AN_HE[pair.from] === pair.to) tags.push('暗合');
            if (ZHI_LIU_HAI[pair.from] === pair.to) tags.push('害');
            if (ZHI_PO[pair.from] === pair.to) tags.push('破');
            const xingResult = (() => {
              const xingMap: Record<string, string> = {
                '子': '卯', '卯': '子', '寅': '巳', '巳': '申', '申': '寅',
                '丑': '戌', '戌': '未', '未': '丑',
              };
              return xingMap[pair.from] === pair.to ? '刑' : '';
            })();
            if (xingResult) tags.push(xingResult);
            if (new Set(['辰', '午', '酉', '亥']).has(pair.from) && pair.from === pair.to) tags.push('自刑');

            const wxRel = wuxingRelation(ZHI_WU_XING[pair.from] || '', ZHI_WU_XING[pair.to] || '');
            if (wxRel === '生') tags.push('生');
            if (wxRel === '克') tags.push('克');

            return (
              <div key={pair.label} className="flex items-center gap-2 bg-white rounded px-3 py-2 border">
                <span className="text-gray-500 text-xs shrink-0">{pair.label}</span>
                <span className="font-bold text-gray-800">{pair.from}→{pair.to}</span>
                <div className="flex gap-1 flex-wrap">
                  {tags.length > 0 ? tags.map((tag, i) => (
                    <span key={i} className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                      tag === '冲' ? 'bg-red-100 text-red-700' :
                      tag.startsWith('合') ? 'bg-blue-100 text-blue-700' :
                      tag === '暗合' ? 'bg-indigo-100 text-indigo-700' :
                      tag === '害' ? 'bg-orange-100 text-orange-700' :
                      tag === '破' ? 'bg-yellow-100 text-yellow-700' :
                      tag === '刑' || tag === '自刑' ? 'bg-red-100 text-red-700' :
                      tag === '生' ? 'bg-green-100 text-green-700' :
                      tag === '克' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {tag}
                    </span>
                  )) : (
                    <span className="text-xs text-gray-400">比和</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI 分析功能 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">AI 分析</h3>
          <AISettingsButton />
        </div>
        <AIAnalysisButton prompt={generateDaLiuRenPrompt(result)} />
      </div>
    </div>
  );
};

const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export default DaLiuRenResultPanel;
