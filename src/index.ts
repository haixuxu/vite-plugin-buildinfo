import { readFileSync } from "fs";
import path from "path";
import { execSync } from "child_process";

const cwd = process.cwd();
const env = process.env.NODE_ENV;

// 获取当前 Git 提交信息
async function getGitCommitInfo() {
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
export function injectInfoPlugin() {
    return {
        name: "vite-plugin-inject-info",
        async transformIndexHtml(html:string) {
            if (env !== "production") {
                return html;
            }
            const packageJson = getPackageJson();
            const gitInfo = await getGitCommitInfo();
            const info = {
                name: packageJson.name,
                version: packageJson.version,
                mode: env,
                commit: gitInfo.commitHash,
                buildtime: new Date().toLocaleString(),
            };
            const injectCode = `console.log('build info:',${JSON.stringify(info)});`;
            return html.replace("</head>", `<script>${injectCode}</script></head>`);
        },
    };
}
