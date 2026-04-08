import React from 'react';

const ShichenTable: React.FC = () => {
  const shichenData = [
    { name: '子时', time: '23:00-01:00' },
    { name: '丑时', time: '01:00-03:00' },
    { name: '寅时', time: '03:00-05:00' },
    { name: '卯时', time: '05:00-07:00' },
    { name: '辰时', time: '07:00-09:00' },
    { name: '巳时', time: '09:00-11:00' },
    { name: '午时', time: '11:00-13:00' },
    { name: '未时', time: '13:00-15:00' },
    { name: '申时', time: '15:00-17:00' },
    { name: '酉时', time: '17:00-19:00' },
    { name: '戌时', time: '19:00-21:00' },
    { name: '亥时', time: '21:00-23:00' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-amber-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">时辰对照表</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {shichenData.map((item, index) => (
          <div 
            key={index}
            className="bg-amber-50 rounded-lg p-3 text-center hover:bg-amber-100 transition-colors"
          >
            <div className="font-bold text-amber-800 text-lg">{item.name}</div>
            <div className="text-sm text-gray-600">{item.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShichenTable;
