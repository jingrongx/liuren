import { isTauri } from '../hooks/useTauriUpdater';

export async function openUrl(url: string): Promise<void> {
  if (isTauri()) {
    try {
      // 动态导入 tauri-plugin-opener
      const openerModule = await import('@tauri-apps/plugin-opener');
      // 使用类型断言来避免 TypeScript 类型错误
      const open = (openerModule as any).open || (openerModule as any).default?.open;
      if (typeof open === 'function') {
        await open(url);
      } else {
        throw new Error('open function not found in opener module');
      }
    } catch (error) {
      console.error('打开链接失败:', error);
      // 失败时回退到 Web 方法
      fallbackOpenUrl(url);
    }
  } else {
    fallbackOpenUrl(url);
  }
}

function fallbackOpenUrl(url: string): void {
  try {
    const newWindow = window.open(url, '_blank');
    if (!newWindow) {
      window.location.href = url;
    }
  } catch (error) {
    console.error('打开链接失败:', error);
    window.location.href = url;
  }
}