import React from 'react';
import { DI_ZHI, ZHI_WU_XING } from '../utils/daLiuRen';

interface TianDiPanSquareProps {
  diPan: string[];
  tianPan: string[];
  tianJiangArr: string[];
  sanChuan: { chu: string; zhong: string; mo: string };
  siKe: { shang: string; xia: string }[];
}

function getWuXingColor(wuxing: string): string {
  switch (wuxing) {
    case '木': return '#15803d';
    case '火': return '#b91c1c';
    case '土': return '#a16207';
    case '金': return '#4b5563';
    case '水': return '#1d4ed8';
    default: return '#374151';
  }
}

function isSanChuanCheck(zhi: string, sanChuan: { chu: string; zhong: string; mo: string }): boolean {
  return zhi === sanChuan.chu || zhi === sanChuan.zhong || zhi === sanChuan.mo;
}

function getSanChuanLabel(zhi: string, sanChuan: { chu: string; zhong: string; mo: string }): string {
  const isChu = zhi === sanChuan.chu;
  const isZhong = zhi === sanChuan.zhong;
  const isMo = zhi === sanChuan.mo;

  if (isChu && isZhong && isMo) return '初中末';
  if (isChu && isZhong) return '初中';
  if (isChu && isMo) return '初末';
  if (isZhong && isMo) return '中末';
  if (isChu) return '初';
  if (isZhong) return '中';
  if (isMo) return '末';
  return '';
}

const TianDiPanSquare: React.FC<TianDiPanSquareProps> = ({ diPan, tianPan, tianJiangArr, sanChuan }) => {
  const CELL_SIZE = 70;
  const FONT_SIZE_ZHI = 18;
  const FONT_SIZE_JIANG = 12;

  const layout = [
    ['巳', '午', '未', '申'],
    ['辰', '', '', '酉'],
    ['卯', '', '', '戌'],
    ['寅', '丑', '子', '亥']
  ];

  const getPosition = (zhi: string): [number, number] | null => {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (layout[row][col] === zhi) {
          return [row, col];
        }
      }
    }
    return null;
  };

  const getIndexByZhi = (zhi: string): number => {
    return DI_ZHI.indexOf(zhi);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-indigo-200">
      <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">天地盘（方形）</h3>
      <p className="text-sm text-gray-500 text-center mb-3">外框：天将 ｜ 中格：天盘 ｜ 内格：地盘</p>

      <div className="flex justify-center">
        <div className="inline-grid grid-cols-4 gap-0.5 border-2 border-gray-400 rounded-lg overflow-hidden">
          {layout.map((row, rowIndex) =>
            row.map((cellZhi, colIndex) => {
              const key = `${rowIndex}-${colIndex}`;
              
              if (!cellZhi) {
                return (
                  <div
                    key={key}
                    className="w-[70px] h-[105px] bg-gray-50 border border-gray-200 flex items-center justify-center"
                    style={{ gridColumn: colIndex + 1, gridRow: rowIndex + 1 }}
                  >
                    <span className="text-xs text-gray-300">中宫</span>
                  </div>
                );
              }

              const zhiIndex = getIndexByZhi(cellZhi);
              const diZhi = diPan[zhiIndex] || cellZhi;
              const tianZhi = tianPan[zhiIndex] || '';
              const tianJiang = tianJiangArr[zhiIndex] || '';
              const diWx = ZHI_WU_XING[diZhi] || '';
              const tianWx = ZHI_WU_XING[tianZhi] || '';
              const isSC = isSanChuanCheck(tianZhi, sanChuan);
              const scLabel = getSanChuanLabel(tianZhi, sanChuan);

              return (
                <div
                  key={key}
                  className={`w-[70px] border border-gray-300 flex flex-col relative ${
                    isSC ? 'bg-red-50' : 'bg-white'
                  }`}
                  style={{ gridColumn: colIndex + 1, gridRow: rowIndex + 1 }}
                >
                  {/* 天将 - 顶部 */}
                  <div className="h-5 bg-purple-50 border-b border-purple-200 flex items-center justify-center">
                    <span
                      className={`${FONT_SIZE_JIANG > 10 ? 'font-medium' : ''}`}
                      style={{ fontSize: `${FONT_SIZE_JIANG}px`, color: '#7c3aed' }}
                    >
                      {tianJiang}
                    </span>
                  </div>

                  {/* 天盘 - 中间 */}
                  <div className="flex-1 flex items-center justify-center border-b border-gray-200">
                    <span
                      style={{ fontSize: `${FONT_SIZE_ZHI}px`, color: getWuXingColor(tianWx), fontWeight: 'bold' }}
                    >
                      {tianZhi}
                    </span>
                    {scLabel && (
                      <span
                        className="absolute top-5 right-0.5"
                        style={{ fontSize: '8px', color: '#ef4444', fontWeight: 'bold' }}
                      >
                        {scLabel}
                      </span>
                    )}
                  </div>

                  {/* 地盘 - 底部 */}
                  <div className="h-8 flex items-center justify-center bg-gray-50">
                    <span
                      style={{ fontSize: `${FONT_SIZE_ZHI - 2}px`, color: getWuXingColor(diWx), fontWeight: '500' }}
                    >
                      {diZhi}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 图例 */}
      <div className="flex flex-wrap justify-center gap-3 mt-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded border-2 border-red-500 bg-red-50"></div>
          <span className="text-gray-600">三传位置</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-purple-600 font-medium">天将</span>
          <span className="text-gray-400">·</span>
          <span className="font-bold text-gray-800">天盘</span>
          <span className="text-gray-400">·</span>
          <span className="text-gray-500">地盘</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-1 text-xs">
        <span className="px-1.5 py-0.5 rounded bg-green-50 text-green-700">木</span>
        <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-700">火</span>
        <span className="px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700">土</span>
        <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">金</span>
        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">水</span>
      </div>
    </div>
  );
};

export default TianDiPanSquare;
