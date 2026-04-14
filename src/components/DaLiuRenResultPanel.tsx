import React from 'react';
import {
  DaLiuRenResult,
  TIAN_JIANG,
  ZHI_WU_XING,
  GAN_WU_XING,
  ZHI_CHONG,
  getSanChuanTianJiang,
  getSanChuanWuXing,
  wuxingRelation,
  getLeiShen,
  getSanChuanDetail,
} from '../utils/daLiuRen';

interface DaLiuRenResultPanelProps {
  result: DaLiuRenResult;
}

const DaLiuRenResultPanel: React.FC<DaLiuRenResultPanelProps> = ({ result }) => {
  const { keTi, sanChuan, dayGan } = result;
  const scTianJiang = getSanChuanTianJiang(sanChuan, result.tianJiangArr);
  const scWuXing = getSanChuanWuXing(sanChuan);
  const ganWx = GAN_WU_XING[result.dayGan];
  const leiShenList = getLeiShen(dayGan);
  const scDetail = getSanChuanDetail(sanChuan, result.tianJiangArr, dayGan);

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
        <div className="space-y-2">
          {leiShenList.filter(ls => ls.zhiList.length > 0).map((ls) => (
            <div key={ls.name} className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-700 w-16">{ls.name}</span>
              <span className="text-gray-400">→</span>
              <span className="flex gap-1">
                {ls.zhiList.map(z => {
                  const isChu = sanChuan.chu === z;
                  const isZhong = sanChuan.zhong === z;
                  const isMo = sanChuan.mo === z;
                  return (
                    <span key={z} className={`px-1.5 py-0.5 rounded text-xs ${
                      isChu || isZhong || isMo ? 'bg-red-100 text-red-700 font-bold' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {z}{(isChu || isZhong || isMo) && '◆'}
                    </span>
                  );
                })}
              </span>
              <span className="text-xs text-gray-400 ml-auto">{ls.desc.slice(0, 8)}</span>
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
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-bold text-gray-800 mb-3">天将排列</h4>
        <div className="grid grid-cols-6 gap-2 text-xs">
          {result.tianJiangArr.map((jiang, idx) => {
            const jiangInfo = TIAN_JIANG.find(tj => tj.name === jiang);
            const isGood = jiangInfo?.nature === '吉';
            const isSC = DI_ZHI[idx] === sanChuan.chu || DI_ZHI[idx] === sanChuan.zhong || DI_ZHI[idx] === sanChuan.mo;
            return (
              <div key={idx} className={`p-2 rounded border text-center ${isSC ? 'ring-2 ring-red-400 ring-offset-1' : ''} ${
                isGood ? 'bg-red-50 border-red-200' : 'bg-gray-100 border-gray-300'
              }`}>
                <div className="font-bold">{jiang}</div>
                <div className="text-gray-500">{DI_ZHI[idx]}</div>
                <div className={`font-medium ${isGood ? 'text-red-600' : 'text-gray-800'}`}>
                  {jiangInfo?.nature}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export default DaLiuRenResultPanel;
