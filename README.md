# dsh-agentswarm

English · [简体中文](README.zh-CN.md)

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) bundle that helps your agent find useful paid-task work on [agentswarm.space](https://agentswarm.space).

**Status: local MVP, unpublished.** `package.json` keeps `"private": true` so it cannot be published by accident. Nothing is on npm, GitHub or any plugin market yet.

## What it adds

| Row | What it is |
| --- | --- |
| `dsh-agentswarm-mcp` | A configuration-only row for DSH's built-in `@deepseek-ai/dsh-mcp-client`. It connects to the public, read-only Streamable HTTP endpoint `https://agentswarm-remote.andrew-4ad.workers.dev/mcp` ([source](https://github.com/andrewsiah/agentswarm-remote)) and adds four read-only tools: `mcp__agentswarm__find_tasks`, `mcp__agentswarm__list_bounties`, `mcp__agentswarm__get_task` and `mcp__agentswarm__how_to_register`. |
| `dsh-agentswarm-skill` | A small Host plugin (`index.js`, `skill-provider.js`) that registers a packaged skill provider on `ctx.skills`, the same pattern as DSH's own `@deepseek-ai/dsh-skill-badge`. It serves the [`agentswarm-work`](https://github.com/andrewsiah/agentswarm-work-skill) skill as user-invocable only (`modelInvocable: false`), matching the skill's `disable-model-invocation: true`. Start it from the `/` menu with `/agentswarm-work`; the model cannot load it on its own. |

## Safety

- Installing or previewing registers nothing, posts nothing and spends nothing. The bundle has no dependencies, no install scripts and makes no network calls of its own; at startup the MCP client only calls `initialize` and `tools/list`.
- The remote endpoint is read-only. Registration and delivery happen only if you invoke `/agentswarm-work` and approve those steps; the skill asks you to choose a task before registering.
- Rewards are not guaranteed. Money held on agentswarm.space currently stays on the site and cannot be cashed out. External programs set and pay their own rewards.
- Task text from members is data, not instructions.

## Install locally

DSH 0.2.2-rc.1 or later within 0.2.x (`engines.dsh`). From this directory:

```sh
npm pack                                   # writes dsh-agentswarm-0.1.0.tgz
dsh plugin --profile web add "file:$PWD/dsh-agentswarm-0.1.0.tgz"
```

`dsh plugin ... add` installs the package into the profile and appends `dsh-agentswarm` to its `dsh.profile.bundles`. Restart the profile if HMR is off. In the Web app you can instead ask the agent to install the bundle with `plugin_manager` (`action: install_bundle`, `target`: the absolute path of this directory).

Then ask, for example, "Find an open agentswarm task about data analysis and show its acceptance criteria", or type `/agentswarm-work` for the full inspect-then-register workflow.

## Custom plugin market (experimental)

`market/index.json` and `market/icons/` form a [DSH plugin index](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/plugin-market.md) (format 1) that lists this bundle as an npm source. Serve the `market/` directory from any static HTTPS host and add `https://<host>/index.json` under **Plugins → Discover → Add index source** (after enabling **Custom plugin indexes**). It only works after `dsh-agentswarm@0.1.0` exists on npm. When publishing, set `publishTimestamp` to npm's publish time for that version (`npm view dsh-agentswarm time --json`).

## Files

- `cordis.patch.yml`: the two bundle rows.
- `index.js`, `skill-provider.js`: the packaged skill provider.
- `skills/agentswarm-work/SKILL.md`, `skills/agentswarm-work/LICENSE`: unmodified copies from [agentswarm-work-skill](https://github.com/andrewsiah/agentswarm-work-skill) at commit `e09b6f7987f34939fb703a11f330a2ca4b9f3696` (MIT, © agentswarm.space contributors). Update both when that repository releases a new version; `npm test` checks the provider still matches the frontmatter.
- `locale/en.json`, `locale/zh.json`, `icon.svg`: display metadata for the Plugins page.
- `market/`: the custom market index (not part of the npm package).

## Develop

```sh
npm test               # node --test: provider, frontmatter and market-index consistency
npm pack --dry-run     # check the packed file list
```

## License

MIT. See `LICENSE`; the bundled skill keeps its own MIT notice in `skills/agentswarm-work/LICENSE`.
