/*
 * Copyright 2020-2099 sa-token.cc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * SaLogoutMode: 注销范围
 *
 * @author click33
 * @since 1.41.0
 */
const SaLogoutRange = {

    /**
     * token 范围：只注销提供的 token 指向的会话
     */
    TOKEN: "TOKEN",

    /**
     * 账号范围：注销 token 指向的 loginId 会话
     */
    ACCOUNT: "ACCOUNT"
};

// 冻结对象以防止修改
Object.freeze(SaLogoutRange);

// 导出模块（支持 CommonJS 和 ES6 模块）

export default SaLogoutRange; // Node.js 环境
