import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import GuaResult from '../components/GuaResult';
import GuaTable from '../components/GuaTable';
import ShichenTable from '../components/ShichenTable';
import FutureGuaTable from '../components/FutureGuaTable';
import { calculateDivination, shichenNames, DivinationResult } from '../utils/divination';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedShichen, setSelectedShichen] = useState<string>('当前');
  const [result, setResult] = useState<DivinationResult | null>(null);

  useEffect(() => {
    const divinationResult = calculateDivination(selectedDate, selectedShichen);
    setResult(divinationResult);
  }, [selectedDate, selectedShichen]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
  };

  const handleReset = () => {
    setSelectedDate(new Date());
    setSelectedShichen('当前');
  };

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-800 via-amber-700 to-red-800 bg-clip-text text-transparent mb-2">
            六壬占卜
          </h1>
          <p className="text-gray-600 text-lg">传统占卜文化，在线吉凶预测</p>
          <div className="mt-4">
            <a 
              href="https://github.com/jingfangjia/liuren-divination/releases/latest/download/app-release.apk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              下载Android APK
            </a>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-amber-200">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-amber-600" />
              <label className="text-gray-700 font-medium">选择日期：</label>
              <input
                type="date"
                value={formatDateForInput(selectedDate)}
                onChange={handleDateChange}
                className="px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="text-gray-700 font-medium">选择时辰：</label>
              <select
                value={selectedShichen}
                onChange={(e) => setSelectedShichen(e.target.value)}
                className="px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white"
              >
                <option value="当前">当前</option>
                {shichenNames.map((name) => (
                  <option key={name} value={name}>{name}时</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-500 to-red-600 text-white rounded-lg hover:from-amber-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <RefreshCw className="w-5 h-5" />
              重新占卜
            </button>
          </div>
        </div>

        {result && (
          <div className="mb-8">
            <GuaResult result={result} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <GuaTable />
          </div>
          <div>
            <ShichenTable />
          </div>
        </div>

        <div>
          <FutureGuaTable />
        </div>

        <footer className="mt-12 text-center text-gray-50 [&>p]:mb-2">
          <p>本程序仅供学习研究使用，请勿用于商业用途</p>
          <p>微信搜索关注【经方家AI】，免费获取海量中医经典资料</p>
          <p>经方家AI望诊+问诊辨证更准确，中医思维真中医</p>
          <p className="text-blue-600 hover:underline"><a href="https://www.jingfangjia.chat" target="_blank" rel="noopener noreferrer">官网：https://www.jingfangjia.chat</a></p>
        </footer>
      </div>
    </div>
  );
}