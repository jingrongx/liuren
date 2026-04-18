import packageJson from '../../package.json';

const version = packageJson.version;

export const getApkDownloadUrl = () => {
  return `https://github.com/jingrongx/liuren/releases/download/v${version}/六壬占卜_v${version}.apk`;
};

export const getGhproxyApkDownloadUrl = () => {
  return `https://ghproxy.net/https://github.com/jingrongx/liuren/releases/download/v${version}/六壬占卜_v${version}.apk`;
};

export const getLatestApkDownloadUrl = () => {
  return `https://github.com/jingrongx/liuren/releases/latest/download/六壬占卜_v${version}.apk`;
};

export const getExeDownloadUrl = () => {
  return `https://github.com/jingrongx/liuren/releases/download/v${version}/六壬占卜_${version}_x64-setup.exe`;
};

export const getGhproxyExeDownloadUrl = () => {
  return `https://ghproxy.net/https://github.com/jingrongx/liuren/releases/download/v${version}/六壬占卜_${version}_x64-setup.exe`;
};

export const getLatestExeDownloadUrl = () => {
  return `https://github.com/jingrongx/liuren/releases/latest/download/六壬占卜_${version}_x64-setup.exe`;
};
