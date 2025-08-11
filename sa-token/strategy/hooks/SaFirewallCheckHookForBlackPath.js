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
import SaFirewallCheckHook from "./SaFirewallCheckHook.js";


/**
 * 防火墙策略校验钩子函数：请求 path 黑名单校验
 *
 * @author click33 qirly
 * @since 1.41.0
 */
class SaFirewallCheckHookForBlackPath extends SaFirewallCheckHook {

    /**
     * 默认实例
     */
    static instance = new SaFirewallCheckHookForBlackPath();

    /**
     * 请求 path 黑名单
     */
    blackPaths = [];

    /**
     * 重载配置
     * @param {...String} paths 黑名单 path 列表
     */
    resetConfig(...paths) {
        this.blackPaths = [];
        this.blackPaths.push(...paths);
    }

    /**
     * 执行的方法
     *
     * @param {SaRequest} req 请求对象
     * @param {SaResponse} res 响应对象
     * @param {Object} extArg 扩展预留参数
     */
    // @Override
    execute(req, res, extArg) {
        const requestPath = req.getRequestPath();
        for (const item of this.blackPaths) {
            if (requestPath === item) {
                throw new RequestPathInvalidException("非法请求：" + requestPath, requestPath);
            }
        }
    }

}
export default SaFirewallCheckHookForBlackPath;
