// 从 package.json 读取版本号
import packageJson from '../../package.json';

export const getApkDownloadUrl = () => {
  const version = packageJson.version;
  return `https://github.com/jingrongx/liuren/releases/download/${version}/app-release.apk`;
};

export const getLatestApkDownloadUrl = () => {
  // 使用 latest 标签，假设 GitHub 会重定向到最新版本
  return `https://github.com/jingrongx/liuren/releases/latest/download/app-release.apk`;
};