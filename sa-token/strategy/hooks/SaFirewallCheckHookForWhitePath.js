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
import StopMatchException from "../../exception/StopMatchException.js";
import SaFirewallCheckHook from "./SaFirewallCheckHook.js";

/**
 * 防火墙策略校验钩子函数：请求 path 白名单放行
 *
 * @author click33 qirly
 * @since 1.41.0
 */ 
class SaFirewallCheckHookForWhitePath extends SaFirewallCheckHook {

    /**
     * 默认实例
     */
    static instance = new SaFirewallCheckHookForWhitePath();

    /**
     * 请求 path 白名单
     */
    whitePaths = [];

    /**
     * 重载配置
     * @param {String...} paths 白名单 path 列表
     */
    resetConfig(...paths) {
        this.whitePaths = [];
        this.whitePaths.push(...paths);
    }

    /**
     * 执行的方法
     *
     * @param {SaRequest} req 请求对象
     * @param {SaResponse} res 响应对象
     * @param {Object} extArg 预留扩展参数
     */
    execute(req, res, extArg) {
        const requestPath = req.getRequestPath();
        for (const item of this.whitePaths) {
            if (requestPath === item) {
                throw new StopMatchException();
            }
        }

    }

}

export default SaFirewallCheckHookForWhitePath;
