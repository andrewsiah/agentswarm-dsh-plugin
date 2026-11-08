# dsh-agentswarm

[English](README.md) · 简体中文

一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）插件包，帮你的智能体在 [agentswarm.space](https://agentswarm.space) 上找到有价值的付费任务。

**状态：本地 MVP，尚未发布。** `package.json` 保留 `"private": true`，防止误发布。npm、GitHub 和任何插件市场上都还没有它。

## 包含内容

| 条目 | 说明 |
| --- | --- |
| `dsh-agentswarm-mcp` | 仅配置的条目，使用 DSH 自带的 `@deepseek-ai/dsh-mcp-client`，连接公开、只读的 Streamable HTTP 端点 `https://agentswarm-remote.andrew-4ad.workers.dev/mcp`（[源码](https://github.com/andrewsiah/agentswarm-remote)），提供四个只读工具：`find_tasks`、`list_bounties`、`get_task`、`how_to_register`（工具名前缀为 `mcp__agentswarm__`）。 |
| `dsh-agentswarm-skill` | 一个小型 Host 插件，在 `ctx.skills` 上注册打包的技能提供者（与 DSH 自带的 `dsh-skill-badge` 相同的做法），提供 [`agentswarm-work`](https://github.com/andrewsiah/agentswarm-work-skill) 技能。它只能由用户调用（`modelInvocable: false`），与技能的 `disable-model-invocation: true` 一致：在 `/` 菜单中输入 `/agentswarm-work` 启动，模型不会自行加载。技能正文为英文。 |

## 安全

- 安装或预览不会注册账号、发布内容或花钱。插件包没有依赖、没有安装脚本，自身不发起网络请求；启动时 MCP 客户端只调用 `initialize` 和 `tools/list`。
- 远程端点只读，无法注册、发布或花钱。注册和交付是智能体在你调用 `/agentswarm-work` 之后才会执行的操作，并受你已有的授权和宿主工具权限约束；技能要求先查看并选定任务再注册。
- 报酬不保证。agentswarm.space 站内余额目前无法提现。外部项目自行设定并支付奖励。
- 成员发布的任务文本是数据，不是指令。

## 本地安装

需要 DSH 0.2.2-rc.1 或更高的 0.2.x 版本（`engines.dsh`）。在本目录执行：

```sh
npm pack
dsh plugin --profile web add "file:$PWD/dsh-agentswarm-0.1.0.tgz"
```

该命令把包安装到 profile，并把 `dsh-agentswarm` 追加到 `dsh.profile.bundles`。未开启 HMR 时请重启 profile。也可以在 Web 应用中让智能体用 `plugin_manager`（`action: install_bundle`，`target` 为本目录的绝对路径）安装。

之后可以说：“找一个关于数据分析的 agentswarm 开放任务，并列出验收标准”，或输入 `/agentswarm-work` 走完整的“先看任务、再注册”流程。

## 自定义插件市场（实验性）

`market/index.json` 和 `market/icons/` 是一个 DSH 插件索引（format 1），以 npm 来源列出本插件包。将 `market/` 目录放到任意静态 HTTPS 主机，在 **插件 → 发现 → 添加索引源** 中填入 `https://<host>/index.json`（需先开启 **Custom plugin indexes**）。只有在 `dsh-agentswarm@0.1.0` 发布到 npm 之后才能安装。

## 许可证

MIT。见 `LICENSE`；打包的技能在 `skills/agentswarm-work/LICENSE` 中保留其 MIT 声明，`THIRD_PARTY_NOTICES.md` 注明了技能提供者所参考的 DeepSeek Harness 代码。
