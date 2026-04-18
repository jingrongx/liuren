import React from 'react';
import { Download, X, RefreshCw } from 'lucide-react';
import { useTauriUpdater } from '../hooks/useTauriUpdater';

const isTauri = () => '__TAURI__' in window || '__TAURI_INTERNALS__' in window;

const TauriUpdateBanner: React.FC = () => {
  if (!isTauri()) return null;

  return <TauriUpdateBannerInner />;
};

const TauriUpdateBannerInner: React.FC = () => {
  const {
    updateAvailable,
    updateInfo,
    downloading,
    progress,
    error,
    checkForUpdate,
    downloadAndInstall,
  } = useTauriUpdater();

  if (!updateAvailable && !error) return null;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 flex items-center justify-between gap-3 text-sm">
      <div className="flex items-center gap-2 min-w-0">
        <Download className="w-5 h-5 shrink-0" />
        <div className="min-w-0">
          <p className="font-medium truncate">
            发现新版本 v{updateInfo?.version}
          </p>
          {downloading && (
            <div className="mt-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-white h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-xs">{progress}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 shrink-0">
        {!downloading ? (
          <>
            <button
              onClick={downloadAndInstall}
              disabled={downloading}
              className="inline-flex items-center gap-1 px-4 py-1.5 bg-white text-blue-600 hover:bg-gray-100 rounded font-medium text-xs transition-colors disabled:opacity-50"
            >
              <Download className="w-3 h-3" />
              立即更新
            </button>
            <button
              onClick={checkForUpdate}
              title="重新检查"
              className="p-1.5 hover:bg-white/20 rounded transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </>
        ) : (
          <span className="text-xs bg-white/20 px-3 py-1.5 rounded">
            下载中...
          </span>
        )}
      </div>
      
      {error && (
        <div className="absolute top-full left-0 right-0 bg-red-500 text-white px-4 py-2 text-xs">
          更新失败：{error}
        </div>
      )}
    </div>
  );
};

export default TauriUpdateBanner;
