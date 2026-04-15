import React from 'react';
import { DivinationResult } from '../utils/divination';
import AIAnalysisButton from './AIAnalysisButton';
import AISettingsButton from './AISettingsButton';
import { generateXiaoLiuRenPrompt } from '../utils/aiPrompt';

interface GuaResultProps {
  result: DivinationResult;
}

const GuaResult: React.FC<GuaResultProps> = ({ result }) => {
  const isGood = result.gua.desc.includes('吉');
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-amber-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">占卜结果</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">公历日期</span>
          <span className="font-medium text-gray-800">{result.solarDate}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">农历日期</span>
          <span className="font-medium text-gray-800">{result.lunarDate}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">时辰</span>
          <span className="font-medium text-gray-800">{result.shichen}</span>
        </div>
      </div>
      
      <div className={`text-center py-6 rounded-lg mb-6 ${isGood ? 'bg-red-50' : 'bg-gray-50'}`}>
        <div className={`text-5xl font-bold mb-2 ${isGood ? 'text-red-700' : 'text-gray-700'}`}>
          {result.gua.result}
        </div>
        <div className="text-lg text-gray-600">{result.gua.desc}</div>
        <div className="mt-2 flex justify-center gap-4">
          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
            卦象：{result.gua.gua}
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            五行：{result.gua.element}
          </span>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-bold text-gray-800 mb-3">推算过程</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">1.</span>
            <span>从 [大安] 开始，得到：[{result.steps.step1.gua.result}]，{result.steps.step1.gua.desc}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">2.</span>
            <span>从 [{result.steps.step1.gua.result}] 开始，得到：[{result.steps.step2.gua.result}]，{result.steps.step2.gua.desc}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">3.</span>
            <span>从 [{result.steps.step2.gua.result}] 开始，得到：[{result.steps.step3.gua.result}]，{result.steps.step3.gua.desc}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">AI 分析</h3>
          <AISettingsButton /> 
        </div>
        <AIAnalysisButton prompt={generateXiaoLiuRenPrompt(result)} />
      </div>
    </div>
  );
};

export default GuaResult;
