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

const ZHI_LAYOUT = [
  { zhi: '寅', side: 'bottom', idx: 0 },
  { zhi: '丑', side: 'bottom', idx: 1 },
  { zhi: '子', side: 'bottom', idx: 2 },
  { zhi: '亥', side: 'bottom', idx: 3 },
  { zhi: '戌', side: 'right', idx: 0 },
  { zhi: '酉', side: 'right', idx: 1 },
  { zhi: '申', side: 'top', idx: 3 },
  { zhi: '未', side: 'top', idx: 2 },
  { zhi: '午', side: 'top', idx: 1 },
  { zhi: '巳', side: 'top', idx: 0 },
  { zhi: '辰', side: 'left', idx: 0 },
  { zhi: '卯', side: 'left', idx: 1 }
];

function getCellPos(layer: 'outer' | 'middle' | 'inner', side: string, idx: number): { row: number; col: number } {
  const topRow: Record<string, number> = { outer: 0, middle: 1, inner: 2 };
  const rightCol: Record<string, number> = { outer: 7, middle: 6, inner: 5 };
  const bottomRow: Record<string, number> = { outer: 7, middle: 6, inner: 5 };
  const leftCol: Record<string, number> = { outer: 0, middle: 1, inner: 2 };

  switch (side) {
    case 'bottom':
      return { row: bottomRow[layer], col: 2 + idx };
    case 'right':
      return { row: 4 - idx, col: rightCol[layer] };
    case 'top':
      return { row: topRow[layer], col: 2 + idx };
    case 'left':
      return { row: 3 + idx, col: leftCol[layer] };
    default:
      return { row: 0, col: 0 };
  }
}

const TianDiPanSquare: React.FC<TianDiPanSquareProps> = ({ diPan, tianPan, tianJiangArr, sanChuan }) => {
  const GRID = 8;
  const CELL = 55;
  const SIZE = GRID * CELL;

  const getIndexByZhi = (zhi: string): number => DI_ZHI.indexOf(zhi);

  const renderLayer = (layerType: 'outer' | 'middle' | 'inner') => {
    return ZHI_LAYOUT.map(({ zhi, side, idx }) => {
      const zhiIndex = getIndexByZhi(zhi);
      let text = '';
      let color = '#374151';
      let fontSize = 14;
      let fontWeight: string = '500';
      let label = '';

      if (layerType === 'outer') {
        text = tianJiangArr[zhiIndex] || '';
        color = '#7c3aed';
        fontSize = 12;
        fontWeight = '600';
      } else if (layerType === 'middle') {
        text = tianPan[zhiIndex] || '';
        const wx = ZHI_WU_XING[text] || '';
        color = getWuXingColor(wx);
        fontSize = 16;
        fontWeight = 'bold';
        if (text && isSanChuanCheck(text, sanChuan)) {
          label = getSanChuanLabel(text, sanChuan);
        }
      } else {
        text = diPan[zhiIndex] || zhi;
        const wx = ZHI_WU_XING[text] || '';
        color = getWuXingColor(wx);
        fontSize = 14;
        fontWeight = '600';
      }

      if (!text) return null;

      const { row, col } = getCellPos(layerType, side, idx);

      return (
        <div
          key={`${layerType}-${zhi}`}
          style={{
            position: 'absolute',
            left: col * CELL,
            top: row * CELL,
            width: CELL,
            height: CELL,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${fontSize}px`,
            fontWeight,
            color,
            zIndex: 10,
            whiteSpace: 'nowrap',
            lineHeight: 1
          }}
        >
          {text}
          {label && (
            <span style={{
              position: 'absolute',
              top: '1px', right: '1px',
              fontSize: '8px',
              color: '#ef4444',
              fontWeight: 'bold'
            }}>
              {label}
            </span>
          )}
        </div>
      );
    }).filter(Boolean);
  };

  const ringBorders = [
    { start: 0, end: 7 },
    { start: 1, end: 6 },
    { start: 2, end: 5 }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-indigo-200">
      <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">天地盘</h3>
      <p className="text-sm text-gray-500 text-center mb-3">外：天将 ｜ 中：天盘 ｜ 内：地盘</p>

      <div className="flex justify-center">
        <div style={{ width: SIZE, height: SIZE, position: 'relative' }}>
          {Array.from({ length: GRID + 1 }, (_, i) => (
            <div key={`h-${i}`} style={{
              position: 'absolute',
              left: 0, top: i * CELL,
              width: SIZE, height: '1px',
              backgroundColor: '#d1d5db'
            }} />
          ))}
          {Array.from({ length: GRID + 1 }, (_, i) => (
            <div key={`v-${i}`} style={{
              position: 'absolute',
              left: i * CELL, top: 0,
              width: '1px', height: SIZE,
              backgroundColor: '#d1d5db'
            }} />
          ))}

          {ringBorders.map(({ start, end }) => (
            <div key={`ring-${start}`} style={{
              position: 'absolute',
              left: start * CELL, top: start * CELL,
              width: (end - start + 1) * CELL,
              height: (end - start + 1) * CELL,
              border: '1px solid #9ca3af',
              pointerEvents: 'none',
              zIndex: 2
            }} />
          ))}

          {renderLayer('outer')}
          {renderLayer('middle')}
          {renderLayer('inner')}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded border border-red-500 bg-red-50"></div>
          <span className="text-gray-600">三传位置</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-purple-600 font-medium">天将</span>
          <span className="text-gray-400">·</span>
          <span className="font-bold text-gray-800">天盘</span>
          <span className="text-gray-400">·</span>
          <span className="text-gray-600">地盘</span>
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
