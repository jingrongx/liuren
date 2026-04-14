import React from 'react';
import {
  Ke,
  Chuan,
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

const SiKeSanChuan: React.FC<SiKeSanChuanProps> = ({
  siKe,
  sanChuan,
  dayGan,
  dayZhi,
  tianJiangArr,
}) => {
  const scTianJiang = getSanChuanTianJiang(sanChuan, tianJiangArr);
  const scWuXing = getSanChuanWuXing(sanChuan);

  return (
    <div className="space-y-6">
      {/* 四课 */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-amber-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">四课</h3>
        <div className="grid grid-cols-2 gap-4">
          {siKe.map((ke, i) => {
            const shangWx = ZHI_WU_XING[ke.shang] || '';
            const xiaWx = ZHI_WU_XING[ke.xia] || '';

            return (
              <div key={i} className={`border-2 rounded-lg p-3 ${getGuanxiColor(ke.guanxi, ke.direction)}`}>
                <div className="text-sm font-bold text-amber-700 mb-2">{ke.label}</div>
                <div className="flex items-center justify-center gap-3">
                  <div className="text-center">
                    <div className={`text-2xl font-bold px-3 py-1 rounded ${getWuXingBadge(shangWx)}`}>
                      {ke.shang}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{shangWx}</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg px-2 py-0.5 rounded text-sm font-medium ${
                      ke.direction === '上克下' || ke.direction === '下贼上'
                        ? 'bg-red-100 text-red-700'
                        : ke.direction === '上生下' || ke.direction === '下生上'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getGuanxiText(ke.guanxi, ke.direction)}
                    </div>
                    <div className="text-lg text-gray-400 mt-1">↓</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg px-3 py-1 rounded text-gray-600 bg-white border border-gray-200`}>
                      {ke.xia}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{xiaWx}</div>
                  </div>
                </div>
                <div className={`text-xs text-center mt-2 font-medium ${
                  ke.direction === '上克下' ? 'text-red-600' :
                  ke.direction === '下贼上' ? 'text-orange-600' :
                  ke.direction === '上生下' ? 'text-blue-600' :
                  ke.direction === '下生上' ? 'text-cyan-600' : 'text-gray-500'
                }`}>
                  {ke.direction}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-xs text-gray-500 text-center">
          日干 {dayGan}（{GAN_WU_XING[dayGan]}·{GAN_YIN_YANG[dayGan]}）寄宫 {GAN_JI_GONG[dayGan]}，日支 {dayZhi}（{ZHI_WU_XING[dayZhi]}）
        </div>
      </div>

      {/* 三传 */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">三传</h3>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
            {sanChuan.men}门
          </span>
        </div>

        <div className="flex items-center justify-center gap-4 mb-4">
          {/* 初传 */}
          <div className="text-center">
            <div className="text-xs text-purple-600 font-medium mb-1">{scTianJiang.chu}</div>
            <div className={`text-3xl font-bold px-5 py-3 rounded-lg border-2 border-red-300 ${getWuXingBadge(scWuXing.chu)}`}>
              {sanChuan.chu}
            </div>
            <div className="text-xs text-gray-500 mt-1">初传</div>
            <div className="text-xs text-gray-400">{scWuXing.chu}</div>
          </div>

          <div className="text-lg text-gray-400">→</div>

          {/* 中传 */}
          <div className="text-center">
            <div className="text-xs text-purple-600 font-medium mb-1">{scTianJiang.zhong}</div>
            <div className={`text-3xl font-bold px-5 py-3 rounded-lg border-2 border-amber-300 ${getWuXingBadge(scWuXing.zhong)}`}>
              {sanChuan.zhong}
            </div>
            <div className="text-xs text-gray-500 mt-1">中传</div>
            <div className="text-xs text-gray-400">{scWuXing.zhong}</div>
          </div>

          <div className="text-lg text-gray-400">→</div>

          {/* 末传 */}
          <div className="text-center">
            <div className="text-xs text-purple-600 font-medium mb-1">{scTianJiang.mo}</div>
            <div className={`text-3xl font-bold px-5 py-3 rounded-lg border-2 border-blue-300 ${getWuXingBadge(scWuXing.mo)}`}>
              {sanChuan.mo}
            </div>
            <div className="text-xs text-gray-500 mt-1">末传</div>
            <div className="text-xs text-gray-400">{scWuXing.mo}</div>
          </div>
        </div>

        {/* 天将详情 */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: '初传', name: scTianJiang.chu, chuan: sanChuan.chu },
            { label: '中传', name: scTianJiang.zhong, chuan: sanChuan.zhong },
            { label: '末传', name: scTianJiang.mo, chuan: sanChuan.mo },
          ].map((item) => {
            const info = getTianJiangInfo(item.name);
            return (
              <div key={item.label} className={`text-center p-2 rounded-lg ${
                info?.nature === '吉' ? 'bg-red-50 border border-red-200' : 'bg-gray-100 border border-gray-300'
              }`}>
                <div className="text-xs text-gray-500">{item.label}天将</div>
                <div className={`font-bold ${info?.nature === '吉' ? 'text-red-700' : 'text-gray-800'}`}>
                  {item.name}
                </div>
                <div className="text-xs text-gray-500">{info?.desc}</div>
              </div>
            );
          })}
        </div>

        {/* 取传说明 */}
        <div className="mt-3 text-sm text-gray-600 bg-indigo-50 rounded-lg p-3">
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
