# Lock 文件与检查边界

## npm `package-lock.json`

- **lockfileVersion 1**：顶层 `dependencies` 嵌套树；每个节点可有 `version` 与嵌套 `dependencies`。脚本递归收集所有出现的包名与版本。
- **lockfileVersion 2+**：`packages` 对象，键为 `node_modules/...` 路径；取路径**最后一段** `node_modules/` 后的名称作为包名（含 scoped `@scope/pkg`）。

同一包可出现多次（不同嵌套路径），脚本会合并为版本集合。

## `yarn.lock`（Classic）

块首行形如 `axios@^1.0.0:` 或 `"@scope/pkg@1.0.0":`，可多描述符逗号分隔；块内 `version "x.y.z"` 为实际安装版本。脚本按块解析，将 `version` 归入匹配到的包名。

Yarn Berry（`.yarnrc.yml` + 不同 lock 形态）可能与 Classic 差异较大；若解析不全，请在 Berry 项目用手工或官方工具核对。

## `pnpm-lock.yaml`

在 `packages` 节中常见键：`/axios@1.6.0:`、`/@scope/pkg@1.0.0:`。脚本用正则提取包名与版本；若 pnpm 格式升级导致不匹配，需更新脚本或改用手工检索。

## `npm ls` 与包管理器

脚本默认在仓库根执行 `npm ls --json --all`，反映 **npm** 视角的安装树。纯 Yarn/PNPM 工作区若未用 npm 安装，可能报错或树不完整；此时以 **对应 lock 文件** 为主，或使用 `--skip-node-modules`。

## 版本匹配策略

仅做**字符串全等**比较，不使用 semver 范围运算；黑名单应写入与 lock 中完全一致的版本号（如 `1.14.1`）。
