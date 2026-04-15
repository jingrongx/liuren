import React, { useState, useCallback } from 'react';
import { Sparkles, X, Copy, Check, Loader2 } from 'lucide-react';
import { loadConfig, saveConfig, DEFAULT_CONFIG } from './AISettingsButton';

interface AIAnalysisButtonProps {
  prompt: string;
}

const AIAnalysisButton: React.FC<AIAnalysisButtonProps> = ({ prompt }) => {
  const [showModal, setShowModal] = useState(false);
  const [config] = useState(loadConfig);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [prompt]);

  const handleAIAnalyze = async () => {
    setShowModal(true);

    if (!config.apiKey) {
      return;
    }

    setIsLoading(true);
    setError('');
    setAiResponse('');

    try {
      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages: [{ role: 'user', content: prompt }],
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
      }

      const data = await response.json();
      setAiResponse(data.choices?.[0]?.message?.content || '未获取到回复');
    } catch (err) {
      setError(err instanceof Error ? err.message : '请求失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleAIAnalyze}
        className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
      >
        <Sparkles className="w-6 h-6" />
        AI 解读
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-500" />
                AI 解读
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {!config.apiKey && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 text-sm">
                    💡 未配置API密钥。您可以复制下方提示词，粘贴到任意AI对话中使用（如 DeepSeek、ChatGPT、通义千问等）。如需直接调用API，请在页面顶部的「AI设置」中配置密钥。
                  </p>
                </div>
              )}

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => setShowPrompt(!showPrompt)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700"
                  >
                    📋 发送给AI的提示词
                    <span className="text-xs">{showPrompt ? '▲ 收起' : '▼ 展开'}</span>
                  </button>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-md text-sm hover:bg-purple-100 flex items-center gap-1 text-purple-700 font-medium"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? '已复制' : '复制提示词'}
                  </button>
                </div>
                {showPrompt && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">{prompt}</pre>
                  </div>
                )}
              </div>

              {config.apiKey && (
                <>
                  {isLoading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                      <span className="ml-3 text-gray-600">AI 正在解读中...</span>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-red-700">{error}</p>
                    </div>
                  )}

                  {aiResponse && !isLoading && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">{aiResponse}</pre>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAnalysisButton;
