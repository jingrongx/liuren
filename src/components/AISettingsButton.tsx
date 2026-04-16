import React, { useState, useEffect } from 'react';
import { Settings, X, AlertTriangle, Eye, EyeOff, Loader2 } from 'lucide-react';

interface AIConfig {
  apiKey: string;
  model: string;
  baseUrl: string;
}

export const DEFAULT_CONFIG: AIConfig = {
  apiKey: '',
  model: 'deepseek-reasoner',
  baseUrl: 'https://api.deepseek.com',
};

export const STORAGE_KEY = 'liuren_ai_config';

export const CONFIG_UPDATED_EVENT = 'liuren_ai_config_updated';

export function loadConfig(): AIConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    }
  } catch {}
  return { ...DEFAULT_CONFIG };
}

export function saveConfig(config: AIConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent(CONFIG_UPDATED_EVENT));
  } catch {}
}

const AISettingsButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [config, setConfig] = useState<AIConfig>(loadConfig);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const handler = () => setConfig(loadConfig());
    window.addEventListener(CONFIG_UPDATED_EVENT, handler);
    return () => window.removeEventListener(CONFIG_UPDATED_EVENT, handler);
  }, []);

  const handleSaveConfig = () => {
    saveConfig(config);
    setConfig(loadConfig());
    setSuccess('设置已保存');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleTestConnection = async () => {
    if (!config.apiKey) {
      setError('请先输入API密钥');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages: [{ role: 'user', content: '测试连接' }],
          max_tokens: 10,
        }),
      });

      if (!response.ok) {
        throw new Error(`连接失败: ${response.status}`);
      }

      setSuccess('连接成功！');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '连接失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white/80 hover:bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200"
        title="AI 设置"
      >
        <Settings className="w-4 h-4" />
        <span className="hidden sm:inline">AI设置</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            {success && (
              <div className="absolute top-0 left-0 right-0 z-10 bg-green-500 text-white text-center py-2.5 text-sm font-medium animate-slide-down">
                ✓ {success}
              </div>
            )}
            {error && (
              <div className="absolute top-0 left-0 right-0 z-10 bg-red-500 text-white text-center py-2.5 text-sm font-medium animate-slide-down">
                ✕ {error}
              </div>
            )}

            <div className={`flex items-center justify-between p-4 border-b ${(success || error) ? 'pt-10' : ''}`}>
              <h2 className="text-xl font-bold">AI解读设置</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API 密钥
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={config.apiKey}
                    onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                    placeholder="sk-xxxxxxxxxxxxxxxx"
                    className="w-full px-4 py-3 pr-20 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-purple-600 font-medium flex items-center gap-1"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showApiKey ? '隐藏' : '显示'}
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  默认使用 DeepSeek API，在{' '}
                  <a
                    href="https://platform.deepseek.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline"
                  >
                    DeepSeek 平台
                  </a>{' '}
                  获取密钥。也可修改下方地址使用其他兼容 OpenAI 格式的 API 服务。
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">模型名称</label>
                <input
                  type="text"
                  value={config.model}
                  onChange={(e) => setConfig({ ...config, model: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API 地址</label>
                <input
                  type="url"
                  value={config.baseUrl}
                  onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                  placeholder="https://api.deepseek.com"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  API 密钥将存储在浏览器本地，请注意安全。调用 API 可能产生费用。不配置密钥也可以复制提示词自行使用。
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleTestConnection}
                  disabled={isLoading}
                  className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'ℹ️ '}
                  测试连接
                </button>
                <button
                  onClick={() => {
                    setConfig({ ...DEFAULT_CONFIG });
                    saveConfig(DEFAULT_CONFIG);
                    setConfig(loadConfig());
                    setSuccess('已恢复默认设置');
                    setTimeout(() => setSuccess(''), 2000);
                  }}
                  className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  恢复默认
                </button>
                <button
                  onClick={handleSaveConfig}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:from-purple-600 hover:to-pink-600"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AISettingsButton;
