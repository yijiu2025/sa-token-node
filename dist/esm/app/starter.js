import 'fs';
import 'path';
import '../sa-token/stp/StpUtil.js';
import '../sa-token/SaManager.js';
import SaResult from '../sa-token/util/SaResult.js';

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
