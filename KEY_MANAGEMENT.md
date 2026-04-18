# 密钥管理指南

## 📋 当前密钥状态

### ✅ 已有密钥
- [x] Android Keystore: `.key/liuren.key.android`
- [x] Windows 公钥: `.key/liuren.key.windows.pub`

### ❓ 缺失密钥
- [ ] Windows 私钥: 用于 GitHub Actions 签名 EXE

---

## 🔧 重新生成 Windows 密钥对（如果需要）

### 步骤1：安装 Rust（如果未安装）
访问 https://rustup.rs/ 下载并安装 Rustup

### 步骤2：生成新的密钥对
```bash
npx tauri signer generate -w .key/liuren.key.windows
```

这会生成两个文件：
- `.key/liuren.key.windows`        # 私钥（绝密！）
- `.key/liuren.key.windows.pub`   # 公钥（可公开，会覆盖现有文件）

### 步骤3：设置密码
系统会提示输入密码，请记住这个密码！

### 步骤4：备份私钥
将私钥文件备份到安全的地方（如密码管理器）

---

## 🔐 配置到 GitHub Secrets

### 必须配置的 Secrets

#### 1. TAURI_PRIVATE_KEY（Windows 私钥）
- **来源**: `.key/liuren.key.windows` 的内容
- **操作**:
  1. 打开 `.key/liuren.key.windows`
  2. 复制全部内容
  3. 访问 https://github.com/jingrongx/liuren/settings/secrets/actions
  4. 点击 "New repository secret"
  5. Name: `TAURI_PRIVATE_KEY`
  6. Value: 粘贴私钥内容
  7. 点击 "Add secret"

#### 2. TAURI_KEY_PASSWORD（密钥密码）
- **来源**: 您生成密钥时设置的密码
- **操作**:
  1. 同样在 Secrets 页面
  2. Name: `TAURI_KEY_PASSWORD`
  3. Value: 您的密码
  4. 点击 "Add secret"

---

## ✅ 已配置的 Secrets（无需重复）

- [x] `RELEASE_KEYSTORE_BASE64` - Android 签名密钥
  - 来源: `.key/liuren.key.android` 的内容

---

## ⚠️ 安全注意事项

1. **绝对不要提交密钥文件到 Git**
   - `.gitignore` 已配置好，会自动忽略 `.key/` 目录

2. **定期备份密钥**
   - 如果丢失私钥，将无法为旧版本发布更新
   - 建议保存到密码管理器或加密的云存储

3. **不要分享私钥**
   - 私钥泄露会导致安全风险
   - 如果泄露，立即重新生成并轮换

---

## 🚀 配置完成后

推送代码即可触发自动构建：

```bash
git add .
git commit -m("chore: 更新密钥配置")
git push origin main
```

GitHub Actions 会自动：
1. 构建 Android APK（使用 RELEASE_KEYSTORE_BASE64）
2. 构建 Windows EXE（使用 TAURI_PRIVATE_KEY）
3. 发布到 GitHub Releases

---

## 📞 故障排查

### 问题：构建失败提示 "invalid signature"
**原因**: 私钥不正确或已过期
**解决**: 
1. 检查 Secrets 中的值是否正确
2. 确认密码是否匹配
3. 重新生成密钥对

### 问题：自动更新不可用
**原因**: 未配置 TAURI_PRIVATE_KEY
**解决**: 按上述步骤添加 Secret

### 问题：密钥文件被 Git 跟踪
**原因**: .gitignore 未生效
**解决**:
```bash
# 从 Git 中移除（保留本地文件）
git rm --cached .key/*
git commit -m("chore: 从 Git 中移除密钥文件")
```
