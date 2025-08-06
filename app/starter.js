'use strict';
import fs from 'fs';
import path from 'path';
// const fs = require('fs');
// const path = require('path');

import SaSecureUtil from '../sa-token/secure/SaSecureUtil.js';
import SaTotpTemplate from '../sa-token/secure/totp/SaTotpTemplate.js';

import SaHexUtil from '../sa-token/util/SaHexUtil.js';
// import SaSession from '../sa-token/session/SaSession.js';
import SaTokenConsts from '../sa-token/util/SaTokenConsts.js';

const aaa = new SaTokenConsts("aaa","bbbb");
// const aaa = new SaSession("111");
// const bytes = new Uint8Array([0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0]);
// const hexStr = SaHexUtil.bytesToHex(bytes);


//console.log('SaHexUtil:', hexStr); 

// const newBytes = SaHexUtil.hexToBytes('123456789ABCDEF0');
// console.log('Byte array:', newBytes); 
// SaHexUtil.printJavaHexStyle(newBytes);  // 以Java十六进制风格打印

// const hexStr = SaHexUtil.bytesToHex(newBytes);


// console.log('SaHexUtil:', hexStr); 












function applyConfig () {
    // // 获取工作目录
    // const baseDir = path.resolve(__dirname, '../');
    // config.init(baseDir);
    // const files = fs.readdirSync(path.resolve(`${baseDir}/app/config`));
  
    // // 加载 config 目录下的配置文件
    // for (const file of files) {
    //   config.getConfigFromFile(`app/config/${file}`);
    // }
  
    // // 加载其它配置文件
    // config.getConfigFromFile('app/extension/file/config.js');
    // config.getConfigFromFile('app/extension/socket/config.js');
  }


// const run = async () => {
//     applyConfig();
//     const { createApp } = require('./app');
//     const app = await createApp();
//     const port = config.getItem('port');
//     app.listen(port, () => {
//       console.log(`listening at http://localhost:${port}`);
//     });
//   };
  
//   //启动应用
//   run();
  