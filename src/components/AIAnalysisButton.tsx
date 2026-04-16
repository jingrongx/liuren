import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Sparkles, X, Copy, Check, Loader2, User, Calendar, Venus, Mars, RefreshCw } from 'lucide-react';
import { loadConfig, saveConfig, DEFAULT_CONFIG, CONFIG_UPDATED_EVENT } from './AISettingsButton';

interface AIAnalysisButtonProps {
  prompt: string;
}

const AIAnalysisButton: React.FC<AIAnalysisButtonProps> = ({ prompt }) => {
  const [showModal, setShowModal] = useState(false);
  const [config, setConfig] = useState(loadConfig());
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [responseCopied, setResponseCopied] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [userInfo, setUserInfo] = useState({
    gender: '',
    birthDate: '',
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const handler = () => setConfig(loadConfig());
    window.addEventListener(CONFIG_UPDATED_EVENT, handler);
    return () => window.removeEventListener(CONFIG_UPDATED_EVENT, handler);
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [prompt]);

  const handleCopyResponse = useCallback(() => {
    navigator.clipboard.writeText(aiResponse).then(() => {
      setResponseCopied(true);
      setTimeout(() => setResponseCopied(false), 2000);
    });
  }, [aiResponse]);

  const handleReset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
    setIsStreaming(false);
    setError('');
    setAiResponse('');
    setUserQuestion('');
    setUserInfo({ gender: '', birthDate: '' });
  }, []);

  const renderMarkdown = (text: string) => {
    // 简单的 Markdown 渲染
    return text
      .replace(/^### (.*$)/gm, '<h3 className="font-bold text-lg mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 className="font-bold text-xl mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 className="font-bold text-2xl mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong className="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em className="italic">$1</em>')
      .replace(/^- (.*$)/gm, '<li className="list-disc ml-6 mb-1">$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<h[1-6]|<li|<p).*$/gm, '<p>$&</p>')
      .replace(/<p><\/p>/g, '');
  };

  const getFullPrompt = () => {
    let fullPrompt = prompt;
    
    // 添加用户个人信息
    if (userInfo.gender || userInfo.birthDate) {
      fullPrompt += '\n\n## 求测人信息\n';
      if (userInfo.gender) {
        fullPrompt += `- 性别：${userInfo.gender}\n`;
      }
      if (userInfo.birthDate) {
        fullPrompt += `- 出生日期：${userInfo.birthDate}\n`;
      }
    }
    
    // 添加用户问题
    if (userQuestion) {
      fullPrompt += `\n\n## 求测问题\n${userQuestion}\n`;
    }
    
    return fullPrompt;
  };

  const handleAIAnalyze = async () => {
    setIsLoading(true);
    setIsStreaming(true);
    setError('');
    setAiResponse('');

    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const fullPrompt = getFullPrompt();
      
      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages: [{ role: 'user', content: fullPrompt }],
          stream: true,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法获取响应流');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // 处理 SSE 格式
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              setIsStreaming(false);
              break;
            }
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                setAiResponse(prev => prev + content);
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }

      setIsStreaming(false);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
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
                onClick={() => {
                  if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                  }
                  setShowModal(false);
                }}
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
                    onClick={() => navigator.clipboard.writeText(getFullPrompt()).then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    })}
                    className="px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-md text-sm hover:bg-purple-100 flex items-center gap-1 text-purple-700 font-medium"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? '已复制' : '复制提示词'}
                  </button>
                </div>
                {showPrompt && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">{getFullPrompt()}</pre>
                  </div>
                )}
              </div>

              {/* 用户信息输入 */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-3">个人信息（选填）</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Mars className="w-4 h-4" />
                      性别
                    </label>
                    <select
                      value={userInfo.gender}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">请选择</option>
                      <option value="男">男</option>
                      <option value="女">女</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      出生日期
                    </label>
                    <input
                      type="date"
                      value={userInfo.birthDate}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, birthDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* 用户问题输入 */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">求测问题</h3>
                <textarea
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="请输入您想要咨询的具体问题...（例如：最近事业发展如何？感情状况怎样？）"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              {config.apiKey && (
                <div className="mb-4">
                  <button
                    onClick={handleAIAnalyze}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    disabled={isLoading || isStreaming}
                  >
                    {isLoading || isStreaming ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        解读中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        开始 AI 解读
                      </>
                    )}
                  </button>
                </div>
              )}

              {config.apiKey && (
                <>
                  {(isLoading || isStreaming) && (
                    <div className="flex items-center justify-center py-4 mb-4">
                      <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                      <span className="ml-3 text-gray-600">AI 正在解读中...</span>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-red-700">{error}</p>
                    </div>
                  )}

                  {aiResponse && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-800">AI 解读结果</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleReset}
                            className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-md text-sm hover:bg-gray-200 flex items-center gap-1 text-gray-700 font-medium"
                            title="新会话"
                          >
                            <RefreshCw className="w-4 h-4" />
                            新会话
                          </button>
                          <button
                            onClick={handleCopyResponse}
                            className="px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-md text-sm hover:bg-purple-100 flex items-center gap-1 text-purple-700 font-medium"
                          >
                            {responseCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {responseCopied ? '已复制' : '复制解读'}
                          </button>
                        </div>
                      </div>
                      <div 
                        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(aiResponse) }}
                      />
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
