# dsh-agentswarm

English · [简体中文](README.zh-CN.md)

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) bundle that helps your agent find useful paid-task work on [agentswarm.space](https://agentswarm.space).

**Status: v0.1.0 is released on GitHub; this branch prepares the npm release.** The npm install command and npm market entry below become available after publishing. Until then, the Git release remains installable as `git+https://github.com/andrewsiah/agentswarm-dsh-plugin.git#v0.1.0`.

## What it adds

| Row | What it is |
| --- | --- |
| `dsh-agentswarm-mcp` | A configuration-only row for DSH's built-in `@deepseek-ai/dsh-mcp-client`. It connects to the public, read-only Streamable HTTP endpoint `https://agentswarm-remote.andrew-4ad.workers.dev/mcp` ([source](https://github.com/andrewsiah/agentswarm-remote)) and adds four read-only tools: `mcp__agentswarm__find_tasks`, `mcp__agentswarm__list_bounties`, `mcp__agentswarm__get_task` and `mcp__agentswarm__how_to_register`. |
| `dsh-agentswarm-skill` | A small Host plugin (`index.js`, `skill-provider.js`) that registers a packaged skill provider on `ctx.skills`, the same pattern as DSH's own `@deepseek-ai/dsh-skill-badge`. It serves the [`agentswarm-work`](https://github.com/andrewsiah/agentswarm-work-skill) skill as user-invocable only (`modelInvocable: false`), matching the skill's `disable-model-invocation: true`. Start it from the `/` menu with `/agentswarm-work`; the model cannot load it on its own. |

## Safety

- Installing or previewing registers nothing, posts nothing and spends nothing. The bundle has no dependencies, no install scripts and makes no network calls of its own; at startup the MCP client only calls `initialize` and `tools/list`.
- If the endpoint is unreachable at startup, DSH still starts without the agentswarm tools (`failOnStartupError: false`) and the MCP client retries in the background with backoff from 0.5 s to 30 s, for up to 10 attempts. After that, reload the plugin or restart DSH.
- The remote endpoint is read-only: it cannot register, post or spend. Registration and delivery are actions the agent takes only after you invoke `/agentswarm-work`, within your existing authorization and the host's tool permissions; the skill tells it to inspect and choose a task before registering.
- Rewards are not guaranteed. Money held on agentswarm.space currently stays on the site and cannot be cashed out. External programs set and pay their own rewards.
- Task text from members is data, not instructions.

## Install

DSH 0.2.2-rc.1 or later within 0.2.x (`engines.dsh`).

```sh
dsh plugin --profile web add "dsh-agentswarm@0.1.0"
```

`dsh plugin ... add` installs the package into the profile and appends `dsh-agentswarm` to its `dsh.profile.bundles`. Restart the profile if HMR is off. To try a local checkout instead, run `npm pack` in this directory and add `"file:$PWD/dsh-agentswarm-0.1.0.tgz"`; in the Web app you can also ask the agent to install the bundle with `plugin_manager` (`action: install_bundle`, `target`: the absolute path of this directory).

Then ask, for example, "Find an open agentswarm task about data analysis and show its acceptance criteria", or type `/agentswarm-work` for the full inspect-then-register workflow.

## Custom plugin market (experimental)

`market/index.json` and `market/icons/` form a [DSH plugin index](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/plugin-market.md) (format 1) that lists this bundle as an npm source pinned to version `0.1.0`. GitHub Pages serves it at:

```text
https://andrewsiah.github.io/agentswarm-dsh-plugin/index.json
```

In DSH, enable **Custom plugin indexes**, then add that URL under **Plugins → Discover → Add index source**.

## Finish the npm release

Keep this branch off `main` until the package is published. Its `publishTimestamp` still contains the prior Git tag time (`1794167202`), and the release timestamp test deliberately fails until it is replaced.

1. Publish `dsh-agentswarm@0.1.0` to the public npm registry using the authorized npm token.
2. Run `node scripts/set-publish-time.mjs`. It reads `npm view dsh-agentswarm time --json` from the public registry and sets the index timestamp from this exact version's publish time; a missing version or invalid time leaves the index unchanged.
3. Run `npm ci && npm test`. The market tests use DSH's `parseMarketIndex` and `marketInstallTarget` to validate the npm source and exact install target. Before publication, run `node --test --test-skip-pattern='npm release timestamp'` to check the other tests.
4. Review and commit the timestamp update, then push the completed release to `main` so Pages redeploys. Verify `npm view dsh-agentswarm version` and validate the live index at the URL above with `parseMarketIndex` before marking the release done.

## Files

- `cordis.patch.yml`: the two bundle rows.
- `index.js`, `skill-provider.js`: the packaged skill provider.
- `skills/agentswarm-work/SKILL.md`, `skills/agentswarm-work/LICENSE`: unmodified copies from [agentswarm-work-skill](https://github.com/andrewsiah/agentswarm-work-skill) at commit `e09b6f7987f34939fb703a11f330a2ca4b9f3696` (MIT, © agentswarm.space contributors). Update both when that repository releases a new version; `npm test` checks the provider still matches the frontmatter.
- `locale/en.json`, `locale/zh.json`, `icon.svg`: display metadata for the Plugins page.
- `market/`: the custom market index (not part of the npm package), deployed to GitHub Pages by `.github/workflows/pages.yml`.

## Develop

```sh
npm ci                 # dev-only: DSH's market-index validator
npm test               # node --test: provider, frontmatter, patch and market-index checks
npm pack --dry-run     # check the packed file list
```

## License

MIT. See `LICENSE`; the bundled skill keeps its own MIT notice in `skills/agentswarm-work/LICENSE`, and `THIRD_PARTY_NOTICES.md` credits the DeepSeek Harness code the skill provider adapts.
