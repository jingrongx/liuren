# 六壬占卜 - 桌面版部署指南

## 📋 您需要做的（仅需一次配置）

### ✅ 已完成
- [x] Android APK 签名密钥 (`RELEASE_KEYSTORE_BASE64`)
- [x] GitHub Actions 自动发布流程

### 🔸 可选配置（推荐但非必须）

#### 方案A：不配置签名密钥（简单）
- **效果**：桌面版正常构建，自动更新功能不可用
- **用户更新方式**：手动下载新版本 EXE
- **适用场景**：初期测试、内部使用

#### 方案B：配置签名密钥（推荐生产环境）

**步骤1：生成密钥**（需要本地安装 Rust，仅此一次）
```bash
# 1. 安装 Rust（如果未安装）
# 访问 https://rustup.rs/ 下载安装

# 2. 生成签名密钥
npx tauri signer generate -w ~/.tauri/liuren.key

# 3. 设置密码（自定义）
# 输入密码后按回车确认
```

**步骤2：添加到 GitHub Secrets**

1. 打开仓库 → Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. 添加两个 Secret：

| Name | Value |
|------|-------|
| `TAURI_PRIVATE_KEY` | 复制 `~/.tauri/liuren.key` 文件的**全部内容** |
| `TAURI_KEY_PASSWORD` | 您刚才设置的密码 |

---

## 🚀 使用流程（完全自动化）

### 开发者视角
```bash
# 1. 写代码
git add .
git commit -m "feat: 新功能"
git push origin main

# 2. 等待 5-10 分钟...
#    GitHub Actions 会自动：
#    ✓ 构建 Android APK
#    ✓ 构建 Windows EXE
#    ✓ 发布到 GitHub Releases

# 3. 在 Releases 页面下载测试
```

### 用户视角

#### Android 用户
1. 打开 Releases 页面
2. 下载 `app-release.apk`
3. 安装到手机

#### Windows 用户
1. 打开 Releases 页面
2. 下载 `liuren_x.x.x_x64-setup.exe` (约15MB)
3. 双击运行
4. 点击"下一步"直到完成
5. 桌面出现快捷方式 → 双击启动 ✅

> **注意**：用户无需安装任何依赖！Windows 10/11 已内置 WebView2 运行时。

---

## ⏱️ 构建时间参考

| 环境 | 首次构建 | 后续构建（有缓存） |
|------|---------|------------------|
| Android APK | ~5分钟 | ~3分钟 |
| Windows EXE | ~8-10分钟 | ~5-6分钟 |

---

## 📁 构建产物位置（GitHub Actions）

成功后会在 Release 页面看到：

```
Release v1.2.21
├── app-release.apk              # Android 版本 (~10MB)
└── liuren_1.2.21_x64-setup.exe # Windows 桌面版 (~15MB)
```

---

## ❓ 常见问题

### Q: 本地开发需要安装 Rust 吗？
**A: 不需要。** 只有在生成签名密钥时才需要 Rust。日常开发只需：
```bash
npm run dev      # Web 开发模式
npx cap sync android && npx cap open android  # Android 调试
```

### Q: 为什么选择 Tauri 而不是 Electron？
**A:**
- **体积**: Tauri 15MB vs Electron 150MB+ （差10倍！）
- **性能**: Tauri 使用系统 WebView，内存占用低
- **体验**: 启动速度更快

### Q: 桌面版支持哪些系统？
**A:**
- ✅ Windows 10/11 (64位)
- ✅ macOS 10.15+ (可扩展)
- ✅ Linux (可扩展)

当前配置只构建 Windows 版本，如需其他平台请告知。

### Q: 如何禁用桌面版构建？
**A:** 删除或注释 `.github/workflows/release.yml` 中的 `build-desktop` job 即可。

### Q: 更新检查频率是多少？
**A:**
- Web版/Android版：每4小时检查一次
- 桌面版：每次启动时检查 + 每4小时后台检查

---

## 🎯 下一步建议

1. **首次推送测试**
   ```bash
   git push origin main
   ```
   观察 Actions 是否正常运行

2. **下载测试 EXE**
   - 验证安装流程是否顺畅
   - 测试应用功能是否正常

3. **（可选）启用自动更新签名**
   - 按上述"方案B"配置密钥
   - 让用户体验无缝更新

---

## 📞 技术支持

如有问题，请检查：
1. GitHub Actions 日志（Actions 标签页）
2. 确保所有 Secrets 已正确配置
3. 查看 Tauri 官方文档：https://tauri.app/

---

**最后更新**: 2024年
