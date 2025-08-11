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
import FirewallCheckException from "../../exception/FirewallCheckException.js";
import SaFirewallCheckHook from "./SaFirewallCheckHook.js";

/**
 * 防火墙策略校验钩子函数：请求参数检测
 *
 * @author click33 qirly
 * @since 1.41.0
 */
class SaFirewallCheckHookForParameter extends SaFirewallCheckHook {

    /**
     * 默认实例
     */
    static instance = new SaFirewallCheckHookForParameter();

    /**
     * 不允许的请求参数列表
     */
    notAllowParameterNames = [];

    constructor() {
        super();
    }

    /**
     * 配置
     * @param {String...} notAllowParameterNames 不允许的请求参数列表 (先清空原来的，再添加上新的)
     */
    resetConfig(...notAllowParameterNames) {
        this.notAllowParameterNames = [];
        this.notAllowParameterNames.push(...notAllowParameterNames);
    }

    /**
     * 执行的方法
     *
     * @param {SaRequest} req 请求对象
     * @param {SaResponse} res 响应对象
     * @param {Object} extArg 预留扩展参数
     */
    execute(req, res, extArg) {
        for (const parameterName of this.notAllowParameterNames) {
            if (req.getParam(parameterName) != null) {
                throw new FirewallCheckException("非法请求参数：" + parameterName);
            }
        }
    }

}

export default SaFirewallCheckHookForParameter;
