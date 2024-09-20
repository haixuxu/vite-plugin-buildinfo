import { readFileSync } from "fs";
import path from "path";
import { execSync } from "child_process";

const cwd = process.cwd();
const env = process.env.NODE_ENV;

interface BuildInfoOpts {
  type?: string;
}

// 获取当前 Git 提交信息
function getGitCommitInfo() {
  try {
    const commitHash = execSync("git rev-parse HEAD").toString().trim();
    return { commitHash };
  } catch (error) {
    return { commitHash: "get failed" };
  }
}

function getPackageJson() {
  // 获取 package.json 信息
  return JSON.parse(readFileSync(path.resolve(cwd, "package.json"), "utf-8"));
}

// Vite 插件
export function viteBuildInfo(opts: BuildInfoOpts = {}) {
  return {
    name: "vite-plugin-inject-info",
    transformIndexHtml(html: string) {
      if (env !== "production") {
        return html;
      }
      const packageJson = getPackageJson();
      const gitInfo = getGitCommitInfo();
      const info = {
        name: packageJson.name,
        version: packageJson.version,
        mode: env,
        commit: gitInfo.commitHash,
        buildtime: new Date().toLocaleString(),
      };
      const code = `window.__buildinfo__=${JSON.stringify(info)}`;
      const injectCode = `${code};console.log(window.__buildinfo__);`;
      if (opts.type === "head") {
        return html.replace(
          "</head>",
          `<script>${injectCode}</script>
          </head>`
        );
      } else {
        return html.replace("<body>", `<body>
          <script>${injectCode}</script>`);
      }
    },
  };
}

// 0.0.1 used
export let injectInfoPlugin = viteBuildInfo;
