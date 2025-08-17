import { babel } from '@rollup/plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import nodePolyfills from 'rollup-plugin-polyfill-node';
// 根据环境变量决定输出格式
const format = process.env.FORMAT || 'esm';

export default {
  input: 'app/starter.js',
  output: {
    dir: `dist/${format}`,
    format,
    // 如果是UMD格式需要指定全局变量名
    name: format === 'umd' ? 'YourLibrary' : undefined,
    preserveModules: true // 保留原始模块结构
  },
  // plugins: [
  //   resolve({
  //     preferBuiltins: true  // 优先使用Node.js内置模块
  //   }),
  //   nodePolyfills({
  //     include: ['crypto'], // 显式指定 polyfill crypto
  //   }),
  //   commonjs(),
  //   babel({
  //     babelHelpers: 'bundled',
  //     exclude: 'node_modules/**',
  //     presets: [['@babel/preset-env', { modules: false }]]
  //   })
  // ],
  // external: (id) => id.startsWith('node:') || // 排除所有 `node:` 前缀的模块
  //   ['url', 'path', 'fs'].includes(id), // 也可以显式列出内置模块
};