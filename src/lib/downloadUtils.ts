// 从 package.json 读取版本号
import packageJson from '../../package.json';

// 直接使用 package.json 中的版本号构建下载链接
export const getApkDownloadUrl = () => {
  const version = packageJson.version;
  return `https://github.com/jingrongx/liuren/releases/download/${version}/app-release.apk`;
};

// 构建国内加速下载链接
export const getGhproxyApkDownloadUrl = () => {
  const version = packageJson.version;
  return `https://ghproxy.net/https://github.com/jingrongx/liuren/releases/download/${version}/app-release.apk`;
};

// 使用 latest 标签，GitHub 会重定向到最新版本
export const getLatestApkDownloadUrl = () => {
  return `https://github.com/jingrongx/liuren/releases/latest/download/app-release.apk`;
};