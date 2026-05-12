---
name: check-dangerous-lock-deps
description: >-
  Scans package-lock.json, yarn.lock, pnpm-lock.yaml, and npm ls output against
  a configurable blacklist of package names and exact versions (supply chain /
  malicious release checks). Use when the user asks to verify dangerous
  dependencies, lockfile safety, axios or other compromised versions, or
  supply-chain remediation.
---

# 危险依赖：lock 与本地安装检查

## 配置（手动维护）

编辑本目录下的 [danger-packages.json](danger-packages.json)：

- 格式：`{ "包名": ["危险版本1", "危险版本2"] }`（**精确匹配** lock / `npm ls` 中的 `version` 字符串）。
- 示例已包含 axios 供应链通报版本 `1.14.1`、`0.30.4`；按需增删键值。
- JSON 不支持注释；敏感内网包名若不宜提交，可改用 `--config` 指向本地私有路径。

更细的 lock 格式说明见 [reference.md](reference.md)。

## 执行检查（优先脚本）

在**仓库根目录**（存在 `package.json` 的目录）运行：

```bash
node .cursor/skills/check-dangerous-lock-deps/scripts/check-dangerous-deps.mjs
```

- `--config <绝对或相对路径>`：自定义黑名单文件。
- `--skip-node-modules`：只扫 lock，不执行 `npm ls`（无安装树或 CI 仅验证 lock 时用）。

退出码：`0` 未命中，`1` 命中危险版本，`2` 配置或解析错误。

脚本会依次处理存在的 `package-lock.json`、`yarn.lock`、`pnpm-lock.yaml`，并默认执行 `npm ls --json --all` 比对本地树。**若项目实际用 Yarn / PNPM 安装**，`npm ls` 可能不完整或报错；此时应结合对应 lock 扫描结果，或加 `--skip-node-modules` 仅以 lock 为准。

## 若脚本不可用时的手工兜底

1. Read [danger-packages.json](danger-packages.json) 获取包名与版本列表。
2. 对每个「包名 + 版本」在 lock 文件中搜索（注意：子依赖也可能引入该包）。
3. 有 `node_modules` 时可在仓库根执行 `npm ls <包名> --all` 辅助查看解析版本。

## 输出说明

脚本会先输出 **「配置包在本项目中的落地版本」**：对 `danger-packages.json` 里每个包名，分别列出在 **lock（合并各 lock 文件解析结果）** 与 **`npm ls` 依赖树** 中出现的版本；`node_modules` 侧会附带若干条依赖链路径（同一版本多路径时会截断显示）。

随后为 **PASS / FAIL** 结论：

- 命中项：包名、版本、来源（lock / `node_modules` 依赖链）；
- 建议：降级/升级至安全版本、刷新 lock、全员 `npm ci` / `yarn install --frozen-lockfile` 等（按项目包管理器说明）。

本流程**不替代** `npm audit`，适用于**已知恶意版本号**的黑名单场景。
