import React from 'react';
import { guaList, Gua } from '../utils/divination';

const GuaTable: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-amber-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">卦象对照表</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-amber-50 border-b-2 border-amber-200">
              <th className="px-4 py-3 text-left text-sm font-bold text-amber-800">结果</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-amber-800">描述</th>
              <th className="px-4 py-3 text-center text-sm font-bold text-amber-800">卦象</th>
              <th className="px-4 py-3 text-center text-sm font-bold text-amber-800">五行</th>
            </tr>
          </thead>
          <tbody>
            {guaList.map((gua, index) => (
              <tr 
                key={index} 
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-4 py-3">
                  <span className={`font-bold ${gua.desc.includes('吉') ? 'text-red-700' : 'text-gray-700'}`}>
                    {gua.result}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{gua.desc}</td>
                <td className="px-4 py-3 text-center font-medium text-gray-700">{gua.gua}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    gua.element === '木' ? 'bg-green-100 text-green-800' :
                    gua.element === '火' ? 'bg-red-100 text-red-800' :
                    gua.element === '土' ? 'bg-yellow-100 text-yellow-800' :
                    gua.element === '金' ? 'bg-gray-200 text-gray-700' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {gua.element}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuaTable;
