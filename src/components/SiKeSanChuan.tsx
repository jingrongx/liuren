import React from 'react';
import {
  Ke,
  Chuan,
  DI_ZHI,
  ZHI_WU_XING,
  GAN_WU_XING,
  GAN_JI_GONG,
  TIAN_JIANG,
  wuxingRelation,
  getSanChuanTianJiang,
  getSanChuanWuXing,
  getTianJiangInfo,
} from '../utils/daLiuRen';

interface SiKeSanChuanProps {
  siKe: Ke[];
  sanChuan: Chuan;
  dayGan: string;
  dayZhi: string;
  tianJiangArr: string[];
  tianPan: string[];
}

function getWuXingBadge(wuxing: string): string {
  switch (wuxing) {
    case '木': return 'bg-green-100 text-green-800';
    case '火': return 'bg-red-100 text-red-800';
    case '土': return 'bg-yellow-100 text-yellow-800';
    case '金': return 'bg-gray-200 text-gray-700';
    case '水': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-600';
  }
}

function getGuanxiColor(guanxi: string, direction: string): string {
  if (direction === '上克下') return 'bg-red-50 border-red-200';
  if (direction === '下贼上') return 'bg-orange-50 border-orange-200';
  if (direction === '上生下') return 'bg-blue-50 border-blue-200';
  if (direction === '下生上') return 'bg-cyan-50 border-cyan-200';
  return 'bg-gray-50 border-gray-200';
}

function getGuanxiText(guanxi: string, direction: string): string {
  if (direction === '上克下') return '克';
  if (direction === '下贼上') return '贼';
  if (direction === '上生下') return '生';
  if (direction === '下生上') return '被生';
  return guanxi;
}

function getTianJiangForSiKe(shang: string, tianPan: string[], tianJiangArr: string[]): string {
  const index = tianPan.indexOf(shang);
  return tianJiangArr[index] || '';
}

const SiKeSanChuan: React.FC<SiKeSanChuanProps> = ({
  siKe,
  sanChuan,
  dayGan,
  dayZhi,
  tianJiangArr,
  tianPan,
}) => {
  const scTianJiang = getSanChuanTianJiang(sanChuan, tianJiangArr, tianPan);
  const scWuXing = getSanChuanWuXing(sanChuan);

  return (
    <div className="space-y-4">
      {/* 四课 */}
      <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-amber-200">
        <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">四课</h3>
        <div className="grid grid-cols-4 gap-2">
          {siKe.map((ke, i) => {
            const shangWx = ZHI_WU_XING[ke.shang] || '';
            const xiaWx = ZHI_WU_XING[ke.xia] || '';

            return (
              <div key={i} className={`border rounded-lg p-2 ${getGuanxiColor(ke.guanxi, ke.direction)}`}>
                <div className="text-center mb-1">
                  <div className="text-xs font-bold text-amber-700">{i === 0 ? '一课' : i === 1 ? '二课' : i === 2 ? '三课' : '四课'}</div>
                </div>
                {/* 天将 */}
                <div className="text-center mb-1">
                  <div className="text-xs text-purple-600 font-medium">{getTianJiangForSiKe(ke.shang, tianPan, tianJiangArr)}</div>
                </div>
                {/* 上神 */}
                <div className="text-center mb-1">
                  <div className={`text-sm font-bold px-2 py-1 rounded ${getWuXingBadge(shangWx)}`}>
                    {ke.shang}
                  </div>
                </div>
                {/* 下神 */}
                <div className="text-center">
                  <div className={`text-sm font-bold px-2 py-1 rounded bg-white border border-gray-200 text-gray-600`}>
                    {ke.xia}{i === 0 ? `(${dayGan})` : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          日干 {dayGan}（{GAN_WU_XING[dayGan]}·{GAN_YIN_YANG[dayGan]}）寄宫 {GAN_JI_GONG[dayGan]}，日支 {dayZhi}（{ZHI_WU_XING[dayZhi]}）
        </div>
      </div>

      {/* 三传 */}
      <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-indigo-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-800">三传</h3>
          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
            {sanChuan.men}门
          </span>
        </div>

        <div className="flex items-center justify-center gap-4 mb-3">
          {/* 初传 */}
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">初传</div>
            <div className={`text-xl font-bold px-3 py-2 rounded border ${getWuXingBadge(scWuXing.chu)}`}>
              {sanChuan.chu}
            </div>
            <div className="text-xs text-purple-600 mt-1">{scTianJiang.chu}</div>
          </div>

          <div className="text-sm text-gray-400">→</div>

          {/* 中传 */}
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">中传</div>
            <div className={`text-xl font-bold px-3 py-2 rounded border ${getWuXingBadge(scWuXing.zhong)}`}>
              {sanChuan.zhong}
            </div>
            <div className="text-xs text-purple-600 mt-1">{scTianJiang.zhong}</div>
          </div>

          <div className="text-sm text-gray-400">→</div>

          {/* 末传 */}
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">末传</div>
            <div className={`text-xl font-bold px-3 py-2 rounded border ${getWuXingBadge(scWuXing.mo)}`}>
              {sanChuan.mo}
            </div>
            <div className="text-xs text-purple-600 mt-1">{scTianJiang.mo}</div>
          </div>
        </div>

        {/* 取传说明 */}
        <div className="mt-2 text-xs text-gray-600 bg-indigo-50 rounded p-2">
          <span className="font-medium text-indigo-700">取传方法：</span>
          {sanChuan.desc}
        </div>
      </div>
    </div>
  );
};

const GAN_YIN_YANG: Record<string, string> = {
  '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴', '戊': '阳',
  '己': '阴', '庚': '阳', '辛': '阴', '壬': '阳', '癸': '阴'
};

export default SiKeSanChuan;
