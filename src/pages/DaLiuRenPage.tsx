import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import TianDiPan from '../components/TianDiPan';
import SiKeSanChuan from '../components/SiKeSanChuan';
import DaLiuRenResultPanel from '../components/DaLiuRenResultPanel';
import { calculateDaLiuRen, DaLiuRenResult, DI_ZHI } from '../utils/daLiuRen';

const shichenOptions = ['当前', '子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时'];

export default function DaLiuRenPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedShichen, setSelectedShichen] = useState<string>('当前');
  const [result, setResult] = useState<DaLiuRenResult | null>(null);

  useEffect(() => {
    const shiZhi = selectedShichen === '当前' ? undefined : selectedShichen[0];
    const divinationResult = calculateDaLiuRen(selectedDate, shiZhi);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-800 via-purple-700 to-indigo-800 bg-clip-text text-transparent mb-2">
            大六壬
          </h1>
          <p className="text-gray-600 text-lg">三式之首，天地人三才之道</p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://liuren-delta.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              官网
            </a>
            <a
              href="https://ghproxy.net/https://github.com/jingrongx/liuren/releases/download/1.1.0/app-release.apk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              国内下载 APK
            </a>
            <a
              href="https://github.com/jingrongx/liuren/releases/download/1.1.0/app-release.apk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
              GitHub下载
            </a>
          </div>
        </header>

        {/* 输入面板 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-indigo-200">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-indigo-600" />
              <label className="text-gray-700 font-medium">选择日期：</label>
              <input
                type="date"
                value={formatDateForInput(selectedDate)}
                onChange={handleDateChange}
                className="px-4 py-2 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="text-gray-700 font-medium">选择时辰：</label>
              <select
                value={selectedShichen}
                onChange={(e) => setSelectedShichen(e.target.value)}
                className="px-4 py-2 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white"
              >
                {shichenOptions.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <RefreshCw className="w-5 h-5" />
              重新排盘
            </button>
          </div>
        </div>

        {result && (
          <>
            {/* 天地盘 */}
            <div className="mb-8">
              <TianDiPan
                diPan={result.diPan}
                tianPan={result.tianPan}
                tianJiangArr={result.tianJiangArr}
                sanChuan={result.sanChuan}
                siKe={result.siKe}
              />
            </div>

            {/* 四课和三传 */}
            <div className="mb-8">
              <SiKeSanChuan
                siKe={result.siKe}
                sanChuan={result.sanChuan}
                dayGan={result.dayGan}
                dayZhi={result.dayZhi}
                tianJiangArr={result.tianJiangArr}
              />
            </div>

            {/* 结果详情 */}
            <div className="mb-8">
              <DaLiuRenResultPanel result={result} />
            </div>
          </>
        )}

        {/* 大六壬简介 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-indigo-100 mb-8">
          <h3 className="text-xl font-bold text-indigo-800 mb-4 text-center">大六壬简介</h3>
          <div className="prose prose-sm max-w-none text-gray-600 space-y-3">
            <p>大六壬，与太乙神数、奇门遁甲并称"三式"，是中国传统术数中最为高深的预测学之一。其以日干支为基准，月将加时起天盘，取四课定三传，推人事之吉凶。</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-indigo-50 rounded-lg p-4">
                <h4 className="font-bold text-indigo-800 mb-2">天盘</h4>
                <p className="text-sm text-gray-600">月将加时所得，代表天时运转，外圈为天盘神，反映外在环境与时机。</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-bold text-purple-800 mb-2">四课</h4>
                <p className="text-sm text-gray-600">日干日支各取两课，上神与下神的关系反映事物之体用与矛盾。</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-bold text-blue-800 mb-2">三传</h4>
                <p className="text-sm text-gray-600">初传为事之始，中传为事之中，末传为事之终，三传递推可知始终。</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center">
          {/* 经方家AI推广区块 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
              <span className="text-2xl">🌿</span>
              经方家AI - 智能中医助手
            </h3>
            <p className="text-gray-600 mb-4">望诊+问诊辨证更准确，中医思维真中医</p>
            <p className="text-amber-600 font-medium mb-4 text-sm">💡 建议使用电脑访问网页版，或下载安卓APP获得最佳体验</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href="https://www.jingfangjia.chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                访问官网
              </a>
              <a
                href="https://ghproxy.net/https://github.com/jingrongx/jingfangjia-ai-releases/releases/download/v1.7.51/JingFangJia-AI-v1.7.51.apk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                国内下载 APK
              </a>
              <a
                href="https://github.com/jingrongx/jingfangjia-ai-releases/releases/download/v1.7.51/JingFangJia-AI-v1.7.51.apk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
                GitHub下载
              </a>
            </div>
            <p className="text-gray-500 text-sm mt-3">微信搜索关注【经方家AI】，免费获取海量中医经典资料</p>
          </div>

          {/* 底部版权信息 */}
          <div className="text-gray-500 text-sm space-y-2 pt-4 border-t border-gray-200">
            <p>本程序仅供学习研究使用，请勿用于商业用途</p>
            <p>© 2024 大六壬 - 传承传统占卜文化</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
