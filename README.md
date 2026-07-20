# 1:09 Portfolio 本地复刻

完整静态站位于 `site/`，包含首页、Works、17 个作品详情、Profile、Contact 和 Thanks 页面。

## 启动

最简单的方式：双击项目根目录中的 `打开本地网站.cmd`。启动器会打开服务器窗口和浏览器。

也可以在 PowerShell 中运行：

```powershell
.\start-site.ps1
```

然后访问 <http://127.0.0.1:8099>。不要直接双击 HTML；站内根路径和模块脚本需要通过本地 HTTP 服务运行。

Contact 表单在离线版本中只演示提交流程，会跳转到本地 Thanks 页面，不会发送邮件。

# wangzhan

## Cloudflare Workers 部署

本仓库已经包含 Cloudflare Workers 静态资源配置：

- Worker 名称：`wangzhan`
- 静态资源目录：`site`
- 部署命令：`npx wrangler deploy`

Cloudflare Workers Builds 设置：

- Production branch：`main`
- Build command：留空
- Deploy command：`npx wrangler deploy`
- Root directory：留空
