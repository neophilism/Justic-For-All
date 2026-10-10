import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const patterns = [
  { name: "private-key-header", regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: "github-personal-access-token", regex: /gh[pousr]_[A-Za-z0-9]{30,}/ },
  { name: "neon-credential", regex: /npg_[A-Za-z0-9]{20,}/ },
  { name: "aws-access-key", regex: /AKIA[0-9A-Z]{16}/ }
];

export function scanContents(source) {
  return patterns.filter(({regex})=>regex.test(source)).map(({name})=>name);
}

export function scanTrackedFiles() {
  const items = execFileSync("git",["ls-files","-z"],{encoding:"utf8"}).split("\0").filter(Boolean);
  const excluded = /(^|\/)(pnpm-lock\.yaml|package-lock\.json|yarn\.lock)$/;
  const findings = [];
  for (const path of items) {
    if (excluded.test(path)) continue;
    if (!/\.(?:md|mjs|js|ts|tsx|json|yml|yaml|env|sql|css)$|^\.env\.example$/.test(path)) continue;
    const content = readFileSync(path,"utf8");
    for(const rule of scanContents(content)) findings.push({path,rule});
  }
  return findings;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const findings=scanTrackedFiles();
  for(const {path,rule} of findings) console.error("Potential committed secret: "+path+" ("+rule+")");
  if(findings.length) process.exitCode=1;
  else console.info("Tracked-file secret heuristics: no matches. This is not a substitute for expert review.");
}
