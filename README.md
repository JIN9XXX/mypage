# 阮靖 · 个人作品集

一个以中文为主的个人作品集网站，用于介绍个人方向、学习与工作经历、项目实践和联系方式。网站使用 React 与 Vite 构建，适配桌面和手机浏览。

## 本地运行

需要 Node.js 22.12 或更高版本。

```sh
npm ci
npm run dev
```

终端会显示本地预览地址。检查生产版本可运行：

```sh
npm run build
npm run preview
```

## 内容与图片

- `src/App.jsx`：首页介绍、经历、项目、技能和联系方式。
- `src/index.css`：全局样式、章节过渡和图片显隐动效。
- `src/assets/portrait.webp`：首页个人肖像。
- `src/assets/projects/`：项目架构示意图。它们是解释性配图，不是实际产品截图。
- 图片默认以重复文字构成的纹理显示；鼠标移入后，原图会从指针所在位置圆形展开。点击可以固定或收起原图，键盘聚焦和手机点击同样可操作。

### 从图片生成文字图

生成脚本是 `scripts/generate_text_image.py`。需要 Python 3 和 Pillow（Python 的图片处理库）：

```sh
py -m pip install Pillow
py scripts/generate_text_image.py src/assets/portrait.webp src/assets/portrait-type.png --words "AGENT CONTEXT RUNTIME MEMORY TOOLS SYSTEM" --cell-width 7 --cell-height 10
```

项目图片也可以用同一个脚本，并为文字纹理提供对应词汇：

```sh
python scripts/generate_text_image.py src/assets/projects/agent-harness-source.png src/assets/projects/agent-harness-type.png --words "AGENT TOOL CONTEXT STATE MEMORY RUNTIME TRACE" --background-threshold 0.18 --cell-width 10 --cell-height 15 --detail-gamma 0.45 --sampling detail
python scripts/generate_text_image.py src/assets/projects/commerce-architecture-source.png src/assets/projects/commerce-architecture-type.png --words "ORDER PRODUCT INVENTORY SERVICE CACHE QUEUE" --background-threshold 0.18 --cell-width 10 --cell-height 15 --detail-gamma 0.45 --sampling detail
```

`--sampling detail` 会保留架构图里的细线和连接关系；照片使用默认的平均取样。`--detail-gamma` 小于 1 时会提亮暗部文字。`--cell-width` 和 `--cell-height` 控制文字颗粒的疏密，数值越小，文字越密。`--background-threshold` 会让较暗的底色变透明，适合深色架构图；肖像等有透明背景的素材通常不需要它。生成图会保存在指定的输出路径；`--check` 可检查文字图是否存在、尺寸是否与原图一致。

项目描述应以本人实际完成的工作为准。谷粒商城是教学项目；更新时请只列本人完成并核实过的模块。网站目前不放联系电话或未经确认的指标。

## 浏览器验收

本机安装 Chrome 后，先运行 `npm run build` 和 `npm run preview -- --port 4173`，保持预览服务运行，再在另一个终端执行：

```sh
npm run verify:browser
```

脚本检查首屏图左文右、眼睛放大、章节圆形展开的中间帧、字符流完全遮挡后跳转、浏览器返回、页面索引、图片移入移出、手机点击切换、字体与素材加载，以及 320 / 768 / 1024 / 1440px 布局。截图保存在不提交 Git 的 `shots/` 目录。预览端口不同可通过 `PREVIEW_URL` 指定完整地址。

## 发布方式

网站代码在 [JIN9XXX/mypage](https://github.com/JIN9XXX/mypage)，Vite 已设置 GitHub Pages 子路径 `/mypage/`。仓库保留 `npm run deploy` 脚本，可在已登录 GitHub 且仓库 Pages 配置允许 `gh-pages` 分支发布时，用它构建并发布 `dist/` 目录。
