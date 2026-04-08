import React, { useMemo } from 'react';
import { FutureGuaDay, getFutureGua } from '../utils/divination';

const FutureGuaTable: React.FC = () => {
  const futureData = useMemo(() => getFutureGua(3), []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-amber-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">三天时辰吉凶速查表</h3>
      
      <div className="space-y-6">
        {futureData.map((day, dayIndex) => (
          <div key={dayIndex} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-amber-50 px-4 py-3 border-b border-amber-200">
              <div className="font-bold text-amber-800 text-lg">{day.lunarDate}</div>
              <div className="text-sm text-gray-600">{day.date}</div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-3 py-2 text-left text-xs font-bold text-gray-700">时辰</th>
                    <th className="px-3 py-2 text-left text-xs font-bold text-gray-700">时间</th>
                    <th className="px-3 py-2 text-center text-xs font-bold text-gray-700">结果</th>
                    <th className="px-3 py-2 text-left text-xs font-bold text-gray-700">描述</th>
                  </tr>
                </thead>
                <tbody>
                  {day.times.map((time, timeIndex) => {
                    const isGood = time.gua.desc.includes('吉');
                    return (
                      <tr 
                        key={timeIndex} 
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${timeIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <td className="px-3 py-2 font-medium text-gray-800">{time.shichenName}</td>
                        <td className="px-3 py-2 text-sm text-gray-600">{time.time}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={`font-bold ${isGood ? 'text-red-700' : 'text-gray-700'}`}>
                            {time.gua.result}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-600">{time.gua.desc}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FutureGuaTable;
