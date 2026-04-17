import React from 'react';
import { DI_ZHI, ZHI_WU_XING } from '../utils/daLiuRen';

interface TianDiPanProps {
  diPan: string[];
  tianPan: string[];
  tianJiangArr: string[];
  sanChuan: { chu: string; zhong: string; mo: string };
  siKe: { shang: string; xia: string }[];
}

const CX = 200;
const CY = 200;
const R_OUTER = 190;
const R_MIDDLE = 145;
const R_INNER = 100;
const R_CENTER = 55;

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

const toRad = (deg: number) => (deg * Math.PI) / 180;

// 传统大六壬布局：子在下方，顺时针排列（丑在左下，寅在左，卯在左上...）
const getSectorAngle = (i: number) => 90 + i * 30;

const getPoint = (angleDeg: number, r: number) => ({
  x: CX + r * Math.cos(toRad(angleDeg)),
  y: CY + r * Math.sin(toRad(angleDeg)),
});

const getCellCenter = (i: number, innerR: number, outerR: number) => {
  const angle = getSectorAngle(i);
  const midR = (innerR + outerR) / 2;
  return getPoint(angle, midR);
};

const getSectorPath = (i: number, innerR: number, outerR: number): string => {
  const startAngle = getSectorAngle(i) - 15;
  const endAngle = getSectorAngle(i) + 15;
  const startRad = toRad(startAngle);
  const endRad = toRad(endAngle);

  const os = { x: CX + outerR * Math.cos(startRad), y: CY + outerR * Math.sin(startRad) };
  const oe = { x: CX + outerR * Math.cos(endRad), y: CY + outerR * Math.sin(endRad) };
  const ie = { x: CX + innerR * Math.cos(endRad), y: CY + innerR * Math.sin(endRad) };
  const is2 = { x: CX + innerR * Math.cos(startRad), y: CY + innerR * Math.sin(startRad) };

  return `M ${os.x} ${os.y} A ${outerR} ${outerR} 0 0 1 ${oe.x} ${oe.y} L ${ie.x} ${ie.y} A ${innerR} ${innerR} 0 0 0 ${is2.x} ${is2.y} Z`;
};

const TianDiPan: React.FC<TianDiPanProps> = ({ diPan, tianPan, tianJiangArr, sanChuan }) => {
  const sectors = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-indigo-200">
      <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">天地盘</h3>
      <p className="text-sm text-gray-500 text-center mb-3">外圈：天将 ｜ 中圈：天盘 ｜ 内圈：地盘</p>

      <svg viewBox="0 0 400 400" className="w-full max-w-sm mx-auto" style={{ maxHeight: '400px' }}>
        {/* 外圈：天将 */}
        {sectors.map((i) => {
          const path = getSectorPath(i, R_MIDDLE, R_OUTER);
          const center = getCellCenter(i, R_MIDDLE, R_OUTER);
          const tianJiang = tianJiangArr[i] || '';

          return (
            <g key={`outer-${i}`}>
              <path d={path} fill="#faf5ff" stroke="#c4b5fd" strokeWidth="0.5" />
              <text
                x={center.x}
                y={center.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="10"
                fill="#7c3aed"
                fontWeight="500"
              >
                {tianJiang}
              </text>
            </g>
          );
        })}

        {/* 中圈：天盘 — 只标注三传 */}
        {sectors.map((i) => {
          const path = getSectorPath(i, R_INNER, R_MIDDLE);
          const center = getCellCenter(i, R_INNER, R_MIDDLE);
          const tianZhi = tianPan[i] || '';
          const tianWx = ZHI_WU_XING[tianZhi] || '';
          const isSC = isSanChuanCheck(tianZhi, sanChuan);
          const scLabel = getSanChuanLabel(tianZhi, sanChuan);

          return (
            <g key={`middle-${i}`}>
              <path d={path} fill={isSC ? '#fef2f2' : '#f9fafb'} stroke="#d1d5db" strokeWidth="0.5" />
              {isSC && <path d={path} fill="none" stroke="#ef4444" strokeWidth="2" />}
              <text
                x={center.x}
                y={center.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="15"
                fill={getWuXingColor(tianWx)}
                fontWeight="bold"
              >
                {tianZhi}
              </text>
              {scLabel && (
                <text
                  x={center.x + 14}
                  y={center.y - 12}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="8"
                  fill="#ef4444"
                  fontWeight="bold"
                >
                  {scLabel}
                </text>
              )}
            </g>
          );
        })}

        {/* 内圈：地盘 — 不做任何特殊标注 */}
        {sectors.map((i) => {
          const path = getSectorPath(i, R_CENTER, R_INNER);
          const center = getCellCenter(i, R_CENTER, R_INNER);
          const diZhi = DI_ZHI[i];
          const diWx = ZHI_WU_XING[diZhi] || '';

          return (
            <g key={`inner-${i}`}>
              <path d={path} fill="#f9fafb" stroke="#d1d5db" strokeWidth="0.5" />
              <text
                x={center.x}
                y={center.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="13"
                fill={getWuXingColor(diWx)}
                fontWeight="500"
              >
                {diZhi}
              </text>
            </g>
          );
        })}

        {/* 圆形边框 */}
        <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="#9ca3af" strokeWidth="1" />
        <circle cx={CX} cy={CY} r={R_MIDDLE} fill="none" stroke="#9ca3af" strokeWidth="0.5" />
        <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="#9ca3af" strokeWidth="0.5" />

        {/* 中心 */}
        <circle cx={CX} cy={CY} r={R_CENTER} fill="white" stroke="#9ca3af" strokeWidth="1" />
      </svg>

      {/* 图例 — 简化，只保留三传 */}
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

export default TianDiPan;
