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
import SaStrategy from "../SaStrategy.js";
import SaFirewallCheckHook from "./SaFirewallCheckHook.js";


/**
 * 防火墙策略校验钩子函数：Host 检测
 *
 * @author click33 qirly
 * @since 1.41.0
 */
class SaFirewallCheckHookForHost extends SaFirewallCheckHook {

    /**
     * 默认实例
     */
    static instance = new SaFirewallCheckHookForHost();

    /**
     * 是否校验 host，默认关闭
     */
    isCheckHost = false;

    /**
     * 允许的 host 列表，允许通配符
     */
    allowHosts = [];

    /**
     * 重载配置
     * @param {boolean} isCheckHost 是否校验 host
     * @param {String...} allowHosts 允许的 host 列表 (先清空原来的，再添加上新的)
     */
    resetConfig(isCheckHost, ...allowHosts) {
        this.isCheckHost = isCheckHost;
        this.allowHosts = [];
        this.allowHosts.push(...allowHosts);
    }

    /**
     * 执行的方法
     *
     * @param {SaRequest} req 请求对象
     * @param {SaResponse} res 响应对象
     * @param {Object} extArg 预留扩展参数
     */
    execute(req, res, extArg) {
        if(this.isCheckHost) {
            const host = req.getHost();
            if( ! SaStrategy.instance.hasElement.apply(this.allowHosts, host) ) {
                throw new FirewallCheckException("非法请求 host：" + host);
            }
        }
    }

}
export default SaFirewallCheckHookForHost;
