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
- `src/index.css`：项目图文布局等全局样式。
- `src/assets/portrait.webp`：首页个人肖像。
- `src/assets/projects/`：项目架构示意图。它们是解释性配图，不是实际产品截图。

项目描述应以本人实际完成的工作为准。谷粒商城是教学项目；更新时请只列本人完成并核实过的模块。网站目前不放联系电话或未经确认的指标。

## 发布

网站代码在 [JIN9XXX/mypage](https://github.com/JIN9XXX/mypage)，Vite 已设置 GitHub Pages 子路径 `/mypage/`。仓库保留 `npm run deploy` 脚本，可在已登录 GitHub 且仓库 Pages 配置允许 `gh-pages` 分支发布时，用它构建并发布 `dist/` 目录。
