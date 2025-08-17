'use strict';

require('fs');
require('path');
require('../sa-token/stp/StpUtil.js');
require('../sa-token/SaManager.js');
var SaResult = require('../sa-token/util/SaResult.js');

global.SaResult = SaResult;


// const run = async () => {
//     //applyConfig();
//     //const { createApp } = require('./app');
//     const app = await createApp();
//     const port = 8080;
//     app.listen(8080, () => {
//       console.log(`listening at http://localhost:${port}`);
//     });
//   };
  
//   //启动应用
//   run();
