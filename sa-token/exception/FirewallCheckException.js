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

import SaTokenException from "./SaTokenException.js";

/**
 * 一个异常：代表防火墙检验未通过
 * 
 * @author click33
 * @since 1.41.0
 */

class FirewallCheckException extends SaTokenException {
    /**
     * 构造函数
     * @param {string|Error} messageOrError 错误消息或错误对象
     * @param {Error} [error] 原始错误对象（可选）
     */
    constructor(messageOrError, error) {
        // 处理三种构造方式：
        // 1. FirewallCheckException(String message)
        // 2. FirewallCheckException(Throwable e)
        // 3. FirewallCheckException(String message, Throwable e)
        if (typeof messageOrError === 'string' && error instanceof Error) {
            // 情况3：消息+错误对象
            super(messageOrError, error);
        } else if (messageOrError instanceof Error) {
            // 情况2：只有错误对象
            super(messageOrError);
        } else {
            // 情况1：只有消息
            super(messageOrError || 'Firewall check failed');
        }

        this.name = 'FirewallCheckException';
        
        // 设置防火墙相关的默认错误码
        //this.code = 17001; // 假设170xx系列是防火墙相关错误码
    }
}

// 冻结原型防止修改
Object.freeze(FirewallCheckException.prototype);

export default FirewallCheckException;








