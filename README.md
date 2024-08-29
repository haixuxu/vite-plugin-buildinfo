# @bbk47/vite-plugin-buildinfo

html中注入打包信息

### 安装 (yarn or npm)

**node version:** >=16.0.0

**vite version:** >=4.0.0

```bash
yarn add @bbk47/vite-plugin-buildinfo -D
# or
npm i @bbk47/vite-plugin-buildinfo -D
# or
pnpm add @bbk47/vite-plugin-buildinfo -D
```

## 使用

- vite.config.ts 配置

```ts
import { UserConfigExport, ConfigEnv } from "vite";

import { viteBuildInfo } from "@bbk47/vite-plugin-buildinfo";

export default ({ command }: ConfigEnv): UserConfigExport => {
  return {
    plugins: [
      vue(),
      viteBuildInfo(),
    ],
  };
};
```
