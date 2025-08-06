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
 * 一个异常：代表框架未能获取有效的上下文
 * <h1>已过期：请更名为 SaTokenContextException 用法不变，未来版本将彻底删除此类</h1>
 * 
 * @author click33
 * @since 1.33.0
 */


/**
 * 无效上下文异常 (已弃用)
 * @deprecated 请使用更具体的上下文异常类替代
 */
class InvalidContextException extends SaTokenException {

    /**
     * 一个异常：代表框架未能获取有效的上下文
     * @param message 异常描述
     */

    /**
     * 构造函数
     * @param {string} message 异常描述信息
     */
    constructor(message = '无效的上下文') {
        super(message);
        this.name = 'InvalidContextException';
        
        // 设置默认错误码（使用SaErrorCode中的上下文相关错误码）
        //this.code = 10002; // CODE_10002 = 未能获取有效的上下文
    }
}

// 冻结原型防止修改
Object.freeze(InvalidContextException.prototype);

// 在控制台显示弃用警告
if (process.env.NODE_ENV !== 'production') {
    console.warn(
        'InvalidContextException 已弃用，请使用更具体的上下文异常类替代'
    );
}

export default InvalidContextException;