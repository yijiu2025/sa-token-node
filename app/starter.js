'use strict';
import fs from 'fs';
import path from 'path';
// const fs = require('fs');
// const path = require('path');

import SaSecureUtil from '../sa-token/secure/SaSecureUtil.js';
import SaTotpTemplate from '../sa-token/secure/totp/SaTotpTemplate.js';

// console.log(new SaTotpTemplate().generateGoogleSecretKey('account', 'issuer', 'VDWZWD5QPE5UE4ISJKE24XLCKA'));
// console.log(new SaTotpTemplate().generateGoogleSecretKey('account', 'VDWZWD5QPE5UE4ISJKE24XLCKA'));
// console.log(new SaTotpTemplate().generateGoogleSecretKey('account'));
// const mima = new SaTotpTemplate()._generateTOTP("444LEXVPRC673WWZ53QCX3JUFM")


// console.log(mima);
// console.log(new SaTotpTemplate().checkTOTP("444LEXVPRC673WWZ53QCX3JUFM",mima,3));
// const private1 = "MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBALSwMomBFA1bJxacT2i/fKjVnzwvgVu/BSVBgzJf+jLSZYLjk0+2AD8HBKxKQYVFzyCklKNwT4Fe2pGaFgIWwbCi07z/ub/1OMTDJhcke3I6HzmY8sN6D6PjV0XoNwHE6rpFIyJysqYd6+/1swJJs5zbps1RsT9rK0O5IpmmHUTrAgMBAAECgYAUP2pqXjyRApXuwrVjV5HwmX+ujuRAE7fP5Pd+vaKb71fQww/O7uY4KeEsLWYKOThswASoC/3c0XRMvKeatFIf+LOkQWtyPFFNgAygV03WG+TJ2Ns4DkkgfQs5I/faUNOJxv6YXhsM7O6LE+xNamLTcGwmmougg3ZLquEvcLAcAQJBAOyAeGV1zS9R7ort+IPCXa3DhBEASHdfQpGflWhOnoib2TqLR6OSzK3n2S/u/3AfJyieTbjsQZZWqCbeIPUeGYsCQQDDlb6R6OkFXC0t07bAk81geaBrU36VVPRYj1EnwEpkii/fWxV8denkLsFabGZzgZKWmmE+5YMpXmX854cgjy4hAkAELNxzRhoiPLsOXtclVFgdCjeZqTyeRuNA+OVFWyX3WXEDVJQmMiBE7bPq4bhGvXYOhITwv9MEmXEMhp1kVmyzAkAscJrjdmNz91TAo+lTaoHw2NHtcQRDFBGNCctr19JPc+KawoxoQjaJxWHjlNvWhOt00tEjxGx/+tX7l/PpHv9hAkB9zuiGJ8YzWpY8iGF+gtJnkgohOpmhA+VSYGUYny8vSHjyT+OJVKmnMwTPFRqeZPIasdQil8clpXvV8hHcvEGN";
// const public1 = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC0sDKJgRQNWycWnE9ov3yo1Z88L4FbvwUlQYMyX/oy0mWC45NPtgA/BwSsSkGFRc8gpJSjcE+BXtqRmhYCFsGwotO8/7m/9TjEwyYXJHtyOh85mPLDeg+j41dF6DcBxOq6RSMicrKmHevv9bMCSbOc26bNUbE/aytDuSKZph1E6wIDAQAB";
// const aaa = "1c8245c8a31217d84301c77d8d33bffd96c51d8da34e994d98c0bb17a353d8eab1546b5e66d523db56969486f6b88a8f2ccfb841c07575fc78af470c4496bc0bbf2c1635b5dfb8606d3658d5173fa521a4f2be5a2b94d14e2a13fb0d9ed7e279a32404da8f667ff35f74768906248c334a91c0a88c2abc72d0bfe5fec1b1aef7";
// const abc = "9682bb4cea5d607dc3846473229ce1e1deb797a2fdede3b4f87d3377ae0e77fa440bef1987045a193a8fc2cc12130e0016c7eadb9d1787d3310966ffa73e0d42be1485ad8a7b3a37a16b1a05f885c9fbfd908a1b0c528519c8b7eb07a412ffbbe560d0be4a28374160b4a2e414bd3367896a9f70470adce1cdbbd3879b47a770"

// const aaa1 = SaSecureUtil.rsaGenerateKeyPair();
// console.log('private2:',aaa1.private);

// console.log('public2:',aaa1.public);

//const text = SaSecureUtil.aesEncrypt('yyyyy',"test123456789")
//console.log('md5: ', text);
//console.log('keyget: ', SaSecureUtil.getSecretKey('yyyyy'));
//5l1VRk1DCcXPMJBHnBfsNQ==
//console.log('md51: ', SaSecureUtil.aesDecrypt('yyyyy',text));//

//const text = SaSecureUtil.sha512("test123456789")
// const bbb = SaSecureUtil.rsaEncryptByPrivate(aaa1.private, "xxxx");
// console.log('bbb: ', bbb);
// console.log('bb1',SaSecureUtil.rsaDecryptByPublic(public1,abc))
//console.log('md5: ', SaSecureUtil.rsaDecryptByPrivate(private1,aaa));
//console.log('md5: ', SaSecureUtil.rsaDecryptByPrivate(private1,aaa));

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
  