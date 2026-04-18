import { useState, useEffect } from 'react';
import { check } from '@tauri-apps/plugin-updater';

interface UpdateInfo {
  version: string;
  date: string;
  body: string;
}

export function useTauriUpdater() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const checkForUpdate = async () => {
    try {
      const update = await check();
      if (update) {
        setUpdateInfo({
          version: update.version,
          date: update.date,
          body: update.body,
        });
        setUpdateAvailable(true);
      }
    } catch (err) {
      console.error('检查更新失败:', err);
      setError(err instanceof Error ? err.message : '检查更新失败');
    }
  };

  const downloadAndInstall = async () => {
    if (!updateInfo) return;

    try {
      setDownloading(true);
      setProgress(0);
      
      const update = await check();
      if (update) {
        // 模拟进度
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + Math.random() * 10;
          });
        }, 200);

        await update.downloadAndInstall(() => {});
        
        clearInterval(progressInterval);
        setProgress(100);
        
        alert('更新下载完成，应用将重启以完成安装');
        
        // 使用 Tauri 的 relaunch API
        if ('__TAURI__' in window) {
          await (window as any).__TAURI__.process.relaunch();
        } else {
          window.location.reload();
        }
      }
    } catch (err) {
      console.error('更新安装失败:', err);
      setError(err instanceof Error ? err.message : '更新安装失败');
      setDownloading(false);
    }
  };

  useEffect(() => {
    checkForUpdate();
    
    // 每4小时检查一次更新
    const interval = setInterval(checkForUpdate, 4 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    updateAvailable,
    updateInfo,
    downloading,
    progress,
    error,
    checkForUpdate,
    downloadAndInstall,
  };
}
