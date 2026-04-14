import React from 'react';
import { DI_ZHI, ZHI_WU_XING, TIAN_JIANG } from '../utils/daLiuRen';

interface TianDiPanProps {
  diPan: string[];
  tianPan: string[];
  tianJiangArr: string[];
  sanChuan: { chu: string; zhong: string; mo: string };
  siKe: { shang: string; xia: string; label: string }[];
}

// 地支在方阵中的位置（4x4方阵，按传统大六壬布局）
// 巳午未申
// 辰    酉
// 卯    戌
// 寅丑子亥
const PAN_POSITIONS = [
  { zhi: '巳', row: 0, col: 0 },
  { zhi: '午', row: 0, col: 1 },
  { zhi: '未', row: 0, col: 2 },
  { zhi: '申', row: 0, col: 3 },
  { zhi: '辰', row: 1, col: 0 },
  { zhi: '酉', row: 1, col: 3 },
  { zhi: '卯', row: 2, col: 0 },
  { zhi: '戌', row: 2, col: 3 },
  { zhi: '寅', row: 3, col: 0 },
  { zhi: '丑', row: 3, col: 1 },
  { zhi: '子', row: 3, col: 2 },
  { zhi: '亥', row: 3, col: 3 },
];

function getWuXingColor(wuxing: string): string {
  switch (wuxing) {
    case '木': return 'text-green-700 bg-green-50';
    case '火': return 'text-red-700 bg-red-50';
    case '土': return 'text-yellow-700 bg-yellow-50';
    case '金': return 'text-gray-600 bg-gray-100';
    case '水': return 'text-blue-700 bg-blue-50';
    default: return 'text-gray-700 bg-white';
  }
}

function isSanChuan(zhi: string, sanChuan: { chu: string; zhong: string; mo: string }): boolean {
  return zhi === sanChuan.chu || zhi === sanChuan.zhong || zhi === sanChuan.mo;
}

function getSanChuanLabel(zhi: string, sanChuan: { chu: string; zhong: string; mo: string }): string {
  if (zhi === sanChuan.chu) return '初';
  if (zhi === sanChuan.zhong) return '中';
  if (zhi === sanChuan.mo) return '末';
  return '';
}

function isSiKe(zhi: string, siKe: { shang: string; xia: string }[]): boolean {
  return siKe.some(ke => ke.shang === zhi || ke.xia === zhi);
}

const TianDiPan: React.FC<TianDiPanProps> = ({ diPan, tianPan, tianJiangArr, sanChuan, siKe }) => {
  // 构建网格数据
  const grid: (typeof PAN_POSITIONS[0] & { tianZhi: string; diZhi: string; tianJiang: string; isSC: boolean; scLabel: string; isSK: boolean })[][] = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ] as any;

  PAN_POSITIONS.forEach(pos => {
    const idx = DI_ZHI.indexOf(pos.zhi);
    const tianZhi = tianPan[idx];
    const tianJiang = tianJiangArr[idx];
    const isSC = isSanChuan(tianZhi, sanChuan);
    const scLabel = getSanChuanLabel(tianZhi, sanChuan);
    const isSK = isSiKe(pos.zhi, siKe) || isSiKe(tianZhi, siKe);

    grid[pos.row][pos.col] = {
      ...pos,
      tianZhi,
      diZhi: pos.zhi,
      tianJiang,
      isSC,
      scLabel,
      isSK,
    };
  });

  // 填充中间区域（第2、3列的第1、2行为中心区域，显示四课三传概要）
  // 中心区域为空

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">天地盘</h3>
      <p className="text-sm text-gray-500 text-center mb-4">外圈天盘（上），内圈地盘（下）</p>

      <div className="flex justify-center">
        <div className="grid grid-cols-4 gap-1.5" style={{ width: '340px' }}>
          {grid.map((row, rowIdx) =>
            row.map((cell, colIdx) => {
              if (!cell) {
                // 中心空白区域或未使用的格子
                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className="flex items-center justify-center rounded-lg border border-gray-100"
                    style={{ width: '78px', height: '88px' }}
                  >
                    {rowIdx === 1 && colIdx === 1 && (
                      <div className="text-center">
                        <div className="text-xs text-amber-600 font-bold">四课</div>
                        <div className="text-lg font-bold text-amber-800">☰</div>
                      </div>
                    )}
                    {rowIdx === 1 && colIdx === 2 && (
                      <div className="text-center">
                        <div className="text-xs text-indigo-600 font-bold">三传</div>
                        <div className="text-lg font-bold text-indigo-800">☵</div>
                      </div>
                    )}
                  </div>
                );
              }

              const tianWx = ZHI_WU_XING[cell.tianZhi] || '';
              const diWx = ZHI_WU_XING[cell.diZhi] || '';
              const scBorder = cell.isSC ? 'ring-2 ring-red-500 ring-offset-1' : '';
              const skBorder = !cell.isSC && cell.isSK ? 'ring-2 ring-amber-400 ring-offset-1' : '';

              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className={`relative rounded-lg border-2 p-1 ${scBorder} ${skBorder} ${
                    cell.isSC ? 'border-red-300 bg-red-25' :
                    cell.isSK ? 'border-amber-300 bg-amber-25' :
                    'border-gray-200 bg-white'
                  }`}
                  style={{ width: '78px', height: '88px' }}
                >
                  {/* 天将 */}
                  <div className="text-center">
                    <span className="text-[10px] text-purple-600 font-medium">{cell.tianJiang}</span>
                  </div>
                  {/* 天盘 */}
                  <div className={`text-center rounded px-1 py-0.5 ${getWuXingColor(tianWx)}`}>
                    <span className="text-base font-bold">{cell.tianZhi}</span>
                    <span className="text-[9px] ml-0.5">{tianWx}</span>
                  </div>
                  {/* 分隔线 */}
                  <div className="border-t border-dashed border-gray-300 my-0.5"></div>
                  {/* 地盘 */}
                  <div className={`text-center rounded px-1 py-0.5 ${getWuXingColor(diWx)}`}>
                    <span className="text-sm font-medium text-gray-600">{cell.diZhi}</span>
                    <span className="text-[9px] ml-0.5 text-gray-400">{diWx}</span>
                  </div>
                  {/* 三传标记 */}
                  {cell.scLabel && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold">
                      {cell.scLabel}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 图例 */}
      <div className="flex flex-wrap justify-center gap-3 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded border-2 border-red-300 bg-red-25 ring-2 ring-red-500 ring-offset-1"></div>
          <span className="text-gray-600">三传位置</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded border-2 border-amber-300 bg-amber-25 ring-2 ring-amber-400 ring-offset-1"></div>
          <span className="text-gray-600">四课位置</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-purple-600 font-medium">天将名</span>
          <span className="text-gray-600">上方</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-bold text-gray-800">天盘</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">地盘</span>
        </div>
      </div>

      {/* 五行色标 */}
      <div className="flex flex-wrap justify-center gap-2 mt-2 text-xs">
        <span className="px-1.5 py-0.5 rounded bg-green-50 text-green-700">木</span>
        <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-700">火</span>
        <span className="px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700">土</span>
        <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">金</span>
        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">水</span>
      </div>
    </div>
  );
};

export default TianDiPan;
