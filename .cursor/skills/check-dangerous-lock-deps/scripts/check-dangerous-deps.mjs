#!/usr/bin/env node
/**
 * 扫描 package-lock / yarn.lock / pnpm-lock 与 npm ls，比对危险包版本黑名单。
 * 用法：在仓库根目录执行
 *   node .cursor/skills/check-dangerous-lock-deps/scripts/check-dangerous-deps.mjs
 *
 * 选项：
 *   --config <path>     自定义 danger-packages.json 路径
 *   --skip-node-modules 仅检查 lock，不执行 npm ls
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const out = { config: null, skipNodeModules: false };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--config" && argv[i + 1]) {
      out.config = path.resolve(argv[++i]);
    } else if (argv[i] === "--skip-node-modules") {
      out.skipNodeModules = true;
    }
  }
  return out;
}

function findProjectRoot(startDir) {
  let dir = path.resolve(startDir);
  const root = path.parse(dir).root;
  while (dir !== root) {
    if (fs.existsSync(path.join(dir, "package.json"))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return null;
}

function loadDangerMap(configPath) {
  const raw = fs.readFileSync(configPath, "utf8");
  const data = JSON.parse(raw);
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new Error("danger-packages.json must be a JSON object: { \"pkg\": [\"ver\"] }");
  }
  const map = {};
  for (const [pkg, vers] of Object.entries(data)) {
    if (!Array.isArray(vers)) {
      throw new Error(`Versions for "${pkg}" must be an array of strings`);
    }
    map[pkg] = new Set(vers.map(String));
  }
  return map;
}

function collectNpmLockV1(deps, acc) {
  if (!deps || typeof deps !== "object") {
    return;
  }
  for (const [name, meta] of Object.entries(deps)) {
    if (meta && typeof meta.version === "string") {
      if (!acc[name]) {
        acc[name] = new Set();
      }
      acc[name].add(meta.version);
    }
    if (meta.dependencies) {
      collectNpmLockV1(meta.dependencies, acc);
    }
  }
}

function parseNpmPackageKey(key) {
  const idx = key.lastIndexOf("node_modules/");
  if (idx === -1) {
    return null;
  }
  return key.slice(idx + "node_modules/".length);
}

function collectNpmLockV2Plus(packages, acc) {
  if (!packages || typeof packages !== "object") {
    return;
  }
  for (const [key, meta] of Object.entries(packages)) {
    if (key === "" || !meta || typeof meta.version !== "string") {
      continue;
    }
    const name = parseNpmPackageKey(key);
    if (!name) {
      continue;
    }
    if (!acc[name]) {
      acc[name] = new Set();
    }
    acc[name].add(meta.version);
  }
}

function keyMatchesYarnDescriptor(descriptor, packageName) {
  const d = descriptor.trim();
  if (packageName.startsWith("@")) {
    return d.startsWith(`${packageName}@`);
  }
  const at = d.indexOf("@");
  if (at === -1) {
    return false;
  }
  return d.slice(0, at) === packageName;
}

function collectYarnLock(content, packageNames) {
  const acc = {};
  for (const p of packageNames) {
    acc[p] = new Set();
  }
  const lines = content.split(/\n/);
  let currentKeys = [];

  for (const line of lines) {
    if (/^\s/.test(line)) {
      const vm = line.match(/^\s+version\s+"([^"]+)"/);
      if (vm && currentKeys.length) {
        for (const key of currentKeys) {
          for (const pkg of packageNames) {
            if (keyMatchesYarnDescriptor(key, pkg)) {
              acc[pkg].add(vm[1]);
            }
          }
        }
      }
      continue;
    }
    const t = line.trim();
    if (t === "" || t.startsWith("#")) {
      continue;
    }
    const hm = line.match(/^(.+):\s*$/);
    if (hm) {
      let header = hm[1].trim();
      if (header.startsWith('"') && header.endsWith('"')) {
        header = header.slice(1, -1);
      }
      currentKeys = header.split(/\s*,\s*/).map((k) => k.trim());
    } else {
      currentKeys = [];
    }
  }
  return acc;
}

/**
 * pnpm-lock.yaml packages 节常见行：/axios@1.6.0: 或 /@scope/pkg@1.0.0:
 */
function collectPnpmLockYaml(content, packageNames) {
  const acc = {};
  for (const p of packageNames) {
    acc[p] = new Set();
  }
  const nameSet = new Set(packageNames);
  const re = /^\s+\/((?:@[^@/]+\/)?[^@/]+)@([^:]+):\s*$/;
  for (const line of content.split("\n")) {
    const m = line.match(re);
    if (!m) {
      continue;
    }
    const pkgName = m[1];
    const ver = m[2];
    if (nameSet.has(pkgName)) {
      acc[pkgName].add(ver);
    }
  }
  return acc;
}

function collectNpmLsVersions(projectRoot) {
  const acc = {};
  const r = spawnSync(
    process.platform === "win32" ? "npm.cmd" : "npm",
    ["ls", "--json", "--all"],
    {
      cwd: projectRoot,
      encoding: "utf8",
      maxBuffer: 50 * 1024 * 1024
    }
  );
  let data;
  try {
    data = JSON.parse(r.stdout || "{}");
  } catch {
    return { acc, error: "npm ls output is not valid JSON" };
  }
  if (data.error && !data.dependencies) {
    return { acc, error: data.error.message || String(data.error) };
  }

  function walkDeps(deps, chain) {
    if (!deps || typeof deps !== "object") {
      return;
    }
    for (const [name, info] of Object.entries(deps)) {
      if (!info || typeof info !== "object") {
        continue;
      }
      const chainNext = chain ? `${chain} > ${name}` : name;
      if (typeof info.version === "string") {
        if (!acc[name]) {
          acc[name] = [];
        }
        acc[name].push({ version: info.version, chain: chainNext });
      }
      if (info.dependencies) {
        walkDeps(info.dependencies, chainNext);
      }
    }
  }

  walkDeps(data.dependencies, "");
  return { acc, error: null };
}

function hitsFromSets(versionSets, dangerMap) {
  const hits = [];
  for (const [pkg, badVers] of Object.entries(dangerMap)) {
    const set = versionSets[pkg];
    if (!set || !set.size) {
      continue;
    }
    for (const v of set) {
      if (badVers.has(v)) {
        hits.push({ pkg, version: v, source: "lock" });
      }
    }
  }
  return hits;
}

function hitsFromNpmLs(lsAcc, dangerMap) {
  const hits = [];
  for (const [pkg, badVers] of Object.entries(dangerMap)) {
    const entries = lsAcc[pkg];
    if (!entries) {
      continue;
    }
    for (const { version, chain } of entries) {
      if (badVers.has(version)) {
        hits.push({ pkg, version, source: "node_modules", chain });
      }
    }
  }
  return hits;
}

function mergeLockSets(a, b) {
  const out = { ...a };
  for (const [pkg, set] of Object.entries(b)) {
    if (!out[pkg]) {
      out[pkg] = new Set();
    }
    for (const v of set) {
      out[pkg].add(v);
    }
  }
  return out;
}

/**
 * 打印 danger-packages.json 中每个包在 lock / npm ls 中实际出现的版本（供审计对照）。
 */
function printResolvedVersions(packageNames, lockVersions, lsAcc, opts) {
  const { skipNodeModules, lsErr } = opts;
  console.log("\n--- 配置包在本项目中的落地版本 ---\n");
  for (const pkg of [...packageNames].sort()) {
    const lockSet = lockVersions[pkg];
    const lockStr =
      lockSet && lockSet.size > 0
        ? [...lockSet].sort().join(", ")
        : "（lock 中未发现该包）";
    console.log(pkg);
    console.log(`  lock: ${lockStr}`);
    if (skipNodeModules) {
      console.log("  node_modules: （已跳过，未执行 npm ls）");
    } else if (lsErr) {
      console.log(`  node_modules: （npm ls 不可用: ${lsErr}）`);
    } else {
      const entries = lsAcc[pkg];
      if (!entries || entries.length === 0) {
        console.log("  node_modules: （依赖树中未发现该包）");
      } else {
        const byVer = new Map();
        for (const e of entries) {
          if (!byVer.has(e.version)) {
            byVer.set(e.version, []);
          }
          byVer.get(e.version).push(e.chain);
        }
        const verStr = [...byVer.keys()].sort().join(", ");
        console.log(`  node_modules: ${verStr}`);
        const maxChainsPerVer = 8;
        for (const v of [...byVer.keys()].sort()) {
          const chains = byVer.get(v);
          const show = chains.slice(0, maxChainsPerVer);
          for (const c of show) {
            console.log(`    - ${v}  ← ${c}`);
          }
          if (chains.length > maxChainsPerVer) {
            console.log(`    … 同版本另有 ${chains.length - maxChainsPerVer} 条路径`);
          }
        }
      }
    }
    console.log("");
  }
}

function main() {
  const args = parseArgs(process.argv);
  const projectRoot = findProjectRoot(process.cwd());
  if (!projectRoot) {
    console.error("Could not find package.json above cwd.");
    process.exit(2);
  }

  const defaultConfig = path.join(
    projectRoot,
    ".cursor/skills/check-dangerous-lock-deps/danger-packages.json"
  );
  const configPath = args.config || defaultConfig;
  if (!fs.existsSync(configPath)) {
    console.error(`Missing config: ${configPath}`);
    process.exit(2);
  }

  let dangerMap;
  try {
    dangerMap = loadDangerMap(configPath);
  } catch (e) {
    console.error(e.message || e);
    process.exit(2);
  }
  const packageNames = Object.keys(dangerMap);
  if (packageNames.length === 0) {
    console.log("No packages in danger list. Nothing to check.");
    process.exit(0);
  }

  let lockVersions = {};
  const lockPath = path.join(projectRoot, "package-lock.json");
  const yarnPath = path.join(projectRoot, "yarn.lock");
  const pnpmPath = path.join(projectRoot, "pnpm-lock.yaml");

  if (fs.existsSync(lockPath)) {
    let lock;
    try {
      lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
    } catch (e) {
      console.error("Failed to parse package-lock.json:", e.message);
      process.exit(2);
    }
    const lv = lock.lockfileVersion || 1;
    const acc = {};
    if (lv >= 2 && lock.packages) {
      collectNpmLockV2Plus(lock.packages, acc);
    } else if (lock.dependencies) {
      collectNpmLockV1(lock.dependencies, acc);
    }
    lockVersions = mergeLockSets(lockVersions, acc);
    console.log(`Scanned package-lock.json (lockfileVersion ${lv}).`);
  }

  if (fs.existsSync(yarnPath)) {
    const yc = fs.readFileSync(yarnPath, "utf8");
    const yAcc = collectYarnLock(yc, packageNames);
    lockVersions = mergeLockSets(lockVersions, yAcc);
    console.log("Scanned yarn.lock.");
  }

  if (fs.existsSync(pnpmPath)) {
    const pc = fs.readFileSync(pnpmPath, "utf8");
    const pAcc = collectPnpmLockYaml(pc, packageNames);
    lockVersions = mergeLockSets(lockVersions, pAcc);
    console.log("Scanned pnpm-lock.yaml.");
  }

  if (
    !fs.existsSync(lockPath) &&
    !fs.existsSync(yarnPath) &&
    !fs.existsSync(pnpmPath)
  ) {
    console.log("No package-lock.json, yarn.lock, or pnpm-lock.yaml found.");
  }

  const lockHits = hitsFromSets(lockVersions, dangerMap);
  let lsHits = [];
  let lsAcc = {};
  let lsErr = null;

  if (!args.skipNodeModules) {
    const r = collectNpmLsVersions(projectRoot);
    lsAcc = r.acc;
    lsErr = r.error;
    if (lsErr) {
      console.warn(`npm ls: ${lsErr} (lock scan still valid)`);
    } else {
      lsHits = hitsFromNpmLs(lsAcc, dangerMap);
      console.log("Scanned node_modules via npm ls --json.");
    }
  } else {
    console.log("Skipped npm ls (--skip-node-modules).");
  }

  printResolvedVersions(packageNames, lockVersions, lsAcc, {
    skipNodeModules: args.skipNodeModules,
    lsErr
  });

  const uniqueHits = [];
  const seen = new Set();
  for (const h of [...lockHits, ...lsHits]) {
    const k = `${h.pkg}|${h.version}|${h.source}|${h.chain || ""}`;
    if (seen.has(k)) {
      continue;
    }
    seen.add(k);
    uniqueHits.push(h);
  }

  console.log("\n--- Danger package report ---\n");
  console.log(`Project root: ${projectRoot}`);
  console.log(`Config: ${configPath}\n`);

  if (uniqueHits.length === 0) {
    console.log("Result: PASS (no configured dangerous versions found in lock or npm ls).");
    process.exit(0);
  }

  console.log("Result: FAIL — dangerous versions detected:\n");
  for (const h of uniqueHits) {
    const loc = h.source === "node_modules" ? `node_modules (npm ls)${h.chain ? ` — ${h.chain}` : ""}` : "lock file(s)";
    console.log(`  - ${h.pkg}@${h.version}  [${loc}]`);
  }
  console.log("\nRemove or replace these versions, then re-run install and this check.");
  process.exit(1);
}

main();
