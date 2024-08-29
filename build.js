import { renameSync } from 'fs';
import esbuild from 'esbuild';
import glob from 'glob';
import {execSync} from 'child_process';

// 先使用 TypeScript 编译器生成类型声明文件
execSync('npx tsc --emitDeclarationOnly');

// 获取所有 TypeScript 源文件
const entryPoints = glob.sync('src/**/*.ts');

// ESM build
esbuild.build({
  entryPoints: entryPoints,
  outdir: 'dist/esm',
  format: 'esm',
  sourcemap: true,
  platform: 'node',
  target: ['es6']
}).then(()=>{
    renameSync("./dist/index.js","./dist/index.esm.js");
}).catch(() => process.exit(1));

// CJS build
esbuild.build({
  entryPoints: entryPoints,
  outdir: 'dist/cjs',
  format: 'cjs',
  sourcemap: true,
  platform: 'node',
  target: ['es6']
}).then(()=>{
  renameSync("./dist/index.js","./dist/index.cjs.js");
}).catch(() => process.exit(1));

