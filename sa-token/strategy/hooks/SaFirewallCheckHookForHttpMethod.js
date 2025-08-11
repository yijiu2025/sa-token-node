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
import SaHttpMethod from "../../router/SaHttpMethod.js";
import SaFirewallCheckHook from "./SaFirewallCheckHook.js";

/**
 * 防火墙策略校验钩子函数：请求 Method 检测
 *
 * @author click33 qirly
 * @since 1.41.0
 */
class SaFirewallCheckHookForHttpMethod extends SaFirewallCheckHook {

    /**
     * 默认实例
     */
    static instance = new SaFirewallCheckHookForHttpMethod();

    /**
     * 是否校验 请求Method，默认开启
     */
    isCheckMethod = true;

    /**
     * 允许的 HttpMethod 列表
     */
    allowMethods = [];

    constructor() {
        super();
        // 默认允许的 HttpMethod 列表
        this.allowMethods.push(SaHttpMethod.GET);
        this.allowMethods.push(SaHttpMethod.POST);
        this.allowMethods.push(SaHttpMethod.PUT);
        this.allowMethods.push(SaHttpMethod.DELETE);
        this.allowMethods.push(SaHttpMethod.HEAD);
        this.allowMethods.push(SaHttpMethod.OPTIONS);
        this.allowMethods.push(SaHttpMethod.PATCH);
        this.allowMethods.push(SaHttpMethod.TRACE);
        this.allowMethods.push(SaHttpMethod.CONNECT);
    }

    /**
     * 配置
     * @param {boolean} isCheckMethod 是否校验 Method
     * @param {String...} methods 允许的 HttpMethod 列表 (先清空原来的，再添加上新的)
     */
    resetConfig(isCheckMethod, ...methods) {
        this.isCheckMethod = isCheckMethod;
        this.allowMethods = [];
        this.allowMethods.push(...methods);
    }

    /**
     * 执行的方法
     *
     * @param {SaRequest} req 请求对象
     * @param {SaResponse} res 响应对象
     * @param {Object} extArg 预留扩展参数
     */
    //@Override
    execute(req, res, extArg) {
        if(this.isCheckMethod) {
            const method = req.getMethod();
            if( ! this.allowMethods.includes(method) ) {
                throw new FirewallCheckException("非法请求 Method：" + method);
            }
        }
    }

}

export default SaFirewallCheckHookForHttpMethod;
