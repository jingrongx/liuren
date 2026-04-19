import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import GuaResult from '../components/GuaResult';
import GuaTable from '../components/GuaTable';
import ShichenTable from '../components/ShichenTable';
import FutureGuaTable from '../components/FutureGuaTable';
import AISettingsButton from '../components/AISettingsButton';
import { calculateDivination, shichenNames, DivinationResult } from '../utils/divination';
import { getApkDownloadUrl, getGhproxyApkDownloadUrl, getLatestApkDownloadUrl, getGhproxyExeDownloadUrl, getLatestExeDownloadUrl } from '../lib/downloadUtils';
import { openUrl } from '../lib/openUrl';

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
            小六壬
          </h1>
          <p className="text-gray-600 text-lg">传统占卜文化，在线吉凶预测</p>
          
          {/* 下载按钮 - 响应式优化 */}
          <div className="mt-6 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <a
                href={getGhproxyApkDownloadUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => { e.preventDefault(); openUrl(getGhproxyApkDownloadUrl()); }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Android下载
              </a>
              <a
                href={getGhproxyExeDownloadUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => { e.preventDefault(); openUrl(getGhproxyExeDownloadUrl()); }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                Windows下载
              </a>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-xs text-gray-500">
              <a
                href={getLatestApkDownloadUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => { e.preventDefault(); openUrl(getLatestApkDownloadUrl()); }}
                className="hover:text-gray-700 underline decoration-dotted"
              >
                GitHub APK
              </a>
              <span className="text-gray-300">|</span>
              <a
                href={getLatestExeDownloadUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => { e.preventDefault(); openUrl(getLatestExeDownloadUrl()); }}
                className="hover:text-gray-700 underline decoration-dotted"
              >
                GitHub EXE
              </a>
              <span className="text-gray-300">|</span>
              <a
                href="https://liuren-delta.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => { e.preventDefault(); openUrl('https://liuren-delta.vercel.app/'); }}
                className="hover:text-gray-700 underline decoration-dotted"
              >
                网页版
              </a>
            </div>
            <p className="text-xs text-gray-400">
              💡 桌面版约15MB，支持自动更新，推荐电脑用户使用
            </p>
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
                onClick={(e) => { e.preventDefault(); openUrl('https://www.jingfangjia.chat'); }}
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
                onClick={(e) => { e.preventDefault(); openUrl('https://ghproxy.net/https://github.com/jingrongx/jingfangjia-ai-releases/releases/download/v1.7.51/JingFangJia-AI-v1.7.51.apk'); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                国内下载 APK
              </a>
              <a
                href="https://github.com/jingrongx/jingfangjia-ai-releases/releases/download/v1.7.51/JingFangJia-AI-v1.7.51.apk"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => { e.preventDefault(); openUrl('https://github.com/jingrongx/jingfangjia-ai-releases/releases/download/v1.7.51/JingFangJia-AI-v1.7.51.apk'); }}
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
            <p>© {new Date().getFullYear()} 六壬占卜 - 传承传统占卜文化</p>
          </div>
        </footer>
      </div>
    </div>
  );
}