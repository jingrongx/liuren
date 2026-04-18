import React, { useState, useEffect } from 'react';
import { X, Download, ExternalLink, RefreshCw, CheckCircle2 } from 'lucide-react';

const CURRENT_VERSION = __APP_VERSION__;

interface ReleaseInfo {
  tag_name: string;
  html_url: string;
  assets: { name: string; browser_download_url: string }[];
}

const UpdateChecker: React.FC = () => {
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [ghproxyUrl, setGhproxyUrl] = useState<string>('');
  const [dismissed, setDismissed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(false);

  // 检测是否在 Tauri 桌面环境中
  const isTauri = '__TAURI__' in window || '__TAURI_INTERNALS__' in window;

  useEffect(() => {
    if (isTauri) {
      // Tauri 环境下使用专门的 updater hook，这里只做基本检查
      setChecking(false);
      return;
    }

    const checkUpdate = async () => {
      try {
        const res = await fetch('https://api.github.com/repos/jingrongx/liuren/releases/latest');
        if (!res.ok) return;
        const data: ReleaseInfo = await res.json();
        const remoteVersion = data.tag_name.replace(/^v/, '');
        setLatestVersion(remoteVersion);

        // 根据平台提供不同的下载链接
        const apkAsset = data.assets.find(a => a.name.endsWith('.apk'));
        const exeAsset = data.assets.find(a => a.name.endsWith('.exe'));
        
        if (isWindows() && exeAsset) {
          setDownloadUrl(exeAsset.browser_download_url);
          setGhproxyUrl(`https://ghproxy.net/${exeAsset.browser_download_url}`);
        } else if (apkAsset) {
          setDownloadUrl(apkAsset.browser_download_url);
          setGhproxyUrl(`https://ghproxy.net/${apkAsset.browser_download_url}`);
        } else {
          setDownloadUrl(data.html_url);
          setGhproxyUrl(data.html_url);
        }
      } catch {
        setError(true);
      } finally {
        setChecking(false);
      }
    };

    const lastCheck = localStorage.getItem('liuren_last_update_check');
    const lastDismissed = localStorage.getItem('liuren_dismissed_version');
    if (lastDismissed) {
      setDismissed(true);
    }

    const now = Date.now();
    if (!lastCheck || now - parseInt(lastCheck) > 4 * 60 * 60 * 1000) {
      checkUpdate();
      localStorage.setItem('liuren_last_update_check', now.toString());
    } else {
      const cached = localStorage.getItem('liuren_latest_version');
      if (cached) setLatestVersion(cached);
      const cachedUrl = localStorage.getItem('liuren_download_url');
      if (cachedUrl) setDownloadUrl(cachedUrl);
      const cachedProxy = localStorage.getItem('liuren_ghproxy_url');
      if (cachedProxy) setGhproxyUrl(cachedProxy);
      setChecking(false);
    }
  }, [isTauri]);

  useEffect(() => {
    if (latestVersion) {
      localStorage.setItem('liuren_latest_version', latestVersion);
      localStorage.setItem('liuren_download_url', downloadUrl);
      localStorage.setItem('liuren_ghproxy_url', ghproxyUrl);
    }
  }, [latestVersion, downloadUrl, ghproxyUrl]);

  const hasUpdate = !checking && latestVersion && latestVersion > CURRENT_VERSION;
  const showBanner = hasUpdate && !(dismissed && localStorage.getItem('liuren_dismissed_version') === latestVersion);

  const handleDismiss = () => {
    setDismissed(true);
    if (latestVersion) localStorage.setItem('liuren_dismissed_version', latestVersion);
  };

  const handleRefresh = () => {
    setChecking(true);
    setError(false);
    setLatestVersion(null);
    localStorage.removeItem('liuren_last_update_check');
    setTimeout(() => window.location.reload(), 300);
  };

  return (
    <>
      {showBanner && !isTauri && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2.5 flex items-center justify-between gap-3 text-sm animate-slide-down">
          <div className="flex items-center gap-2 min-w-0">
            <Download className="w-4 h-4 shrink-0" />
            <span className="truncate">
              发现新版本 <strong>v{latestVersion}</strong>（当前 v{CURRENT_VERSION}）
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={ghproxyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-medium transition-colors"
            >
              <Download className="w-3 h-3" />
              国内下载
            </a>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              GitHub
            </a>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="text-center text-xs text-gray-400 py-2 px-4 flex items-center justify-center gap-2">
        <span>
          v{CURRENT_VERSION}
          {!checking && latestVersion && (
            <span className={hasUpdate ? 'text-blue-500 font-medium' : 'text-green-500'}>
              {' / 最新 '}
              v{latestVersion}
              {hasUpdate ? ' （可更新）' : ' （已是最新）'}
            </span>
          )}
          {checking && <span className="text-gray-400"> / 检查中...</span>}
          {error && <span className="text-gray-400"> / 检查失败</span>}
        </span>
        <button
          onClick={handleRefresh}
          title="检查更新"
          className="p-0.5 hover:text-gray-600 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>
    </>
  );
};

function isWindows(): boolean {
  if (typeof navigator === 'undefined') return false;
  return navigator.platform.indexOf('Win') > -1;
}

export default UpdateChecker;
