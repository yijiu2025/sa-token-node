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

import SaRequest from "../../context/model/SaRequest.js";
import SaResponse from "../../context/model/SaResponse.js";
import RequestPathInvalidException from "../../exception/RequestPathInvalidException.js";
import SaFoxUtil from "../../util/SaFoxUtil.js";
import SaFirewallCheckHook from "./SaFirewallCheckHook.js";

/**
 * 防火墙策略校验钩子函数：请求 path 禁止字符校验
 *
 * @author click33 qirly
 * @since 1.41.0
 */
class SaFirewallCheckHookForPathBannedCharacter extends SaFirewallCheckHook {

    /**
     * 默认实例
     */
    static instance = new SaFirewallCheckHookForPathBannedCharacter();

    /**
     * 是否严格禁止出现百分号字符 % （默认：否）
     */
    bannedPercentage = false;

    /**
     * 重载配置
     * @param {boolean} bannedPercentage 是否严格禁止出现百分号字符 % （默认：否）
     */
    resetConfig(bannedPercentage) {
        this.bannedPercentage = bannedPercentage;
    }

    /**
     * 执行的方法
     *
     * @param {SaRequest} req 请求对象
     * @param {SaResponse} res 响应对象
     * @param {Object} extArg 预留扩展参数
     */
    execute(req, res, extArg) {
        // 非可打印 ASCII 字符检查
        const requestPath = req.getRequestPath();
        if(SaFoxUtil.hasNonPrintableASCII(requestPath)) {
            throw new RequestPathInvalidException("请求 path 包含禁止字符：" + requestPath, requestPath);
        }
        if(this.bannedPercentage && requestPath.contains("%")) {
            throw new RequestPathInvalidException("请求 path 包含禁止字符 %：" + requestPath, requestPath);
        }
    }

}
export default SaFirewallCheckHookForPathBannedCharacter;
