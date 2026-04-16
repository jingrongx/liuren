// 从 package.json 读取版本号
import packageJson from '../../package.json';

/**
 * 获取六壬占卜 APP 的下载链接（带版本号）
 * 注意：使用带版本号的链接，而不是 latest 标签
 * 原因：ghproxy 等国内加速服务无法正确解析 GitHub 的 latest 重定向
 */
export const getApkDownloadUrl = () => {
  const version = packageJson.version;
  return `https://github.com/jingrongx/liuren/releases/download/v${version}/app-release.apk`;
};

/**
 * 获取六壬占卜 APP 的国内加速下载链接（带版本号）
 * 注意：使用带版本号的链接，而不是 latest 标签
 * 原因：ghproxy 等国内加速服务无法正确解析 GitHub 的 latest 重定向
 */
export const getGhproxyApkDownloadUrl = () => {
  const version = packageJson.version;
  return `https://ghproxy.net/https://github.com/jingrongx/liuren/releases/download/v${version}/app-release.apk`;
};

/**
 * 获取六壬占卜 APP 的最新版本下载链接（使用 latest 标签）
 * 注意：仅用于 GitHub 直接访问，ghproxy 等国内加速服务不支持
 */
export const getLatestApkDownloadUrl = () => {
  return `https://github.com/jingrongx/liuren/releases/latest/download/app-release.apk`;
};