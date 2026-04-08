此次合并主要是为项目添加了 Android 平台支持，通过集成 Capacitor 框架实现了从 Web 应用到移动应用的转换。同时更新了首页布局，添加了 APK 下载按钮和新的页脚信息。
| 文件 | 变更 |
|------|---------|
| package.json | - 添加了 Capacitor 相关依赖（@capacitor/android、@capacitor/cli、@capacitor/core）<br>- 调整了依赖项顺序 |
| src/pages/Home.tsx | - 添加了 Android APK 下载按钮，链接到 GitHub Releases 页面<br>- 更新了页脚信息，添加了微信公众号和官网链接 |
| capacitor.config.ts | - 新增 Capacitor 配置文件，设置应用 ID 为 com.jingfangjia.liuren，应用名为六壬占卜 |
| android/ | - 新增完整的 Android 项目结构，包括构建配置、资源文件和源代码 |